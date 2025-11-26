"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPoolRepository = void 0;
const Entities_1 = require("../../../core/domain/Entities");
class PrismaPoolRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(pool) {
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
    async findAll() {
        const pools = await this.prisma.pool.findMany({
            include: { members: true }
        });
        return pools.map(this.toDomain);
    }
    async findByPoolId(poolId) {
        const pool = await this.prisma.pool.findUnique({
            where: { pool_id: poolId },
            include: { members: true }
        });
        return pool ? this.toDomain(pool) : null;
    }
    toDomain(record) {
        const members = record.members.map((m) => new Entities_1.PoolMember(m.id, m.pool_id, m.ship_id, Number(m.cb_before), Number(m.cb_after), m.created_at));
        return new Entities_1.Pool(record.id, record.pool_id, record.year, record.is_valid, Number(record.sum_cb), record.created_at, members);
    }
}
exports.PrismaPoolRepository = PrismaPoolRepository;
