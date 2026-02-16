import { Octokit } from "@octokit/rest";

export class GitHubClient {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  async getRepos(params?: {
    limit?: number;
    sort?: "updated" | "created" | "pushed";
  }) {
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      sort: params?.sort ?? "updated",
      per_page: params?.limit ?? 10,
    });
    return {
      data: data.map((r) => ({
        name: r.full_name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        openIssues: r.open_issues_count,
        updatedAt: r.updated_at,
        url: r.html_url,
        private: r.private,
      })),
      error: null,
      metadata: { source: "github", resultCount: data.length },
    };
  }

  async getPullRequests(params: {
    owner: string;
    repo: string;
    state?: "open" | "closed" | "all";
    limit?: number;
  }) {
    const { data } = await this.octokit.pulls.list({
      owner: params.owner,
      repo: params.repo,
      state: params.state ?? "open",
      per_page: params.limit ?? 10,
    });
    return {
      data: data.map((pr) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        author: pr.user?.login,
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
        url: pr.html_url,
        draft: pr.draft,
        labels: pr.labels.map((l) =>
          typeof l === "string" ? l : l.name ?? ""
        ),
      })),
      error: null,
      metadata: { source: "github", resultCount: data.length },
    };
  }

  async getIssues(params: {
    owner: string;
    repo: string;
    state?: "open" | "closed" | "all";
    labels?: string;
    limit?: number;
  }) {
    const { data } = await this.octokit.issues.listForRepo({
      owner: params.owner,
      repo: params.repo,
      state: params.state ?? "open",
      labels: params.labels,
      per_page: params.limit ?? 10,
    });
    const issues = data.filter((i) => !i.pull_request);
    return {
      data: issues.map((issue) => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        author: issue.user?.login,
        labels: issue.labels.map((l) =>
          typeof l === "string" ? l : l.name ?? ""
        ),
        createdAt: issue.created_at,
        url: issue.html_url,
      })),
      error: null,
      metadata: { source: "github", resultCount: issues.length },
    };
  }

  async getRecentCommits(params: {
    owner: string;
    repo: string;
    limit?: number;
  }) {
    const { data } = await this.octokit.repos.listCommits({
      owner: params.owner,
      repo: params.repo,
      per_page: params.limit ?? 10,
    });
    return {
      data: data.map((c) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0],
        author: c.commit.author?.name ?? c.author?.login,
        date: c.commit.author?.date,
        url: c.html_url,
      })),
      error: null,
      metadata: { source: "github", resultCount: data.length },
    };
  }
}
