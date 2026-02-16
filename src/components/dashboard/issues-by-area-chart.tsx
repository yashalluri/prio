"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip } from "./chart-tooltip";

const COLORS = {
  blocked: "#ef4444",
  inProgress: "#6775f5",
  todo: "#d4a843",
  backlog: "rgba(255,255,255,0.15)",
  done: "#34c79b",
};

const data = [
  { area: "Billing", blocked: 2, inProgress: 1, todo: 3, backlog: 1, done: 0 },
  { area: "Auth", blocked: 2, inProgress: 2, todo: 1, backlog: 0, done: 1 },
  { area: "API", blocked: 1, inProgress: 1, todo: 2, backlog: 2, done: 0 },
  { area: "Mobile", blocked: 0, inProgress: 1, todo: 2, backlog: 1, done: 0 },
  { area: "Onboarding", blocked: 0, inProgress: 1, todo: 2, backlog: 1, done: 0 },
  { area: "Performance", blocked: 0, inProgress: 1, todo: 1, backlog: 1, done: 1 },
];

export function IssuesByAreaChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Issues by Product Area
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 12, top: 4, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              type="number"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="area"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              width={80}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            <Bar dataKey="blocked" stackId="a" fill={COLORS.blocked} name="Blocked" radius={0} />
            <Bar dataKey="inProgress" stackId="a" fill={COLORS.inProgress} name="In Progress" radius={0} />
            <Bar dataKey="todo" stackId="a" fill={COLORS.todo} name="To Do" radius={0} />
            <Bar dataKey="backlog" stackId="a" fill={COLORS.backlog} name="Backlog" radius={0} />
            <Bar dataKey="done" stackId="a" fill={COLORS.done} name="Done" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
