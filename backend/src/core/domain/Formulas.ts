export class Formulas {
    static readonly TARGET_INTENSITY_2025 = 89.3368;
    static readonly ENERGY_DENSITY_MJ_PER_TONNE = 41000;

    static calculateEnergyInScope(fuelConsumptionTonnes: number): number {
        return fuelConsumptionTonnes * this.ENERGY_DENSITY_MJ_PER_TONNE;
    }

    static calculateComplianceBalance(
        ghgIntensity: number,
        fuelConsumptionTonnes: number,
        targetIntensity: number = this.TARGET_INTENSITY_2025
    ): number {
        const energyInScope = this.calculateEnergyInScope(fuelConsumptionTonnes);
        // Formula: (Target - Actual) * Energy
        return (targetIntensity - ghgIntensity) * energyInScope;
    }

    static calculatePercentDifference(comparison: number, baseline: number): number {
        if (baseline === 0) return 0;
        return ((comparison / baseline) - 1) * 100;
    }

    static isCompliant(ghgIntensity: number, targetIntensity: number = this.TARGET_INTENSITY_2025): boolean {
        return ghgIntensity <= targetIntensity;
    }
}
