"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteUseCase = void 0;
const Formulas_1 = require("../domain/Formulas");
class RouteUseCase {
    constructor(routeRepo) {
        this.routeRepo = routeRepo;
    }
    async getAllRoutes(filters) {
        return this.routeRepo.findAll(filters);
    }
    async setBaseline(routeId) {
        const route = await this.routeRepo.findByRouteId(routeId);
        if (!route) {
            throw new Error('Route not found');
        }
        // Check if baseline already exists? 
        // Requirement says: "5 routes with one baseline". 
        // If we want to enforce single baseline, we might need to unset others or check.
        // For now, just set this one.
        if (route.isBaseline) {
            throw new Error('Route is already baseline');
        }
        return this.routeRepo.setBaseline(routeId);
    }
    async getComparison() {
        const baseline = await this.routeRepo.findBaseline();
        if (!baseline) {
            throw new Error('No baseline set');
        }
        const allRoutes = await this.routeRepo.findAll();
        const comparisons = allRoutes
            .filter(r => r.id !== baseline.id) // Compare against others
            .map(route => {
            const percentDiff = Formulas_1.Formulas.calculatePercentDifference(route.ghgIntensity, baseline.ghgIntensity);
            const compliant = Formulas_1.Formulas.isCompliant(route.ghgIntensity);
            return {
                routeId: route.routeId,
                baselineGhgIntensity: baseline.ghgIntensity,
                comparisonGhgIntensity: route.ghgIntensity,
                percentDifference: percentDiff,
                compliant
            };
        });
        return {
            baseline,
            comparison: comparisons,
            target: Formulas_1.Formulas.TARGET_INTENSITY_2025
        };
    }
}
exports.RouteUseCase = RouteUseCase;
