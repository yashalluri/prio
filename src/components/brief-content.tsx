"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface BriefSection {
  heading: string;
  body: string;
}

interface BriefContentData {
  summary?: string;
  sections?: BriefSection[];
  recommendations?: string[];
}

export function BriefContent({
  title,
  content,
  status,
  updatedAt,
}: {
  title: string;
  content: BriefContentData;
  status: string;
  updatedAt: Date;
}) {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>
            {status.toLowerCase()}
          </Badge>
          <span className="text-muted-foreground text-xs">
            Updated {new Date(updatedAt).toLocaleDateString()}
          </span>
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {title}
        </h1>
      </header>

      {content.summary && (
        <section className="bg-muted/50 border-border/50 rounded-lg border p-5">
          <h2 className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
            Executive Summary
          </h2>
          <p className="text-foreground text-sm leading-relaxed">
            {content.summary}
          </p>
        </section>
      )}

      {content.sections?.map((section, i) => (
        <section key={i} className="space-y-3">
          <h2 className="font-heading text-lg font-semibold">{section.heading}</h2>
          <div className="prose-sm text-foreground text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="mb-3 ml-4 list-disc space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-3 ml-4 list-decimal space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm leading-relaxed">{children}</li>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <pre className="bg-muted/50 border-border/50 my-3 overflow-x-auto rounded-lg border p-3">
                      <code className="block font-mono text-xs">
                        {children}
                      </code>
                    </pre>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="border-border/50 my-3 overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted/50 border-border/50 border-b">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-border/30 divide-y">
                    {children}
                  </tbody>
                ),
                th: ({ children }) => (
                  <th className="text-muted-foreground px-3 py-2 text-left text-xs font-medium">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-sm">{children}</td>
                ),
              }}
            >
              {section.body}
            </ReactMarkdown>
          </div>
        </section>
      ))}

      {content.recommendations && content.recommendations.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold">
            Recommendations
          </h2>
          <ul className="space-y-2">
            {content.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
