"use client";

import type { PoolCreationResult, Ship } from "@/lib/types";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { createPool } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";

interface PoolingSimulatorProps {
  initialShips: Ship[];
}

export default function PoolingSimulator({ initialShips }: PoolingSimulatorProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [result, setResult] = useState<PoolCreationResult | null>(null);

  const handleCreatePool = () => {
    startTransition(async () => {
      const poolResult = await createPool();
      setResult(poolResult);
      if (!poolResult.isCompliant) {
        toast({
          variant: "destructive",
          title: "Pool Not Compliant",
          description: "The total compliance balance of the pool is negative. Pooling is not allowed."
        });
      } else {
        toast({
          title: "Pool Created",
          description: "Compliance balances have been successfully reallocated within the pool."
        });
      }
    });
  };

  const shipsToDisplay = result?.before ?? initialShips;
  const totalBalance = shipsToDisplay.reduce((acc, ship) => acc + (ship.adjustedComplianceBalance ?? ship.complianceBalance), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Pool Members</CardTitle>
              <CardDescription>Ships available for pooling and their compliance status.</CardDescription>
            </div>
            <Button onClick={handleCreatePool} disabled={isPending} size="lg">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {result ? "Re-run Simulation" : "Create Pool & Allocate"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-end gap-4 pb-4">
              <span className="font-semibold">Total Pool Balance:</span>
              <Badge className={`text-lg ${totalBalance >= 0 ? "border-green-400 text-green-400" : "border-red-400 text-red-400"}`} variant="outline">
                {totalBalance.toFixed(2)}
              </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ship Name</TableHead>
                <TableHead>Vessel Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-center">CB Before</TableHead>
                {result && <TableHead className="text-center">Allocation</TableHead>}
                {result && <TableHead className="text-center">CB After</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipsToDisplay.map((ship, index) => {
                const afterShip = result?.after.find(s => s.id === ship.id);
                const beforeBalance = ship.adjustedComplianceBalance ?? ship.complianceBalance;
                const afterBalance = afterShip?.adjustedComplianceBalance ?? 0;
                const difference = result ? afterBalance - beforeBalance : 0;
                return (
                  <TableRow key={ship.id}>
                    <TableCell className="font-medium">{ship.name}</TableCell>
                    <TableCell>{ship.vesselType}</TableCell>
                    <TableCell>{ship.year}</TableCell>
                    <TableCell className={`text-center font-mono ${beforeBalance < 0 ? 'text-red-400' : 'text-green-400'}`}>{beforeBalance.toFixed(2)}</TableCell>
                    {result && (
                      <TableCell className="text-center font-mono flex items-center justify-center gap-2">
                         <span className={difference > 0 ? "text-green-400" : difference < 0 ? "text-red-400" : "text-muted-foreground"}>
                           ({difference > 0 && '+'}{difference.toFixed(2)})
                         </span>
                         <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    )}
                    {result && afterShip && (
                      <TableCell className={`text-center font-mono ${afterBalance < 0 ? 'text-red-400' : 'text-green-400'}`}>{afterBalance.toFixed(2)}</TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
