"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Check,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getToolCardRenderer, ToolCardRenderer } from "./tool-cards";

// Tools that auto-expand their rich card when complete
const autoExpandTools = new Set(["synthesizeEvidence", "generateBrief"]);

const toolLabels: Record<string, string> = {
  searchLinearIssues: "Searching Linear issues",
  searchJiraIssues: "Searching Jira issues",
  getProductAreaOverview: "Getting product area overview",
  searchSlackMessages: "Searching Slack messages",
  searchNotionDocs: "Searching Notion docs",
  generateBrief: "Generating brief",
  searchGitHubRepos: "Searching GitHub repos",
  searchGitHubPRs: "Searching GitHub PRs",
  searchGitHubIssues: "Searching GitHub issues",
  getGitHubCommits: "Fetching GitHub commits",
  synthesizeEvidence: "Synthesizing evidence graph",
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
  const [showRaw, setShowRaw] = useState(false);
  const isComplete = state === "result";
  const label = toolLabels[toolName] ?? toolName;

  // Auto-expand hero tool cards (evidence graph, brief) when result arrives
  useEffect(() => {
    if (isComplete && autoExpandTools.has(toolName)) {
      setExpanded(true);
    }
  }, [isComplete, toolName]);

  const toolResult = result as
    | { data?: unknown; error?: string | null; metadata?: unknown }
    | undefined;
  const hasRichCard =
    isComplete &&
    toolResult?.data &&
    !toolResult?.error &&
    !!getToolCardRenderer(toolName);

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
      {expanded ? (
        <div className="border-border/50 border-t px-3 py-2">
          {hasRichCard ? (
            <>
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRaw(!showRaw)}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                >
                  <Code className="size-3" />
                  {showRaw ? "Show card" : "Show raw"}
                </button>
              </div>
              {showRaw ? (
                <pre className="bg-background max-h-48 overflow-auto rounded p-2 font-mono text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <ToolCardRenderer
                  toolName={toolName}
                  data={toolResult!.data}
                />
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
