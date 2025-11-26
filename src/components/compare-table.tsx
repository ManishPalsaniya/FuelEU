"use client";

import type { ComparisonData } from "@/app/(app)/compare/page";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CompareTable({ data }: { data: ComparisonData[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Route ID</TableHead>
          <TableHead>Vessel</TableHead>
          <TableHead>GHG Intensity</TableHead>
          <TableHead>% Diff from Baseline</TableHead>
          <TableHead>Compliance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.routeId}>
            <TableCell className="font-medium">{item.routeId}</TableCell>
            <TableCell>{item.vesselType}</TableCell>
            <TableCell>{item.ghgIntensity.toFixed(2)}</TableCell>
            <TableCell className={item.percentDifference > 0 ? "text-red-400" : "text-green-400"}>
              {item.percentDifference.toFixed(2)}%
            </TableCell>
            <TableCell>
              {item.isCompliant ? (
                <Badge variant="outline" className="border-green-400 text-green-400">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Compliant
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Non-Compliant
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
