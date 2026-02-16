import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const integrations = [
  {
    name: "Linear",
    description: "Issue tracking and project management",
    connected: false,
  },
  {
    name: "Notion",
    description: "Documents, wikis, and databases",
    connected: false,
  },
  {
    name: "Slack",
    description: "Team communication and feedback",
    connected: false,
  },
  {
    name: "GitHub",
    description: "Code repositories and pull requests",
    connected: false,
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Settings
        </h2>
        <p className="text-muted-foreground text-sm">
          Manage your tool connections and preferences.
        </p>
      </div>

      <div className="grid gap-4">
        <h3 className="font-heading text-lg font-semibold">Integrations</h3>
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">{integration.name}</CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={integration.connected ? "default" : "outline"}>
                  {integration.connected ? "Connected" : "Not connected"}
                </Badge>
                <Button
                  variant={integration.connected ? "outline" : "default"}
                  size="sm"
                >
                  {integration.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
