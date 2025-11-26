"use client";

import type { Route } from "@/lib/types";
import { useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setBaseline } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function RoutesTable({ routes }: { routes: Route[] }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSetBaseline = (routeId: string) => {
    startTransition(async () => {
      const result = await setBaseline(routeId);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    });
  };

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Route ID</TableHead>
            <TableHead>Vessel Type</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Fuel Cons. (t)</TableHead>
            <TableHead>Distance (km)</TableHead>
            <TableHead>GHG Intensity (gCO₂e/MJ)</TableHead>
            <TableHead>Total Emissions (t)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.routeId}>
              <TableCell className="font-medium">{route.routeId}</TableCell>
              <TableCell>{route.vesselType}</TableCell>
              <TableCell>{route.fuelType}</TableCell>
              <TableCell>{route.year}</TableCell>
              <TableCell>{route.fuelConsumption.toLocaleString()}</TableCell>
              <TableCell>{route.distance.toLocaleString()}</TableCell>
              <TableCell>{route.ghgIntensity.toFixed(2)}</TableCell>
              <TableCell>{route.totalEmissions.toLocaleString()}</TableCell>
              <TableCell>
                {route.isBaseline && <Badge variant="secondary">Baseline</Badge>}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetBaseline(route.routeId)}
                  disabled={route.isBaseline || isPending}
                >
                  Set Baseline
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
