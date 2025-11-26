import { BankingRecord } from '../../../core/domain/Entities';
import { BankingRepository } from '../../../core/ports/Repositories';
import { PrismaClient } from '@prisma/client';

export class PrismaBankingRepository implements BankingRepository {
    constructor(private prisma: PrismaClient) { }

    async findByShipIdAndYear(shipId: string, year: number): Promise<BankingRecord[]> {
        const records = await this.prisma.bankEntry.findMany({
            where: { ship_id: shipId, year: year }
        });
        return records.map(this.toDomain);
    }

    async create(record: Omit<BankingRecord, 'id' | 'date'>): Promise<BankingRecord> {
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

    async getTotalBanked(shipId: string): Promise<number> {
        const records = await this.prisma.bankEntry.findMany({
            where: { ship_id: shipId }
        });

        // Sum: Banked - Applied
        return records.reduce((sum: number, rec: any) => {
            const amount = Number(rec.amount_gco2eq);
            if (rec.transaction_type === 'bank') return sum + amount;
            if (rec.transaction_type === 'apply') return sum - amount;
            return sum;
        }, 0);
    }

    private toDomain(record: any): BankingRecord {
        return new BankingRecord(
            record.id,
            record.ship_id,
            record.year,
            Number(record.amount_gco2eq),
            record.transaction_type as 'bank' | 'apply',
            record.date
        );
    }
}
