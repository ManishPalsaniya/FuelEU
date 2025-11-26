import type { Route, Ship, BankingRecord, VesselType, FuelType } from '@/lib/types';

// In a real app, this would be a database.
// We'll use a mutable in-memory store for simulation.
let routes: Route[] = [
  { routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: false },
  { routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: true },
  { routeId: "R003", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700, isBaseline: false },
  { routeId: "R004", vesselType: "RoRo", fuelType: "HFO", year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300, isBaseline: false },
  { routeId: "R005", vesselType: "Container", fuelType: "LNG", year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400, isBaseline: false },
];

let ships: Ship[] = [
    { id: 'S001', name: 'The Endeavor', vesselType: 'Container', year: 2024, complianceBalance: 150 },
    { id: 'S002', name: 'The Pioneer', vesselType: 'BulkCarrier', year: 2024, complianceBalance: -50 },
    { id: 'S003', name: 'The Voyager', vesselType: 'Tanker', year: 2024, complianceBalance: -120 },
    { id: 'S004', name: 'The Nomad', vesselType: 'RoRo', year: 2025, complianceBalance: 200 },
    { id: 'S005', name: 'The Discovery', vesselType: 'Container', year: 2025, complianceBalance: -20 },
];

let bankingRecords: BankingRecord[] = [];

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getRoutes(filters?: { vesselType?: string, fuelType?: string, year?: string }): Promise<Route[]> {
  await delay(500);
  let filteredRoutes = [...routes];
  if (filters?.vesselType && filters.vesselType !== 'all') {
    filteredRoutes = filteredRoutes.filter(r => r.vesselType === filters.vesselType);
  }
  if (filters?.fuelType && filters.fuelType !== 'all') {
    filteredRoutes = filteredRoutes.filter(r => r.fuelType === filters.fuelType);
  }
  if (filters?.year && filters.year !== 'all') {
    filteredRoutes = filteredRoutes.filter(r => r.year === parseInt(filters.year!, 10));
  }
  return JSON.parse(JSON.stringify(filteredRoutes));
}

export async function getRoute(routeId: string): Promise<Route | undefined> {
    await delay(100);
    return JSON.parse(JSON.stringify(routes.find(r => r.routeId === routeId)));
}

export async function getBaselineRoute(): Promise<Route | undefined> {
    await delay(100);
    return JSON.parse(JSON.stringify(routes.find(r => r.isBaseline)));
}

export async function setBaseline(routeId: string): Promise<Route[]> {
  await delay(1000);
  routes = routes.map(r => ({ ...r, isBaseline: r.routeId === routeId }));
  return JSON.parse(JSON.stringify(routes));
}

export async function getShips(): Promise<Ship[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(ships));
}

export async function getShip(id: string): Promise<Ship | undefined> {
    await delay(100);
    return JSON.parse(JSON.stringify(ships.find(s => s.id === id)));
}

export async function updateShipBalance(shipId: string, newBalance: number): Promise<Ship | undefined> {
    await delay(800);
    const shipIndex = ships.findIndex(s => s.id === shipId);
    if (shipIndex !== -1) {
        ships[shipIndex].complianceBalance = newBalance;
        return JSON.parse(JSON.stringify(ships[shipIndex]));
    }
    return undefined;
}

export async function addBankingRecord(record: Omit<BankingRecord, 'id' | 'date'>): Promise<BankingRecord> {
    await delay(100);
    const newRecord: BankingRecord = {
        ...record,
        id: `BR${Date.now()}`,
        date: new Date(),
    };
    bankingRecords.push(newRecord);
    return JSON.parse(JSON.stringify(newRecord));
}

export async function getBankingRecords(shipId: string): Promise<BankingRecord[]> {
    await delay(400);
    return JSON.parse(JSON.stringify(bankingRecords.filter(r => r.shipId === shipId)));
}
