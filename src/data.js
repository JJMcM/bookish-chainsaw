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
        suffix: "",
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
        suffix: "",
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
          title: "Steam Trap Survey",
          subtitle: "Thermal imaging sweep of north loop",
          meta: "Fieldwork 60%"
        },
        {
          title: "Hydraulic Hose Campaign",
          subtitle: "Replace critical hoses with crimped assemblies",
          meta: "12 of 18 complete"
        }
      ]
    },
    highlights: {
      context: "Crew callouts from the mechanical superintendent",
      items: [
        {
          title: "Line 3 coupler change-out finished 2 hours early",
          subtitle: "Rigging plan shaved downtime",
          meta: "Schedule"
        },
        {
          title: "Portable balancer training certified two new techs",
          subtitle: "Enables weekend PdM coverage",
          meta: "Skills"
        }
      ]
    },
    meetings: [
      {
        title: "Millwright Toolbox Talk",
        description: "Discuss lockout sequence updates and pinch point hazards",
        time: "Tuesday · 06:10 – 06:30"
      },
      {
        title: "Planner Hand-Off",
        description: "Confirm parts availability for weekend shutdown",
        time: "Thursday · 15:00 – 15:20"
      }
    ]
  },
  {
    id: "electrical",
    name: "Electrical & Instrumentation",
    summary:
      "The team prioritised MCC inspections and cleared nuisance trips on the packaging line. Instrument techs still need historian tags for the new flow meters before go-live.",
    metrics: [
      {
        label: "PM Completion",
        value: 95,
        suffix: "%",
        trend: { label: "↑ 3", description: "extra overtime window" }
      },
      {
        label: "Control Cabinet Findings",
        value: 12,
        suffix: "",
        trend: { label: "↗ 5", description: "thermal scans catching hot spots" }
      },
      {
        label: "Breaker Trips",
        value: 1,
        suffix: "",
        trend: { label: "↓ 2", description: "load balancing on line 5" }
      },
      {
        label: "Calibration Backlog",
        value: 6,
        suffix: " loops",
        trend: { label: "↘ 4", description: "loaned techs from utilities" }
      }
    ],
    trend: {
      context: "Protective relay tests completed per day",
      datapoints: [
        { label: "Mon", value: 3 },
        { label: "Tue", value: 5 },
        { label: "Wed", value: 4 },
        { label: "Thu", value: 4 },
        { label: "Fri", value: 6 },
        { label: "Sat", value: 2 },
        { label: "Sun", value: 1 }
      ]
    },
    projects: {
      context: "Electrical & instrumentation projects with open actions",
      items: [
        {
          title: "MCC Infrared Survey",
          subtitle: "Capture load imbalance data for panel 12",
          meta: "Report due Thursday"
        },
        {
          title: "Flow Meter Commissioning",
          subtitle: "Validate scaling and historian tags",
          meta: "Waiting on PI mapping"
        },
        {
          title: "UPS Battery Replacement",
          subtitle: "Swap cells on emergency lighting circuits",
          meta: "8 of 14 panels"
        }
      ]
    },
    highlights: {
      context: "Signals from electricians and instrument techs",
      items: [
        {
          title: "Packaging PLC nuisance fault resolved",
          subtitle: "Re-terminated loose IO block wiring",
          meta: "Stability"
        },
        {
          title: "Safety relay training completed for apprentices",
          subtitle: "Now cleared for solo troubleshooting",
          meta: "Training"
        }
      ]
    },
    meetings: [
      {
        title: "Power Distribution Review",
        description: "Evaluate feeder loading against summer profile",
        time: "Wednesday · 14:00 – 14:45"
      },
      {
        title: "Instrumentation Stand-Up",
        description: "Coordinate calibrations and spare transmitters",
        time: "Friday · 07:30 – 07:50"
      }
    ]
  },
  {
    id: "reliability",
    name: "Reliability Engineering",
    summary:
      "Predictive program coverage expanded and the asset risk matrix was refreshed. The team is modelling spare motor lead times to avoid line stoppages during hurricane season.",
    metrics: [
      {
        label: "PdM Coverage",
        value: 78,
        suffix: "%",
        trend: { label: "↑ 7", description: "new ultrasound routes" }
      },
      {
        label: "Failure Investigations",
        value: 3,
        suffix: " active",
        trend: { label: "↔", description: "awaiting vendor reports" }
      },
      {
        label: "Critical Spares Accuracy",
        value: 94,
        suffix: "%",
        trend: { label: "↑ 4", description: "cycle counts reconciled" }
      },
      {
        label: "Condition Alerts",
        value: 9,
        suffix: "",
        trend: { label: "↘ 3", description: "addressed lube issues" }
      }
    ],
    trend: {
      context: "Risk-ranked assets reviewed each day",
      datapoints: [
        { label: "Mon", value: 8 },
        { label: "Tue", value: 10 },
        { label: "Wed", value: 9 },
        { label: "Thu", value: 11 },
        { label: "Fri", value: 12 },
        { label: "Sat", value: 4 },
        { label: "Sun", value: 3 }
      ]
    },
    projects: {
      context: "Reliability initiatives moving the risk needle",
      items: [
        {
          title: "Asset Criticality Review",
          subtitle: "Re-score packaging line drives with production",
          meta: "Workshop Friday"
        },
        {
          title: "Spare Motor Strategy",
          subtitle: "Model lead time and carrying cost trade-offs",
          meta: "Finance review next week"
        },
        {
          title: "PdM Route Expansion",
          subtitle: "Add ultrasound checks to ammonia compressors",
          meta: "Relaunch Tuesday"
        }
      ]
    },
    highlights: {
      context: "Notes from the reliability program board",
      items: [
        {
          title: "MTBF on conveyors climbed to 124 days",
          subtitle: "Root cause work orders closed the chronic jam",
          meta: "Continuity"
        },
        {
          title: "Digital twin pilot caught pump cavitation early",
          subtitle: "Ops throttled flow before damage occurred",
          meta: "Predictive"
        }
      ]
    },
    meetings: [
      {
        title: "PdM Analytics Review",
        description: "Walk predictive trends with operations supervisors",
        time: "Tuesday · 13:00 – 13:45"
      },
      {
        title: "Spares Strategy Workshop",
        description: "Align on stocking levels for hurricane readiness",
        time: "Thursday · 10:00 – 11:00"
      }
    ]
  }
];

export const dataset = {
  meta: dashboardMeta,
  departments
};
