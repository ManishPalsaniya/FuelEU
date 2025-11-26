"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesController = void 0;
const express_1 = require("express");
class RoutesController {
    constructor(routeUseCase) {
        this.routeUseCase = routeUseCase;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.getAllRoutes.bind(this));
        this.router.post('/:routeId/baseline', this.setBaseline.bind(this));
        this.router.get('/comparison', this.getComparison.bind(this));
    }
    async getAllRoutes(req, res) {
        try {
            const filters = {
                vesselType: req.query.vesselType,
                fuelType: req.query.fuelType,
                year: req.query.year ? Number(req.query.year) : undefined
            };
            const routes = await this.routeUseCase.getAllRoutes(filters);
            res.json({ routes, total: routes.length });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async setBaseline(req, res) {
        try {
            const { routeId } = req.params;
            const route = await this.routeUseCase.setBaseline(routeId);
            res.json({ message: "Baseline set", route });
        }
        catch (error) {
            if (error.message === 'Route not found') {
                res.status(404).json({ error: error.message });
            }
            else if (error.message === 'Route is already baseline') {
                res.status(409).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
    async getComparison(req, res) {
        try {
            const result = await this.routeUseCase.getComparison();
            res.json(result);
        }
        catch (error) {
            if (error.message === 'No baseline set') {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}
exports.RoutesController = RoutesController;
