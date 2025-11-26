"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const routes = [
        {
            route_id: 'R001',
            vessel_type: 'Container',
            fuel_type: 'HFO',
            year: 2024,
            ghg_intensity: 91.0,
            fuel_consumption: 5000,
            distance: 12000,
            total_emissions: 4500,
            is_baseline: true,
        },
        {
            route_id: 'R002',
            vessel_type: 'BulkCarrier',
            fuel_type: 'LNG',
            year: 2024,
            ghg_intensity: 88.0,
            fuel_consumption: 4800,
            distance: 11500,
            total_emissions: 4200,
            is_baseline: false,
        },
        {
            route_id: 'R003',
            vessel_type: 'Tanker',
            fuel_type: 'MGO',
            year: 2024,
            ghg_intensity: 93.5,
            fuel_consumption: 5100,
            distance: 12500,
            total_emissions: 4700,
            is_baseline: false,
        },
        {
            route_id: 'R004',
            vessel_type: 'RoRo',
            fuel_type: 'HFO',
            year: 2025,
            ghg_intensity: 89.2,
            fuel_consumption: 4900,
            distance: 11800,
            total_emissions: 4300,
            is_baseline: false,
        },
        {
            route_id: 'R005',
            vessel_type: 'Container',
            fuel_type: 'LNG',
            year: 2025,
            ghg_intensity: 90.5,
            fuel_consumption: 4950,
            distance: 11900,
            total_emissions: 4400,
            is_baseline: false,
        },
    ];
    for (const route of routes) {
        await prisma.route.upsert({
            where: { route_id: route.route_id },
            update: {},
            create: route,
        });
        // Seed ShipCompliance for each route (assuming ship_id = route_id)
        const compliance = {
            ship_id: route.route_id,
            year: route.year,
            cb_gco2eq: route.ghg_intensity - 89.3, // Mock calculation: intensity - target
            cb_before_banking: route.ghg_intensity - 89.3,
            adjusted_cb: route.ghg_intensity - 89.3,
        };
        // Check if compliance exists to avoid duplicates if run multiple times (though upsert is better)
        // Since schema doesn't have unique constraint on ship_id+year, we use findFirst
        const existingCompliance = await prisma.shipCompliance.findFirst({
            where: { ship_id: compliance.ship_id, year: compliance.year }
        });
        if (!existingCompliance) {
            await prisma.shipCompliance.create({
                data: compliance
            });
        }
    }
    // Seed some banking records
    const bankEntries = [
        {
            ship_id: 'R001',
            year: 2024,
            amount_gco2eq: 10.5,
            transaction_type: 'bank',
        },
        {
            ship_id: 'R002',
            year: 2024,
            amount_gco2eq: 5.0,
            transaction_type: 'apply',
        }
    ];
    for (const entry of bankEntries) {
        // Just create, don't worry about duplicates for now as it's mock history
        // Or check count
        const count = await prisma.bankEntry.count({
            where: { ship_id: entry.ship_id, year: entry.year, transaction_type: entry.transaction_type }
        });
        if (count === 0) {
            await prisma.bankEntry.create({ data: entry });
        }
    }
    console.log('Seed data inserted');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
