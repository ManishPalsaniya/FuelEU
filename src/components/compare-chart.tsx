"use client"

import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { ComparisonData } from "@/app/(app)/compare/page";

interface CompareChartProps {
  data: ComparisonData[];
  baseline: number;
  target: number;
}

export default function CompareChart({ data, baseline, target }: CompareChartProps) {
  const chartData = data.map(d => ({
    name: d.routeId,
    "GHG Intensity": d.ghgIntensity,
  }));

  return (
    <div className="h-[180px] w-full">
      <ChartContainer config={{}} className="h-full w-full">
        <BarChart data={chartData} layout="vertical" accessibilityLayer margin={{ left: 20, right: 20 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" hide domain={[0, 'auto']} />
          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} />
          <Tooltip
            cursor={{ fill: "hsl(var(--accent))" }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="GHG Intensity" radius={[0, 10, 10, 0]} barSize={15}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry["GHG Intensity"] <= target ? "#4ade80" : "#f87171"} />
            ))}
          </Bar>
          <ReferenceLine
            x={baseline}
            isFront
            label={{ value: "Baseline", position: "insideTopLeft", fill: 'hsl(var(--foreground))', angle: -90, offset: 4 }}
            stroke="hsl(var(--foreground))"
            strokeDasharray="3 3"
            strokeWidth={2}
          />
          <ReferenceLine
            x={target}
            isFront
            label={{
              value: `Target: ${target.toFixed(2)}`,
              position: "insideTopRight",
              fill: 'hsl(var(--destructive))',
              fontSize: 14,
              fontWeight: 'bold',
              angle: 0,
              offset: 10
            }}
            stroke="hsl(var(--destructive))"
            strokeDasharray="3 3"
            strokeWidth={2}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
