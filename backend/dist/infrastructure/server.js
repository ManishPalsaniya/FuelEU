"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const RouteRepository_impl_1 = require("../adapters/outbound/postgres/RouteRepository.impl");
const ComplianceRepository_impl_1 = require("../adapters/outbound/postgres/ComplianceRepository.impl");
const BankingRepository_impl_1 = require("../adapters/outbound/postgres/BankingRepository.impl");
const PoolRepository_impl_1 = require("../adapters/outbound/postgres/PoolRepository.impl");
const RouteUseCase_1 = require("../core/application/RouteUseCase");
const ComplianceUseCase_1 = require("../core/application/ComplianceUseCase");
const BankingUseCase_1 = require("../core/application/BankingUseCase");
const PoolUseCase_1 = require("../core/application/PoolUseCase");
const routes_controller_1 = require("../adapters/inbound/http/routes.controller");
const compliance_controller_1 = require("../adapters/inbound/http/compliance.controller");
const banking_controller_1 = require("../adapters/inbound/http/banking.controller");
const pools_controller_1 = require("../adapters/inbound/http/pools.controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Repositories
const routeRepo = new RouteRepository_impl_1.PrismaRouteRepository(prisma);
const complianceRepo = new ComplianceRepository_impl_1.PrismaComplianceRepository(prisma);
const bankingRepo = new BankingRepository_impl_1.PrismaBankingRepository(prisma);
const poolRepo = new PoolRepository_impl_1.PrismaPoolRepository(prisma);
// Use Cases
const routeUseCase = new RouteUseCase_1.RouteUseCase(routeRepo);
const complianceUseCase = new ComplianceUseCase_1.ComplianceUseCase(complianceRepo, routeRepo, bankingRepo);
const bankingUseCase = new BankingUseCase_1.BankingUseCase(bankingRepo, complianceRepo);
const poolUseCase = new PoolUseCase_1.PoolUseCase(poolRepo, complianceRepo);
// Controllers
const routesController = new routes_controller_1.RoutesController(routeUseCase);
const complianceController = new compliance_controller_1.ComplianceController(complianceUseCase);
const bankingController = new banking_controller_1.BankingController(bankingUseCase);
const poolsController = new pools_controller_1.PoolsController(poolUseCase);
// Routes
app.use('/api/routes', routesController.router);
app.use('/api/compliance', complianceController.router);
app.use('/api/banking', bankingController.router);
app.use('/api/pools', poolsController.router);
// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
