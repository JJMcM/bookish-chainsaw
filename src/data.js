export const dashboardMeta = {
  reportingPeriod: "Maintenance Week 18 · 2024",
  lastUpdated: "Manual import · May 6, 2024 06:30",
  refreshGuidance: "Use the import control to load the latest CMMS export while offline."
};

export const departments = [
  {
    id: "all",
    name: "All Maintenance",
    summary:
      "Crew leaders kept preventive work on pace while trimming the emergency backlog. Reliability and safety partners are aligned on the boiler upgrade cutover slated for next week.",
    metrics: [
      {
        label: "Preventive Compliance",
        value: 92,
        suffix: "%",
        trend: { label: "↑ 4", description: "after planner stand-up reset routes" }
      },
      {
        label: "Reactive Backlog",
        value: 38,
        suffix: " WO",
        trend: { label: "↓ 11", description: "cleared weekend callouts" }
      },
      {
        label: "Critical Asset Availability",
        value: 97.5,
        suffix: "%",
        trend: { label: "↗ 0.8", description: "boiler redundancy restored" }
      },
      {
        label: "Safety Observations Logged",
        value: 54,
        trend: { label: "↑ 12", description: "crew-led audits" }
      }
    ],
    trend: {
      context: "Work orders closed per day across the site",
      datapoints: [
        { label: "Mon", value: 46 },
        { label: "Tue", value: 58 },
        { label: "Wed", value: 62 },
        { label: "Thu", value: 57 },
        { label: "Fri", value: 69 },
        { label: "Sat", value: 34 },
        { label: "Sun", value: 28 }
      ]
    },
    projects: {
      context: "Plant-wide initiatives with executive visibility",
      items: [
        {
          title: "Boiler Feedwater Retrofit",
          subtitle: "Stage spare pump, perform insulation, and validate vibration limits",
          meta: "Cutover window May 10"
        },
        {
          title: "Planner Playbook Rollout",
          subtitle: "Standardise job plan templates and estimated hours across crews",
          meta: "75% adoption"
        },
        {
          title: "Lockout/Tagout Refresh",
          subtitle: "Audit panels and update laminated field guides",
          meta: "Sign-off pending"
        }
      ]
    },
    highlights: {
      context: "Wins and watch items from the maintenance program review",
      items: [
        {
          title: "Oil analysis flagged bearing wear early",
          subtitle: "Scheduled downtime avoided a 14-hour production stop",
          meta: "Predictive"
        },
        {
          title: "Confined space drill executed under target time",
          subtitle: "EHS observers signed off on updated rescue kit staging",
          meta: "Safety"
        },
        {
          title: "Warehouse kitting achieved 98% accuracy",
          subtitle: "Mechanics spent 40 fewer hours searching for parts",
          meta: "Materials"
        }
      ]
    },
    meetings: [
      {
        title: "Maintenance Readiness Huddle",
        description: "Review daily crew assignments and plant constraints",
        time: "Monday · 06:30 – 07:00"
      },
      {
        title: "Reliability Steering Committee",
        description: "Align on PdM alerts and risk-ranked assets",
        time: "Wednesday · 11:30 – 12:15"
      },
      {
        title: "Safety Walkdown",
        description: "Cross-discipline review of boiler deck mitigations",
        time: "Friday · 09:00 – 10:00"
      }
    ]
  },
  {
    id: "mechanical",
    name: "Mechanical",
    summary:
      "Focus stayed on rotating equipment reliability and clearing overdue lubrication work. Gearbox rebuild prep is tracking, but alignment checks need extra support on second shift.",
    metrics: [
      {
        label: "Planned Work Ratio",
        value: 71,
        suffix: "%",
        trend: { label: "↑ 6", description: "better job kitting" }
      },
      {
        label: "Emergency Work Orders",
        value: 4,
        suffix: " open",
        trend: { label: "↓ 3", description: "stand-by millwright rotation" }
      },
      {
        label: "Lubrication Compliance",
        value: 88,
        suffix: "%",
        trend: { label: "↗ 5", description: "route consolidation complete" }
      },
      {
        label: "Vibration Alerts",
        value: 7,
        trend: { label: "↘ 2", description: "bearing replacements landed" }
      }
    ],
    trend: {
      context: "Average repair duration (hours)",
      datapoints: [
        { label: "Mon", value: 5.6 },
        { label: "Tue", value: 4.3 },
        { label: "Wed", value: 4.8 },
        { label: "Thu", value: 4.1 },
        { label: "Fri", value: 3.9 },
        { label: "Sat", value: 4.5 },
        { label: "Sun", value: 4.0 }
      ]
    },
    projects: {
      context: "Mechanical priorities in execution",
      items: [
        {
          title: "Press Line Gearbox Rebuild",
          subtitle: "Stage laser alignment tools and inspect coupling",
          meta: "Tear-down Saturday"
        },
        {
          title: "Boiler Feed Pump Exchange",
          subtitle: "Prep spare pump base, align suction valves, and stage rigging",
          meta: "Ready for outage"
        }
      ]
    },
    highlights: {
      context: "Crew headlines and watch items",
      items: [
        {
          title: "Gearcase flush cut wear debris by 40%",
          subtitle: "Oil sampling trending back inside targets",
          meta: "Reliability"
        },
        {
          title: "Rigging team completed pump changeout 6 hours early",
          subtitle: "Overtime shaved for the weekend maintenance window",
          meta: "Execution"
        }
      ]
    },
    meetings: [
      {
        title: "Millwright Alignment Check-in",
        description: "Confirm tooling availability and second-shift coverage",
        time: "Tuesday · 14:00 – 14:30"
      },
      {
        title: "Lubrication Route Review",
        description: "Validate new merged routes and grease spec updates",
        time: "Thursday · 09:30 – 10:15"
      }
    ]
  },
  {
    id: "electrical",
    name: "Electrical",
    summary:
      "Crew zeroed out urgent breaker inspections and handed off arc-flash updates. Instrument tech backlog is steady; plan to free a floater for PLC work next week.",
    metrics: [
      {
        label: "Preventive Tasks Completed",
        value: 126,
        trend: { label: "↑ 18", description: "panel inspections accelerated" }
      },
      {
        label: "Priority Call-ins",
        value: 6,
        suffix: " events",
        trend: { label: "↘ 2", description: "spare breaker cache paid off" }
      },
      {
        label: "Thermography Exceptions",
        value: 3,
        trend: { label: "↘ 1", description: "load balancing resolved hot spots" }
      },
      {
        label: "Control Room Coverage",
        value: 96,
        suffix: "%",
        trend: { label: "↗ 3", description: "cross-training backfill" }
      }
    ],
    trend: {
      context: "Average hours to close electrical work orders",
      datapoints: [
        { label: "Mon", value: 6.1 },
        { label: "Tue", value: 5.8 },
        { label: "Wed", value: 5.4 },
        { label: "Thu", value: 5.1 },
        { label: "Fri", value: 4.8 },
        { label: "Sat", value: 4.5 },
        { label: "Sun", value: 4.2 }
      ]
    },
    projects: {
      context: "Electrical work in flight",
      items: [
        {
          title: "Arc-Flash Study Refresh",
          subtitle: "Finalize labels for boiler house and switchgear",
          meta: "Labels printing"
        },
        {
          title: "PLC Firmware Upgrades",
          subtitle: "Schedule windows with production to flash controllers",
          meta: "Round 1 complete"
        }
      ]
    },
    highlights: {
      context: "Noteworthy outcomes",
      items: [
        {
          title: "Breaker infrared scan caught loose lug early",
          subtitle: "Avoided unplanned outage on kiln feeder",
          meta: "Reliability"
        },
        {
          title: "Instrument tech cross-training unlocked night shift coverage",
          subtitle: "No open calls during weekend operations",
          meta: "Staffing"
        }
      ]
    },
    meetings: [
      {
        title: "Electrical Work Coordination",
        description: "Sequence planned line shutdowns and permit requests",
        time: "Monday · 10:00 – 10:45"
      },
      {
        title: "Controls Steering",
        description: "Review PLC firmware schedule and automation requests",
        time: "Thursday · 13:00 – 13:45"
      }
    ]
  },
  {
    id: "reliability",
    name: "Reliability",
    summary:
      "PdM coverage expanded to all boiler feed assets while analysts validated sensor drift. Outage prep is on pace but lube analysis turnaround needs attention.",
    metrics: [
      {
        label: "Assets on PdM Routes",
        value: 118,
        trend: { label: "↑ 9", description: "new boiler feed pumps instrumented" }
      },
      {
        label: "Condition Alerts Reviewed",
        value: 27,
        trend: { label: "↗ 5", description: "steam trap campaign generated findings" }
      },
      {
        label: "Lube Lab Turnaround",
        value: 4.5,
        suffix: " days",
        trend: { label: "↗ 1.2", description: "supplier backlog" }
      },
      {
        label: "Ultrasound Routes Completed",
        value: 86,
        suffix: "%",
        trend: { label: "↘ 6", description: "coverage shifted to outage prep" }
      }
    ],
    trend: {
      context: "Predictive findings validated per week",
      datapoints: [
        { label: "Mon", value: 9 },
        { label: "Tue", value: 11 },
        { label: "Wed", value: 12 },
        { label: "Thu", value: 10 },
        { label: "Fri", value: 8 },
        { label: "Sat", value: 6 },
        { label: "Sun", value: 4 }
      ]
    },
    projects: {
      context: "Reliability initiatives",
      items: [
        {
          title: "Steam Trap Audit",
          subtitle: "Instrument remaining traps and log follow-up work",
          meta: "82% complete"
        },
        {
          title: "Boiler Feed Upgrade Readiness",
          subtitle: "Finalize sensor baselines and alarm thresholds",
          meta: "Cutover support"
        }
      ]
    },
    highlights: {
      context: "Program call-outs",
      items: [
        {
          title: "Vibration alert prevented gearbox failure",
          subtitle: "Maintenance swapped bearing before catastrophic damage",
          meta: "PdM"
        },
        {
          title: "Lube lab flagged varnish levels early",
          subtitle: "Coordinated flush avoids production downtime",
          meta: "Lubrication"
        }
      ]
    },
    meetings: [
      {
        title: "Reliability / Maintenance Sync",
        description: "Review PdM findings and outage prep tasks",
        time: "Wednesday · 15:00 – 16:00"
      },
      {
        title: "Predictive Analytics Stand-up",
        description: "Prioritise sensor tuning and alert reviews",
        time: "Friday · 10:00 – 10:30"
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
