import { tool } from "ai";
import { z } from "zod/v4";
import { getGitHubClient } from "@/lib/integrations/get-github-client";

// ---------------------------------------------------------------------------
// Mock data: Interconnected product team narrative (Feb 2026)
// ---------------------------------------------------------------------------

export const MOCK_LINEAR_ISSUES = [
  // --- Auth (6) ---
  {
    id: "PRD-142",
    title: "Add SSO support for enterprise customers",
    status: "in_progress",
    priority: "urgent",
    assignee: "Sarah Chen",
    labels: ["enterprise", "auth"],
    estimate: 8,
    project: "auth",
    createdAt: "2026-01-20",
    blockedBy: "Waiting on Okta SAML API credentials (submitted Feb 3, no response after 12 days)",
    url: "https://linear.app/prio/issue/PRD-142",
  },
  {
    id: "PRD-148",
    title: "Implement SAML 2.0 assertion validation",
    status: "in_progress",
    priority: "urgent",
    assignee: "Sarah Chen",
    labels: ["auth", "security"],
    estimate: 5,
    project: "auth",
    createdAt: "2026-02-01",
    blockedBy: "Blocked by PRD-142 — needs Okta credentials first",
    url: "https://linear.app/prio/issue/PRD-148",
  },
  {
    id: "PRD-152",
    title: "OIDC provider configuration UI",
    status: "todo",
    priority: "high",
    assignee: "Priya Patel",
    labels: ["auth", "frontend"],
    estimate: 5,
    project: "auth",
    createdAt: "2026-02-03",
    blockedBy: "Depends on PRD-148 SAML validation work",
    url: "https://linear.app/prio/issue/PRD-152",
  },
  {
    id: "PRD-155",
    title: "SSO session management and token refresh",
    status: "backlog",
    priority: "high",
    assignee: null,
    labels: ["auth", "security"],
    estimate: 8,
    project: "auth",
    createdAt: "2026-02-05",
    url: "https://linear.app/prio/issue/PRD-155",
  },
  {
    id: "PRD-160",
    title: "Enforce MFA for SSO-enabled accounts",
    status: "backlog",
    priority: "medium",
    assignee: null,
    labels: ["auth", "security"],
    estimate: 3,
    project: "auth",
    createdAt: "2026-02-10",
    url: "https://linear.app/prio/issue/PRD-160",
  },
  {
    id: "PRD-146",
    title: "Fix OAuth redirect loop on mobile Safari",
    status: "done",
    priority: "high",
    assignee: "Priya Patel",
    labels: ["auth", "bug", "mobile"],
    estimate: 2,
    project: "auth",
    createdAt: "2026-01-28",
    url: "https://linear.app/prio/issue/PRD-146",
  },

  // --- Performance (4) ---
  {
    id: "PRD-138",
    title: "Dashboard loading time exceeds 3s on mobile",
    status: "done",
    priority: "high",
    assignee: "Alex Kim",
    labels: ["performance", "mobile"],
    estimate: 5,
    project: "performance",
    createdAt: "2026-01-22",
    url: "https://linear.app/prio/issue/PRD-138",
  },
  {
    id: "PRD-156",
    title: "Optimize GraphQL query batching for dashboard",
    status: "in_progress",
    priority: "medium",
    assignee: "Alex Kim",
    labels: ["performance", "api"],
    estimate: 3,
    project: "performance",
    createdAt: "2026-02-05",
    url: "https://linear.app/prio/issue/PRD-156",
  },
  {
    id: "PRD-161",
    title: "Lazy-load chart components on dashboard",
    status: "todo",
    priority: "medium",
    assignee: "Alex Kim",
    labels: ["performance", "frontend"],
    estimate: 2,
    project: "performance",
    createdAt: "2026-02-10",
    url: "https://linear.app/prio/issue/PRD-161",
  },
  {
    id: "PRD-163",
    title: "Add server-side caching for analytics endpoints",
    status: "backlog",
    priority: "low",
    assignee: null,
    labels: ["performance", "infrastructure"],
    estimate: 5,
    project: "performance",
    createdAt: "2026-02-12",
    url: "https://linear.app/prio/issue/PRD-163",
  },

  // --- Onboarding (4) ---
  {
    id: "PRD-131",
    title: "User onboarding flow redesign",
    status: "in_progress",
    priority: "high",
    assignee: "Maria Lopez",
    labels: ["ux", "growth"],
    estimate: 13,
    project: "onboarding",
    createdAt: "2026-01-10",
    url: "https://linear.app/prio/issue/PRD-131",
  },
  {
    id: "PRD-144",
    title: "Add pre-built templates for new workspaces",
    status: "todo",
    priority: "medium",
    assignee: "Maria Lopez",
    labels: ["onboarding", "content"],
    estimate: 5,
    project: "onboarding",
    createdAt: "2026-01-25",
    url: "https://linear.app/prio/issue/PRD-144",
  },
  {
    id: "PRD-153",
    title: "Interactive product tour with guided tooltips",
    status: "todo",
    priority: "medium",
    assignee: "Priya Patel",
    labels: ["onboarding", "frontend"],
    estimate: 8,
    project: "onboarding",
    createdAt: "2026-02-03",
    url: "https://linear.app/prio/issue/PRD-153",
  },
  {
    id: "PRD-164",
    title: "Track onboarding completion rate metrics",
    status: "backlog",
    priority: "low",
    assignee: null,
    labels: ["onboarding", "analytics"],
    estimate: 3,
    project: "onboarding",
    createdAt: "2026-02-13",
    url: "https://linear.app/prio/issue/PRD-164",
  },

  // --- Billing (5) ---
  {
    id: "PRD-127",
    title: "API rate limiting for free tier",
    status: "in_progress",
    priority: "high",
    assignee: "James Wright",
    labels: ["api", "billing"],
    estimate: 5,
    project: "billing",
    createdAt: "2026-01-05",
    blockedBy: "Overdue — started 6 weeks ago, no PR submitted",
    url: "https://linear.app/prio/issue/PRD-127",
  },
  {
    id: "PRD-157",
    title: "Fix incorrect proration on plan upgrades",
    status: "todo",
    priority: "urgent",
    assignee: "James Wright",
    labels: ["billing", "bug"],
    estimate: 3,
    project: "billing",
    createdAt: "2026-02-08",
    url: "https://linear.app/prio/issue/PRD-157",
  },
  {
    id: "PRD-158",
    title: "Pricing page showing stale cached prices",
    status: "todo",
    priority: "high",
    assignee: "James Wright",
    labels: ["billing", "bug", "frontend"],
    estimate: 2,
    project: "billing",
    createdAt: "2026-02-08",
    url: "https://linear.app/prio/issue/PRD-158",
  },
  {
    id: "PRD-159",
    title: "Stripe webhook handler dropping events under load",
    status: "todo",
    priority: "high",
    assignee: "James Wright",
    labels: ["billing", "bug", "infrastructure"],
    estimate: 5,
    project: "billing",
    createdAt: "2026-02-08",
    url: "https://linear.app/prio/issue/PRD-159",
  },
  {
    id: "PRD-165",
    title: "Add annual billing discount toggle",
    status: "backlog",
    priority: "medium",
    assignee: null,
    labels: ["billing", "growth"],
    estimate: 3,
    project: "billing",
    createdAt: "2026-02-14",
    url: "https://linear.app/prio/issue/PRD-165",
  },

  // --- API (5) ---
  {
    id: "PRD-135",
    title: "Implement webhook retry mechanism",
    status: "in_progress",
    priority: "medium",
    assignee: "James Wright",
    labels: ["infrastructure", "api"],
    estimate: 3,
    project: "api",
    createdAt: "2026-01-15",
    blockedBy: "Overdue — started 4+ weeks ago, no PR submitted",
    url: "https://linear.app/prio/issue/PRD-135",
  },
  {
    id: "PRD-149",
    title: "API versioning strategy (v2 migration path)",
    status: "todo",
    priority: "high",
    assignee: "James Wright",
    labels: ["api", "infrastructure"],
    estimate: 8,
    project: "api",
    createdAt: "2026-02-01",
    url: "https://linear.app/prio/issue/PRD-149",
  },
  {
    id: "PRD-162",
    title: "Rate limit response headers missing on /v1/events",
    status: "todo",
    priority: "medium",
    assignee: "James Wright",
    labels: ["api", "bug"],
    estimate: 2,
    project: "api",
    createdAt: "2026-02-11",
    url: "https://linear.app/prio/issue/PRD-162",
  },
  {
    id: "PRD-150",
    title: "GraphQL subscription support for real-time updates",
    status: "backlog",
    priority: "medium",
    assignee: null,
    labels: ["api", "feature"],
    estimate: 13,
    project: "api",
    createdAt: "2026-02-02",
    url: "https://linear.app/prio/issue/PRD-150",
  },
  {
    id: "PRD-166",
    title: "Document new webhook payload format",
    status: "backlog",
    priority: "low",
    assignee: null,
    labels: ["api", "docs"],
    estimate: 2,
    project: "api",
    createdAt: "2026-02-14",
    url: "https://linear.app/prio/issue/PRD-166",
  },

  // --- Mobile (4) ---
  {
    id: "PRD-143",
    title: "Push notification delivery failing on Android 14",
    status: "in_progress",
    priority: "high",
    assignee: "Alex Kim",
    labels: ["mobile", "bug"],
    estimate: 3,
    project: "mobile",
    createdAt: "2026-01-24",
    url: "https://linear.app/prio/issue/PRD-143",
  },
  {
    id: "PRD-151",
    title: "Offline mode data sync conflicts",
    status: "todo",
    priority: "high",
    assignee: "Alex Kim",
    labels: ["mobile", "data"],
    estimate: 8,
    project: "mobile",
    createdAt: "2026-02-02",
    url: "https://linear.app/prio/issue/PRD-151",
  },
  {
    id: "PRD-154",
    title: "Biometric auth on mobile (Face ID / fingerprint)",
    status: "backlog",
    priority: "medium",
    assignee: "Priya Patel",
    labels: ["mobile", "auth"],
    estimate: 5,
    project: "mobile",
    createdAt: "2026-02-04",
    url: "https://linear.app/prio/issue/PRD-154",
  },
  {
    id: "PRD-167",
    title: "Mobile app crashes on low-memory devices",
    status: "todo",
    priority: "medium",
    assignee: null,
    labels: ["mobile", "bug"],
    estimate: 3,
    project: "mobile",
    createdAt: "2026-02-15",
    url: "https://linear.app/prio/issue/PRD-167",
  },
];

export const MOCK_SLACK_MESSAGES = [
  // --- #product-feedback (4) ---
  {
    channel: "#product-feedback",
    author: "Rachel Torres",
    timestamp: "2026-02-14T10:30:00Z",
    text: "Multiple enterprise customers asking about SSO. Acme Corp ($180K ARR) says it's a blocker for their Q1 renewal. They need SAML — not just OIDC.",
    reactions: { "+1": 7, eyes: 3 },
    url: "https://prio-team.slack.com/archives/C04FEEDBACK/p1739526600",
  },
  {
    channel: "#product-feedback",
    author: "Liam O'Brien",
    timestamp: "2026-02-13T15:45:00Z",
    text: "Lost the TechStart deal ($120K ARR). They went with CompetitorX because onboarding took too long AND no SSO. Hurts.",
    reactions: { disappointed: 4, cry: 2 },
    url: "https://prio-team.slack.com/archives/C04FEEDBACK/p1739458700",
  },
  {
    channel: "#product-feedback",
    author: "Rachel Torres",
    timestamp: "2026-02-11T09:15:00Z",
    text: "Meridian Health ($95K ARR) pilot is going well but their IT team won't approve without SSO. Need a timeline to give them.",
    reactions: { "+1": 3 },
    url: "https://prio-team.slack.com/archives/C04FEEDBACK/p1739268900",
  },
  {
    channel: "#product-feedback",
    author: "Alex Kim",
    timestamp: "2026-02-15T11:00:00Z",
    text: "Dashboard perf fix (PR #251) just merged! Mobile load time down from 3.2s to 1.1s. Should see mobile NPS complaints drop.",
    reactions: { tada: 12, rocket: 5, fire: 3 },
    thread: [
      {
        author: "David Park",
        text: "Nice work Alex. Big win for mobile users.",
        timestamp: "2026-02-15T11:05:00Z",
      },
    ],
    url: "https://prio-team.slack.com/archives/C04FEEDBACK/p1739614800",
  },

  // --- #eng-general (5) ---
  {
    channel: "#eng-general",
    author: "Sarah Chen",
    timestamp: "2026-02-10T09:30:00Z",
    text: "Still waiting on Okta API credentials for the SAML integration (PRD-142). Submitted the request 7 days ago. I've followed up twice. This is blocking PRD-148 and PRD-152 too.",
    reactions: { eyes: 4, warning: 2 },
    url: "https://prio-team.slack.com/archives/C04ENGGEN/p1739183400",
  },
  {
    channel: "#eng-general",
    author: "David Park",
    timestamp: "2026-02-12T10:00:00Z",
    text: "Has anyone heard from James? He hasn't been in standup since Monday and has 7 issues assigned. PRD-127 and PRD-135 are both overdue.",
    reactions: { eyes: 3 },
    url: "https://prio-team.slack.com/archives/C04ENGGEN/p1739358000",
  },
  {
    channel: "#eng-general",
    author: "Priya Patel",
    timestamp: "2026-02-14T14:30:00Z",
    text: "Finished the OAuth redirect fix (PRD-146). Ready to pick up PRD-153 (product tour) unless auth needs me on SSO.",
    reactions: { "+1": 2 },
    url: "https://prio-team.slack.com/archives/C04ENGGEN/p1739540200",
  },
  {
    channel: "#eng-general",
    author: "Alex Kim",
    timestamp: "2026-02-12T09:00:00Z",
    text: "PR #251 for dashboard perf is ready for review. Reduced load time from 3.2s to 1.1s on mobile. Key changes: virtualized lists, deferred chart rendering, image lazy-loading.",
    reactions: { rocket: 6 },
    url: "https://prio-team.slack.com/archives/C04ENGGEN/p1739354400",
  },
  {
    channel: "#eng-general",
    author: "Sarah Chen",
    timestamp: "2026-02-15T16:00:00Z",
    text: "Update: Okta support escalated our request. They say 3-5 business days. Best case we can resume SAML work (PRD-142) by Feb 21.",
    reactions: { pray: 5, hourglass: 2 },
    url: "https://prio-team.slack.com/archives/C04ENGGEN/p1739632800",
  },

  // --- #product-decisions (3) ---
  {
    channel: "#product-decisions",
    author: "Nina Kowalski",
    timestamp: "2026-02-05T14:00:00Z",
    text: "Decision: Q1 priorities are 1) SSO (enterprise retention, $480K pipeline at risk), 2) Dashboard performance (mobile NPS dropped 12pts), 3) Onboarding redesign (activation rate at 23%, target 40%). API docs deferred to Q2.",
    reactions: { white_check_mark: 8 },
    thread: [
      {
        author: "David Park",
        text: "Agreed. Auth is the revenue play, perf is the retention play.",
        timestamp: "2026-02-05T14:15:00Z",
      },
      {
        author: "Maria Lopez",
        text: "Onboarding designs are ready whenever eng has bandwidth.",
        timestamp: "2026-02-05T14:20:00Z",
      },
    ],
    url: "https://prio-team.slack.com/archives/C04DECISIONS/p1738764000",
  },
  {
    channel: "#product-decisions",
    author: "Nina Kowalski",
    timestamp: "2026-02-11T16:30:00Z",
    text: "Sprint 3 retro: Auth velocity is concerning — 0 story points completed in auth this sprint due to Okta blocker. Performance on track (PR #251 nearly done). Onboarding designs approved, implementation starting next sprint.",
    reactions: { noted: 4 },
    url: "https://prio-team.slack.com/archives/C04DECISIONS/p1739295000",
  },
  {
    channel: "#product-decisions",
    author: "Nina Kowalski",
    timestamp: "2026-02-14T09:00:00Z",
    text: "Emergency: 4 billing bugs filed yesterday after the pricing page deploy (PRD-157, PRD-158, PRD-159). James owns all of them but he's been unresponsive. David — can you check in?",
    reactions: { warning: 3, eyes: 2 },
    url: "https://prio-team.slack.com/archives/C04DECISIONS/p1739520400",
  },

  // --- #sales (3) ---
  {
    channel: "#sales",
    author: "Liam O'Brien",
    timestamp: "2026-02-07T11:00:00Z",
    text: "Bolt Logistics ($85K ARR) demo went great. They're ready to sign but need SSO with SAML before their security team will approve. Timeline?",
    reactions: { "+1": 2 },
    url: "https://prio-team.slack.com/archives/C04SALES/p1738926000",
  },
  {
    channel: "#sales",
    author: "Liam O'Brien",
    timestamp: "2026-02-12T16:30:00Z",
    text: "Pipeline update: 4 enterprise deals ($480K total ARR) blocked on SSO — Acme Corp ($180K), TechStart ($120K), Meridian Health ($95K), Bolt Logistics ($85K). We're losing competitive deals without it.",
    reactions: { chart_with_upwards_trend: 2, warning: 3 },
    url: "https://prio-team.slack.com/archives/C04SALES/p1739381400",
  },
  {
    channel: "#sales",
    author: "Liam O'Brien",
    timestamp: "2026-02-15T10:00:00Z",
    text: "TechStart officially signed with CompetitorX yesterday. That's $120K we won't get back. The remaining 3 SSO-blocked deals total $360K.",
    reactions: { disappointed: 5 },
    url: "https://prio-team.slack.com/archives/C04SALES/p1739611200",
  },

  // --- #customer-success (3) ---
  {
    channel: "#customer-success",
    author: "Rachel Torres",
    timestamp: "2026-02-08T13:00:00Z",
    text: "Three customers reported incorrect billing after upgrading plans today. All hit the proration bug. Filed PRD-157.",
    reactions: { bug: 3, eyes: 2 },
    url: "https://prio-team.slack.com/archives/C04CS/p1739019600",
  },
  {
    channel: "#customer-success",
    author: "Rachel Torres",
    timestamp: "2026-02-13T11:00:00Z",
    text: "Acme Corp renewal is in 6 weeks. Their champion (VP Eng) said SSO is a 'must-have' for renewal. If we can't commit to a date, they'll evaluate alternatives. That's $180K ARR at risk.",
    reactions: { warning: 4, rotating_light: 2 },
    url: "https://prio-team.slack.com/archives/C04CS/p1739441600",
  },
  {
    channel: "#customer-success",
    author: "Rachel Torres",
    timestamp: "2026-02-10T15:30:00Z",
    text: "NPS survey results: mobile users score us 28 (down from 40 last quarter). Top complaint is dashboard load time. Desktop users at 52 (stable).",
    reactions: { chart_with_downwards_trend: 3 },
    url: "https://prio-team.slack.com/archives/C04CS/p1739205000",
  },
];

export const MOCK_NOTION_DOCS = [
  {
    id: "notion-1",
    title: "PRD: Enterprise SSO Integration",
    type: "prd",
    lastEdited: "2026-02-10",
    excerpt:
      "Support SAML 2.0 and OIDC for enterprise customers. Target: 50+ seat accounts. Expected impact: 30% reduction in enterprise churn, $480K pipeline unblocked. Risk: Dependency on Okta API access (submitted Feb 3, no response). Fallback: Auth0 integration as backup provider.",
    author: "Sarah Chen",
    tags: ["auth", "enterprise", "Q1"],
    linkedIssues: ["PRD-142", "PRD-148", "PRD-152", "PRD-155"],
    url: "https://notion.so/prio/Enterprise-SSO-PRD-a1b2c3d4",
  },
  {
    id: "notion-2",
    title: "Spec: Onboarding Flow v2",
    type: "spec",
    lastEdited: "2026-02-08",
    excerpt:
      "Reduce time-to-value from 15 minutes to 3 minutes. Key changes: guided setup wizard, pre-built templates (PRD-144), interactive tutorial (PRD-153). Success metric: activation rate from 23% to 40%. Design approved Feb 8, eng implementation starting Sprint 4.",
    author: "Maria Lopez",
    tags: ["onboarding", "growth", "Q1"],
    linkedIssues: ["PRD-131", "PRD-144", "PRD-153"],
    url: "https://notion.so/prio/Onboarding-Flow-v2-e5f6g7h8",
  },
  {
    id: "notion-3",
    title: "Q1 Planning Meeting Notes",
    type: "meeting_notes",
    lastEdited: "2026-01-15",
    excerpt:
      "Attendees: Nina, David, Sarah, Alex, Maria, James. Agreed priorities: 1) SSO (enterprise retention — $480K pipeline), 2) Dashboard perf (mobile NPS dropped 12pts), 3) Onboarding redesign (23% activation). API v2 and docs deferred to Q2. James raised concerns about bandwidth across API and billing.",
    author: "Nina Kowalski",
    tags: ["planning", "Q1"],
    linkedIssues: ["PRD-142", "PRD-138", "PRD-131"],
    url: "https://notion.so/prio/Q1-Planning-Notes-i9j0k1l2",
  },
  {
    id: "notion-4",
    title: "Decision Log: Q1 Priority Order",
    type: "decision",
    lastEdited: "2026-02-05",
    excerpt:
      "Decision: Ship SSO before end of Q1 (target: March 15). Dashboard perf fix target: Feb 15. Onboarding v2 target: March 30. Rationale: SSO unblocks $480K in enterprise pipeline. Performance fixes address mobile NPS decline. Onboarding improves activation funnel.",
    author: "Nina Kowalski",
    tags: ["decision", "Q1", "priorities"],
    linkedIssues: ["PRD-142", "PRD-138", "PRD-131", "PRD-127"],
    url: "https://notion.so/prio/Q1-Priority-Decision-m3n4o5p6",
  },
  {
    id: "notion-5",
    title: "Sprint 3 Retrospective",
    type: "meeting_notes",
    lastEdited: "2026-02-11",
    excerpt:
      "What went well: OAuth redirect fix shipped (PRD-146), dashboard perf PR nearly done. What didn't: Auth velocity = 0 due to Okta blocker. James has too many items in flight (7 issues). Action items: 1) Escalate Okta, 2) Redistribute James's load, 3) Consider Auth0 as SAML fallback.",
    author: "David Park",
    tags: ["retro", "sprint-3"],
    linkedIssues: ["PRD-142", "PRD-148", "PRD-138", "PRD-146"],
    url: "https://notion.so/prio/Sprint-3-Retro-q7r8s9t0",
  },
  {
    id: "notion-6",
    title: "Spec: API Rate Limiting v2",
    type: "spec",
    lastEdited: "2026-01-20",
    excerpt:
      "Implement tiered rate limits: Free (100 req/min), Pro (1000 req/min), Enterprise (custom). Uses Redis sliding window. Depends on billing tier detection (PRD-127). Migration path for existing v1 consumers documented. Estimated 2 sprints to complete.",
    author: "James Wright",
    tags: ["api", "billing", "infrastructure"],
    linkedIssues: ["PRD-127", "PRD-149"],
    url: "https://notion.so/prio/API-Rate-Limiting-v2-u1v2w3x4",
  },
  {
    id: "notion-7",
    title: "PRD: Mobile Push Notifications Overhaul",
    type: "prd",
    lastEdited: "2026-02-04",
    excerpt:
      "Fix Android 14 push delivery (PRD-143) and implement offline sync (PRD-151). Root cause: Firebase Cloud Messaging deprecated the legacy API we use. Migration to FCM v1 HTTP API required. Offline sync needs conflict resolution strategy for concurrent edits.",
    author: "Alex Kim",
    tags: ["mobile", "notifications"],
    linkedIssues: ["PRD-143", "PRD-151"],
    url: "https://notion.so/prio/Mobile-Push-Overhaul-y5z6a7b8",
  },
  {
    id: "notion-8",
    title: "Billing System Post-mortem: Feb 8 Pricing Deploy",
    type: "meeting_notes",
    lastEdited: "2026-02-09",
    excerpt:
      "Incident: Pricing page deploy on Feb 8 introduced 3 bugs. Root cause: Stripe webhook handler wasn't updated for new price IDs, proration calculation used old tier boundaries, pricing page CDN cache wasn't invalidated. Impact: ~45 customers saw incorrect charges. Owner: James Wright. Status: All 3 bugs filed, none started.",
    author: "David Park",
    tags: ["billing", "post-mortem", "incident"],
    linkedIssues: ["PRD-157", "PRD-158", "PRD-159"],
    url: "https://notion.so/prio/Billing-Postmortem-Feb8-c9d0e1f2",
  },
  {
    id: "notion-9",
    title: "Architecture: Dashboard Performance Optimization",
    type: "spec",
    lastEdited: "2026-02-07",
    excerpt:
      "Approach: 1) Virtualize issue lists (react-window), 2) Defer chart rendering below fold, 3) Lazy-load images, 4) GraphQL query batching (PRD-156), 5) Server-side caching (PRD-163). Phase 1 (PR #251) targets mobile — expected to reduce load from 3.2s to ~1s. Phase 2 adds caching layer.",
    author: "Alex Kim",
    tags: ["performance", "dashboard", "architecture"],
    linkedIssues: ["PRD-138", "PRD-156", "PRD-161"],
    url: "https://notion.so/prio/Dashboard-Perf-Architecture-g3h4i5j6",
  },
  {
    id: "notion-10",
    title: "Competitive Analysis: SSO Landscape",
    type: "decision",
    lastEdited: "2026-02-06",
    excerpt:
      "CompetitorX launched SSO in January. They support SAML + OIDC + SCIM. Our gap: No SSO at all. 3 of our enterprise prospects cited CompetitorX SSO as reason for considering switch. If we ship SAML + OIDC by March 15, we close the gap on 80% of requirements. SCIM can wait for Q2.",
    author: "Nina Kowalski",
    tags: ["auth", "competitive", "enterprise"],
    linkedIssues: ["PRD-142"],
    url: "https://notion.so/prio/SSO-Competitive-Analysis-k7l8m9n0",
  },
];

export const MOCK_AREA_OVERVIEWS: Record<
  string,
  {
    issues: {
      total: number;
      byStatus: Record<string, number>;
      blockers: { id: string; title: string; daysBlocked: number; url: string }[];
    };
    velocity: {
      issuesCompleted: number;
      avgCycleTimeDays: number;
      trend: string;
    };
    feedbackThemes: { theme: string; mentions: number; sentiment: string }[];
    recentPRs: { merged: number; open: number; avgReviewTimeDays: number };
  }
> = {
  auth: {
    issues: {
      total: 6,
      byStatus: { backlog: 2, todo: 1, in_progress: 2, done: 1 },
      blockers: [
        {
          id: "PRD-142",
          title: "SSO blocked on Okta SAML API credentials (13 days waiting)",
          daysBlocked: 13,
          url: "https://linear.app/prio/issue/PRD-142",
        },
        {
          id: "PRD-148",
          title: "SAML validation blocked by PRD-142",
          daysBlocked: 5,
          url: "https://linear.app/prio/issue/PRD-148",
        },
      ],
    },
    velocity: { issuesCompleted: 1, avgCycleTimeDays: 6.5, trend: "declining" },
    feedbackThemes: [
      { theme: "Enterprise SSO urgently needed", mentions: 8, sentiment: "negative" },
      { theme: "OAuth mobile fix appreciated", mentions: 2, sentiment: "positive" },
    ],
    recentPRs: { merged: 1, open: 1, avgReviewTimeDays: 9.0 },
  },
  performance: {
    issues: {
      total: 4,
      byStatus: { backlog: 1, todo: 1, in_progress: 1, done: 1 },
      blockers: [],
    },
    velocity: { issuesCompleted: 1, avgCycleTimeDays: 3.0, trend: "on_track" },
    feedbackThemes: [
      { theme: "Mobile dashboard slow", mentions: 6, sentiment: "negative" },
      { theme: "Desktop performance fine", mentions: 2, sentiment: "neutral" },
    ],
    recentPRs: { merged: 1, open: 1, avgReviewTimeDays: 1.5 },
  },
  onboarding: {
    issues: {
      total: 4,
      byStatus: { backlog: 1, todo: 2, in_progress: 1, done: 0 },
      blockers: [],
    },
    velocity: { issuesCompleted: 0, avgCycleTimeDays: 0, trend: "not_started" },
    feedbackThemes: [
      { theme: "Onboarding too slow — 15min time-to-value", mentions: 5, sentiment: "negative" },
      { theme: "Want pre-built templates", mentions: 3, sentiment: "neutral" },
    ],
    recentPRs: { merged: 0, open: 0, avgReviewTimeDays: 0 },
  },
  billing: {
    issues: {
      total: 5,
      byStatus: { backlog: 1, todo: 3, in_progress: 1, done: 0 },
      blockers: [
        {
          id: "PRD-127",
          title: "API rate limiting overdue (6 weeks, no PR submitted)",
          daysBlocked: 42,
          url: "https://linear.app/prio/issue/PRD-127",
        },
        {
          id: "PRD-157",
          title: "Proration bug affecting ~45 customers (unfixed since Feb 8)",
          daysBlocked: 8,
          url: "https://linear.app/prio/issue/PRD-157",
        },
      ],
    },
    velocity: { issuesCompleted: 0, avgCycleTimeDays: 0, trend: "at_risk" },
    feedbackThemes: [
      { theme: "Incorrect billing charges after upgrade", mentions: 4, sentiment: "negative" },
      { theme: "Want annual billing option", mentions: 3, sentiment: "neutral" },
    ],
    recentPRs: { merged: 0, open: 0, avgReviewTimeDays: 0 },
  },
  api: {
    issues: {
      total: 5,
      byStatus: { backlog: 2, todo: 2, in_progress: 1, done: 0 },
      blockers: [
        {
          id: "PRD-135",
          title: "Webhook retry overdue (4+ weeks, no PR submitted)",
          daysBlocked: 32,
          url: "https://linear.app/prio/issue/PRD-135",
        },
      ],
    },
    velocity: { issuesCompleted: 0, avgCycleTimeDays: 0, trend: "at_risk" },
    feedbackThemes: [
      { theme: "API docs incomplete", mentions: 6, sentiment: "negative" },
      { theme: "Need webhook reliability", mentions: 3, sentiment: "negative" },
    ],
    recentPRs: { merged: 0, open: 0, avgReviewTimeDays: 0 },
  },
  mobile: {
    issues: {
      total: 4,
      byStatus: { backlog: 1, todo: 2, in_progress: 1, done: 0 },
      blockers: [],
    },
    velocity: { issuesCompleted: 0, avgCycleTimeDays: 0, trend: "improving" },
    feedbackThemes: [
      { theme: "Push notifications unreliable on Android", mentions: 4, sentiment: "negative" },
      { theme: "Dashboard fast now after perf fix!", mentions: 2, sentiment: "positive" },
    ],
    recentPRs: { merged: 0, open: 1, avgReviewTimeDays: 2.0 },
  },
};

export const MOCK_JIRA_ISSUES = [
  // --- Auth / SSO (5) ---
  {
    key: "ENG-401",
    summary: "Epic: Enterprise SSO (SAML + OIDC)",
    status: "In Progress",
    priority: "Highest",
    type: "Epic",
    assignee: "Sarah Chen",
    labels: ["enterprise", "auth"],
    project: "ENG",
    sprint: "Sprint 4",
    storyPoints: 21,
    createdAt: "2026-01-18",
    blockedBy: "Blocked — Okta SAML API credentials not received (13 days waiting)",
    url: "https://mycompany.atlassian.net/browse/ENG-401",
  },
  {
    key: "ENG-415",
    summary: "Implement SAML 2.0 assertion validation",
    status: "In Progress",
    priority: "Highest",
    type: "Story",
    assignee: "Sarah Chen",
    labels: ["auth", "security"],
    project: "ENG",
    sprint: "Sprint 4",
    storyPoints: 5,
    createdAt: "2026-02-01",
    blockedBy: "Blocked by ENG-401 — needs Okta credentials first",
    url: "https://mycompany.atlassian.net/browse/ENG-415",
  },
  {
    key: "ENG-422",
    summary: "OIDC provider configuration UI",
    status: "To Do",
    priority: "High",
    type: "Story",
    assignee: "Priya Patel",
    labels: ["auth", "frontend"],
    project: "ENG",
    sprint: "Sprint 5",
    storyPoints: 5,
    createdAt: "2026-02-03",
    blockedBy: "Depends on ENG-415 SAML validation",
    url: "https://mycompany.atlassian.net/browse/ENG-422",
  },
  {
    key: "ENG-428",
    summary: "SSO session management and token refresh",
    status: "Backlog",
    priority: "High",
    type: "Story",
    assignee: null,
    labels: ["auth", "security"],
    project: "ENG",
    sprint: null,
    storyPoints: 8,
    createdAt: "2026-02-05",
    url: "https://mycompany.atlassian.net/browse/ENG-428",
  },
  {
    key: "ENG-446",
    summary: "Fix OAuth redirect loop on mobile Safari",
    status: "Done",
    priority: "High",
    type: "Bug",
    assignee: "Priya Patel",
    labels: ["auth", "mobile"],
    project: "ENG",
    sprint: "Sprint 3",
    storyPoints: 2,
    createdAt: "2026-01-28",
    url: "https://mycompany.atlassian.net/browse/ENG-446",
  },

  // --- Billing / API (6) --- James Wright overloaded
  {
    key: "ENG-389",
    summary: "API rate limiting for free tier",
    status: "In Progress",
    priority: "High",
    type: "Story",
    assignee: "James Wright",
    labels: ["api", "billing"],
    project: "ENG",
    sprint: "Sprint 2",
    storyPoints: 5,
    createdAt: "2026-01-05",
    blockedBy: "Overdue — started 6 weeks ago, no PR submitted",
    url: "https://mycompany.atlassian.net/browse/ENG-389",
  },
  {
    key: "ENG-445",
    summary: "Fix incorrect proration on plan upgrades",
    status: "To Do",
    priority: "Highest",
    type: "Bug",
    assignee: "James Wright",
    labels: ["billing"],
    project: "ENG",
    sprint: "Sprint 4",
    storyPoints: 3,
    createdAt: "2026-02-08",
    url: "https://mycompany.atlassian.net/browse/ENG-445",
  },
  {
    key: "ENG-447",
    summary: "Pricing page showing stale cached prices",
    status: "To Do",
    priority: "High",
    type: "Bug",
    assignee: "James Wright",
    labels: ["billing", "frontend"],
    project: "ENG",
    sprint: "Sprint 4",
    storyPoints: 2,
    createdAt: "2026-02-08",
    url: "https://mycompany.atlassian.net/browse/ENG-447",
  },
  {
    key: "ENG-448",
    summary: "Stripe webhook handler dropping events under load",
    status: "To Do",
    priority: "High",
    type: "Bug",
    assignee: "James Wright",
    labels: ["billing", "infrastructure"],
    project: "ENG",
    sprint: "Sprint 4",
    storyPoints: 5,
    createdAt: "2026-02-08",
    url: "https://mycompany.atlassian.net/browse/ENG-448",
  },
  {
    key: "ENG-438",
    summary: "Implement billing tier detection for rate limits",
    status: "To Do",
    priority: "High",
    type: "Story",
    assignee: "James Wright",
    labels: ["api", "billing"],
    project: "ENG",
    sprint: "Sprint 5",
    storyPoints: 5,
    createdAt: "2026-02-01",
    blockedBy: "Depends on ENG-389 rate limiting",
    url: "https://mycompany.atlassian.net/browse/ENG-438",
  },
  {
    key: "ENG-449",
    summary: "API versioning strategy (v2 migration path)",
    status: "To Do",
    priority: "High",
    type: "Story",
    assignee: "James Wright",
    labels: ["api", "infrastructure"],
    project: "ENG",
    sprint: "Sprint 5",
    storyPoints: 8,
    createdAt: "2026-02-01",
    url: "https://mycompany.atlassian.net/browse/ENG-449",
  },

  // --- Performance (3) ---
  {
    key: "ENG-412",
    summary: "Dashboard loading time exceeds 3s on mobile",
    status: "Done",
    priority: "High",
    type: "Bug",
    assignee: "Alex Kim",
    labels: ["performance", "mobile"],
    project: "ENG",
    sprint: "Sprint 3",
    storyPoints: 5,
    createdAt: "2026-01-22",
    url: "https://mycompany.atlassian.net/browse/ENG-412",
  },
  {
    key: "ENG-432",
    summary: "Optimize GraphQL query batching for dashboard",
    status: "In Progress",
    priority: "Medium",
    type: "Task",
    assignee: "Alex Kim",
    labels: ["performance", "api"],
    project: "ENG",
    sprint: "Sprint 4",
    storyPoints: 3,
    createdAt: "2026-02-05",
    url: "https://mycompany.atlassian.net/browse/ENG-432",
  },
  {
    key: "ENG-440",
    summary: "Lazy-load chart components on dashboard",
    status: "To Do",
    priority: "Medium",
    type: "Task",
    assignee: "Alex Kim",
    labels: ["performance", "frontend"],
    project: "ENG",
    sprint: "Sprint 5",
    storyPoints: 2,
    createdAt: "2026-02-10",
    url: "https://mycompany.atlassian.net/browse/ENG-440",
  },

  // --- Onboarding (3) ---
  {
    key: "ENG-430",
    summary: "User onboarding flow redesign",
    status: "In Progress",
    priority: "High",
    type: "Story",
    assignee: "Maria Lopez",
    labels: ["ux", "growth"],
    project: "ENG",
    sprint: "Sprint 4",
    storyPoints: 13,
    createdAt: "2026-01-10",
    url: "https://mycompany.atlassian.net/browse/ENG-430",
  },
  {
    key: "ENG-435",
    summary: "Add pre-built templates for new workspaces",
    status: "To Do",
    priority: "Medium",
    type: "Story",
    assignee: "Maria Lopez",
    labels: ["onboarding", "content"],
    project: "ENG",
    sprint: "Sprint 5",
    storyPoints: 5,
    createdAt: "2026-01-25",
    url: "https://mycompany.atlassian.net/browse/ENG-435",
  },
  {
    key: "ENG-436",
    summary: "Interactive product tour with guided tooltips",
    status: "To Do",
    priority: "Medium",
    type: "Story",
    assignee: "Priya Patel",
    labels: ["onboarding", "frontend"],
    project: "ENG",
    sprint: "Sprint 5",
    storyPoints: 8,
    createdAt: "2026-02-03",
    url: "https://mycompany.atlassian.net/browse/ENG-436",
  },

  // --- Mobile (2) ---
  {
    key: "ENG-420",
    summary: "Push notification delivery failing on Android 14",
    status: "In Progress",
    priority: "High",
    type: "Bug",
    assignee: "Alex Kim",
    labels: ["mobile"],
    project: "ENG",
    sprint: "Sprint 4",
    storyPoints: 3,
    createdAt: "2026-01-24",
    url: "https://mycompany.atlassian.net/browse/ENG-420",
  },
  {
    key: "ENG-425",
    summary: "Offline mode data sync conflicts",
    status: "To Do",
    priority: "High",
    type: "Story",
    assignee: "Alex Kim",
    labels: ["mobile", "data"],
    project: "ENG",
    sprint: "Sprint 5",
    storyPoints: 8,
    createdAt: "2026-02-02",
    url: "https://mycompany.atlassian.net/browse/ENG-425",
  },
];

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

export function createTools(userId: string) {
  return {
    searchLinearIssues: tool({
      description:
        "Search and filter Linear issues by status, assignee, label, or project. Returns issue titles, statuses, priorities, and assignees.",
      inputSchema: z.object({
        query: z.string().describe("Search query or keyword"),
        status: z
          .enum(["backlog", "todo", "in_progress", "done", "canceled"])
          .optional()
          .describe("Filter by issue status"),
        project: z.string().optional().describe("Filter by project name"),
        limit: z
          .number()
          .optional()
          .default(10)
          .describe("Max number of results"),
      }),
      execute: async ({ query, status, project, limit }) => {
        const filtered = MOCK_LINEAR_ISSUES.filter((issue) => {
          if (status && issue.status !== status) return false;
          if (project && issue.project !== project.toLowerCase()) return false;
          if (query) {
            const q = query.toLowerCase();
            const searchable = [
              issue.title,
              issue.id,
              issue.assignee ?? "",
              ...issue.labels,
              issue.project,
              issue.blockedBy ?? "",
            ]
              .join(" ")
              .toLowerCase();
            if (!searchable.includes(q)) return false;
          }
          return true;
        }).slice(0, limit);

        return {
          data: filtered,
          error: null,
          metadata: {
            source: "linear",
            resultCount: filtered.length,
          },
        };
      },
    }),

    getProductAreaOverview: tool({
      description:
        "Get a complete overview of a product area including active issues, blockers, recent feedback themes, and development velocity.",
      inputSchema: z.object({
        area: z
          .string()
          .describe(
            "Product area or team name (e.g. 'auth', 'billing', 'onboarding')"
          ),
        timeRange: z
          .enum(["7d", "30d", "90d"])
          .optional()
          .default("30d")
          .describe("Time range for metrics"),
      }),
      execute: async ({ area, timeRange }) => {
        const areaKey = area.toLowerCase();
        const overview = MOCK_AREA_OVERVIEWS[areaKey];

        if (!overview) {
          return {
            data: {
              area,
              timeRange,
              error: `No data available for area "${area}". Available areas: ${Object.keys(MOCK_AREA_OVERVIEWS).join(", ")}`,
              issues: { total: 0, byStatus: {}, blockers: [] },
              velocity: { issuesCompleted: 0, avgCycleTimeDays: 0, trend: "unknown" },
              feedbackThemes: [],
              recentPRs: { merged: 0, open: 0, avgReviewTimeDays: 0 },
            },
            error: null,
            metadata: { source: "aggregated" },
          };
        }

        // Scale velocity by time range
        const scale = timeRange === "7d" ? 0.25 : timeRange === "90d" ? 3 : 1;
        const velocity = {
          issuesCompleted: Math.round(overview.velocity.issuesCompleted * scale),
          avgCycleTimeDays: overview.velocity.avgCycleTimeDays,
          trend: overview.velocity.trend,
        };

        return {
          data: {
            area,
            timeRange,
            issues: overview.issues,
            velocity,
            feedbackThemes: overview.feedbackThemes,
            recentPRs: overview.recentPRs,
          },
          error: null,
          metadata: { source: "aggregated" },
        };
      },
    }),

    searchSlackMessages: tool({
      description:
        "Search Slack channels for customer feedback, team discussions, and product decisions. Returns message excerpts with context.",
      inputSchema: z.object({
        query: z.string().describe("Search query for Slack messages"),
        channel: z
          .string()
          .optional()
          .describe(
            "Specific channel to search (e.g. #product-feedback)"
          ),
        limit: z
          .number()
          .optional()
          .default(10)
          .describe("Max number of results"),
      }),
      execute: async ({ query, channel, limit }) => {
        const filtered = MOCK_SLACK_MESSAGES.filter((msg) => {
          if (channel) {
            const normalized = channel.startsWith("#")
              ? channel
              : `#${channel}`;
            if (msg.channel !== normalized) return false;
          }
          if (query) {
            const q = query.toLowerCase();
            const threadText = (
              msg.thread?.map((t) => t.text) ?? []
            ).join(" ");
            const searchable = [
              msg.text,
              msg.author,
              msg.channel,
              threadText,
            ]
              .join(" ")
              .toLowerCase();
            if (!searchable.includes(q)) return false;
          }
          return true;
        }).slice(0, limit);

        return {
          data: filtered,
          error: null,
          metadata: {
            source: "slack",
            resultCount: filtered.length,
          },
        };
      },
    }),

    searchNotionDocs: tool({
      description:
        "Search Notion workspace for PRDs, specs, meeting notes, and product decisions. Returns document titles and relevant excerpts.",
      inputSchema: z.object({
        query: z.string().describe("Search query for Notion documents"),
        type: z
          .enum(["prd", "spec", "meeting_notes", "decision", "all"])
          .optional()
          .default("all")
          .describe("Filter by document type"),
      }),
      execute: async ({ query, type }) => {
        const filtered = MOCK_NOTION_DOCS.filter((doc) => {
          if (type !== "all" && doc.type !== type) return false;
          if (query) {
            const q = query.toLowerCase();
            const searchable = [
              doc.title,
              doc.excerpt,
              doc.author,
              ...doc.tags,
              ...(doc.linkedIssues ?? []),
            ]
              .join(" ")
              .toLowerCase();
            if (!searchable.includes(q)) return false;
          }
          return true;
        });

        return {
          data: filtered,
          error: null,
          metadata: {
            source: "notion",
            resultCount: filtered.length,
          },
        };
      },
    }),

    searchJiraIssues: tool({
      description:
        "Search and filter Jira issues by status, assignee, type, or project. Returns issue keys, summaries, statuses, priorities, types, and assignees.",
      inputSchema: z.object({
        query: z.string().describe("Search query or keyword"),
        status: z
          .string()
          .optional()
          .describe(
            "Filter by status (e.g. 'In Progress', 'To Do', 'Done', 'Backlog')"
          ),
        type: z
          .enum(["Bug", "Story", "Task", "Epic", "all"])
          .optional()
          .default("all")
          .describe("Filter by issue type"),
        project: z.string().optional().describe("Filter by project key (e.g. 'ENG')"),
        limit: z
          .number()
          .optional()
          .default(10)
          .describe("Max number of results"),
      }),
      execute: async ({ query, status, type, project, limit }) => {
        const filtered = MOCK_JIRA_ISSUES.filter((issue) => {
          if (status && issue.status.toLowerCase() !== status.toLowerCase())
            return false;
          if (type && type !== "all" && issue.type !== type) return false;
          if (project && issue.project.toLowerCase() !== project.toLowerCase())
            return false;
          if (query) {
            const q = query.toLowerCase();
            const searchable = [
              issue.summary,
              issue.key,
              issue.assignee ?? "",
              ...issue.labels,
              issue.project,
              issue.type,
              issue.sprint ?? "",
              issue.blockedBy ?? "",
            ]
              .join(" ")
              .toLowerCase();
            if (!searchable.includes(q)) return false;
          }
          return true;
        }).slice(0, limit);

        return {
          data: filtered,
          error: null,
          metadata: {
            source: "jira",
            resultCount: filtered.length,
          },
        };
      },
    }),

    generateBrief: tool({
      description:
        "Generate and save a structured product brief (PRD, analysis, or recommendation). Use this when the user asks you to draft a PRD, create a brief, write up an analysis, or save your findings as a document.",
      inputSchema: z.object({
        title: z
          .string()
          .describe("Brief title (e.g., 'SSO Integration PRD')"),
        content: z.object({
          summary: z
            .string()
            .describe("Executive summary (2-3 sentences)"),
          sections: z
            .array(
              z.object({
                heading: z.string(),
                body: z
                  .string()
                  .describe("Markdown-formatted section content"),
              })
            )
            .describe("Main content sections"),
          recommendations: z
            .array(z.string())
            .optional()
            .describe("Key recommendations or next steps"),
        }),
      }),
      execute: async ({ title, content }) => {
        return {
          data: { title, content, savedAt: new Date().toISOString() },
          error: null,
          metadata: { source: "prio", type: "brief" },
        };
      },
    }),

    synthesizeEvidence: tool({
      description:
        "Synthesize cross-source evidence into a structured graph showing how findings connect. Call this AFTER gathering data from 2+ sources when you discover non-obvious patterns, cascading blockers, or hidden risk chains. The evidence graph will be rendered visually for the user.",
      inputSchema: z.object({
        title: z
          .string()
          .describe("Concise finding title, e.g. 'SSO Delay Threatening $360K Pipeline'"),
        keyInsight: z
          .string()
          .describe(
            "The non-obvious insight connecting the evidence — the thing a human PM might miss"
          ),
        evidence: z
          .array(
            z.object({
              id: z.string().describe("Unique identifier, e.g. 'linear-prd-142'"),
              source: z.enum(["linear", "slack", "notion", "github", "jira"]),
              label: z.string().describe("Short label, e.g. 'PRD-142: SSO Support'"),
              detail: z
                .string()
                .describe("Key detail, e.g. 'Blocked 13 days on Okta credentials'"),
              url: z.string().describe("URL to the source item"),
            })
          )
          .describe("Evidence items from different sources (4-8 items)"),
        connections: z
          .array(
            z.object({
              from: z.string().describe("Source evidence id"),
              to: z.string().describe("Target evidence id"),
              type: z.enum([
                "blocks",
                "references",
                "contradicts",
                "supports",
                "caused_by",
              ]),
            })
          )
          .describe("Relationships between evidence items"),
        impact: z.object({
          revenue: z
            .string()
            .optional()
            .describe("Revenue impact, e.g. '$360K pipeline at risk'"),
          timeline: z
            .string()
            .optional()
            .describe("Timeline impact, e.g. '3+ week delay'"),
          risk: z.enum(["critical", "high", "medium", "low"]),
        }),
      }),
      execute: async (input) => ({
        data: input,
        error: null,
        metadata: { source: "prio", type: "evidence_synthesis" },
      }),
    }),

    // --- Real GitHub tools ---

    searchGitHubRepos: tool({
      description:
        "List the user's GitHub repositories, sorted by most recently updated. Use this to find repos before searching issues or PRs.",
      inputSchema: z.object({
        limit: z
          .number()
          .optional()
          .default(10)
          .describe("Max repos to return"),
      }),
      execute: async ({ limit }) => {
        const github = await getGitHubClient(userId);
        if (!github) {
          return {
            data: [],
            error:
              "GitHub not connected. Ask the user to connect GitHub in Settings.",
            metadata: { source: "github" },
          };
        }
        return github.getRepos({ limit });
      },
    }),

    searchGitHubPRs: tool({
      description:
        "Search pull requests in a GitHub repository. Returns PR titles, authors, status, and URLs.",
      inputSchema: z.object({
        owner: z
          .string()
          .describe("Repository owner (e.g. 'vercel')"),
        repo: z.string().describe("Repository name (e.g. 'next.js')"),
        state: z
          .enum(["open", "closed", "all"])
          .optional()
          .default("open"),
        limit: z.number().optional().default(10),
      }),
      execute: async ({ owner, repo, state, limit }) => {
        const github = await getGitHubClient(userId);
        if (!github) {
          return {
            data: [],
            error: "GitHub not connected.",
            metadata: { source: "github" },
          };
        }
        return github.getPullRequests({ owner, repo, state, limit });
      },
    }),

    searchGitHubIssues: tool({
      description:
        "Search issues in a GitHub repository. Returns issue titles, labels, authors, and URLs.",
      inputSchema: z.object({
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        state: z
          .enum(["open", "closed", "all"])
          .optional()
          .default("open"),
        labels: z
          .string()
          .optional()
          .describe("Comma-separated label filter"),
        limit: z.number().optional().default(10),
      }),
      execute: async ({ owner, repo, state, labels, limit }) => {
        const github = await getGitHubClient(userId);
        if (!github) {
          return {
            data: [],
            error: "GitHub not connected.",
            metadata: { source: "github" },
          };
        }
        return github.getIssues({ owner, repo, state, labels, limit });
      },
    }),

    getGitHubCommits: tool({
      description:
        "Get recent commits from a GitHub repository. Returns commit messages, authors, and dates.",
      inputSchema: z.object({
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        limit: z.number().optional().default(10),
      }),
      execute: async ({ owner, repo, limit }) => {
        const github = await getGitHubClient(userId);
        if (!github) {
          return {
            data: [],
            error: "GitHub not connected.",
            metadata: { source: "github" },
          };
        }
        return github.getRecentCommits({ owner, repo, limit });
      },
    }),
  };
}
