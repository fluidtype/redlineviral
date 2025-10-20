"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { label: "Lun", value: 24 },
  { label: "Mar", value: 32 },
  { label: "Mer", value: 28 },
  { label: "Gio", value: 35 },
  { label: "Ven", value: 31 },
  { label: "Sab", value: 38 },
  { label: "Dom", value: 42 },
  { label: "Lun", value: 45 },
  { label: "Mar", value: 47 },
  { label: "Mer", value: 52 }
];

export function Sparkline() {
  return (
    <div data-testid="sparkline-chart" className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, bottom: 0, left: 0, right: 0 }}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.8)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.05)" />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" hide axisLine={false} tickLine={false} />
          <YAxis hide domain={[0, "dataMax + 10"]} />
          <Tooltip
            cursor={{ stroke: "rgba(16, 185, 129, 0.2)" }}
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              borderRadius: 12,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#f4f4f5",
              fontSize: 12
            }}
            itemStyle={{ color: "#a3e635" }}
            labelStyle={{ color: "#e5e7eb", fontWeight: 600 }}
          />
          <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} fill="url(#sparklineGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
