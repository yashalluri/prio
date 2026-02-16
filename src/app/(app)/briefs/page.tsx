import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare } from "lucide-react";

export default async function BriefsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const briefs = await prisma.brief.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  if (briefs.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Briefs
          </h2>
          <p className="text-muted-foreground text-sm">
            AI-generated product briefs and recommendations.
          </p>
        </div>
        <div className="grid gap-4">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-xl">
                <FileText className="text-muted-foreground size-6" />
              </div>
              <p className="text-foreground mb-1 text-sm font-medium">
                No briefs yet
              </p>
              <p className="text-muted-foreground mb-6 max-w-sm text-center text-xs">
                Ask Prio to analyze your backlog, prioritize features, or draft
                a PRD. Briefs will appear here automatically.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/chat">
                  <MessageSquare className="mr-2 size-3.5" />
                  Start a conversation
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Briefs
        </h2>
        <p className="text-muted-foreground text-sm">
          AI-generated product briefs and recommendations.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {briefs.map((brief) => {
          const content = brief.content as { summary?: string } | null;
          return (
            <Link key={brief.id} href={`/briefs/${brief.id}`}>
              <Card className="hover:border-primary/30 h-full transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-base">
                      {brief.title}
                    </CardTitle>
                    <Badge
                      variant={
                        brief.status === "PUBLISHED" ? "default" : "secondary"
                      }
                      className="shrink-0"
                    >
                      {brief.status.toLowerCase()}
                    </Badge>
                  </div>
                  {content?.summary && (
                    <CardDescription className="line-clamp-2">
                      {content.summary}
                    </CardDescription>
                  )}
                  <p className="text-muted-foreground text-xs">
                    {new Date(brief.updatedAt).toLocaleDateString()}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
