import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-2 text-sm">
              No briefs yet.
            </p>
            <p className="text-muted-foreground text-xs">
              Ask Prio to analyze your backlog or generate a PRD in the Chat.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
