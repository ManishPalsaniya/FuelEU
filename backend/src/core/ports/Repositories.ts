import { Route, ComplianceBalance, BankingRecord, Pool } from '../domain/Entities';

export interface RouteRepository {
    findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
    findById(id: string): Promise<Route | null>;
    findByRouteId(routeId: string): Promise<Route | null>;
    findBaseline(): Promise<Route | null>;
    setBaseline(routeId: string): Promise<Route>;
    create(route: Omit<Route, 'id' | 'createdAt'>): Promise<Route>;
}

export interface ComplianceRepository {
    findByShipIdAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
    findAllShips(): Promise<ComplianceBalance[]>;
    save(compliance: ComplianceBalance): Promise<ComplianceBalance>;
}

export interface BankingRepository {
    findByShipIdAndYear(shipId: string, year: number): Promise<BankingRecord[]>;
    create(record: Omit<BankingRecord, 'id' | 'date'>): Promise<BankingRecord>;
    getTotalBanked(shipId: string): Promise<number>;
}

export interface PoolRepository {
    create(pool: Pool): Promise<Pool>;
    findAll(): Promise<Pool[]>;
    findByPoolId(poolId: string): Promise<Pool | null>;
}
