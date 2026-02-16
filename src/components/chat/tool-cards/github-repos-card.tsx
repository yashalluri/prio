"use client";

import { CardList, ExtLink } from "./shared";

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  private: boolean;
}

const langColors: Record<string, string> = {
  TypeScript: "bg-blue-400",
  JavaScript: "bg-yellow-300",
  Python: "bg-green-400",
  Rust: "bg-orange-400",
  Go: "bg-cyan-400",
  Java: "bg-red-400",
  Ruby: "bg-red-500",
};

export function GitHubReposCard({ data }: { data: unknown }) {
  const repos = data as GitHubRepo[];
  if (!repos?.length)
    return (
      <p className="text-muted-foreground text-xs">No repositories found.</p>
    );

  return (
    <CardList>
      <div className="divide-border/20 divide-y">
        {repos.map((repo) => (
          <div key={repo.name} className="flex items-center gap-2 py-1.5">
            <ExtLink
              href={repo.url}
              className="text-foreground text-xs font-medium hover:underline"
            >
              {repo.name}
            </ExtLink>
            {repo.private && (
              <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px]">
                private
              </span>
            )}
            {repo.language && (
              <span className="flex items-center gap-1 text-[10px]">
                <span
                  className={`inline-block size-2 rounded-full ${langColors[repo.language] ?? "bg-muted-foreground"}`}
                />
                <span className="text-muted-foreground">{repo.language}</span>
              </span>
            )}
            {repo.stars > 0 && (
              <span className="text-muted-foreground ml-auto text-[10px]">
                &#9733; {repo.stars}
              </span>
            )}
          </div>
        ))}
      </div>
    </CardList>
  );
}
