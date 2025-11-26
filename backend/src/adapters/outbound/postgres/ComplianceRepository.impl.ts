import { ComplianceBalance } from '../../../core/domain/Entities';
import { ComplianceRepository } from '../../../core/ports/Repositories';
import { PrismaClient } from '@prisma/client';

export class PrismaComplianceRepository implements ComplianceRepository {
    constructor(private prisma: PrismaClient) { }

    async findByShipIdAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
        const record = await this.prisma.shipCompliance.findFirst({
            where: { ship_id: shipId, year: year }
        });
        return record ? this.toDomain(record) : null;
    }

    async findAllShips(): Promise<ComplianceBalance[]> {
        const records = await this.prisma.shipCompliance.findMany();
        return records.map((record: any) => this.toDomain(record));
    }

    async save(compliance: ComplianceBalance): Promise<ComplianceBalance> {
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
        } else {
            saved = await this.prisma.shipCompliance.create({ data });
        }

        return this.toDomain(saved);
    }

    private toDomain(record: any): ComplianceBalance {
        return new ComplianceBalance(
            record.id,
            record.ship_id,
            record.year,
            Number(record.cb_gco2eq),
            Number(record.cb_before_banking),
            Number(record.adjusted_cb),
            record.created_at
        );
    }
}
