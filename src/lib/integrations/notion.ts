/**
 * Notion integration client.
 * Stub implementation returning mock data.
 * Replace with @notionhq/client when OAuth is implemented.
 */
export class NotionClient {
  constructor(private accessToken: string) {}

  async searchPages(params: { query: string; type?: string }) {
    // TODO: Replace with real Notion client call
    // const client = new Client({ auth: this.accessToken });
    // return client.search({ query: params.query });
    return { data: [], error: null, metadata: { mock: true } };
  }

  async getPage(pageId: string) {
    return { data: null, error: null, metadata: { mock: true } };
  }

  async getDatabases() {
    return { data: [], error: null, metadata: { mock: true } };
  }
}
