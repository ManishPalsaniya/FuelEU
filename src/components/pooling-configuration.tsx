"use client";

import { useState, useMemo, useTransition } from "react";
import type { Ship, PoolMember, PoolSummary, PoolingValidation } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Filter, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { createPool } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface PoolingConfigurationProps {
    initialShips: Ship[];
}

export default function PoolingConfiguration({ initialShips }: PoolingConfigurationProps) {
    const [selectedShips, setSelectedShips] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<'all' | 'surplus' | 'deficit'>('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Ship; direction: 'asc' | 'desc' } | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    // --- Simulation Logic ---
    const simulationResult = useMemo(() => {
        const selectedShipList = initialShips.filter(s => selectedShips.has(s.id));

        // Calculate initial totals
        const totalSurplus = selectedShipList.reduce((sum, s) => sum + Math.max(0, s.complianceBalance), 0);
        const totalDeficit = selectedShipList.reduce((sum, s) => sum + Math.min(0, s.complianceBalance), 0);
        const netPoolBalance = totalSurplus + totalDeficit;

        // Simulate Allocation (Greedy)
        // 1. Sort by CB descending (Surplus first)
        const sortedForAllocation = [...selectedShipList].sort((a, b) => b.complianceBalance - a.complianceBalance);

        const surplusShips = sortedForAllocation.filter(s => s.complianceBalance > 0);
        const deficitShips = sortedForAllocation.filter(s => s.complianceBalance < 0);

        // Map to track state
        const shipStates = new Map<string, { before: number, after: number }>();
        selectedShipList.forEach(s => {
            shipStates.set(s.id, { before: s.complianceBalance, after: s.complianceBalance });
        });

        let currentSurplusIdx = 0;

        // Distribute surplus to deficits
        for (const deficitShip of deficitShips) {
            let needed = Math.abs(deficitShip.complianceBalance);

            while (needed > 0 && currentSurplusIdx < surplusShips.length) {
                const provider = surplusShips[currentSurplusIdx];
                const providerState = shipStates.get(provider.id)!;

                // Available surplus from this provider
                // Note: providerState.after starts as full surplus. We deduct from it.
                const available = providerState.after;

                if (available <= 0) {
                    currentSurplusIdx++;
                    continue;
                }

                if (available >= needed) {
                    // Provider covers full need
                    providerState.after -= needed;
                    const receiverState = shipStates.get(deficitShip.id)!;
                    receiverState.after += needed; // Should become 0
                    needed = 0;
                } else {
                    // Provider gives all they have
                    providerState.after = 0;
                    const receiverState = shipStates.get(deficitShip.id)!;
                    receiverState.after += available;
                    needed -= available;
                    currentSurplusIdx++;
                }
            }
        }

        // Create PoolMembers
        const members: PoolMember[] = initialShips.map(ship => {
            const isSelected = selectedShips.has(ship.id);
            const state = shipStates.get(ship.id);

            const cbBefore = ship.complianceBalance;
            const cbAfter = isSelected && state ? state.after : cbBefore;

            return {
                shipId: ship.id,
                shipName: ship.name,
                vesselType: ship.vesselType,
                cbBefore,
                cbAfter,
                impact: cbAfter - cbBefore,
                selected: isSelected,
                status: cbBefore > 0 ? 'surplus' : cbBefore < 0 ? 'deficit' : 'balanced'
            };
        });

        const summary: PoolSummary = {
            selectedShips: Array.from(selectedShips),
            totalSurplus,
            totalDeficit,
            netPoolBalance,
            isValid: false, // calculated below
            validationErrors: [],
            memberCount: selectedShips.size
        };

        const validation: PoolingValidation = {
            hasMinMembers: selectedShips.size >= 2,
            netBalancePositive: netPoolBalance >= 0,
            noDeficitWorsened: true, // Logic guarantees this
            noSurplusNegative: true, // Logic guarantees this
            allRulesMet: false
        };

        if (!validation.hasMinMembers) summary.validationErrors.push("Pool must have at least 2 members.");
        if (!validation.netBalancePositive) summary.validationErrors.push("Net pool balance must be positive.");

        validation.allRulesMet = validation.hasMinMembers && validation.netBalancePositive;
        summary.isValid = validation.allRulesMet;

        return { members, summary, validation };
    }, [initialShips, selectedShips]);

    // --- Handlers ---
    const toggleShip = (id: string) => {
        const newSelected = new Set(selectedShips);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedShips(newSelected);
    };

    const toggleAll = () => {
        if (selectedShips.size === initialShips.length) {
            setSelectedShips(new Set());
        } else {
            setSelectedShips(new Set(initialShips.map(s => s.id)));
        }
    };

    const handleCreatePool = () => {
        if (!simulationResult.summary.isValid) return;

        startTransition(async () => {
            const result = await createPool(Array.from(selectedShips));

            if (result.isCompliant) {
                toast({
                    title: "Pool Created",
                    description: `Pool created successfully with ${selectedShips.size} ships! Net balance: ${simulationResult.summary.netPoolBalance.toFixed(2)} gCO₂e/MJ`
                });
            } else {
                toast({ variant: "destructive", title: "Error", description: "Failed to create pool." });
            }
        });
    };



    // --- Filtering & Sorting ---
    const filteredMembers = useMemo(() => {
        let data = [...simulationResult.members];

        if (filter === 'surplus') data = data.filter(m => m.status === 'surplus');
        if (filter === 'deficit') data = data.filter(m => m.status === 'deficit');

        if (sortConfig) {
            data.sort((a, b) => {
                // @ts-ignore - dynamic sort key
                const aValue = a[sortConfig.key === 'id' ? 'shipId' : sortConfig.key === 'name' ? 'shipName' : 'cbBefore'];
                // @ts-ignore
                const bValue = b[sortConfig.key === 'id' ? 'shipId' : sortConfig.key === 'name' ? 'shipName' : 'cbBefore'];

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [simulationResult.members, filter, sortConfig]);

    const requestSort = (key: any) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-[#393E46] border-gray-600">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-white">Pool Summary</CardTitle>
                        </div>

                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Selected Ships</p>
                            <p className="text-2xl font-bold">{simulationResult.summary.memberCount}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Total Surplus</p>
                            <p className="text-2xl font-bold text-green-500">+{simulationResult.summary.totalSurplus.toFixed(2)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Total Deficit</p>
                            <p className="text-2xl font-bold text-red-500">{simulationResult.summary.totalDeficit.toFixed(2)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Net Pool Balance</p>
                            <div className="flex items-center gap-2">
                                <p className={`text-2xl font-bold ${simulationResult.summary.netPoolBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {simulationResult.summary.netPoolBalance.toFixed(2)}
                                </p>
                                {simulationResult.summary.isValid ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                            </div>
                        </div>
                    </div>

                    {simulationResult.summary.validationErrors.length > 0 && (
                        <div className="mt-4 rounded-md bg-red-900/30 p-3 text-sm text-red-500">
                            <div className="flex items-center gap-2 font-medium">
                                <AlertTriangle className="h-4 w-4" />
                                Validation Errors:
                            </div>
                            <ul className="mt-1 list-inside list-disc pl-5">
                                {simulationResult.summary.validationErrors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Configuration Table */}
            <Card className="bg-[#393E46] border-gray-600">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-white">Available Ships</CardTitle>
                            <CardDescription className="text-gray-400">Select ships to include in the pool.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                                <SelectTrigger className="w-[150px] bg-[#222831] border-gray-600 text-white">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#222831] border-gray-600 text-white">
                                    <SelectItem value="all" className="focus:bg-[#393E46] focus:text-white">All Ships</SelectItem>
                                    <SelectItem value="surplus" className="focus:bg-[#393E46] focus:text-white">Surplus Only</SelectItem>
                                    <SelectItem value="deficit" className="focus:bg-[#393E46] focus:text-white">Deficit Only</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleCreatePool}
                                disabled={!simulationResult.summary.isValid || isPending}
                            >
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Pool
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-600 hover:bg-[#393E46]">
                                <TableHead className="w-[50px] text-gray-300">
                                    <Checkbox
                                        checked={selectedShips.size === initialShips.length && initialShips.length > 0}
                                        onCheckedChange={toggleAll}
                                        className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                    />
                                </TableHead>
                                <TableHead className="cursor-pointer text-gray-300" onClick={() => requestSort('id')}>
                                    <div className="flex items-center gap-1">
                                        Ship ID <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer text-gray-300" onClick={() => requestSort('name')}>
                                    <div className="flex items-center gap-1">
                                        Name <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-gray-300">Type</TableHead>
                                <TableHead className="text-right cursor-pointer text-gray-300" onClick={() => requestSort('complianceBalance')}>
                                    <div className="flex items-center justify-end gap-1">
                                        CB Before <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-right text-gray-300">CB After Pool</TableHead>
                                <TableHead className="text-right text-gray-300">Impact</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow key={member.shipId} className={`border-gray-600 hover:bg-[#222831] ${member.status === 'surplus' ? 'bg-green-500/5' : member.status === 'deficit' ? 'bg-red-500/5' : ''}`}>
                                    <TableCell>
                                        <Checkbox
                                            checked={member.selected}
                                            onCheckedChange={() => toggleShip(member.shipId)}
                                            className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-300">{member.shipId}</TableCell>
                                    <TableCell className="text-gray-300">{member.shipName}</TableCell>
                                    <TableCell className="text-gray-300">{member.vesselType}</TableCell>
                                    <TableCell className={`text-right font-mono ${member.cbBefore > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {member.cbBefore.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {member.selected ? (
                                            <span className={member.cbAfter >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                {member.cbAfter.toFixed(2)}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {member.selected && member.impact !== 0 ? (
                                            <Badge variant={member.impact > 0 ? "default" : "secondary"} className={member.impact > 0 ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
                                                {member.impact > 0 ? '+' : ''}{member.impact.toFixed(2)}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
