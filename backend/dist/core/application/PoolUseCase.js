"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolUseCase = void 0;
const Entities_1 = require("../domain/Entities");
const uuid_1 = require("uuid");
class PoolUseCase {
    constructor(poolRepo, complianceRepo) {
        this.poolRepo = poolRepo;
        this.complianceRepo = complianceRepo;
    }
    async createPool(members, year) {
        // 1. Fetch compliance for all members
        const complianceRecords = [];
        for (const shipId of members) {
            const rec = await this.complianceRepo.findByShipIdAndYear(shipId, year);
            if (!rec)
                throw new Error(`Compliance record not found for ship ${shipId}`);
            complianceRecords.push(rec);
        }
        // 2. Validate Sum(adjustedCB) >= 0
        const totalCb = complianceRecords.reduce((sum, rec) => sum + rec.adjustedCb, 0);
        if (totalCb < 0) {
            throw new Error('Pool constraint fail: Total Compliance Balance is negative');
        }
        // 3. Greedy Allocation
        // Sort by CB descending (Surplus first)
        complianceRecords.sort((a, b) => b.adjustedCb - a.adjustedCb);
        const poolMembers = [];
        let poolSurplus = 0;
        // Separate surplus and deficit ships
        const surplusShips = complianceRecords.filter(c => c.adjustedCb > 0);
        const deficitShips = complianceRecords.filter(c => c.adjustedCb < 0);
        // Calculate total surplus
        poolSurplus = surplusShips.reduce((sum, s) => sum + s.adjustedCb, 0);
        // Map initial states
        const shipStates = new Map();
        complianceRecords.forEach(c => {
            shipStates.set(c.shipId, { before: c.adjustedCb, after: c.adjustedCb });
        });
        // Distribute surplus to deficits
        for (const deficitShip of deficitShips) {
            const needed = Math.abs(deficitShip.adjustedCb);
            if (poolSurplus >= needed) {
                // Fully cover deficit
                const state = shipStates.get(deficitShip.shipId);
                state.after = 0; // Compliant
                poolSurplus -= needed;
            }
            else {
                // Partially cover
                const state = shipStates.get(deficitShip.shipId);
                state.after += poolSurplus;
                poolSurplus = 0;
            }
        }
        // Remaining surplus stays with surplus ships (proportionally or just leave as is?)
        // "Surplus ship cannot exit negative" - guaranteed if we only take what they have.
        // "Deficit ship cannot exit worse than before" - guaranteed as we add to them.
        // Logic: The surplus ships "gave" their surplus to the pool. 
        // If there is remaining surplus, who gets it? 
        // Usually it's shared or returned. 
        // For simplicity: If we covered all deficits, the remaining surplus is distributed back 
        // or we just say the pool has a total surplus.
        // Let's assume the pool entity holds the total sum, and individual ships are marked as 0 (compliant) 
        // if they were helped. Surplus ships might be reduced to 0 if they gave it all away?
        // Let's stick to: Deficits become 0 (if possible). Surplus ships reduce by what they gave.
        // Re-calculate 'after' for surplus ships based on what was used?
        // Actually, the prompt says "Greedy allocation... assign surplus to deficits".
        // It doesn't explicitly say how to decrement the surplus providers.
        // Let's assume a simple model: The pool acts as a single unit. 
        // But we need to record cb_after for each member.
        // Let's refine:
        // Total Pool CB = X.
        // If X >= 0, the pool is valid.
        // All members are technically compliant because they are in a valid pool.
        // So cb_after could be 0 for everyone, or we distribute the positive remainder?
        // Let's set cb_after to 0 for everyone if the pool is valid, 
        // OR distribute the remainder to the original surplus holders.
        // Let's go with: Everyone becomes 0, except maybe the leader?
        // Or better: Just record the final state. 
        // If the pool is valid, the penalty is 0.
        // Let's just store the 'before' and 'after' as calculated.
        // If we just want to show they are compliant, 'after' >= 0 is the goal.
        // Let's implement a simple distribution:
        // 1. Calculate total pool balance.
        // 2. If >= 0, then we can make everyone >= 0.
        //    We can just set everyone to 0 and leave the remainder in the pool object?
        //    Or distribute remainder.
        //    Let's just set cb_after = 0 for deficits.
        //    And reduce surplus ships proportionally?
        // Simplified Greedy:
        // Iterate deficits. Take from first surplus ship. If empty, next.
        let currentSurplusIdx = 0;
        for (const deficitShip of deficitShips) {
            let needed = Math.abs(deficitShip.adjustedCb);
            while (needed > 0 && currentSurplusIdx < surplusShips.length) {
                const provider = surplusShips[currentSurplusIdx];
                const providerState = shipStates.get(provider.shipId);
                const available = providerState.after; // Initially same as before
                if (available >= needed) {
                    providerState.after -= needed;
                    const receiverState = shipStates.get(deficitShip.shipId);
                    receiverState.after += needed; // Should become 0
                    needed = 0;
                }
                else {
                    // Take all available
                    providerState.after = 0;
                    const receiverState = shipStates.get(deficitShip.shipId);
                    receiverState.after += available;
                    needed -= available;
                    currentSurplusIdx++;
                }
            }
        }
        // Create Pool Members
        for (const shipId of members) {
            const state = shipStates.get(shipId);
            poolMembers.push(new Entities_1.PoolMember((0, uuid_1.v4)(), // ID
            '', // Pool ID (set later)
            shipId, state.before, state.after, new Date()));
        }
        const pool = new Entities_1.Pool((0, uuid_1.v4)(), `POOL-${new Date().getTime()}`, year, true, totalCb, new Date(), poolMembers);
        // Save Pool and Members
        return this.poolRepo.create(pool);
    }
    async getPools() {
        return this.poolRepo.findAll();
    }
}
exports.PoolUseCase = PoolUseCase;
