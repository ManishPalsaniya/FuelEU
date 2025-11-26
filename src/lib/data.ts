import { apiClient } from '@/lib/api-client';
import type { Route, Ship, BankingRecord } from '@/lib/types';

export async function getRoutes(filters?: { vesselType?: string, fuelType?: string, year?: string }): Promise<Route[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.vesselType && filters.vesselType !== 'all') params.append('vesselType', filters.vesselType);
    if (filters?.fuelType && filters.fuelType !== 'all') params.append('fuelType', filters.fuelType);
    if (filters?.year && filters.year !== 'all') params.append('year', filters.year);

    const response = await apiClient.get<{ routes: Route[] }>('/routes', { params });
    return response.data.routes;
  } catch (error) {
    console.error('Failed to fetch routes:', error);
    return [];
  }
}

export async function getRoute(routeId: string): Promise<Route | undefined> {
  try {
    // efficient enough for now given the small dataset
    const routes = await getRoutes();
    return routes.find(r => r.routeId === routeId);
  } catch (error) {
    console.error(`Failed to fetch route ${routeId}:`, error);
    return undefined;
  }
}

export async function getBaselineRoute(): Promise<Route | undefined> {
  try {
    const routes = await getRoutes();
    return routes.find(r => r.isBaseline);
  } catch (error) {
    console.error('Failed to fetch baseline route:', error);
    return undefined;
  }
}

export async function setBaseline(routeId: string): Promise<void> {
  try {
    await apiClient.post(`/routes/${routeId}/baseline`);
  } catch (error) {
    console.error(`Failed to set baseline for ${routeId}:`, error);
    throw error;
  }
}

export async function getShips(): Promise<Ship[]> {
  try {
    const response = await apiClient.get<{ ships: Ship[] }>('/compliance/ships');
    return response.data.ships;
  } catch (error) {
    console.error('Failed to fetch ships:', error);
    return [];
  }
}

export async function getShip(id: string): Promise<Ship | undefined> {
  try {
    const ships = await getShips();
    return ships.find(s => s.id === id);
  } catch (error) {
    console.error(`Failed to fetch ship ${id}:`, error);
    return undefined;
  }
}

export async function updateShipBalance(shipId: string, newBalance: number): Promise<void> {
  // No-op, state is managed by backend
}

export async function addBankingRecord(record: Omit<BankingRecord, 'id' | 'date'>): Promise<void> {
  // No-op
}

export async function getBankingRecords(shipId: string): Promise<{ records: BankingRecord[], totalBanked: number }> {
  try {
    const year = 2024; // Default year
    const response = await apiClient.get<{ records: BankingRecord[], totalBanked: number }>('/banking/records', { params: { shipId, year } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch banking records:', error);
    return { records: [], totalBanked: 0 };
  }
}
