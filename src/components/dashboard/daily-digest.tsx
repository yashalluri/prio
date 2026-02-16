"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";
import Link from "next/link";
import type { DailyDigest } from "@/lib/ai/digest";

const severityStyles = {
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
};

const statusConfig = {
  critical: {
    bg: "bg-red-500/10 border-red-500/30",
    badge: "bg-red-500/20 text-red-400",
    icon: AlertTriangle,
    label: "Critical",
  },
  at_risk: {
    bg: "bg-orange-500/10 border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-400",
    icon: TrendingDown,
    label: "At Risk",
  },
  on_track: {
    bg: "bg-green-500/10 border-green-500/30",
    badge: "bg-green-500/20 text-green-400",
    icon: CheckCircle2,
    label: "On Track",
  },
};

export function DailyDigestCard({ digest }: { digest: DailyDigest }) {
  const config = statusConfig[digest.overallStatus];
  const StatusIcon = config.icon;

  return (
    <Card className={`border ${config.bg}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-9 items-center justify-center rounded-lg">
              <Zap className="text-primary size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Daily Digest
              </CardTitle>
              <p className="text-muted-foreground text-xs">{digest.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${config.badge} border-0 text-xs font-medium`}
            >
              <StatusIcon className="mr-1 size-3" />
              {config.label}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              Auto-generated
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {digest.statusLine}
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Pipeline at risk callout */}
        {digest.pipelineAtRisk > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <DollarSign className="size-5 shrink-0 text-red-400" />
            <div>
              <span className="text-sm font-semibold text-red-400">
                ${(digest.pipelineAtRisk / 1000).toFixed(0)}K pipeline at risk
              </span>
              <p className="text-muted-foreground text-xs">
                3 enterprise deals blocked on SSO — down from 4 after losing
                TechStart ($120K) to competitor
              </p>
            </div>
          </div>
        )}

        {/* Risks */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
            <AlertTriangle className="size-3.5" />
            Risks ({digest.risks.length})
          </h4>
          <div className="space-y-2">
            {digest.risks.map((risk, i) => (
              <div
                key={i}
                className={`rounded-lg border px-3 py-2.5 ${severityStyles[risk.severity]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase">
                        {risk.severity}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground">
                        {risk.title}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                      {risk.detail}
                    </p>
                  </div>
                  {risk.metric && (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-0 bg-white/5 text-[10px]"
                    >
                      {risk.metric}
                    </Badge>
                  )}
                </div>
                <div className="mt-1.5 flex gap-1">
                  {risk.sources.map((src) => (
                    <span
                      key={src}
                      className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team risks */}
        {digest.teamRisks.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
              <Users className="size-3.5" />
              Team Flags
            </h4>
            <div className="divide-border/30 divide-y rounded-lg border">
              {digest.teamRisks.map((tr) => (
                <div
                  key={tr.name}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <div>
                    <span className="text-sm font-medium">{tr.name}</span>
                    <p className="text-muted-foreground text-xs">{tr.flag}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-orange-400">
                      {tr.issueCount}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      issues
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action items */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <ArrowRight className="size-3.5" />
            Recommended Actions
          </h4>
          <div className="space-y-2">
            {digest.actions.map((action, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border px-3 py-2.5"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-bold text-blue-400">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-bold text-blue-400">
                      {action.verb}
                    </span>{" "}
                    <span className="text-foreground">{action.action}</span>
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-auto shrink-0 border-0 text-[10px] ${
                    action.urgency === "today"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Clock className="mr-0.5 size-2.5" />
                  {action.urgency === "today" ? "Today" : "This week"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Wins */}
        {digest.wins.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-400">
              <CheckCircle2 className="size-3.5" />
              Wins
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {digest.wins.map((win, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2"
                >
                  <p className="text-sm font-medium text-green-400">
                    {win.title}
                  </p>
                  <p className="text-muted-foreground text-xs">{win.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between border-t pt-3">
          <p className="text-muted-foreground text-[10px]">
            Cross-referenced from Linear, Jira, Slack, and Notion
          </p>
          <Link
            href="/chat"
            className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
          >
            Ask Prio to dig deeper
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
