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
    <div className="relative rounded-md border">
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow className="border-gray-600 hover:bg-[#393E46]">
            <TableHead className="font-semibold text-gray-300">Route ID</TableHead>
            <TableHead className="font-semibold text-gray-300">Vessel Type</TableHead>
            <TableHead className="font-semibold text-gray-300">Fuel Type</TableHead>
            <TableHead className="font-semibold text-gray-300">Year</TableHead>
            <TableHead className="font-semibold text-gray-300">Fuel Cons. (t)</TableHead>
            <TableHead className="font-semibold text-gray-300">Distance (km)</TableHead>
            <TableHead className="font-semibold text-gray-300">GHG Intensity (gCO₂e/MJ)</TableHead>
            <TableHead className="font-semibold text-gray-300">Total Emissions (t)</TableHead>
            <TableHead className="font-semibold text-gray-300">Status</TableHead>
            <TableHead className="text-right font-semibold text-gray-300">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.routeId} className="border-gray-600 hover:bg-[#222831]">
              <TableCell className="font-medium text-gray-300">{route.routeId}</TableCell>
              <TableCell className="text-gray-300">{route.vesselType}</TableCell>
              <TableCell className="text-gray-300">{route.fuelType}</TableCell>
              <TableCell className="text-gray-300">{route.year}</TableCell>
              <TableCell className="text-gray-300">{route.fuelConsumption.toLocaleString()}</TableCell>
              <TableCell className="text-gray-300">{route.distance.toLocaleString()}</TableCell>
              <TableCell className="text-gray-300">{route.ghgIntensity.toFixed(2)}</TableCell>
              <TableCell className="text-gray-300">{route.totalEmissions.toLocaleString()}</TableCell>
              <TableCell>
                {route.isBaseline && <Badge variant="secondary" className="font-normal">Baseline</Badge>}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetBaseline(route.routeId)}
                  disabled={route.isBaseline || isPending}
                  className="h-8"
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
