import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const SEED_USER_ID = process.env.SEED_USER_ID ?? "seed-demo-user";
const SEED_USER_EMAIL = process.env.SEED_USER_EMAIL ?? "demo@prio.dev";

function msg(
  role: "user" | "assistant",
  text: string
): { id: string; role: string; parts: { type: string; text: string }[] } {
  return {
    id: crypto.randomUUID(),
    role,
    parts: [{ type: "text", text }],
  };
}

async function main() {
  console.log("Seeding database...");

  // 1. Upsert user
  await prisma.user.upsert({
    where: { id: SEED_USER_ID },
    update: { email: SEED_USER_EMAIL },
    create: { id: SEED_USER_ID, email: SEED_USER_EMAIL, name: "Demo User" },
  });

  // 2. Clean existing seed data
  await prisma.brief.deleteMany({ where: { userId: SEED_USER_ID } });
  await prisma.conversation.deleteMany({ where: { userId: SEED_USER_ID } });

  // 3. Create conversations
  const conv1 = await prisma.conversation.create({
    data: {
      userId: SEED_USER_ID,
      title: "Why is auth velocity dropping?",
      messages: [
        msg("user", "Why is auth velocity dropping this sprint?"),
        msg(
          "assistant",
          `**Auth velocity has collapsed to zero this sprint.** The root cause is a single external dependency blocking the entire SSO chain.

| Issue | Status | Blocker | Days Blocked |
|---|---|---|---|
| [PRD-142](https://linear.app/prio/issue/PRD-142): SSO support | In Progress | Okta SAML API credentials not received | 13 |
| [PRD-148](https://linear.app/prio/issue/PRD-148): SAML validation | In Progress | Depends on PRD-142 | 5 |
| [PRD-152](https://linear.app/prio/issue/PRD-152): OIDC config UI | Todo | Depends on PRD-148 | — |

Sarah Chen is assigned to PRD-142 and PRD-148 but cannot make progress. She posted in #eng-general on Feb 10: *"Still waiting on Okta API credentials... submitted 7 days ago. This is blocking PRD-148 and PRD-152 too."*

The Sprint 3 retro flagged this: "Auth velocity = 0 due to Okta blocker." Action items included escalating Okta and evaluating Auth0 as a fallback SAML provider.

**Update (Feb 15):** Okta escalated the request. Best case, credentials arrive by Feb 21 — meaning auth work resumes Sprint 5 at earliest.

### Recommendations
1. **Escalate** Okta through their enterprise support channel — 13 days is unacceptable
2. **Evaluate** Auth0 as backup SAML provider to derisk the timeline
3. **Reassign** Priya Patel from onboarding to SSO prep work (PRD-152 UI) so she's ready when unblocked

---
**Sources**
- [PRD-142: Add SSO support](https://linear.app/prio/issue/PRD-142) — Linear
- [PRD-148: SAML validation](https://linear.app/prio/issue/PRD-148) — Linear
- [Sprint 3 Retrospective](https://notion.so/prio/Sprint-3-Retro-q7r8s9t0) — Notion
- [#eng-general](https://prio-team.slack.com/archives/C04ENGGEN/p1739183400) — Slack, Feb 10`
        ),
      ],
    },
  });

  const conv2 = await prisma.conversation.create({
    data: {
      userId: SEED_USER_ID,
      title: "Backlog prioritization (RICE)",
      messages: [
        msg("user", "Can you prioritize our backlog using RICE scoring?"),
        msg(
          "assistant",
          `**RICE analysis of 10 highest-priority backlog and todo items.** Scoring uses data from Linear issues, Slack feedback frequency, and Notion PRDs.

| Rank | Issue | Reach | Impact | Confidence | Effort | RICE Score |
|---|---|---|---|---|---|---|
| 1 | PRD-142: SSO support | 4 deals ($480K) | 3 (massive) | 90% | 8 pts | **162** |
| 2 | PRD-157: Proration bug | ~45 customers | 3 (massive) | 95% | 3 pts | **142** |
| 3 | PRD-131: Onboarding redesign | All new users | 2 (high) | 80% | 13 pts | **12** |
| 4 | PRD-138: Dashboard perf | Mobile users | 2 (high) | 90% | 5 pts | **36** |
| 5 | PRD-143: Android push | Android users | 2 (high) | 85% | 3 pts | **57** |
| 6 | PRD-152: OIDC config UI | Enterprise | 2 (high) | 70% | 5 pts | **28** |
| 7 | PRD-149: API v2 migration | API consumers | 2 (high) | 60% | 8 pts | **15** |
| 8 | PRD-151: Offline sync | Mobile users | 2 (high) | 50% | 8 pts | **13** |
| 9 | PRD-127: Rate limiting | Free tier | 1 (medium) | 80% | 5 pts | **16** |
| 10 | PRD-144: Templates | New users | 1 (medium) | 75% | 5 pts | **15** |

### Recommendations
1. **Ship** PRD-142 (SSO) — highest revenue impact, blocked on Okta. Escalate immediately.
2. **Fix** PRD-157 (proration bug) — urgent, affecting paying customers, low effort (3 pts)
3. **Ship** PRD-138 (dashboard perf) — already done! PR #251 merged Feb 15.
4. **Defer** PRD-149 (API v2) to Q2 — high effort, lower confidence

---
**Sources**
- [Linear backlog](https://linear.app/prio) — Linear
- [Q1 Priority Decision](https://notion.so/prio/Q1-Priority-Decision-m3n4o5p6) — Notion
- [#sales pipeline update](https://prio-team.slack.com/archives/C04SALES/p1739381400) — Slack, Feb 12`
        ),
      ],
    },
  });

  const conv3 = await prisma.conversation.create({
    data: {
      userId: SEED_USER_ID,
      title: "SSO revenue impact analysis",
      messages: [
        msg(
          "user",
          "If we ship SSO this sprint, what customer deals does it unblock?"
        ),
        msg(
          "assistant",
          `**$360K in active pipeline is blocked on SSO.** One deal ($120K) was already lost to CompetitorX.

| Company | ARR | Status | Source |
|---|---|---|---|
| Acme Corp | $180K | Renewal in 6 weeks — VP Eng says SSO is "must-have" | CS, Sales |
| Meridian Health | $95K | Pilot going well, IT won't approve without SSO | CS |
| Bolt Logistics | $85K | Ready to sign, security team requires SAML | Sales |
| ~~TechStart~~ | ~~$120K~~ | **Lost** — signed with CompetitorX on Feb 14 | Sales |

**Total at risk: $360K ARR** (down from $480K after TechStart loss).

The competitive analysis doc notes CompetitorX launched SSO in January with SAML + OIDC + SCIM. Three prospects cited this as reason for evaluating alternatives.

Current SSO timeline is blocked — Okta credentials expected Feb 21, meaning earliest SSO ship date is mid-March. Acme Corp renewal is ~6 weeks out (late March), making this extremely tight.

### Recommendations
1. **Escalate** Okta aggressively — every day of delay increases revenue risk
2. **Commit** a date to Acme Corp and Meridian Health to hold the deals
3. **Evaluate** Auth0 as backup — if Okta takes another week, we miss the Acme renewal window

---
**Sources**
- [#sales pipeline update](https://prio-team.slack.com/archives/C04SALES/p1739381400) — Slack, Feb 12
- [Acme Corp renewal risk](https://prio-team.slack.com/archives/C04CS/p1739441600) — Slack, Feb 13
- [TechStart lost](https://prio-team.slack.com/archives/C04SALES/p1739611200) — Slack, Feb 15
- [Competitive Analysis: SSO](https://notion.so/prio/SSO-Competitive-Analysis-k7l8m9n0) — Notion`
        ),
      ],
    },
  });

  await prisma.conversation.create({
    data: {
      userId: SEED_USER_ID,
      title: "Sprint health check",
      messages: [
        msg("user", "Give me a sprint health check across all areas"),
        msg(
          "assistant",
          `**Sprint 3 summary: 1 area on track, 2 blocked, 1 at risk, 2 not started.**

| Area | Status | Key Metric | Top Issue |
|---|---|---|---|
| **Auth** | Blocked | 0 story points completed | Okta SAML credentials (13 days waiting) |
| **Performance** | On Track | 1 issue shipped (PRD-138) | PR #251 merged — 3.2s → 1.1s mobile |
| **Billing** | At Risk | 0 completed, 3 bugs open | James Wright unresponsive, 7 issues assigned |
| **API** | At Risk | 0 completed, 2 overdue | PRD-127 and PRD-135 both 4+ weeks overdue |
| **Onboarding** | Not Started | Designs approved | Waiting for eng bandwidth (Sprint 4) |
| **Mobile** | Improving | Push fix in progress | PRD-143 Android 14 push delivery |

### Critical Risks

**James Wright is a single point of failure.** He owns 7 issues across billing and API — double anyone else on the team. He hasn't been in standup since Monday (Feb 10). David Park flagged this in #eng-general. The Feb 8 pricing deploy introduced 3 billing bugs (PRD-157/158/159) that are all assigned to James and haven't been started.

**Auth has a hard revenue deadline.** Acme Corp renewal ($180K) in 6 weeks requires SSO. Current Okta blocker pushes earliest ship to mid-March.

### Recommendations
1. **Check in** on James Wright immediately — redistribute his load if needed
2. **Escalate** Okta through enterprise support
3. **Celebrate** the dashboard perf win — Alex shipped a major improvement
4. **Plan** onboarding kickoff for Sprint 4 — designs are ready

---
**Sources**
- [Sprint 3 Retrospective](https://notion.so/prio/Sprint-3-Retro-q7r8s9t0) — Notion
- [David re: James](https://prio-team.slack.com/archives/C04ENGGEN/p1739358000) — Slack, Feb 12
- [Billing post-mortem](https://notion.so/prio/Billing-Postmortem-Feb8-c9d0e1f2) — Notion`
        ),
      ],
    },
  });

  // 4. Create briefs
  await prisma.brief.create({
    data: {
      userId: SEED_USER_ID,
      conversationId: conv1.id,
      title: "SSO Integration PRD",
      status: "PUBLISHED",
      content: {
        summary:
          "Enterprise SSO supporting SAML 2.0 and OIDC, targeting 50+ seat accounts. Expected to unblock $360K in pipeline and reduce enterprise churn by 30%.",
        sections: [
          {
            heading: "Problem Statement",
            body: "Four enterprise deals totaling $480K ARR are blocked on SSO (one already lost). CompetitorX shipped SSO in January, and 3 prospects cited this as reason for evaluating alternatives.",
          },
          {
            heading: "Solution Overview",
            body: "Implement SAML 2.0 assertion validation and OIDC provider configuration. Phase 1: SAML + OIDC (Q1). Phase 2: SCIM provisioning (Q2).",
          },
          {
            heading: "Success Metrics",
            body: "- 30% reduction in enterprise churn\n- $360K pipeline unblocked\n- <1 day SSO setup time for new enterprise customers",
          },
          {
            heading: "Timeline",
            body: "Target: March 15, 2026. Dependent on Okta API credentials (expected Feb 21). If Auth0 fallback needed, add 1 week.",
          },
          {
            heading: "Risks",
            body: "1. Okta vendor dependency — 13 days waiting, no credentials yet\n2. Sarah Chen is sole engineer on auth — single point of failure\n3. Acme Corp renewal in 6 weeks creates hard deadline",
          },
        ],
        recommendations: [
          "Escalate Okta through enterprise support immediately",
          "Evaluate Auth0 as backup SAML provider",
          "Scope SCIM for Q2 — not needed for initial deals",
        ],
      },
    },
  });

  await prisma.brief.create({
    data: {
      userId: SEED_USER_ID,
      title: "Q1 Sprint 3 Retrospective Analysis",
      status: "PUBLISHED",
      content: {
        summary:
          "Sprint 3 showed mixed results — performance track delivered (dashboard 3.2s→1.1s), but auth stalled completely and billing hit an incident.",
        sections: [
          {
            heading: "Velocity Analysis",
            body: "- **Auth**: 0 story points (blocked on Okta)\n- **Performance**: 5 points (PRD-138 shipped)\n- **Billing**: 0 points (Feb 8 incident, 3 new bugs)\n- **API**: 0 points (PRD-127 and PRD-135 overdue)\n- **Onboarding**: 0 points (designs approved, eng in Sprint 4)\n- **Mobile**: In progress (PRD-143 push fix)",
          },
          {
            heading: "Blockers",
            body: "1. Okta SAML credentials — submitted Feb 3, no response after 12 days. Blocking PRD-142 → PRD-148 → PRD-152 chain.\n2. James Wright bandwidth — 7 assigned issues, hasn't been in standup since Feb 10.",
          },
          {
            heading: "Team Health",
            body: "- Alex Kim: Strong sprint, shipped dashboard perf, well-received by team\n- Sarah Chen: Frustrated but proactive, escalating Okta\n- James Wright: Unresponsive — requires immediate check-in\n- Priya Patel: Finished OAuth fix, ready for new work",
          },
        ],
        recommendations: [
          "Redistribute James Wright's load across the team",
          "Escalate Okta vendor relationship",
          "Start onboarding eng work in Sprint 4",
        ],
      },
    },
  });

  await prisma.brief.create({
    data: {
      userId: SEED_USER_ID,
      conversationId: conv2.id,
      title: "Backlog Prioritization (RICE Scoring)",
      status: "DRAFT",
      content: {
        summary:
          "RICE analysis of 10 backlog items. SSO and proration bug fix rank highest due to direct revenue impact and customer-facing severity.",
        sections: [
          {
            heading: "Scoring Methodology",
            body: "Reach: number of users/deals affected. Impact: 1-3 scale (medium/high/massive). Confidence: % based on data quality. Effort: story points from Linear estimates. Score = (Reach × Impact × Confidence) / Effort.",
          },
          {
            heading: "Top 5 Ranked Items",
            body: "1. **PRD-142** (SSO) — RICE 162. $480K pipeline, 4 enterprise deals.\n2. **PRD-157** (Proration bug) — RICE 142. 45 customers affected, 3pt effort.\n3. **PRD-143** (Android push) — RICE 57. All Android users, 3pt effort.\n4. **PRD-138** (Dashboard perf) — RICE 36. Already shipped!\n5. **PRD-152** (OIDC UI) — RICE 28. Enterprise feature, blocked on SSO chain.",
          },
        ],
        recommendations: [
          "Ship SSO as top priority — highest revenue impact",
          "Fix proration bug urgently — low effort, high customer impact",
          "Defer API v2 migration to Q2",
        ],
      },
    },
  });

  await prisma.brief.create({
    data: {
      userId: SEED_USER_ID,
      conversationId: conv3.id,
      title: "Enterprise Revenue Risk Assessment",
      status: "DRAFT",
      content: {
        summary:
          "$360K in active enterprise pipeline is at risk due to SSO delays. One deal ($120K) already lost to CompetitorX.",
        sections: [
          {
            heading: "At-Risk Deals",
            body: "| Company | ARR | Risk Level | Timeline |\n|---|---|---|---|\n| Acme Corp | $180K | Critical | Renewal in 6 weeks |\n| Meridian Health | $95K | High | Pilot pending IT approval |\n| Bolt Logistics | $85K | Medium | Ready to sign when SSO ships |\n| ~~TechStart~~ | ~~$120K~~ | Lost | Signed with CompetitorX Feb 14 |",
          },
          {
            heading: "Competitive Landscape",
            body: "CompetitorX launched SSO (SAML + OIDC + SCIM) in January 2026. Three of our enterprise prospects cited this as reason for evaluating alternatives. Our gap: no SSO at all.",
          },
          {
            heading: "Revenue Impact",
            body: "- **Lost**: $120K (TechStart)\n- **At risk**: $360K (3 remaining deals)\n- **Total exposure**: $480K ARR\n- **Win-back potential**: $360K if SSO ships by mid-March",
          },
        ],
        recommendations: [
          "Commit SSO ship date to Acme Corp to hold the renewal",
          "Fast-track Okta resolution — every day costs $1K+ in deal risk",
          "Prepare Auth0 fallback plan in parallel",
          "Brief sales team on realistic timeline after Okta responds",
        ],
      },
    },
  });

  console.log("Seed complete:");
  console.log("  - 4 conversations created");
  console.log("  - 4 briefs created (2 published, 2 drafts)");
  console.log(`  - User: ${SEED_USER_EMAIL} (${SEED_USER_ID})`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
