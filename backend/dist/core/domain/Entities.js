"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolMember = exports.Pool = exports.BankingRecord = exports.ComplianceBalance = exports.Route = void 0;
class Route {
    constructor(id, routeId, vesselType, fuelType, year, ghgIntensity, fuelConsumption, distance, totalEmissions, isBaseline, createdAt) {
        this.id = id;
        this.routeId = routeId;
        this.vesselType = vesselType;
        this.fuelType = fuelType;
        this.year = year;
        this.ghgIntensity = ghgIntensity;
        this.fuelConsumption = fuelConsumption;
        this.distance = distance;
        this.totalEmissions = totalEmissions;
        this.isBaseline = isBaseline;
        this.createdAt = createdAt;
    }
}
exports.Route = Route;
class ComplianceBalance {
    constructor(id, shipId, year, cbGco2eq, cbBeforeBanking, adjustedCb, createdAt) {
        this.id = id;
        this.shipId = shipId;
        this.year = year;
        this.cbGco2eq = cbGco2eq;
        this.cbBeforeBanking = cbBeforeBanking;
        this.adjustedCb = adjustedCb;
        this.createdAt = createdAt;
    }
}
exports.ComplianceBalance = ComplianceBalance;
class BankingRecord {
    constructor(id, shipId, year, amountGco2eq, transactionType, date) {
        this.id = id;
        this.shipId = shipId;
        this.year = year;
        this.amountGco2eq = amountGco2eq;
        this.transactionType = transactionType;
        this.date = date;
    }
}
exports.BankingRecord = BankingRecord;
class Pool {
    constructor(id, poolId, year, isValid, sumCb, createdAt, members = []) {
        this.id = id;
        this.poolId = poolId;
        this.year = year;
        this.isValid = isValid;
        this.sumCb = sumCb;
        this.createdAt = createdAt;
        this.members = members;
    }
}
exports.Pool = Pool;
class PoolMember {
    constructor(id, poolId, shipId, cbBefore, cbAfter, createdAt) {
        this.id = id;
        this.poolId = poolId;
        this.shipId = shipId;
        this.cbBefore = cbBefore;
        this.cbAfter = cbAfter;
        this.createdAt = createdAt;
    }
}
exports.PoolMember = PoolMember;
