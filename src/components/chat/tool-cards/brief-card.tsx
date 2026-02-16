"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BriefResult {
  title: string;
  content: { summary: string };
  savedAt: string;
}

export function BriefCard({ data }: { data: unknown }) {
  const brief = data as BriefResult;

  return (
    <div className="bg-primary/5 border-primary/20 flex items-start gap-3 rounded-lg border px-3 py-2.5">
      <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-xs font-medium">{brief.title}</p>
        <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px]">
          {brief.content.summary}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px]">
            draft
          </span>
          <Link
            href="/briefs"
            className="text-primary hover:text-primary/80 inline-flex items-center gap-0.5 text-[10px] font-medium transition-colors"
          >
            View in Briefs
            <ArrowRight className="size-2.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
