"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolsController = void 0;
const express_1 = require("express");
class PoolsController {
    constructor(poolUseCase) {
        this.poolUseCase = poolUseCase;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.getPools.bind(this));
        this.router.post('/', this.createPool.bind(this));
    }
    async getPools(req, res) {
        try {
            const pools = await this.poolUseCase.getPools();
            res.json({ pools });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createPool(req, res) {
        try {
            const { members, year } = req.body;
            const pool = await this.poolUseCase.createPool(members, year);
            res.json(pool);
        }
        catch (error) {
            if (error.message.includes('Pool constraint fail')) {
                res.status(409).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}
exports.PoolsController = PoolsController;
