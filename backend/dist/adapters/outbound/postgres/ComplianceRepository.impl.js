"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaComplianceRepository = void 0;
const Entities_1 = require("../../../core/domain/Entities");
class PrismaComplianceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByShipIdAndYear(shipId, year) {
        const record = await this.prisma.shipCompliance.findFirst({
            where: { ship_id: shipId, year: year }
        });
        return record ? this.toDomain(record) : null;
    }
    async findAllShips() {
        const records = await this.prisma.shipCompliance.findMany();
        return records.map((record) => this.toDomain(record));
    }
    async save(compliance) {
        const data = {
            ship_id: compliance.shipId,
            year: compliance.year,
            cb_gco2eq: compliance.cbGco2eq,
            cb_before_banking: compliance.cbBeforeBanking,
            adjusted_cb: compliance.adjustedCb
        };
        // Upsert based on ship_id + year? 
        // Prisma schema doesn't have a unique constraint on (ship_id, year) but it should.
        // Assuming we can find by ID if it exists, or findFirst.
        const existing = await this.prisma.shipCompliance.findFirst({
            where: { ship_id: compliance.shipId, year: compliance.year }
        });
        let saved;
        if (existing) {
            saved = await this.prisma.shipCompliance.update({
                where: { id: existing.id },
                data
            });
        }
        else {
            saved = await this.prisma.shipCompliance.create({ data });
        }
        return this.toDomain(saved);
    }
    toDomain(record) {
        return new Entities_1.ComplianceBalance(record.id, record.ship_id, record.year, Number(record.cb_gco2eq), Number(record.cb_before_banking), Number(record.adjusted_cb), record.created_at);
    }
}
exports.PrismaComplianceRepository = PrismaComplianceRepository;
