/**
 * GitHub integration client.
 * Stub implementation returning mock data.
 * Replace with @octokit/rest when OAuth is implemented.
 */
export class GitHubClient {
  constructor(private accessToken: string) {}

  async getPullRequests(params: {
    repo: string;
    state?: "open" | "closed" | "all";
    limit?: number;
  }) {
    // TODO: Replace with real Octokit call
    // const octokit = new Octokit({ auth: this.accessToken });
    // return octokit.pulls.list({ owner, repo, state });
    return { data: [], error: null, metadata: { mock: true } };
  }

  async getAreaPRs(area: string, timeRange: string) {
    return { data: [], error: null, metadata: { mock: true } };
  }

  async getRepoStats(repo: string) {
    return { data: null, error: null, metadata: { mock: true } };
  }
}
