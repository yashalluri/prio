"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const toolLabels: Record<string, string> = {
  searchLinearIssues: "Searching Linear issues",
  getProductAreaOverview: "Getting product area overview",
  searchSlackMessages: "Searching Slack messages",
  searchNotionDocs: "Searching Notion docs",
  generateBrief: "Generating brief",
};

export function ToolCall({
  toolName,
  args,
  result,
  state,
}: {
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  state: "call" | "result";
}) {
  const [expanded, setExpanded] = useState(false);
  const isComplete = state === "result";
  const label = toolLabels[toolName] ?? toolName;

  return (
    <div className="border-border/50 bg-muted/30 my-2 rounded-lg border">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
      >
        {isComplete ? (
          <Check className="text-primary size-3.5 shrink-0" />
        ) : (
          <Loader2 className="text-muted-foreground size-3.5 shrink-0 animate-spin" />
        )}
        <span
          className={cn(
            "flex-1 font-medium",
            isComplete ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
        {expanded ? (
          <ChevronDown className="text-muted-foreground size-3.5" />
        ) : (
          <ChevronRight className="text-muted-foreground size-3.5" />
        )}
      </button>
      {expanded && (
        <div className="border-border/50 border-t px-3 py-2">
          <div className="mb-2">
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
              Parameters
            </p>
            <pre className="bg-background overflow-x-auto rounded p-2 font-mono text-xs">
              {JSON.stringify(args, null, 2)}
            </pre>
          </div>
          {result != null && (
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                Result
              </p>
              <pre className="bg-background max-h-48 overflow-auto rounded p-2 font-mono text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
