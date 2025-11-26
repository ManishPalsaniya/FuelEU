import { getBaselineRoute, getRoutes } from '@/lib/data';
import type { Route } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CompareChart from '@/components/compare-chart';
import CompareTable from '@/components/compare-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export const GHG_TARGET = 89.3368;

export const dynamic = 'force-dynamic';

export interface ComparisonData extends Route {
  baselineGhgIntensity: number;
  percentDifference: number;
  isCompliant: boolean;
}

export default async function ComparePage() {
  const [routes, baselineRoute] = await Promise.all([getRoutes(), getBaselineRoute()]);

  if (!baselineRoute) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Baseline Set</AlertTitle>
        <AlertDescription>
          Please set a baseline route from the 'Routes' tab to enable comparison.
        </AlertDescription>
      </Alert>
    );
  }

  const comparisonData: ComparisonData[] = routes
    .filter(route => !route.isBaseline)
    .map(route => {
      const percentDifference = ((route.ghgIntensity / baselineRoute.ghgIntensity) - 1) * 100;
      const isCompliant = route.ghgIntensity <= GHG_TARGET;
      return {
        ...route,
        baselineGhgIntensity: baselineRoute.ghgIntensity,
        percentDifference,
        isCompliant,
      };
    });

  const compliantRoutesCount = comparisonData.filter(d => d.isCompliant).length;
  const totalRoutesCount = comparisonData.length;
  const averageIntensity = comparisonData.reduce((acc, curr) => acc + curr.ghgIntensity, 0) / (totalRoutesCount || 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Routes Comparison</h2>
      </div>

      {/* Intensity Comparison Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#393E46] border-gray-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Target GHG Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{GHG_TARGET} <span className="text-sm font-normal text-[#4ade80]"> gCO₂e/MJ</span></div>
            <p className="text-xs text-gray-400">2% reduction from {baselineRoute.ghgIntensity.toFixed(2)} baseline (fixed target)</p>
          </CardContent>
        </Card>
        <Card className="bg-[#393E46] border-gray-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Compliant Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{compliantRoutesCount} <span className="text-sm font-normal text-gray-400">/ {totalRoutesCount}</span></div>
            <p className="text-xs text-gray-400">Routes meeting the target</p>
          </CardContent>
        </Card>
        <Card className="bg-[#393E46] border-gray-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Average Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${averageIntensity <= GHG_TARGET ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
              {averageIntensity.toFixed(4)}
            </div>
            <p className="text-xs text-gray-400">Average GHG intensity across all routes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-2 bg-[#393E46] border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">GHG Intensity Comparison</CardTitle>
            <CardDescription className="text-gray-400">
              Visualizing GHG intensity of each route against the baseline and target.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompareChart data={comparisonData} baseline={baselineRoute.ghgIntensity} target={GHG_TARGET} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-[#393E46] border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Comparison Details</CardTitle>
            <CardDescription className="text-gray-400">
              Detailed breakdown of each route's performance against the baseline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompareTable data={comparisonData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
