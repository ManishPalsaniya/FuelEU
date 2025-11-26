import { getRoutes } from '@/lib/data';
import RoutesTable from '@/components/routes-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RoutesFilters from '@/components/routes-filters';

export const dynamic = 'force-dynamic';

export default async function RoutesPage({ searchParams }: {
  searchParams?: {
    vesselType?: string;
    fuelType?: string;
    year?: string;
    query?: string;
  }
}) {
  const routes = await getRoutes(searchParams);
  const allRoutes = await getRoutes(); // for filter options

  const vesselTypes = [...new Set(allRoutes.map(r => r.vesselType))];
  const fuelTypes = [...new Set(allRoutes.map(r => r.fuelType))];
  const years = [...new Set(allRoutes.map(r => r.year.toString()))].sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Routes Management</h2>
          <p className="text-muted-foreground">View, filter, and manage vessel routes.</p>
        </div>
        <RoutesFilters vesselTypes={vesselTypes} fuelTypes={fuelTypes} years={years} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Data</CardTitle>
          <CardDescription>
            Detailed information on all recorded voyages. Set a baseline route for compliance comparison.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoutesTable routes={routes} />
        </CardContent>
      </Card>
    </div>
  )
}
