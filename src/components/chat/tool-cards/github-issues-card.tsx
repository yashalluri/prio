"use client";

import { StatusBadge, ExtLink, CardList } from "./shared";

interface GitHubIssue {
  number: number;
  title: string;
  state: string;
  labels: string[];
  url: string;
}

export function GitHubIssuesCard({ data }: { data: unknown }) {
  const issues = data as GitHubIssue[];
  if (!issues?.length)
    return <p className="text-muted-foreground text-xs">No issues found.</p>;

  return (
    <CardList>
      <div className="divide-border/20 divide-y">
        {issues.map((issue) => (
          <div key={issue.number} className="py-1.5">
            <div className="flex items-start gap-2">
              <StatusBadge status={issue.state} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <ExtLink
                    href={issue.url}
                    className="text-muted-foreground shrink-0 font-mono text-[10px]"
                  >
                    #{issue.number}
                  </ExtLink>
                  <span className="text-foreground line-clamp-1 text-xs">
                    {issue.title}
                  </span>
                </div>
                {issue.labels.length > 0 && (
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    {issue.labels.map((label) => (
                      <span
                        key={label}
                        className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[10px]"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardList>
  );
}
