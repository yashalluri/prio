"use client";

import { StatusBadge, TrendBadge, ExtLink, SentimentDot } from "./shared";
import { AlertTriangle } from "lucide-react";

interface AreaOverview {
  area: string;
  timeRange: string;
  issues: {
    total: number;
    byStatus: Record<string, number>;
    blockers: {
      id: string;
      title: string;
      daysBlocked: number;
      url: string;
    }[];
  };
  velocity: {
    issuesCompleted: number;
    avgCycleTimeDays: number;
    trend: string;
  };
  feedbackThemes: { theme: string; mentions: number; sentiment: string }[];
  recentPRs: { merged: number; open: number; avgReviewTimeDays: number };
}

export function AreaOverviewCard({ data }: { data: unknown }) {
  const overview = data as AreaOverview;

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-heading text-foreground text-sm font-semibold capitalize">
          {overview.area}
        </span>
        <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px]">
          {overview.timeRange}
        </span>
        <TrendBadge trend={overview.velocity.trend} />
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(overview.issues.byStatus).map(([status, count]) => (
          <div key={status} className="flex items-center gap-1">
            <StatusBadge status={status} />
            <span className="text-muted-foreground font-mono">{count}</span>
          </div>
        ))}
        <span className="text-muted-foreground">
          {overview.issues.total} total
        </span>
      </div>

      <div className="bg-background/50 flex gap-4 rounded-md px-2.5 py-1.5">
        <div>
          <span className="text-muted-foreground">Completed</span>
          <span className="text-foreground ml-1 font-mono font-medium">
            {overview.velocity.issuesCompleted}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Avg cycle</span>
          <span className="text-foreground ml-1 font-mono font-medium">
            {overview.velocity.avgCycleTimeDays}d
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">PRs</span>
          <span className="text-foreground ml-1 font-mono font-medium">
            {overview.recentPRs.merged}m {overview.recentPRs.open}o
          </span>
        </div>
      </div>

      {overview.issues.blockers.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-red-400">
            <AlertTriangle className="size-3" />
            <span className="font-medium">Blockers</span>
          </div>
          {overview.issues.blockers.map((b) => (
            <div
              key={b.id}
              className="bg-red-500/5 flex items-start gap-1.5 rounded px-2 py-1"
            >
              <ExtLink
                href={b.url}
                className="shrink-0 font-mono text-[10px]"
              >
                {b.id}
              </ExtLink>
              <span className="text-foreground line-clamp-1 flex-1">
                {b.title}
              </span>
              <span className="text-muted-foreground shrink-0">
                {b.daysBlocked}d
              </span>
            </div>
          ))}
        </div>
      )}

      {overview.feedbackThemes.length > 0 && (
        <div className="space-y-1">
          <span className="text-muted-foreground font-medium">
            Feedback themes
          </span>
          {overview.feedbackThemes.map((ft, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <SentimentDot sentiment={ft.sentiment} />
              <span className="text-foreground line-clamp-1 flex-1">
                {ft.theme}
              </span>
              <span className="text-muted-foreground font-mono">
                {ft.mentions}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
