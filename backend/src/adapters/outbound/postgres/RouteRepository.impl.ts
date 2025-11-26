import { Route } from '../../../core/domain/Entities';
import { RouteRepository } from '../../../core/ports/Repositories';
import { PrismaClient } from '@prisma/client';

export class PrismaRouteRepository implements RouteRepository {
    constructor(private prisma: PrismaClient) { }

    async findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
        const where: any = {};
        if (filters?.vesselType) where.vessel_type = filters.vesselType;
        if (filters?.fuelType) where.fuel_type = filters.fuelType;
        if (filters?.year) where.year = filters.year;

        const routes = await this.prisma.route.findMany({ where });
        return routes.map(this.toDomain);
    }

    async findById(id: string): Promise<Route | null> {
        const route = await this.prisma.route.findUnique({ where: { id } });
        return route ? this.toDomain(route) : null;
    }

    async findByRouteId(routeId: string): Promise<Route | null> {
        const route = await this.prisma.route.findUnique({ where: { route_id: routeId } });
        return route ? this.toDomain(route) : null;
    }

    async findBaseline(): Promise<Route | null> {
        const route = await this.prisma.route.findFirst({ where: { is_baseline: true } });
        return route ? this.toDomain(route) : null;
    }

    async setBaseline(routeId: string): Promise<Route> {
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

    async create(route: Omit<Route, 'id' | 'createdAt'>): Promise<Route> {
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

    private toDomain(prismaRoute: any): Route {
        return new Route(
            prismaRoute.id,
            prismaRoute.route_id,
            prismaRoute.vessel_type,
            prismaRoute.fuel_type,
            prismaRoute.year,
            Number(prismaRoute.ghg_intensity),
            Number(prismaRoute.fuel_consumption),
            Number(prismaRoute.distance),
            Number(prismaRoute.total_emissions),
            prismaRoute.is_baseline,
            prismaRoute.created_at
        );
    }
}
