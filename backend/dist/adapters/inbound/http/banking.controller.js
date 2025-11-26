"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingController = void 0;
const express_1 = require("express");
class BankingController {
    constructor(bankingUseCase) {
        this.bankingUseCase = bankingUseCase;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/records', this.getBankingRecords.bind(this));
        this.router.post('/bank', this.bankSurplus.bind(this));
        this.router.post('/apply', this.applySurplus.bind(this));
    }
    async getBankingRecords(req, res) {
        try {
            const shipId = req.query.shipId;
            const year = Number(req.query.year);
            if (!shipId || !year) {
                return res.status(400).json({ error: 'Missing shipId or year' });
            }
            const records = await this.bankingUseCase.getBankingRecords(shipId, year);
            const totalBanked = await this.bankingUseCase.getTotalBanked(shipId);
            res.json({ records, totalBanked });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async bankSurplus(req, res) {
        try {
            const { shipId, year, amount } = req.body;
            const result = await this.bankingUseCase.bankSurplus(shipId, year, amount);
            res.json(result);
        }
        catch (error) {
            if (error.message === 'Insufficient Compliance Balance to bank') {
                res.status(409).json({ error: error.message });
            }
            else if (error.message === 'Amount must be positive') {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
    async applySurplus(req, res) {
        try {
            const { shipId, year, amount } = req.body;
            const result = await this.bankingUseCase.applySurplus(shipId, year, amount);
            res.json(result);
        }
        catch (error) {
            if (error.message === 'Insufficient banked surplus') {
                res.status(400).json({ error: error.message });
            }
            else if (error.message === 'Amount must be positive') {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}
exports.BankingController = BankingController;
