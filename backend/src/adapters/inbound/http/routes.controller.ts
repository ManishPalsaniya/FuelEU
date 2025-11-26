import { Request, Response, Router } from 'express';
import { RouteUseCase } from '../../../core/application/RouteUseCase';

export class RoutesController {
    public router: Router;

    constructor(private routeUseCase: RouteUseCase) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.getAllRoutes.bind(this));
        this.router.post('/:routeId/baseline', this.setBaseline.bind(this));
        this.router.get('/comparison', this.getComparison.bind(this));
    }

    async getAllRoutes(req: Request, res: Response) {
        try {
            const filters = {
                vesselType: req.query.vesselType as string,
                fuelType: req.query.fuelType as string,
                year: req.query.year ? Number(req.query.year) : undefined
            };
            const routes = await this.routeUseCase.getAllRoutes(filters);
            res.json({ routes, total: routes.length });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async setBaseline(req: Request, res: Response) {
        try {
            const { routeId } = req.params;
            const route = await this.routeUseCase.setBaseline(routeId);
            res.json({ message: "Baseline set", route });
        } catch (error: any) {
            if (error.message === 'Route not found') {
                res.status(404).json({ error: error.message });
            } else if (error.message === 'Route is already baseline') {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async getComparison(req: Request, res: Response) {
        try {
            const result = await this.routeUseCase.getComparison();
            res.json(result);
        } catch (error: any) {
            if (error.message === 'No baseline set') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}
