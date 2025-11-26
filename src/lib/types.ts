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
  transactionType: 'bank' | 'apply';
  amountGco2eq: number;
  date: Date;
  balanceBefore?: number;
  balanceAfter?: number;
};

export type PoolCreationResult = {
  isCompliant: boolean;
  before: Ship[];
  after: Ship[];
  totalBefore: number;
  totalAfter: number;
};

export type PoolMember = {
  shipId: string;
  shipName: string;
  vesselType: string;
  cbBefore: number;
  cbAfter: number;
  impact: number;           // cbAfter - cbBefore (delta)
  selected: boolean;        // Checkbox state
  status: 'surplus' | 'deficit' | 'balanced';  // Classification
};

export type PoolSummary = {
  selectedShips: string[];
  totalSurplus: number;     // Sum of positive CBs
  totalDeficit: number;     // Sum of negative CBs
  netPoolBalance: number;   // totalSurplus + totalDeficit
  isValid: boolean;
  validationErrors: string[];
  memberCount: number;
};

export type PoolingValidation = {
  hasMinMembers: boolean;           // ≥ 2 members
  netBalancePositive: boolean;      // Sum(CB) ≥ 0
  noDeficitWorsened: boolean;       // Each deficit ship not worse
  noSurplusNegative: boolean;       // Each surplus ship ≥ 0
  allRulesMet: boolean;
};
