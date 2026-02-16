"use client";

import { StatusBadge, ExtLink, CardList } from "./shared";

interface GitHubPR {
  number: number;
  title: string;
  state: string;
  author: string | undefined;
  url: string;
  draft: boolean | undefined;
}

export function GitHubPRsCard({ data }: { data: unknown }) {
  const prs = data as GitHubPR[];
  if (!prs?.length)
    return (
      <p className="text-muted-foreground text-xs">
        No pull requests found.
      </p>
    );

  return (
    <CardList>
      <div className="divide-border/20 divide-y">
        {prs.map((pr) => (
          <div key={pr.number} className="flex items-start gap-2 py-1.5">
            <StatusBadge status={pr.draft ? "draft" : pr.state} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <ExtLink
                  href={pr.url}
                  className="text-muted-foreground shrink-0 font-mono text-[10px]"
                >
                  #{pr.number}
                </ExtLink>
                <span className="text-foreground line-clamp-1 text-xs">
                  {pr.title}
                </span>
              </div>
              {pr.author && (
                <span className="text-muted-foreground text-[10px]">
                  {pr.author}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardList>
  );
}
