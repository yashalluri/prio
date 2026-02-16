"use client";

import { PriorityDot, StatusBadge, ExtLink, CardList } from "./shared";

interface LinearIssue {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string | null;
  url: string;
}

export function LinearIssuesCard({ data }: { data: unknown }) {
  const issues = data as LinearIssue[];
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
              Status
            </th>
            <th className="text-muted-foreground pb-1.5 text-left font-medium">
              Assignee
            </th>
          </tr>
        </thead>
        <tbody className="divide-border/20 divide-y">
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td className="py-1.5 pr-2">
                <div className="flex items-center gap-1.5">
                  <PriorityDot priority={issue.priority} />
                  <ExtLink
                    href={issue.url}
                    className="shrink-0 font-mono text-[10px]"
                  >
                    {issue.id}
                  </ExtLink>
                  <span className="text-foreground line-clamp-1">
                    {issue.title}
                  </span>
                </div>
              </td>
              <td className="py-1.5 pr-2">
                <StatusBadge status={issue.status} />
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
