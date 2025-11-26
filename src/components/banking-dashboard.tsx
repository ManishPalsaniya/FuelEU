"use client";

import { useState } from "react";
import type { Ship, BankingRecord } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Banknote, TrendingDown, TrendingUp, History } from "lucide-react";
import BankingForm from "@/components/banking-form";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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

    // Filter records for the selected year to calculate "Applied" (Net Banking Impact) for this year
    const currentYearRecords = bankingData.records.filter(r => r.year === parseInt(selectedYear));

    // Calculate Net Applied/Banked for the selected year
    // Banked = negative impact on CB (removes surplus)
    // Applied = positive impact on CB (adds to deficit)
    // We store amounts as positive in DB, so we need to check transactionType
    const netBankingImpact = currentYearRecords.reduce((acc, record) => {
        if (record.transactionType === 'bank') {
            return acc - record.amountGco2eq;
        } else {
            return acc + record.amountGco2eq;
        }
    }, 0);

    // CB Before Banking = Current Balance - Net Impact? 
    // No, Current Balance = Original + Net Impact.
    // So Original (CB Before) = Current Balance - Net Impact.
    const cbBeforeBanking = selectedShip.complianceBalance - netBankingImpact;
    const cbAfterBanking = selectedShip.complianceBalance;

    const totalBanked = bankingData?.totalBanked ?? 0;

    return (
        <div className="min-h-screen p-6 text-white">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            

                {/* Filters */}
                <Card className="bg-[#393E46] border-gray-600">
                    <CardContent className="p-4 flex gap-4 items-end">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="ship-select" className="text-gray-300">
                                ship name
                            </Label>
                            <Select value={selectedShipId} onValueChange={setSelectedShipId}>
                                <SelectTrigger id="ship-select" className="w-[280px] bg-[#222831] border-gray-600 text-white">
                                    <SelectValue placeholder="Select a ship" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#222831] border-gray-600 text-white">
                                    {ships.map((ship) => (
                                        <SelectItem key={ship.id} value={ship.id} className="focus:bg-[#393E46] focus:text-white">
                                            {ship.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full max-w-[150px] items-center gap-1.5">
                            <Label htmlFor="year-select" className="text-gray-300">
                                Year
                            </Label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger id="year-select" className="bg-[#222831] border-gray-600 text-white">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#222831] border-gray-600 text-white">
                                    <SelectItem value="2024" className="focus:bg-[#393E46] focus:text-white">2024</SelectItem>
                                    <SelectItem value="2025" className="focus:bg-[#393E46] focus:text-white">2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Table */}
                <Card className="bg-[#393E46] border-gray-600">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-600 hover:bg-[#393E46]">
                                    <TableHead className="text-gray-300">CB Before Banking</TableHead>
                                    <TableHead className="text-gray-300">Applied / Banked</TableHead>
                                    <TableHead className="text-gray-300">CB After Banking</TableHead>
                                    <TableHead className="text-gray-300">Total Banked</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-gray-600 hover:bg-[#222831]">
                                    <TableCell className={`font-mono text-lg ${cbBeforeBanking >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {cbBeforeBanking.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="font-mono text-lg text-white">
                                        {netBankingImpact > 0 ? '+' : ''}{netBankingImpact.toFixed(2)}
                                    </TableCell>
                                    <TableCell className={`font-mono text-lg ${cbAfterBanking >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {cbAfterBanking.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="font-mono text-lg text-blue-400">
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
                    <Card className={`bg-[#393E46] border-gray-600 ${selectedShip.complianceBalance <= 0 ? "opacity-60" : ""}`}>
                        <CardHeader>
                            <CardTitle className="text-white">Bank Surplus</CardTitle>
                            <CardDescription className="text-gray-400">According to Article 20 - Banking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 text-sm text-gray-300">
                                Bank your surplus to use in future years.
                                <ul className="list-disc list-inside mt-2 text-xs text-gray-400">
                                    <li>Can only bank positive CB (CB &gt; 0)</li>
                                    <li>Cannot bank more than available CB</li>
                                </ul>
                            </div>
                            {selectedShip.complianceBalance > 0 ? (
                                <BankingForm
                                    ship={selectedShip}
                                    actionType="bank"
                                    maxAmount={selectedShip.complianceBalance}
                                />
                            ) : (
                                <div className="rounded-md bg-[#222831] p-3 text-sm text-gray-400">
                                    Banking is disabled because Compliance Balance is ≤ 0.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Apply Banking */}
                    <Card className={`bg-[#393E46] border-gray-600 ${selectedShip.complianceBalance >= 0 ? "opacity-60" : ""}`}>
                        <CardHeader>
                            <CardTitle className="text-white">Apply Banking</CardTitle>
                            <CardDescription className="text-gray-400">Use previously banked surplus to cover a deficit.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 text-sm text-gray-300">
                                Apply banked surplus to cover deficits.
                                <ul className="list-disc list-inside mt-2 text-xs text-gray-400">
                                    <li>Can only apply to negative CB</li>
                                    <li>Reduces total banked amount</li>
                                </ul>
                            </div>
                            {selectedShip.complianceBalance < 0 ? (
                                <BankingForm
                                    ship={selectedShip}
                                    actionType="apply"
                                    maxAmount={totalBanked}
                                />
                            ) : (
                                <div className="rounded-md bg-[#222831] p-3 text-sm text-gray-400">
                                    Applying banking is disabled because Compliance Balance is ≥ 0.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-[#393E46] border-gray-600">
                    <CardHeader>
                        <CardTitle className="text-white">Banking History</CardTitle>
                        <CardDescription className="text-gray-400">Transaction history for {selectedShip.name}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-600 hover:bg-[#393E46]">
                                    <TableHead className="text-gray-300">Date</TableHead>
                                    <TableHead className="text-gray-300">Type</TableHead>
                                    <TableHead className="text-gray-300">Amount</TableHead>
                                    <TableHead className="text-gray-300">Year</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(!bankingData?.records || bankingData.records.length === 0) ? (
                                    <TableRow className="border-gray-600">
                                        <TableCell colSpan={4} className="text-center text-gray-400">No banking history found.</TableCell>
                                    </TableRow>
                                ) : (
                                    bankingData.records.map((record) => (
                                        <TableRow key={record.id} className="border-gray-600 hover:bg-[#222831]">
                                            <TableCell className="text-gray-300">{new Date(record.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={record.transactionType === 'bank' ? 'default' : 'secondary'} className={record.transactionType === 'bank' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}>
                                                    {record.transactionType === 'bank' ? 'Banked' : 'Applied'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-300">{record.amountGco2eq?.toFixed(2) ?? '0.00'}</TableCell>
                                            <TableCell className="text-gray-300">{record.year}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
