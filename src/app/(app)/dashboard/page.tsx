import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Minus,
  ArrowRight,
  MessageSquare,
  FileText,
  GitBranch,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [briefCount, conversationCount, briefsByStatus, githubConnection, recentConversations] =
    await Promise.all([
      prisma.brief.count({ where: { userId: user.id } }),
      prisma.conversation.count({ where: { userId: user.id } }),
      prisma.brief.groupBy({
        by: ["status"],
        _count: true,
        where: { userId: user.id },
      }),
      prisma.connection.findFirst({
        where: { userId: user.id, provider: "GITHUB" },
        select: { id: true },
      }),
      prisma.conversation.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, updatedAt: true },
      }),
    ]);

  const draftCount =
    briefsByStatus.find((b) => b.status === "DRAFT")?._count ?? 0;
  const publishedCount =
    briefsByStatus.find((b) => b.status === "PUBLISHED")?._count ?? 0;

  const stats = [
    {
      title: "Conversations",
      value: String(conversationCount),
      detail: "All time",
      icon: MessageSquare,
      source: "Prio",
    },
    {
      title: "Briefs",
      value: String(briefCount),
      detail: `${draftCount} draft${draftCount !== 1 ? "s" : ""}, ${publishedCount} published`,
      icon: FileText,
      source: "Prio",
    },
    {
      title: "GitHub",
      value: githubConnection ? "Connected" : "Not connected",
      detail: githubConnection ? "Ready to use" : "Connect in Settings",
      icon: GitBranch,
      source: "GitHub",
    },
    {
      title: "Quick Action",
      value: "Chat",
      detail: "Ask Prio anything",
      icon: Sparkles,
      source: "Prio",
    },
  ];

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
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Badge variant="secondary">{stat.source}</Badge>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground flex items-center gap-1 text-xs">
                {stat.title === "GitHub" && githubConnection ? (
                  <TrendingUp className="size-3.5 text-green-500" />
                ) : (
                  <Minus className="text-muted-foreground size-3.5" />
                )}
                {stat.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Recent Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4 text-center text-sm">
                No conversations yet. Start chatting to see activity here.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/chat">
                  Start a Chat
                  <ArrowRight className="ml-2 size-3.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/chat/${conv.id}`}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-muted-foreground size-4" />
                    <span className="text-sm font-medium">{conv.title}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/chat">
                    New Chat
                    <ArrowRight className="ml-2 size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
