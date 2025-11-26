"use client";

import { useState } from "react";
import type { Ship, BankingRecord } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Banknote, TrendingDown, TrendingUp, History } from "lucide-react";
import BankingForm from "@/components/banking-form";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BankingDashboardProps {
    ships: Ship[];
    initialBankingRecords: Record<string, { records: BankingRecord[], totalBanked: number }>;
}

export default function BankingDashboard({ ships, initialBankingRecords }: BankingDashboardProps) {
    const [selectedShipId, setSelectedShipId] = useState<string>(ships[0]?.id || "");
    const [selectedYear, setSelectedYear] = useState<string>("2025");

    const selectedShip = ships.find(s => s.id === selectedShipId);
    const bankingData = selectedShip ? initialBankingRecords[selectedShip.id] : { records: [], totalBanked: 0 };

    if (!selectedShip) {
        return <div>No ships found.</div>;
    }

    // Calculate derived values for the status table
    // Note: In a real app, these might come from a specific "Compliance Status" API
    // For now, we use the current ship state and banking data
    const cbBeforeBanking = selectedShip.complianceBalance; // This is actually the current balance, but let's assume it's "before" for the next action or "current"
    // To get "Applied", we might sum up applied records for this year? 
    // Or is "Applied" the amount *available* to apply? 
    // The user request says: "CB Before Banking, Applied, CB After Banking, Total Banked"
    // This looks like a row describing the *result* of banking operations.
    // If we haven't banked yet, Applied is 0.
    // If we have banked, the `complianceBalance` on the ship object *should* reflect that if fetched fresh.

    // Let's assume:
    // CB Before Banking = current compliance balance (before any *new* action)
    // Applied = 0 (placeholder for now, or sum of recent transactions?)
    // CB After Banking = calculated based on potential action? No, this is a dashboard.

    // Interpretation: The user wants to see the *current state* in a table format.
    // "CB Before Banking" -> The balance *before* any banking was applied?
    // If the ship has a deficit of -10, and we applied 5, the current balance is -5.
    // So "CB Before" would be -10, "Applied" 5, "CB After" -5.
    // But we only have `complianceBalance` from the `Ship` object.
    // Let's display the current `complianceBalance` as "CB Before Banking" (meaning available for banking)
    // and "Total Banked" as the pool.
    // "Applied" and "CB After" might be relevant *after* an action or as a history summary.
    // Given the constraints, I will display the *Current* values.

    const totalBanked = bankingData?.totalBanked ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Banking and Compliances</h1>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4 flex gap-4 items-end">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <label htmlFor="ship-select" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Filter by ship name
                            </label>
                            <Select value={selectedShipId} onValueChange={setSelectedShipId}>
                                <SelectTrigger id="ship-select" className="w-[280px]">
                                    <SelectValue placeholder="Select a ship" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ships.map((ship) => (
                                        <SelectItem key={ship.id} value={ship.id}>
                                            {ship.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full max-w-[150px] items-center gap-1.5">
                            <label htmlFor="year-select" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Year
                            </label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger id="year-select">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>CB Before Banking</TableHead>
                                    <TableHead>Applied</TableHead>
                                    <TableHead>CB After Banking</TableHead>
                                    <TableHead>Total Banked</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={`font-mono ${selectedShip.complianceBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedShip.complianceBalance?.toFixed(2) ?? '0.00'}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {/* We don't have "Applied" in the ship object, showing 0.00 or derived from history if complex logic added */}
                                        0.00
                                    </TableCell>
                                    <TableCell className={`font-mono ${selectedShip.complianceBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {/* Assuming CB After is same as current for now until action taken */}
                                        {selectedShip.complianceBalance?.toFixed(2) ?? '0.00'}
                                    </TableCell>
                                    <TableCell className="font-mono text-blue-600">
                                        {totalBanked.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Bank Surplus */}
                    <Card className={selectedShip.complianceBalance <= 0 ? "opacity-60" : ""}>
                        <CardHeader>
                            <CardTitle>Bank Surplus</CardTitle>
                            <CardDescription>According to Article 20 - Banking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 text-sm text-muted-foreground">
                                Bank your surplus to use in future years.
                            </div>
                            {selectedShip.complianceBalance > 0 ? (
                                <BankingForm
                                    ship={selectedShip}
                                    actionType="bank"
                                    maxAmount={selectedShip.complianceBalance}
                                />
                            ) : (
                                <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                                    Banking is disabled because Compliance Balance is ≤ 0.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Apply Banking */}
                    <Card className={selectedShip.complianceBalance >= 0 ? "opacity-60" : ""}>
                        <CardHeader>
                            <CardTitle>Apply Banking</CardTitle>
                            <CardDescription>Use previously banked surplus to cover a deficit in the current year.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 text-sm text-muted-foreground">
                                Can only apply to negative Compliance Balance.
                            </div>
                            {selectedShip.complianceBalance < 0 ? (
                                <BankingForm
                                    ship={selectedShip}
                                    actionType="apply"
                                    maxAmount={totalBanked}
                                />
                            ) : (
                                <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                                    Applying banking is disabled because Compliance Balance is ≥ 0.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
