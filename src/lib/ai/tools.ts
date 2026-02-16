import { tool } from "ai";
import { z } from "zod/v4";

export const tools = {
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
      const mockIssues = [
        {
          id: "PRD-142",
          title: "Add SSO support for enterprise customers",
          status: "in_progress",
          priority: "urgent",
          assignee: "Sarah Chen",
          labels: ["enterprise", "auth"],
          estimate: 8,
        },
        {
          id: "PRD-138",
          title: "Dashboard loading time exceeds 3s on mobile",
          status: "todo",
          priority: "high",
          assignee: "Alex Kim",
          labels: ["performance", "mobile"],
          estimate: 5,
        },
        {
          id: "PRD-135",
          title: "Implement webhook retry mechanism",
          status: "backlog",
          priority: "medium",
          assignee: null,
          labels: ["infrastructure"],
          estimate: 3,
        },
        {
          id: "PRD-131",
          title: "User onboarding flow redesign",
          status: "todo",
          priority: "high",
          assignee: "Maria Lopez",
          labels: ["ux", "growth"],
          estimate: 13,
        },
        {
          id: "PRD-127",
          title: "API rate limiting for free tier",
          status: "backlog",
          priority: "medium",
          assignee: null,
          labels: ["api", "billing"],
          estimate: 5,
        },
      ];

      const filtered = mockIssues
        .filter((i) => {
          if (status && i.status !== status) return false;
          if (query && !i.title.toLowerCase().includes(query.toLowerCase()))
            return false;
          return true;
        })
        .slice(0, limit);

      return {
        data: filtered,
        error: null,
        metadata: { source: "linear", resultCount: filtered.length, mock: true },
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
      return {
        data: {
          area,
          timeRange,
          issues: {
            total: 12,
            byStatus: { backlog: 4, todo: 3, in_progress: 3, done: 2 },
            blockers: [
              {
                id: "PRD-142",
                title: "SSO integration blocked on SAML provider response",
                daysBlocked: 5,
              },
              {
                id: "PRD-139",
                title: "Design approval pending for settings page",
                daysBlocked: 3,
              },
            ],
          },
          velocity: {
            issuesCompleted: 8,
            avgCycleTimeDays: 4.2,
            trend: "improving",
          },
          feedbackThemes: [
            {
              theme: "Needs faster onboarding",
              mentions: 14,
              sentiment: "negative",
            },
            {
              theme: "Love the new dashboard",
              mentions: 8,
              sentiment: "positive",
            },
            {
              theme: "API docs are incomplete",
              mentions: 6,
              sentiment: "negative",
            },
          ],
          recentPRs: {
            merged: 6,
            open: 3,
            avgReviewTimeDays: 1.8,
          },
        },
        error: null,
        metadata: { source: "aggregated", mock: true },
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
        .describe("Specific channel to search (e.g. #product-feedback)"),
      limit: z
        .number()
        .optional()
        .default(5)
        .describe("Max number of results"),
    }),
    execute: async ({ query, channel, limit }) => {
      const mockMessages = [
        {
          channel: "#product-feedback",
          author: "Customer Success",
          timestamp: "2026-02-14T10:30:00Z",
          text: "Multiple enterprise customers asking about SSO. Acme Corp says it's a blocker for their renewal.",
          reactions: { "+1": 5, eyes: 2 },
        },
        {
          channel: "#product-feedback",
          author: "Sales Team",
          timestamp: "2026-02-13T15:45:00Z",
          text: "Lost a deal with TechStart because onboarding took too long. They went with a competitor.",
          reactions: { disappointed: 3 },
        },
        {
          channel: "#eng-general",
          author: "Alex Kim",
          timestamp: "2026-02-12T09:00:00Z",
          text: "Dashboard performance fix is ready for review. Reduced load time from 3.2s to 1.1s on mobile.",
          reactions: { tada: 8, rocket: 3 },
        },
        {
          channel: "#product-decisions",
          author: "PM Lead",
          timestamp: "2026-02-11T14:00:00Z",
          text: "Decision: We're prioritizing SSO for Q1. Onboarding redesign moves to Q2.",
          reactions: { white_check_mark: 6 },
        },
      ];

      return {
        data: mockMessages.slice(0, limit),
        error: null,
        metadata: {
          source: "slack",
          resultCount: mockMessages.length,
          mock: true,
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
      const mockDocs = [
        {
          id: "notion-1",
          title: "PRD: Enterprise SSO Integration",
          type: "prd",
          lastEdited: "2026-02-10",
          excerpt:
            "Support SAML 2.0 and OIDC for enterprise customers. Target: 50+ seat accounts. Expected impact: 30% reduction in enterprise churn.",
          author: "Sarah Chen",
        },
        {
          id: "notion-2",
          title: "Spec: Onboarding Flow v2",
          type: "spec",
          lastEdited: "2026-02-08",
          excerpt:
            "Reduce time-to-value from 15 minutes to 3 minutes. Key changes: guided setup wizard, pre-built templates, interactive tutorial.",
          author: "Maria Lopez",
        },
        {
          id: "notion-3",
          title: "Q1 Planning Meeting Notes",
          type: "meeting_notes",
          lastEdited: "2026-01-15",
          excerpt:
            "Agreed priorities: 1) SSO (enterprise retention), 2) Performance (mobile), 3) Onboarding (growth). API docs deferred to Q2.",
          author: "PM Lead",
        },
      ];

      const filtered =
        type === "all" ? mockDocs : mockDocs.filter((d) => d.type === type);

      return {
        data: filtered,
        error: null,
        metadata: {
          source: "notion",
          resultCount: filtered.length,
          mock: true,
        },
      };
    },
  }),
};
