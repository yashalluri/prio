import { tool } from "ai";
import { z } from "zod/v4";
import { getGitHubClient } from "@/lib/integrations/get-github-client";

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
      execute: async ({ query, status, limit }) => {
        const mockIssues = [
          {
            id: "PRD-142",
            title: "Add SSO support for enterprise customers",
            status: "in_progress",
            priority: "urgent",
            assignee: "Sarah Chen",
            labels: ["enterprise", "auth"],
            estimate: 8,
            url: "https://linear.app/prio/issue/PRD-142",
          },
          {
            id: "PRD-138",
            title: "Dashboard loading time exceeds 3s on mobile",
            status: "todo",
            priority: "high",
            assignee: "Alex Kim",
            labels: ["performance", "mobile"],
            estimate: 5,
            url: "https://linear.app/prio/issue/PRD-138",
          },
          {
            id: "PRD-135",
            title: "Implement webhook retry mechanism",
            status: "backlog",
            priority: "medium",
            assignee: null,
            labels: ["infrastructure"],
            estimate: 3,
            url: "https://linear.app/prio/issue/PRD-135",
          },
          {
            id: "PRD-131",
            title: "User onboarding flow redesign",
            status: "todo",
            priority: "high",
            assignee: "Maria Lopez",
            labels: ["ux", "growth"],
            estimate: 13,
            url: "https://linear.app/prio/issue/PRD-131",
          },
          {
            id: "PRD-127",
            title: "API rate limiting for free tier",
            status: "backlog",
            priority: "medium",
            assignee: null,
            labels: ["api", "billing"],
            estimate: 5,
            url: "https://linear.app/prio/issue/PRD-127",
          },
        ];

        const filtered = mockIssues
          .filter((i) => {
            if (status && i.status !== status) return false;
            if (
              query &&
              !i.title.toLowerCase().includes(query.toLowerCase())
            )
              return false;
            return true;
          })
          .slice(0, limit);

        return {
          data: filtered,
          error: null,
          metadata: {
            source: "linear",
            resultCount: filtered.length,
            mock: true,
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
                  title:
                    "SSO integration blocked on SAML provider response",
                  daysBlocked: 5,
                  url: "https://linear.app/prio/issue/PRD-142",
                },
                {
                  id: "PRD-139",
                  title: "Design approval pending for settings page",
                  daysBlocked: 3,
                  url: "https://linear.app/prio/issue/PRD-139",
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
          .describe(
            "Specific channel to search (e.g. #product-feedback)"
          ),
        limit: z
          .number()
          .optional()
          .default(5)
          .describe("Max number of results"),
      }),
      execute: async ({ limit }) => {
        const mockMessages = [
          {
            channel: "#product-feedback",
            author: "Customer Success",
            timestamp: "2026-02-14T10:30:00Z",
            text: "Multiple enterprise customers asking about SSO. Acme Corp says it's a blocker for their renewal.",
            reactions: { "+1": 5, eyes: 2 },
            url: "https://prio-team.slack.com/archives/C04FEEDBACK/p1707904200",
          },
          {
            channel: "#product-feedback",
            author: "Sales Team",
            timestamp: "2026-02-13T15:45:00Z",
            text: "Lost a deal with TechStart because onboarding took too long. They went with a competitor.",
            reactions: { disappointed: 3 },
            url: "https://prio-team.slack.com/archives/C04FEEDBACK/p1707836700",
          },
          {
            channel: "#eng-general",
            author: "Alex Kim",
            timestamp: "2026-02-12T09:00:00Z",
            text: "Dashboard performance fix is ready for review. Reduced load time from 3.2s to 1.1s on mobile.",
            reactions: { tada: 8, rocket: 3 },
            url: "https://prio-team.slack.com/archives/C04ENGGEN/p1707725400",
          },
          {
            channel: "#product-decisions",
            author: "PM Lead",
            timestamp: "2026-02-11T14:00:00Z",
            text: "Decision: We're prioritizing SSO for Q1. Onboarding redesign moves to Q2.",
            reactions: { white_check_mark: 6 },
            url: "https://prio-team.slack.com/archives/C04DECISIONS/p1707656400",
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
      execute: async ({ type }) => {
        const mockDocs = [
          {
            id: "notion-1",
            title: "PRD: Enterprise SSO Integration",
            type: "prd",
            lastEdited: "2026-02-10",
            excerpt:
              "Support SAML 2.0 and OIDC for enterprise customers. Target: 50+ seat accounts. Expected impact: 30% reduction in enterprise churn.",
            author: "Sarah Chen",
            url: "https://notion.so/prio/Enterprise-SSO-PRD-a1b2c3d4",
          },
          {
            id: "notion-2",
            title: "Spec: Onboarding Flow v2",
            type: "spec",
            lastEdited: "2026-02-08",
            excerpt:
              "Reduce time-to-value from 15 minutes to 3 minutes. Key changes: guided setup wizard, pre-built templates, interactive tutorial.",
            author: "Maria Lopez",
            url: "https://notion.so/prio/Onboarding-Flow-v2-e5f6g7h8",
          },
          {
            id: "notion-3",
            title: "Q1 Planning Meeting Notes",
            type: "meeting_notes",
            lastEdited: "2026-01-15",
            excerpt:
              "Agreed priorities: 1) SSO (enterprise retention), 2) Performance (mobile), 3) Onboarding (growth). API docs deferred to Q2.",
            author: "PM Lead",
            url: "https://notion.so/prio/Q1-Planning-Notes-i9j0k1l2",
          },
        ];

        const filtered =
          type === "all"
            ? mockDocs
            : mockDocs.filter((d) => d.type === type);

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
