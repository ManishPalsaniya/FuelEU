"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formulas = void 0;
class Formulas {
    static calculateEnergyInScope(fuelConsumptionTonnes) {
        return fuelConsumptionTonnes * this.ENERGY_DENSITY_MJ_PER_TONNE;
    }
    static calculateComplianceBalance(ghgIntensity, fuelConsumptionTonnes, targetIntensity = this.TARGET_INTENSITY_2025) {
        const energyInScope = this.calculateEnergyInScope(fuelConsumptionTonnes);
        // Formula: (Target - Actual) * Energy
        return (targetIntensity - ghgIntensity) * energyInScope;
    }
    static calculatePercentDifference(comparison, baseline) {
        if (baseline === 0)
            return 0;
        return ((comparison / baseline) - 1) * 100;
    }
    static isCompliant(ghgIntensity, targetIntensity = this.TARGET_INTENSITY_2025) {
        return ghgIntensity <= targetIntensity;
    }
}
exports.Formulas = Formulas;
Formulas.TARGET_INTENSITY_2025 = 89.3368;
Formulas.ENERGY_DENSITY_MJ_PER_TONNE = 41000;
