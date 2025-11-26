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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Routes Comparison</h2>
        <p className="text-muted-foreground">
          Compare routes' GHG intensity against the baseline. Current Target: {GHG_TARGET} gCO₂e/MJ
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>GHG Intensity Comparison</CardTitle>
            <CardDescription>
              Visualizing GHG intensity of each route against the baseline and target.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompareChart data={comparisonData} baseline={baselineRoute.ghgIntensity} target={GHG_TARGET} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comparison Details</CardTitle>
            <CardDescription>
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
