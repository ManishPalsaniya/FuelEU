"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaBankingRepository = void 0;
const Entities_1 = require("../../../core/domain/Entities");
class PrismaBankingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByShipIdAndYear(shipId, year) {
        const records = await this.prisma.bankEntry.findMany({
            where: { ship_id: shipId, year: year }
        });
        return records.map(this.toDomain);
    }
    async create(record) {
        const created = await this.prisma.bankEntry.create({
            data: {
                ship_id: record.shipId,
                year: record.year,
                amount_gco2eq: record.amountGco2eq,
                transaction_type: record.transactionType
            }
        });
        return this.toDomain(created);
    }
    async getTotalBanked(shipId) {
        const records = await this.prisma.bankEntry.findMany({
            where: { ship_id: shipId }
        });
        // Sum: Banked - Applied
        return records.reduce((sum, rec) => {
            const amount = Number(rec.amount_gco2eq);
            if (rec.transaction_type === 'bank')
                return sum + amount;
            if (rec.transaction_type === 'apply')
                return sum - amount;
            return sum;
        }, 0);
    }
    toDomain(record) {
        return new Entities_1.BankingRecord(record.id, record.ship_id, record.year, Number(record.amount_gco2eq), record.transaction_type, record.date);
    }
}
exports.PrismaBankingRepository = PrismaBankingRepository;
