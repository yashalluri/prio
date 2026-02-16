import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function BriefsPage() {
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
              Ask Prio to analyze your backlog, prioritize features, or draft a
              PRD. Briefs will appear here automatically.
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
