"use client";

import { CardList, ExtLink } from "./shared";

interface NotionDoc {
  id: string;
  title: string;
  type: string;
  lastEdited: string;
  excerpt: string;
  author: string;
  tags: string[];
  url: string;
}

const typeLabels: Record<string, string> = {
  prd: "PRD",
  spec: "Spec",
  meeting_notes: "Meeting Notes",
  decision: "Decision",
};

export function NotionDocsCard({ data }: { data: unknown }) {
  const docs = data as NotionDoc[];
  if (!docs?.length)
    return (
      <p className="text-muted-foreground text-xs">No documents found.</p>
    );

  return (
    <CardList>
      <div className="divide-border/20 divide-y">
        {docs.map((doc) => (
          <div key={doc.id} className="py-2 first:pt-0 last:pb-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="bg-primary/15 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                {typeLabels[doc.type] ?? doc.type}
              </span>
              <ExtLink
                href={doc.url}
                className="text-foreground text-xs font-medium hover:underline"
              >
                {doc.title}
              </ExtLink>
            </div>
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {doc.excerpt}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px]"
                >
                  {tag}
                </span>
              ))}
              <span className="text-muted-foreground ml-auto text-[10px]">
                {doc.author} &middot; {doc.lastEdited}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardList>
  );
}
