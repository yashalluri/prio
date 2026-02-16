import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-blue-400",
};

export function PriorityDot({ priority }: { priority: string }) {
  return (
    <span
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        priorityColors[priority] ?? "bg-muted-foreground/30"
      )}
      title={priority}
    />
  );
}

const statusStyles: Record<string, string> = {
  backlog: "bg-muted text-muted-foreground",
  todo: "bg-muted text-foreground",
  in_progress: "bg-primary/15 text-primary",
  done: "bg-green-500/15 text-green-400",
  canceled: "bg-destructive/15 text-destructive",
  open: "bg-green-500/15 text-green-400",
  closed: "bg-red-500/15 text-red-400",
  merged: "bg-purple-500/15 text-purple-400",
  draft: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
        statusStyles[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

const trendStyles: Record<string, string> = {
  on_track: "bg-green-500/15 text-green-400",
  improving: "bg-green-500/15 text-green-400",
  declining: "bg-red-500/15 text-red-400",
  at_risk: "bg-orange-400/15 text-orange-400",
  not_started: "bg-muted text-muted-foreground",
};

export function TrendBadge({ trend }: { trend: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        trendStyles[trend] ?? "bg-muted text-muted-foreground"
      )}
    >
      {trend.replace(/_/g, " ")}
    </span>
  );
}

export function ExtLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-primary hover:text-primary/80 inline-flex items-center gap-0.5 transition-colors",
        className
      )}
    >
      {children}
      <ExternalLink className="size-2.5 shrink-0 opacity-50" />
    </a>
  );
}

export function CardList({ children }: { children: React.ReactNode }) {
  return <div className="max-h-64 overflow-y-auto">{children}</div>;
}

export function SentimentDot({ sentiment }: { sentiment: string }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        sentiment === "positive"
          ? "bg-green-400"
          : sentiment === "negative"
            ? "bg-red-400"
            : "bg-muted-foreground/50"
      )}
    />
  );
}
