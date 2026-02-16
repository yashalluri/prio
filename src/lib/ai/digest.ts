import {
  MOCK_LINEAR_ISSUES,
  MOCK_JIRA_ISSUES,
  MOCK_SLACK_MESSAGES,
  MOCK_AREA_OVERVIEWS,
} from "./tools";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DigestRisk {
  severity: "critical" | "high" | "medium";
  title: string;
  detail: string;
  sources: string[]; // e.g. ["Linear", "Slack", "Jira"]
  metric?: string; // e.g. "$360K at risk"
}

export interface DigestWin {
  title: string;
  detail: string;
  source: string;
}

export interface DigestAction {
  verb: string; // bold verb: "Escalate", "Check in", "Decide"
  action: string;
  urgency: "today" | "this_week";
}

export interface DigestTeamRisk {
  name: string;
  issueCount: number;
  overdueCount: number;
  flag: string;
}

export interface DailyDigest {
  date: string;
  overallStatus: "on_track" | "at_risk" | "critical";
  statusLine: string;
  risks: DigestRisk[];
  wins: DigestWin[];
  actions: DigestAction[];
  teamRisks: DigestTeamRisk[];
  velocityTrend: { sprint: string; planned: number; completed: number }[];
  pipelineAtRisk: number; // dollar amount
}

// ---------------------------------------------------------------------------
// Analysis engine — deterministic, no AI call needed
// ---------------------------------------------------------------------------

export function generateDailyDigest(): DailyDigest {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // --- Blockers across Linear + Jira ---
  const linearBlockers = MOCK_LINEAR_ISSUES.filter(
    (i) => i.blockedBy && i.status !== "done"
  );
  const jiraBlockers = MOCK_JIRA_ISSUES.filter(
    (i) => i.blockedBy && i.status !== "Done"
  );

  // --- Team workload analysis ---
  const assigneeCounts: Record<string, { total: number; overdue: number }> = {};
  for (const issue of [...MOCK_LINEAR_ISSUES, ...MOCK_JIRA_ISSUES]) {
    const name =
      "assignee" in issue && issue.assignee ? issue.assignee : null;
    if (!name) continue;
    if (!assigneeCounts[name]) assigneeCounts[name] = { total: 0, overdue: 0 };
    assigneeCounts[name].total++;
    const blockedBy = "blockedBy" in issue ? issue.blockedBy : undefined;
    if (
      blockedBy &&
      typeof blockedBy === "string" &&
      blockedBy.toLowerCase().includes("overdue")
    ) {
      assigneeCounts[name].overdue++;
    }
  }

  const teamRisks: DigestTeamRisk[] = [];
  for (const [name, counts] of Object.entries(assigneeCounts)) {
    if (counts.total >= 6 || counts.overdue > 0) {
      const flags: string[] = [];
      if (counts.total >= 6) flags.push(`${counts.total} issues assigned`);
      if (counts.overdue > 0)
        flags.push(`${counts.overdue} overdue with no PR`);
      teamRisks.push({
        name,
        issueCount: counts.total,
        overdueCount: counts.overdue,
        flag: flags.join(", "),
      });
    }
  }
  teamRisks.sort((a, b) => b.issueCount - a.issueCount);

  // --- Revenue at risk from Slack ---
  const ssoSlackMsgs = MOCK_SLACK_MESSAGES.filter(
    (m) =>
      m.text.toLowerCase().includes("sso") ||
      m.text.toLowerCase().includes("pipeline")
  );
  const pipelineAtRisk = 360_000; // from Slack: 3 remaining deals after TechStart loss

  // --- Wins ---
  const wins: DigestWin[] = [];
  const doneLinear = MOCK_LINEAR_ISSUES.filter((i) => i.status === "done");
  for (const issue of doneLinear) {
    wins.push({
      title: `${issue.id}: ${issue.title}`,
      detail: `Completed by ${issue.assignee}`,
      source: "Linear",
    });
  }
  const doneJira = MOCK_JIRA_ISSUES.filter((i) => i.status === "Done");
  for (const issue of doneJira) {
    if (!wins.some((w) => w.title.includes(issue.summary))) {
      wins.push({
        title: `${issue.key}: ${issue.summary}`,
        detail: `Completed by ${issue.assignee}`,
        source: "Jira",
      });
    }
  }

  // --- Risks ---
  const risks: DigestRisk[] = [];

  // SSO blocker cascade
  const ssoBlockerDays =
    MOCK_AREA_OVERVIEWS.auth.issues.blockers[0]?.daysBlocked ?? 13;
  risks.push({
    severity: "critical",
    title: "SSO blocker cascade — Okta credentials stalled",
    detail: `PRD-142 blocked ${ssoBlockerDays} days. Cascading to PRD-148 and PRD-152. 3 enterprise deals ($360K) waiting on SSO.`,
    sources: ["Linear", "Jira", "Slack"],
    metric: "$360K pipeline at risk",
  });

  // James Wright overload
  const jamesData = assigneeCounts["James Wright"];
  if (jamesData) {
    risks.push({
      severity: "critical",
      title: "James Wright — overloaded and unresponsive",
      detail: `${jamesData.total} issues assigned, ${jamesData.overdue} overdue with no PR. Billing bugs from Feb 8 incident still unfixed (~45 customers affected).`,
      sources: ["Linear", "Jira", "Slack"],
      metric: "45 customers affected",
    });
  }

  // Billing area at risk
  const billingArea = MOCK_AREA_OVERVIEWS.billing;
  if (billingArea.velocity.trend === "at_risk") {
    risks.push({
      severity: "high",
      title: "Billing area — zero velocity, 2 active blockers",
      detail: `PRD-127 overdue 42 days. Proration bug (PRD-157) unfixed 8 days. 0 issues completed this sprint.`,
      sources: ["Linear", "Notion"],
    });
  }

  // Sprint velocity declining
  risks.push({
    severity: "high",
    title: "Sprint velocity declining 3 consecutive sprints",
    detail:
      "Completed points: Sprint 1 (14) → Sprint 2 (10) → Sprint 3 (5) → Sprint 4 (3 so far). Auth team blocked, billing team stalled.",
    sources: ["Linear", "Jira"],
  });

  // --- Actions ---
  const actions: DigestAction[] = [
    {
      verb: "Escalate",
      action:
        "Okta SAML credentials — Sarah's update says 3-5 business days, best case Feb 21. Consider Auth0 as fallback.",
      urgency: "today",
    },
    {
      verb: "Check in",
      action:
        "with James Wright — 7 issues, 0 PRs, absent from standups since Monday. Redistribute billing bugs if needed.",
      urgency: "today",
    },
    {
      verb: "Decide",
      action:
        "whether to redirect Priya to SSO work (PRD-152) or keep her on onboarding tour (PRD-153). SSO has higher revenue impact.",
      urgency: "this_week",
    },
    {
      verb: "Review",
      action:
        "Acme Corp renewal timeline — 6 weeks out, $180K ARR. Their VP Eng says SSO is a must-have. Need to give them a date.",
      urgency: "this_week",
    },
  ];

  // --- Overall status ---
  const criticalCount = risks.filter((r) => r.severity === "critical").length;
  const overallStatus: DailyDigest["overallStatus"] =
    criticalCount >= 2 ? "critical" : criticalCount >= 1 ? "at_risk" : "on_track";

  const atRiskAreas = Object.entries(MOCK_AREA_OVERVIEWS).filter(
    ([, v]) => v.velocity.trend === "at_risk" || v.velocity.trend === "declining"
  );

  const statusLine =
    overallStatus === "critical"
      ? `${criticalCount} critical risks across ${atRiskAreas.length} areas. Auth blocked on external dependency, billing stalled on personnel issue.`
      : overallStatus === "at_risk"
        ? `${atRiskAreas.length} areas at risk. Velocity declining.`
        : "All areas on track.";

  return {
    date: dateStr,
    overallStatus,
    statusLine,
    risks,
    wins,
    actions,
    teamRisks,
    velocityTrend: [
      { sprint: "Sprint 1", planned: 16, completed: 14 },
      { sprint: "Sprint 2", planned: 15, completed: 10 },
      { sprint: "Sprint 3", planned: 14, completed: 5 },
      { sprint: "Sprint 4", planned: 13, completed: 3 },
    ],
    pipelineAtRisk,
  };
}
