# Live Data Integration Blueprint

This document outlines the initial plan for replacing the static data module with live
integrations so the workplace dashboard can deliver the operational reliability that
stakeholders expect. It focuses on the interface between the frontend and the new data
services: API topology, authentication, refresh cadence, and resilience concerns.

## Integration Principles

* **Incremental rollout** – Start with read-only endpoints that mirror the existing static
  structures, then extend to multi-source joins or write operations as needed.
* **Data freshness with guardrails** – Prefer near-real-time updates, but always provide
  fallbacks (cached snapshots, last-known-good values) when sources are unavailable.
* **Observability-first** – Every request should emit metrics (latency, success rate) and
  logs that are correlated with user sessions to surface reliability issues quickly.
* **Consistent schemas** – Standardise field names, units, and null-handling so the
  frontend can render each department’s data with the same components.

## API Surface

Expose a versioned REST API under `/api/v1` that returns JSON payloads designed for the
existing UI groupings.

| Endpoint | Description | Sample Filters | Response Skeleton |
| --- | --- | --- | --- |
| `GET /api/v1/summary` | Aggregated stats for high-level scorecards (uptime, open tasks, utilisation). | `?departments=ops,eng&date=2024-05-01` | `{ "generatedAt": ISO8601, "departments": [{ "id": "ops", "metrics": { ... }}] }` |
| `GET /api/v1/projects` | Active projects with status, owners, risks, and key dates. | `?status=active&team=eng` | `{ "projects": [{ "id": "proj-123", "name": "HQ Retrofit", "status": "at-risk", "riskLevel": 3, "milestones": [...] }] }` |
| `GET /api/v1/people` | Staffing levels, hiring pipeline stats, and sentiment signals. | `?team=workplace&include=sentiment` | `{ "teams": [{ "id": "workplace", "headcount": 42, "openRoles": 3, "sentimentScore": 0.71 }] }` |
| `GET /api/v1/events` | Upcoming meetings, site visits, or operational checkpoints. | `?timeframe=7d&location=hq` | `{ "events": [{ "id": "evt-55", "title": "Vendors sync", "start": ISO8601, "location": "HQ" }] }` |
| `GET /api/v1/incidents` | Incident tickets or workplace requests with resolution status. | `?state=open&severity=high` | `{ "incidents": [{ "id": "inc-88", "reportedAt": ISO8601, "severity": "high", "assignee": "Facilities" }] }` |

### Response Standards

* Timestamps use ISO8601 UTC and include a `generatedAt` field at the root for caching.
* Include pagination metadata (`page`, `pageSize`, `total`) on list endpoints.
* Every resource carries a stable `id` for frontend caching and reconciliation.
* Error payloads follow `{ "error": { "code": "SOURCE_TIMEOUT", "message": "...", "retryAfter": seconds } }`.

## Authentication & Authorisation

Use OAuth 2.0 client credentials for the dashboard service to call the backend API. This
keeps secrets off the client and allows the backend to fan out to third-party systems with
rotating tokens.

1. **Token issuance** – Provision a machine-to-machine client in the identity provider
   (e.g. Okta, Auth0) with scope-limited access to workplace data.
2. **Backend session** – The dashboard frontend calls a lightweight proxy endpoint (e.g.
   `/auth/token`) that exchanges the client credentials for a short-lived access token
   stored server-side.
3. **Downstream calls** – API requests include the bearer token and an additional
   `X-Trace-Id` header for observability. The backend validates scopes and maps them to
   department-level access rules (e.g. workplace leadership can see all departments,
   team managers only see their teams).
4. **Rotation & secrets hygiene** – Automate credential rotation every 90 days. Detect and
   revoke leaked tokens with IP allowlisting and anomaly monitoring.

For third-party integrations (HRIS, ticketing, building management systems), prefer the
vendor’s OAuth flows or signed webhooks. Store external refresh tokens in a secrets
manager and keep per-source scopes minimal.

## Data Refresh Cadence

| Data Domain | Update Strategy | Target Latency | Notes |
| --- | --- | --- | --- |
| Summary metrics | Pull every 5 minutes with a 1-minute timeout; cache last success. | < 6 minutes | Critical for executive visibility; alert if stale >15 minutes. |
| Project statuses | Refresh every 15 minutes or upon webhook event. | < 10 minutes | Merge webhook deltas with scheduled pulls to avoid missed updates. |
| People metrics | Pull hourly from HRIS, with nightly full sync. | < 65 minutes | Sensitive data: encrypt at rest, audit access. |
| Events calendar | Subscribe to calendar webhooks; fall back to 10-minute polling. | < 5 minutes | Handle recurring events and timezone conversions server-side. |
| Incident queues | Poll every 2 minutes during business hours, 10 minutes otherwise. | < 3 minutes | Allow manual “refresh now” button for urgent triage. |

Implement a refresh coordinator service that schedules these cadences, tracks last fetch
status per source, and publishes updates to the frontend via Server-Sent Events (SSE) or a
lightweight WebSocket channel. The frontend should gracefully degrade to cached data when
the SSE channel drops.

## Reliability & Monitoring

* Instrument each integration with circuit breakers and retries with exponential backoff.
* Capture success, failure, timeout, and staleness metrics; emit them to the existing ops
  monitoring stack (e.g. Datadog, Prometheus).
* Provide a `/health` endpoint that reports on upstream status (per source) so the
  dashboard can surface “data delayed” banners to stakeholders.
* Maintain runbooks for each integration covering failure modes, escalation paths, and
  manual backfill steps.

## Next Steps

1. Prototype the `/api/v1/summary` endpoint using the current `src/data.js` as the data
   source to validate the schema and caching strategy.
2. Stand up the auth proxy and client-credentials flow in staging.
3. Define SLIs/SLOs per integration (availability, freshness) and wire alerts to the
   workplace ops on-call rotation.
4. Expand to additional data domains once the core dashboard views are reliably live.
