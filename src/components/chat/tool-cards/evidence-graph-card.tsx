"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ExtLink } from "./shared";
import {
  Network,
  AlertTriangle,
  Clock,
  DollarSign,
  GitBranch,
  MessageSquare,
  FileText,
  Github,
  type LucideIcon,
} from "lucide-react";

// --- Types ---

interface EvidenceItem {
  id: string;
  source: "linear" | "slack" | "notion" | "github";
  label: string;
  detail: string;
  url: string;
}

interface Connection {
  from: string;
  to: string;
  type: "blocks" | "references" | "contradicts" | "supports" | "caused_by";
}

interface Impact {
  revenue?: string;
  timeline?: string;
  risk: "critical" | "high" | "medium" | "low";
}

interface EvidenceData {
  title: string;
  keyInsight: string;
  evidence: EvidenceItem[];
  connections: Connection[];
  impact: Impact;
}

// --- Config ---

const sourceConfig: Record<
  string,
  { color: string; icon: LucideIcon; label: string }
> = {
  linear: { color: "border-l-purple-500", icon: GitBranch, label: "Linear" },
  slack: {
    color: "border-l-green-500",
    icon: MessageSquare,
    label: "Slack",
  },
  notion: { color: "border-l-blue-500", icon: FileText, label: "Notion" },
  github: { color: "border-l-gray-400", icon: Github, label: "GitHub" },
};

const connectionColors: Record<string, string> = {
  blocks: "oklch(0.704 0.191 22.216)",
  caused_by: "oklch(0.704 0.191 22.216)",
  contradicts: "oklch(0.769 0.188 70.08)",
  supports: "oklch(0.696 0.17 162.48)",
  references: "oklch(0.55 0 0)",
};

const riskConfig: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  critical: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  high: {
    bg: "bg-orange-400/10",
    text: "text-orange-400",
    border: "border-orange-400/20",
  },
  medium: {
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
    border: "border-yellow-400/20",
  },
  low: {
    bg: "bg-blue-400/10",
    text: "text-blue-400",
    border: "border-blue-400/20",
  },
};

// --- Subcomponents ---

interface EvidenceNodeProps {
  node: EvidenceItem;
  side: "left" | "right";
  isHighlighted: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
}

const EvidenceNode = forwardRef<HTMLDivElement, EvidenceNodeProps>(
  function EvidenceNode({ node, side, isHighlighted, isDimmed, onHover }, ref) {
    const config = sourceConfig[node.source] ?? sourceConfig.linear;
    const Icon = config.icon;

    return (
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, x: side === "left" ? -16 : 16 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        className={cn(
          "bg-background/60 relative rounded-md border-l-[3px] px-3 py-2 transition-all duration-200",
          config.color,
          isHighlighted && "ring-1 ring-primary/30 bg-background/80",
          isDimmed && "opacity-30"
        )}
      >
        <div className="flex items-center gap-1.5">
          <Icon className="text-muted-foreground size-3 shrink-0" />
          <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
            {config.label}
          </span>
        </div>
        <ExtLink href={node.url} className="mt-1 text-xs font-medium">
          {node.label}
        </ExtLink>
        <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-relaxed">
          {node.detail}
        </p>
      </motion.div>
    );
  }
);

// --- Path calculation ---

interface PathData {
  d: string;
  from: string;
  to: string;
  type: string;
}

function calculatePaths(
  connections: Connection[],
  nodeRefs: Record<string, HTMLDivElement | null>,
  containerRef: HTMLDivElement | null,
  leftIds: Set<string>,
  rightIds: Set<string>
): PathData[] {
  if (!containerRef) return [];
  const containerRect = containerRef.getBoundingClientRect();
  const paths: PathData[] = [];

  // Fan out overlapping cross-column paths by offsetting control points
  let crossIndex = 0;
  const crossCount = connections.filter((c) => leftIds.has(c.from) !== leftIds.has(c.to)).length;

  for (const conn of connections) {
    const fromEl = nodeRefs[conn.from];
    const toEl = nodeRefs[conn.to];
    if (!fromEl || !toEl) continue;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const fromOnLeft = leftIds.has(conn.from);
    const toOnLeft = leftIds.has(conn.to);
    const sameSide = fromOnLeft === toOnLeft;

    let fromX: number;
    let fromY: number;
    let toX: number;
    let toY: number;

    if (sameSide) {
      // Same column — curve out to the side
      const isLeft = fromOnLeft;
      fromX =
        (isLeft
          ? fromRect.right
          : fromRect.left) - containerRect.left;
      fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
      toX =
        (isLeft
          ? toRect.right
          : toRect.left) - containerRect.left;
      toY = toRect.top + toRect.height / 2 - containerRect.top;

      const offset = isLeft ? 40 : -40;
      paths.push({
        d: `M ${fromX} ${fromY} C ${fromX + offset} ${fromY}, ${toX + offset} ${toY}, ${toX} ${toY}`,
        from: conn.from,
        to: conn.to,
        type: conn.type,
      });
    } else {
      // Cross-column — S-curve with fanned control points
      fromX = (fromOnLeft ? fromRect.right : fromRect.left) - containerRect.left;
      fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
      toX = (toOnLeft ? toRect.right : toRect.left) - containerRect.left;
      toY = toRect.top + toRect.height / 2 - containerRect.top;

      // Spread control points across the gap so paths don't overlap
      const t = crossCount > 1 ? crossIndex / (crossCount - 1) : 0.5;
      const spread = (toX - fromX) * 0.7;
      const cp1X = fromX + spread * (0.25 + t * 0.3);
      const cp2X = toX - spread * (0.25 + (1 - t) * 0.3);

      paths.push({
        d: `M ${fromX} ${fromY} C ${cp1X} ${fromY}, ${cp2X} ${toY}, ${toX} ${toY}`,
        from: conn.from,
        to: conn.to,
        type: conn.type,
      });
      crossIndex++;
    }
  }

  return paths;
}

// --- Main Component ---

export function EvidenceGraphCard({ data }: { data: unknown }) {
  const d = data as EvidenceData;
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [showPaths, setShowPaths] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Split nodes into columns: Linear + GitHub on left, Slack + Notion on right
  const leftSources = new Set(["linear", "github"]);
  const leftNodes = d.evidence.filter((n) => leftSources.has(n.source));
  const rightNodes = d.evidence.filter((n) => !leftSources.has(n.source));
  const leftIds = new Set(leftNodes.map((n) => n.id));
  const rightIds = new Set(rightNodes.map((n) => n.id));

  // Check if a node is connected to the hovered node
  const isConnectedToHovered = useCallback(
    (nodeId: string) => {
      if (!hoveredNode) return false;
      return d.connections.some(
        (c) =>
          (c.from === hoveredNode && c.to === nodeId) ||
          (c.to === hoveredNode && c.from === nodeId)
      );
    },
    [hoveredNode, d.connections]
  );

  // Calculate SVG paths after nodes are rendered and animated
  useEffect(() => {
    const timer = setTimeout(() => {
      const computed = calculatePaths(
        d.connections,
        nodeRefs.current,
        containerRef.current,
        leftIds,
        rightIds
      );
      setPaths(computed);
      // Small delay before showing to let positions stabilize
      setTimeout(() => setShowPaths(true), 50);
    }, 800); // Wait for node animations to finish

    return () => clearTimeout(timer);
  }, [d.connections, d.evidence]);

  const risk = riskConfig[d.impact.risk] ?? riskConfig.medium;

  // Node ref setter
  const setNodeRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      nodeRefs.current[id] = el;
    },
    []
  );

  // Column animation variants
  const columnVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  return (
    <div className="space-y-0 text-xs">
      {/* Key Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-primary/5 rounded-t-lg border-b border-primary/10 px-4 py-3"
      >
        <div className="flex items-start gap-2">
          <Network className="text-primary mt-0.5 size-4 shrink-0" />
          <div>
            <h3 className="font-heading text-foreground text-sm font-semibold">
              {d.title}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {d.keyInsight}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Evidence Graph */}
      <div ref={containerRef} className="relative px-4 py-4">
        {/* SVG Connection Layer */}
        {showPaths && paths.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 z-10"
            style={{ width: "100%", height: "100%" }}
          >
            {paths.map((path, i) => {
              const isActive =
                hoveredNode &&
                (path.from === hoveredNode || path.to === hoveredNode);
              const isDimmed = hoveredNode && !isActive;
              const isDashed =
                path.type === "caused_by" || path.type === "contradicts";

              return (
                <motion.path
                  key={`${path.from}-${path.to}-${i}`}
                  d={path.d}
                  stroke={connectionColors[path.type] ?? connectionColors.references}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={isDashed ? "6 4" : undefined}
                  opacity={isDimmed ? 0.1 : isActive ? 1 : 0.5}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: isDimmed ? 0.1 : isActive ? 1 : 0.5,
                  }}
                  transition={{
                    pathLength: {
                      duration: 0.6,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    },
                    opacity: { duration: 0.2 },
                  }}
                />
              );
            })}
          </svg>
        )}

        {/* Node Grid */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-3">
          {/* Left Column: Linear + GitHub */}
          <motion.div
            className="space-y-3"
            variants={columnVariants}
            initial="hidden"
            animate="visible"
          >
            {leftNodes.map((node) => (
              <EvidenceNode
                key={node.id}
                ref={setNodeRef(node.id)}
                node={node}
                side="left"
                isHighlighted={hoveredNode === node.id}
                isDimmed={
                  hoveredNode !== null &&
                  hoveredNode !== node.id &&
                  !isConnectedToHovered(node.id)
                }
                onHover={setHoveredNode}
              />
            ))}
          </motion.div>

          {/* Right Column: Slack + Notion */}
          <motion.div
            className="space-y-3"
            variants={columnVariants}
            initial="hidden"
            animate="visible"
          >
            {rightNodes.map((node) => (
              <EvidenceNode
                key={node.id}
                ref={setNodeRef(node.id)}
                node={node}
                side="right"
                isHighlighted={hoveredNode === node.id}
                isDimmed={
                  hoveredNode !== null &&
                  hoveredNode !== node.id &&
                  !isConnectedToHovered(node.id)
                }
                onHover={setHoveredNode}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Impact Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          delay: 1.6,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className={cn(
          "mx-4 mb-3 flex items-center gap-3 rounded-lg border px-3 py-2",
          risk.bg,
          risk.border
        )}
      >
        <AlertTriangle className={cn("size-4 shrink-0", risk.text)} />
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={cn("font-semibold uppercase", risk.text)}>
            {d.impact.risk} risk
          </span>
          {d.impact.revenue && (
            <span className="text-foreground flex items-center gap-1">
              <DollarSign className="size-3" />
              {d.impact.revenue}
            </span>
          )}
          {d.impact.timeline && (
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {d.impact.timeline}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
