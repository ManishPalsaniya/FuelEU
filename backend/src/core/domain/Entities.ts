export class Route {
    constructor(
        public id: string,
        public routeId: string,
        public vesselType: string,
        public fuelType: string,
        public year: number,
        public ghgIntensity: number,
        public fuelConsumption: number,
        public distance: number,
        public totalEmissions: number,
        public isBaseline: boolean,
        public createdAt: Date
    ) { }
}

export class ComplianceBalance {
    constructor(
        public id: string,
        public shipId: string,
        public year: number,
        public cbGco2eq: number,
        public cbBeforeBanking: number,
        public adjustedCb: number,
        public createdAt: Date
    ) { }
}

export class BankingRecord {
    constructor(
        public id: string,
        public shipId: string,
        public year: number,
        public amountGco2eq: number,
        public transactionType: 'bank' | 'apply',
        public date: Date
    ) { }
}

export class Pool {
    constructor(
        public id: string,
        public poolId: string,
        public year: number,
        public isValid: boolean,
        public sumCb: number,
        public createdAt: Date,
        public members: PoolMember[] = []
    ) { }
}

export class PoolMember {
    constructor(
        public id: string,
        public poolId: string,
        public shipId: string,
        public cbBefore: number,
        public cbAfter: number,
        public createdAt: Date
    ) { }
}
