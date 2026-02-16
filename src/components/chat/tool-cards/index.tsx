import type { ComponentType } from "react";
import { LinearIssuesCard } from "./linear-issues-card";
import { AreaOverviewCard } from "./area-overview-card";
import { SlackMessagesCard } from "./slack-messages-card";
import { NotionDocsCard } from "./notion-docs-card";
import { BriefCard } from "./brief-card";
import { GitHubReposCard } from "./github-repos-card";
import { GitHubPRsCard } from "./github-prs-card";
import { GitHubIssuesCard } from "./github-issues-card";
import { GitHubCommitsCard } from "./github-commits-card";

type ToolCardComponent = ComponentType<{ data: unknown }>;

const registry: Record<string, ToolCardComponent> = {
  searchLinearIssues: LinearIssuesCard,
  getProductAreaOverview: AreaOverviewCard,
  searchSlackMessages: SlackMessagesCard,
  searchNotionDocs: NotionDocsCard,
  generateBrief: BriefCard,
  searchGitHubRepos: GitHubReposCard,
  searchGitHubPRs: GitHubPRsCard,
  searchGitHubIssues: GitHubIssuesCard,
  getGitHubCommits: GitHubCommitsCard,
};

export function getToolCardRenderer(
  toolName: string
): ToolCardComponent | undefined {
  return registry[toolName];
}

export function ToolCardRenderer({
  toolName,
  data,
}: {
  toolName: string;
  data: unknown;
}) {
  const Component = registry[toolName];
  if (!Component) return null;
  return <Component data={data} />;
}
