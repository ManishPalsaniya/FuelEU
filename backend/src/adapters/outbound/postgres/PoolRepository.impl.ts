import { Pool, PoolMember } from '../../../core/domain/Entities';
import { PoolRepository } from '../../../core/ports/Repositories';
import { PrismaClient } from '@prisma/client';

export class PrismaPoolRepository implements PoolRepository {
    constructor(private prisma: PrismaClient) { }

    async create(pool: Pool): Promise<Pool> {
        // Transaction to create Pool and Members
        const created = await this.prisma.pool.create({
            data: {
                pool_id: pool.poolId,
                year: pool.year,
                is_valid: pool.isValid,
                sum_cb: pool.sumCb,
                members: {
                    create: pool.members.map(m => ({
                        ship_id: m.shipId,
                        cb_before: m.cbBefore,
                        cb_after: m.cbAfter
                    }))
                }
            },
            include: { members: true }
        });
        return this.toDomain(created);
    }

    async findAll(): Promise<Pool[]> {
        const pools = await this.prisma.pool.findMany({
            include: { members: true }
        });
        return pools.map(this.toDomain);
    }

    async findByPoolId(poolId: string): Promise<Pool | null> {
        const pool = await this.prisma.pool.findUnique({
            where: { pool_id: poolId },
            include: { members: true }
        });
        return pool ? this.toDomain(pool) : null;
    }

    private toDomain(record: any): Pool {
        const members = record.members.map((m: any) => new PoolMember(
            m.id,
            m.pool_id,
            m.ship_id,
            Number(m.cb_before),
            Number(m.cb_after),
            m.created_at
        ));

        return new Pool(
            record.id,
            record.pool_id,
            record.year,
            record.is_valid,
            Number(record.sum_cb),
            record.created_at,
            members
        );
    }
}
