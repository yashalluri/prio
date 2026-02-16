"use client";

import { PriorityDot, StatusBadge, ExtLink, CardList } from "./shared";
import { cn } from "@/lib/utils";

interface JiraIssue {
  key: string;
  summary: string;
  status: string;
  priority: string;
  type: string;
  assignee: string | null;
  url: string;
}

const priorityMap: Record<string, string> = {
  highest: "urgent",
  high: "high",
  medium: "medium",
  low: "low",
  lowest: "low",
};

const typeStyles: Record<string, string> = {
  Bug: "bg-red-500/15 text-red-400",
  Story: "bg-green-500/15 text-green-400",
  Task: "bg-blue-400/15 text-blue-400",
  Epic: "bg-purple-500/15 text-purple-400",
};

export function JiraIssuesCard({ data }: { data: unknown }) {
  const issues = data as JiraIssue[];
  if (!issues?.length)
    return <p className="text-muted-foreground text-xs">No issues found.</p>;

  return (
    <CardList>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-border/30 border-b">
            <th className="text-muted-foreground pb-1.5 pr-2 text-left font-medium">
              Issue
            </th>
            <th className="text-muted-foreground pb-1.5 pr-2 text-left font-medium">
              Type
            </th>
            <th className="text-muted-foreground pb-1.5 pr-2 text-left font-medium">
              Status
            </th>
            <th className="text-muted-foreground pb-1.5 text-left font-medium">
              Assignee
            </th>
          </tr>
        </thead>
        <tbody className="divide-border/20 divide-y">
          {issues.map((issue) => (
            <tr key={issue.key}>
              <td className="py-1.5 pr-2">
                <div className="flex items-center gap-1.5">
                  <PriorityDot
                    priority={
                      priorityMap[issue.priority.toLowerCase()] ?? "medium"
                    }
                  />
                  <ExtLink
                    href={issue.url}
                    className="shrink-0 font-mono text-[10px]"
                  >
                    {issue.key}
                  </ExtLink>
                  <span className="text-foreground line-clamp-1">
                    {issue.summary}
                  </span>
                </div>
              </td>
              <td className="py-1.5 pr-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                    typeStyles[issue.type] ?? "bg-muted text-muted-foreground"
                  )}
                >
                  {issue.type}
                </span>
              </td>
              <td className="py-1.5 pr-2">
                <StatusBadge
                  status={issue.status.toLowerCase().replace(/ /g, "_")}
                />
              </td>
              <td className="text-muted-foreground py-1.5 text-xs">
                {issue.assignee ?? (
                  <span className="italic">unassigned</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-muted-foreground mt-1.5 text-[10px]">
        {issues.length} issue{issues.length !== 1 ? "s" : ""}
      </p>
    </CardList>
  );
}
