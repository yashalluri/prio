import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Dashboard
        </h2>
        <p className="text-muted-foreground text-sm">
          Your product overview at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <Badge variant="secondary">Linear</Badge>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold">24</div>
            <p className="text-muted-foreground text-xs">
              +3 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Feedback Threads
            </CardTitle>
            <Badge variant="secondary">Slack</Badge>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PRs Merged</CardTitle>
            <Badge variant="secondary">GitHub</Badge>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold">8</div>
            <p className="text-muted-foreground text-xs">
              This sprint
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Briefs</CardTitle>
            <Badge variant="secondary">Prio</Badge>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">
              2 drafts, 1 published
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Connect your tools in Settings to see real-time activity here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
