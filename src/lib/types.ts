export type VesselType = "Container" | "BulkCarrier" | "Tanker" | "RoRo";
export type FuelType = "HFO" | "LNG" | "MGO";

export type Route = {
  routeId: string;
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
};

export type Ship = {
  id: string;
  name: string;
  vesselType: VesselType;
  year: number;
  complianceBalance: number;
  adjustedComplianceBalance?: number; // for pooling
};

export type BankingRecord = {
  id: string;
  shipId: string;
  year: number;
  type: 'bank' | 'apply';
  amount: number;
  date: Date;
  balanceBefore: number;
  balanceAfter: number;
};

export type PoolCreationResult = {
  isCompliant: boolean;
  before: Ship[];
  after: Ship[];
  totalBefore: number;
  totalAfter: number;
};
