"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaRouteRepository = void 0;
const Entities_1 = require("../../../core/domain/Entities");
class PrismaRouteRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.vesselType)
            where.vessel_type = filters.vesselType;
        if (filters?.fuelType)
            where.fuel_type = filters.fuelType;
        if (filters?.year)
            where.year = filters.year;
        const routes = await this.prisma.route.findMany({ where });
        return routes.map(this.toDomain);
    }
    async findById(id) {
        const route = await this.prisma.route.findUnique({ where: { id } });
        return route ? this.toDomain(route) : null;
    }
    async findByRouteId(routeId) {
        const route = await this.prisma.route.findUnique({ where: { route_id: routeId } });
        return route ? this.toDomain(route) : null;
    }
    async findBaseline() {
        const route = await this.prisma.route.findFirst({ where: { is_baseline: true } });
        return route ? this.toDomain(route) : null;
    }
    async setBaseline(routeId) {
        // Unset previous baseline if any (assuming single baseline)
        await this.prisma.route.updateMany({
            where: { is_baseline: true },
            data: { is_baseline: false }
        });
        const route = await this.prisma.route.update({
            where: { route_id: routeId },
            data: { is_baseline: true }
        });
        return this.toDomain(route);
    }
    async create(route) {
        const created = await this.prisma.route.create({
            data: {
                route_id: route.routeId,
                vessel_type: route.vesselType,
                fuel_type: route.fuelType,
                year: route.year,
                ghg_intensity: route.ghgIntensity,
                fuel_consumption: route.fuelConsumption,
                distance: route.distance,
                total_emissions: route.totalEmissions,
                is_baseline: route.isBaseline
            }
        });
        return this.toDomain(created);
    }
    toDomain(prismaRoute) {
        return new Entities_1.Route(prismaRoute.id, prismaRoute.route_id, prismaRoute.vessel_type, prismaRoute.fuel_type, prismaRoute.year, Number(prismaRoute.ghg_intensity), Number(prismaRoute.fuel_consumption), Number(prismaRoute.distance), Number(prismaRoute.total_emissions), prismaRoute.is_baseline, prismaRoute.created_at);
    }
}
exports.PrismaRouteRepository = PrismaRouteRepository;
