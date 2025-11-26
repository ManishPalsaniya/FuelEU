
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import { PrismaRouteRepository } from '../adapters/outbound/postgres/RouteRepository.impl';
import { PrismaComplianceRepository } from '../adapters/outbound/postgres/ComplianceRepository.impl';
import { PrismaBankingRepository } from '../adapters/outbound/postgres/BankingRepository.impl';
import { PrismaPoolRepository } from '../adapters/outbound/postgres/PoolRepository.impl';

import { RouteUseCase } from '../core/application/RouteUseCase';
import { ComplianceUseCase } from '../core/application/ComplianceUseCase';
import { BankingUseCase } from '../core/application/BankingUseCase';
import { PoolUseCase } from '../core/application/PoolUseCase';

import { RoutesController } from '../adapters/inbound/http/routes.controller';
import { ComplianceController } from '../adapters/inbound/http/compliance.controller';
import { BankingController } from '../adapters/inbound/http/banking.controller';
import { PoolsController } from '../adapters/inbound/http/pools.controller';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Repositories
const routeRepo = new PrismaRouteRepository(prisma);
const complianceRepo = new PrismaComplianceRepository(prisma);
const bankingRepo = new PrismaBankingRepository(prisma);
const poolRepo = new PrismaPoolRepository(prisma);

// Use Cases
const routeUseCase = new RouteUseCase(routeRepo);
const complianceUseCase = new ComplianceUseCase(complianceRepo, routeRepo, bankingRepo);
const bankingUseCase = new BankingUseCase(bankingRepo, complianceRepo);
const poolUseCase = new PoolUseCase(poolRepo, complianceRepo);

// Controllers
const routesController = new RoutesController(routeUseCase);
const complianceController = new ComplianceController(complianceUseCase);
const bankingController = new BankingController(bankingUseCase);
const poolsController = new PoolsController(poolUseCase);

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
