"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingUseCase = void 0;
class BankingUseCase {
    constructor(bankingRepo, complianceRepo) {
        this.bankingRepo = bankingRepo;
        this.complianceRepo = complianceRepo;
    }
    async getBankingRecords(shipId, year) {
        return this.bankingRepo.findByShipIdAndYear(shipId, year);
    }
    async getTotalBanked(shipId) {
        return this.bankingRepo.getTotalBanked(shipId);
    }
    async bankSurplus(shipId, year, amount) {
        if (amount <= 0)
            throw new Error('Amount must be positive');
        const compliance = await this.complianceRepo.findByShipIdAndYear(shipId, year);
        if (!compliance)
            throw new Error('Compliance record not found');
        if (compliance.adjustedCb < amount) {
            throw new Error('Insufficient Compliance Balance to bank');
        }
        // Create Bank Record
        const record = await this.bankingRepo.create({
            shipId,
            year,
            amountGco2eq: amount,
            transactionType: 'bank'
        });
        // Update Compliance (Adjusted CB decreases)
        compliance.adjustedCb -= amount;
        await this.complianceRepo.save(compliance);
        return {
            message: "Surplus banked",
            cbBefore: compliance.adjustedCb + amount,
            applied: amount,
            cbAfter: compliance.adjustedCb
        };
    }
    async applySurplus(shipId, year, amount) {
        if (amount <= 0)
            throw new Error('Amount must be positive');
        // Check total banked available (from previous years?)
        // For simplicity, let's assume we track a "Banked Balance" or sum all 'bank' - 'apply'
        // The prompt says "amount <= availableBanked".
        const totalBanked = await this.bankingRepo.getTotalBanked(shipId);
        if (totalBanked < amount) {
            throw new Error('Insufficient banked surplus');
        }
        const compliance = await this.complianceRepo.findByShipIdAndYear(shipId, year);
        if (!compliance)
            throw new Error('Compliance record not found');
        // Create Apply Record
        await this.bankingRepo.create({
            shipId,
            year,
            amountGco2eq: amount,
            transactionType: 'apply'
        });
        // Update Compliance (Adjusted CB increases)
        compliance.adjustedCb += amount;
        await this.complianceRepo.save(compliance);
        return {
            message: "Banked surplus applied",
            cbBefore: compliance.adjustedCb - amount,
            applied: amount,
            cbAfter: compliance.adjustedCb
        };
    }
}
exports.BankingUseCase = BankingUseCase;
