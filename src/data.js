export const dashboardMeta = {
  reportingPeriod: "Week 32 · 2024",
  lastUpdated: "Manual import · Aug 5, 2024 09:00",
  refreshGuidance:
    "Built for transparent operations. Import a new offline dataset to refresh the view."
};

export const departments = [
  {
    id: "all",
    name: "All Departments",
    summary: "Aggregate performance across operations, engineering, people, and workplace teams.",
    metrics: [
      {
        label: "Projects On Track",
        value: 18,
        suffix: "/ 22",
        trend: { label: "↑ 3", description: "vs last week" }
      },
      {
        label: "Team Health Score",
        value: 8.7,
        suffix: "/ 10",
        trend: { label: "↗ 0.4", description: "steady improvement" }
      },
      {
        label: "Average Cycle Time",
        value: 4.2,
        suffix: " days",
        trend: { label: "↓ 0.5", description: "faster than target" }
      },
      {
        label: "Office Utilization",
        value: 68,
        suffix: "%",
        trend: { label: "↑ 6", description: "after new seating plan" }
      }
    ],
    trend: {
      context: "Story points delivered across all teams",
      datapoints: [
        { label: "Mon", value: 54 },
        { label: "Tue", value: 62 },
        { label: "Wed", value: 71 },
        { label: "Thu", value: 64 },
        { label: "Fri", value: 78 },
        { label: "Sat", value: 46 },
        { label: "Sun", value: 38 }
      ]
    },
    projects: {
      context: "Top initiatives with the biggest operational impact",
      items: [
        {
          title: "Hybrid Work Enablement",
          subtitle: "Deploy desk booking analytics to refine occupancy targets",
          meta: "Phase 2 · 76% complete"
        },
        {
          title: "Incident Response Playbooks",
          subtitle: "Cross-functional tabletop run-through with leadership",
          meta: "Pilot sessions wrap Friday"
        },
        {
          title: "Benefits Enrollment Refresh",
          subtitle: "Coordinated HR + Finance comms and knowledge base articles",
          meta: "Launch comms Tuesday"
        }
      ]
    },
    highlights: {
      context: "Wins and risks surfaced in leadership sync",
      items: [
        {
          title: "Engineering shipped the deployment guardrails ahead of schedule",
          subtitle: "Early telemetry shows 32% fewer rollbacks",
          meta: "Reliability"
        },
        {
          title: "Facilities resolved HVAC drift in the north annex",
          subtitle: "Comfort scores climbed 12 points overnight",
          meta: "Environment"
        },
        {
          title: "People Ops onboarding cohort reached 95% satisfaction",
          subtitle: "New check-in template surfaced friction points earlier",
          meta: "People"
        }
      ]
    },
    meetings: [
      {
        title: "Operations Council",
        description: "Weekly alignment on department OKRs",
        time: "Monday · 9:00 – 10:00"
      },
      {
        title: "Workplace Experience Deep Dive",
        description: "Final seating map review for Q4",
        time: "Tuesday · 14:30 – 15:15"
      },
      {
        title: "People Ops Pulse",
        description: "Review sentiment survey themes",
        time: "Thursday · 11:00 – 11:45"
      }
    ]
  },
  {
    id: "ops",
    name: "Operations",
    summary: "Ensuring end-to-end processes remain resilient and measurable.",
    metrics: [
      {
        label: "On-Time Deliveries",
        value: 96,
        suffix: "%",
        trend: { label: "↑ 2", description: "after vendor workshop" }
      },
      {
        label: "Escalations",
        value: 3,
        suffix: " open",
        trend: { label: "↓ 1", description: "major incidents resolved" }
      },
      {
        label: "Budget Burn",
        value: 51,
        suffix: "%",
        trend: { label: "↔", description: "mid-quarter" }
      },
      {
        label: "Automation Coverage",
        value: 64,
        suffix: "%",
        trend: { label: "↑ 8", description: "three new playbooks" }
      }
    ],
    trend: {
      context: "Fulfillment cycle time (hours per request)",
      datapoints: [
        { label: "Mon", value: 5.1 },
        { label: "Tue", value: 4.8 },
        { label: "Wed", value: 4.3 },
        { label: "Thu", value: 4.6 },
        { label: "Fri", value: 3.9 },
        { label: "Sat", value: 4.4 },
        { label: "Sun", value: 4.2 }
      ]
    },
    projects: {
      context: "Process optimizations nearing completion",
      items: [
        {
          title: "Vendor SLA Dashboard",
          subtitle: "Unified uptime visibility across logistics partners",
          meta: "Go-live Friday"
        },
        {
          title: "Auto-Renewal Policy",
          subtitle: "Legal + Ops review to trim manual paperwork",
          meta: "Sign-off pending"
        }
      ]
    },
    highlights: {
      context: "Signals from the operations command center",
      items: [
        {
          title: "Escalation runbook adoption hit 92% compliance",
          subtitle: "Team ran two successful failover drills",
          meta: "Operational Excellence"
        },
        {
          title: "Warehouse IoT rollout expanded to 3 new sites",
          subtitle: "Cycle time variance cut by 18%",
          meta: "Automation"
        }
      ]
    },
    meetings: [
      {
        title: "Logistics Vendor Sync",
        description: "Spot-check SLA performance",
        time: "Wednesday · 13:00 – 13:45"
      },
      {
        title: "Quarterly Risk Review",
        description: "Scenario modeling for peak season",
        time: "Friday · 10:30 – 12:00"
      }
    ]
  },
  {
    id: "eng",
    name: "Engineering",
    summary: "Delivering reliable product increments and platform improvements.",
    metrics: [
      {
        label: "Deployment Success",
        value: 99.1,
        suffix: "%",
        trend: { label: "↑ 1.2", description: "release guardrails live" }
      },
      {
        label: "Velocity",
        value: 420,
        suffix: " pts",
        trend: { label: "↑ 28", description: "productive spike" }
      },
      {
        label: "Open Bugs",
        value: 47,
        suffix: "",
        trend: { label: "↓ 12", description: "triage blitz" }
      },
      {
        label: "Incident MTTR",
        value: 42,
        suffix: " mins",
        trend: { label: "↓ 9", description: "faster mitigations" }
      }
    ],
    trend: {
      context: "Story points completed per day",
      datapoints: [
        { label: "Mon", value: 68 },
        { label: "Tue", value: 74 },
        { label: "Wed", value: 82 },
        { label: "Thu", value: 71 },
        { label: "Fri", value: 89 },
        { label: "Sat", value: 36 },
        { label: "Sun", value: 28 }
      ]
    },
    projects: {
      context: "Focus areas for the platform team",
      items: [
        {
          title: "Observability Unification",
          subtitle: "Migrating service metrics into the shared timeline view",
          meta: "84% complete"
        },
        {
          title: "API Rate Guardrails",
          subtitle: "Progressive throttling + customer comms",
          meta: "ETA next sprint"
        },
        {
          title: "Mobile Shell Refresh",
          subtitle: "Final QA for new offline persistence",
          meta: "Ship window Wednesday"
        }
      ]
    },
    highlights: {
      context: "Notable engineering callouts",
      items: [
        {
          title: "Launch readiness checklist adopted squad-wide",
          subtitle: "Defects at launch dipped 22%",
          meta: "Quality"
        },
        {
          title: "Error budget trending within safe limits",
          subtitle: "SLO burn-down recovered after patch",
          meta: "Reliability"
        }
      ]
    },
    meetings: [
      {
        title: "Architecture Review Board",
        description: "Sequence-based caching proposal",
        time: "Tuesday · 16:00 – 17:00"
      },
      {
        title: "Incident Game Day",
        description: "Chaos workflow validation",
        time: "Thursday · 15:00 – 16:30"
      }
    ]
  },
  {
    id: "people",
    name: "People Operations",
    summary: "Supporting employee engagement, hiring velocity, and retention.",
    metrics: [
      {
        label: "Hiring Pipeline",
        value: 42,
        suffix: " open reqs",
        trend: { label: "↗ 4", description: "marketing pipeline expanding" }
      },
      {
        label: "Time to Fill",
        value: 27,
        suffix: " days",
        trend: { label: "↓ 3", description: "streamlined interviews" }
      },
      {
        label: "Attrition",
        value: 6.4,
        suffix: "%",
        trend: { label: "↘ 0.8", description: "lowest this year" }
      },
      {
        label: "Pulse Score",
        value: 8.9,
        suffix: "/ 10",
        trend: { label: "↑ 0.6", description: "new manager rituals" }
      }
    ],
    trend: {
      context: "Offer acceptance rate per weekday",
      datapoints: [
        { label: "Mon", value: 78 },
        { label: "Tue", value: 82 },
        { label: "Wed", value: 74 },
        { label: "Thu", value: 76 },
        { label: "Fri", value: 88 },
        { label: "Sat", value: 0 },
        { label: "Sun", value: 0 }
      ]
    },
    projects: {
      context: "Employee experience efforts in flight",
      items: [
        {
          title: "Manager Toolkit 2.0",
          subtitle: "Peer coaching, conflict resolution, and salary narrative",
          meta: "Workshop sprint this week"
        },
        {
          title: "Global Onboarding Journey",
          subtitle: "Localized benefits library launch",
          meta: "Feedback review Friday"
        }
      ]
    },
    highlights: {
      context: "Signals from the employee lifecycle",
      items: [
        {
          title: "New hire NPS hit 76",
          subtitle: "Welcome mentors credited for the lift",
          meta: "Engagement"
        },
        {
          title: "Benefits FAQ traffic tripled post campaign",
          subtitle: "Self-serve answers reduced ticket queue by 18%",
          meta: "Enablement"
        }
      ]
    },
    meetings: [
      {
        title: "Compensation Council",
        description: "Finalize mid-year adjustments",
        time: "Monday · 11:00 – 12:00"
      },
      {
        title: "Talent Marketing Sync",
        description: "Campaign retrospectives + next sprint",
        time: "Wednesday · 15:30 – 16:15"
      }
    ]
  },
  {
    id: "workplace",
    name: "Workplace Experience",
    summary: "Creating an environment where people do their best work.",
    metrics: [
      {
        label: "Occupancy",
        value: 71,
        suffix: "%",
        trend: { label: "↑ 5", description: "neighborhood pilot" }
      },
      {
        label: "Support Tickets",
        value: 18,
        suffix: " open",
        trend: { label: "↘ 4", description: "self-serve kiosks live" }
      },
      {
        label: "Satisfaction",
        value: 9.1,
        suffix: "/ 10",
        trend: { label: "↑ 0.7", description: "community activations" }
      },
      {
        label: "Energy Use",
        value: 84,
        suffix: "% of baseline",
        trend: { label: "↓ 6", description: "HVAC tuning complete" }
      }
    ],
    trend: {
      context: "Daily foot traffic (badge entries)",
      datapoints: [
        { label: "Mon", value: 420 },
        { label: "Tue", value: 468 },
        { label: "Wed", value: 492 },
        { label: "Thu", value: 476 },
        { label: "Fri", value: 388 },
        { label: "Sat", value: 160 },
        { label: "Sun", value: 120 }
      ]
    },
    projects: {
      context: "Facilities improvements in focus",
      items: [
        {
          title: "Wayfinding Refresh",
          subtitle: "Install dynamic signage and floor beacons",
          meta: "Installations ongoing"
        },
        {
          title: "Wellness Room Expansion",
          subtitle: "Ergonomic upgrades and booking automation",
          meta: "Contractor review Thursday"
        }
      ]
    },
    highlights: {
      context: "Stories from the workplace experience team",
      items: [
        {
          title: "Community garden lunches filled every seat",
          subtitle: "Employee chef program piloted successfully",
          meta: "Engagement"
        },
        {
          title: "Air quality monitoring alerts now integrated",
          subtitle: "Facilities team receives push notifications",
          meta: "Safety"
        }
      ]
    },
    meetings: [
      {
        title: "Space Planning Huddle",
        description: "Re-balance quiet vs collaborative zones",
        time: "Tuesday · 10:00 – 10:45"
      },
      {
        title: "Vendor Walkthrough",
        description: "Review signage installation progress",
        time: "Thursday · 09:30 – 10:15"
      }
    ]
  }
];

export const dashboardTheme = {
  palette: {
    background: "#f6f7fb",
    surface: "#ffffff",
    surfaceAlt: "#f0f1f7",
    border: "#d8dbe7",
    text: "#1f2937",
    muted: "#6b7280",
    accent: "#2563eb",
    accentMuted: "#bfdbfe",
    accentSoft: "rgba(37, 99, 235, 0.1)",
    alert: "#b45309"
  },
  typography: {
    base:
      '"Inter", "Segoe UI", "Helvetica Neue", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    heading:
      '"Inter", "Segoe UI", "Helvetica Neue", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    weightHeading: "600",
    weightStrong: "700"
  },
  shape: {
    radiusLg: "20px",
    radiusMd: "14px",
    radiusSm: "10px",
    shadowSm: "0 8px 24px rgba(15, 23, 42, 0.04)",
    shadowMd: "0 20px 45px rgba(15, 23, 42, 0.08)"
  }
};

export const dataset = {
  meta: dashboardMeta,
  departments,
  theme: dashboardTheme
};
