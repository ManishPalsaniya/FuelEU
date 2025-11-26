"use client";

import type { ComparisonData } from "@/app/(app)/compare/page";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CompareTable({ data }: { data: ComparisonData[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-600 hover:bg-[#393E46]">
          <TableHead className="text-gray-300">Route ID</TableHead>
          <TableHead className="text-gray-300">Vessel</TableHead>
          <TableHead className="text-gray-300">GHG Intensity</TableHead>
          <TableHead className="text-gray-300">Baseline</TableHead>
          <TableHead className="text-gray-300">% Difference</TableHead>
          <TableHead className="text-gray-300">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.routeId} className="border-gray-600 hover:bg-[#222831]">
            <TableCell className="font-medium text-gray-300">{item.routeId}</TableCell>
            <TableCell className="text-gray-300">{item.vesselType}</TableCell>
            <TableCell className="text-gray-300">{item.ghgIntensity.toFixed(2)}</TableCell>
            <TableCell className="text-gray-300">{item.baselineGhgIntensity.toFixed(2)}</TableCell>
            <TableCell className={item.percentDifference <= 0 ? "text-[#4ade80]" : "text-[#f87171]"}>
              {item.percentDifference > 0 ? '+' : ''}{item.percentDifference.toFixed(2)}%
            </TableCell>
            <TableCell>
              {item.isCompliant ? (
                <Badge variant="outline" className="border-[#4ade80] text-[#4ade80]">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Compliant
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-[#f87171] hover:bg-[#f87171]/80">
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
