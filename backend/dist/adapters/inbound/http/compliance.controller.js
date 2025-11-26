"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceController = void 0;
const express_1 = require("express");
class ComplianceController {
    constructor(complianceUseCase) {
        this.complianceUseCase = complianceUseCase;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/cb', this.getComplianceBalance.bind(this));
        this.router.get('/adjusted-cb', this.getAdjustedComplianceBalance.bind(this));
        this.router.get('/ships', this.getAllShips.bind(this));
    }
    async getComplianceBalance(req, res) {
        try {
            const shipId = req.query.shipId;
            const year = Number(req.query.year);
            if (!shipId || !year) {
                return res.status(400).json({ error: 'Missing shipId or year' });
            }
            const result = await this.complianceUseCase.calculateComplianceBalance(shipId, year);
            res.json(result);
        }
        catch (error) {
            if (error.message === 'Ship/Route not found') {
                res.status(404).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
    async getAdjustedComplianceBalance(req, res) {
        try {
            const shipId = req.query.shipId;
            const year = Number(req.query.year);
            if (!shipId || !year) {
                return res.status(400).json({ error: 'Missing shipId or year' });
            }
            const result = await this.complianceUseCase.getAdjustedComplianceBalance(shipId, year);
            res.json(result);
        }
        catch (error) {
            if (error.message === 'Ship/Route not found') {
                res.status(404).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
    async getAllShips(req, res) {
        try {
            const ships = await this.complianceUseCase.getAllShips();
            res.json({ ships });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ComplianceController = ComplianceController;
