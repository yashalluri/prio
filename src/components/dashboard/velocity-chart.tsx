"use client";

import {
  AreaChart,
  Area,
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

const data = [
  { sprint: "Sprint 1", completed: 14, planned: 16 },
  { sprint: "Sprint 2", completed: 11, planned: 15 },
  { sprint: "Sprint 3", completed: 6, planned: 14 },
  { sprint: "Sprint 4", completed: 3, planned: 13 },
];

export function VelocityChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Sprint Velocity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            margin={{ left: -8, right: 12, top: 4, bottom: 4 }}
          >
            <defs>
              <linearGradient id="planned-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(255,255,255,0.15)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="rgba(255,255,255,0.15)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="completed-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6775f5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6775f5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="sprint"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            <Area
              type="monotone"
              dataKey="planned"
              name="Planned"
              stroke="rgba(255,255,255,0.3)"
              fill="url(#planned-grad)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <Area
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#6775f5"
              fill="url(#completed-grad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
