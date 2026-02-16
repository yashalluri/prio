"use client";

import { CardList, ExtLink } from "./shared";

interface GitHubCommit {
  sha: string;
  message: string;
  author: string | undefined;
  date: string | undefined;
  url: string;
}

export function GitHubCommitsCard({ data }: { data: unknown }) {
  const commits = data as GitHubCommit[];
  if (!commits?.length)
    return <p className="text-muted-foreground text-xs">No commits found.</p>;

  return (
    <CardList>
      <div className="divide-border/20 divide-y">
        {commits.map((commit) => (
          <div key={commit.sha} className="flex items-start gap-2 py-1.5">
            <ExtLink
              href={commit.url}
              className="text-primary shrink-0 font-mono text-[10px]"
            >
              {commit.sha}
            </ExtLink>
            <span className="text-foreground line-clamp-1 flex-1 text-xs">
              {commit.message}
            </span>
            {commit.author && (
              <span className="text-muted-foreground shrink-0 text-[10px]">
                {commit.author}
              </span>
            )}
          </div>
        ))}
      </div>
    </CardList>
  );
}
