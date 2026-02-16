"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip } from "./chart-tooltip";

const data = [
  { name: "James W.", issues: 7, risk: true },
  { name: "Alex K.", issues: 5, risk: false },
  { name: "Priya P.", issues: 4, risk: false },
  { name: "Sarah C.", issues: 2, risk: false },
  { name: "Maria L.", issues: 2, risk: false },
];

export function TeamWorkloadChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Team Workload</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            margin={{ left: -8, right: 12, top: 4, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <ReferenceLine
              y={5}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="3 3"
              label={{
                value: "Capacity",
                fill: "rgba(255,255,255,0.3)",
                fontSize: 10,
                position: "right",
              }}
            />
            <Bar dataKey="issues" name="Issues" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.risk ? "#ef4444" : "#6775f5"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
