"use client"

import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis, Tooltip, Legend } from "recharts"
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
    <div className="h-[350px] w-full">
      <ChartContainer config={{}} className="h-full w-full">
        <BarChart data={chartData} accessibilityLayer>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis unit=" gCO₂e/MJ" />
          <Tooltip
            cursor={{ fill: "hsl(var(--accent))" }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Legend />
          <ReferenceLine
            y={baseline}
            label={{ value: "Baseline", position: "insideTopLeft", fill: 'hsl(var(--foreground))' }}
            stroke="hsl(var(--secondary-foreground))"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={target}
            label={{ value: "Target", position: "insideTopRight", fill: 'hsl(var(--foreground))' }}
            stroke="hsl(var(--destructive))"
            strokeDasharray="3 3"
          />
          <Bar dataKey="GHG Intensity" fill="hsl(var(--primary))" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
