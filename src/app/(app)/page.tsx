import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Open Issues",
    value: "24",
    change: "+3 from last week",
    trend: "up" as const,
    source: "Linear",
  },
  {
    title: "Feedback Threads",
    value: "12",
    change: "Last 7 days",
    trend: "neutral" as const,
    source: "Slack",
  },
  {
    title: "PRs Merged",
    value: "8",
    change: "This sprint",
    trend: "up" as const,
    source: "GitHub",
  },
  {
    title: "Active Briefs",
    value: "3",
    change: "2 drafts, 1 published",
    trend: "neutral" as const,
    source: "Prio",
  },
];

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp className="size-3.5 text-green-500" />;
  if (trend === "down") return <TrendingDown className="size-3.5 text-red-500" />;
  return <Minus className="text-muted-foreground size-3.5" />;
}

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
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Badge variant="secondary">{stat.source}</Badge>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground flex items-center gap-1 text-xs">
                <TrendIcon trend={stat.trend} />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4 text-center text-sm">
            Connect your tools in Settings to see real-time activity here.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">
              Go to Settings
              <ArrowRight className="ml-2 size-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
