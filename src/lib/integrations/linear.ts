/**
 * Linear integration client.
 * Stub implementation returning mock data.
 * Replace with @linear/sdk when OAuth is implemented.
 */
export class LinearClient {
  constructor(private accessToken: string) {}

  async getIssues(params: {
    query?: string;
    status?: string;
    project?: string;
    limit?: number;
  }) {
    // TODO: Replace with real Linear SDK call
    // const client = new LinearSDK({ apiKey: this.accessToken });
    // return client.issues({ filter: { ... } });
    return { data: [], error: null, metadata: { mock: true } };
  }

  async getAreaIssues(area: string, timeRange: string) {
    return { data: [], error: null, metadata: { mock: true } };
  }

  async getTeams() {
    return { data: [], error: null, metadata: { mock: true } };
  }

  async getProjects() {
    return { data: [], error: null, metadata: { mock: true } };
  }
}
