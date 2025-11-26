import { Request, Response, Router } from 'express';
import { ComplianceUseCase } from '../../../core/application/ComplianceUseCase';

export class ComplianceController {
    public router: Router;

    constructor(private complianceUseCase: ComplianceUseCase) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/cb', this.getComplianceBalance.bind(this));
        this.router.get('/adjusted-cb', this.getAdjustedComplianceBalance.bind(this));
        this.router.get('/ships', this.getAllShips.bind(this));
    }

    async getComplianceBalance(req: Request, res: Response) {
        try {
            const shipId = req.query.shipId as string;
            const year = Number(req.query.year);

            if (!shipId || !year) {
                return res.status(400).json({ error: 'Missing shipId or year' });
            }

            const result = await this.complianceUseCase.calculateComplianceBalance(shipId, year);
            res.json(result);
        } catch (error: any) {
            if (error.message === 'Ship/Route not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async getAdjustedComplianceBalance(req: Request, res: Response) {
        try {
            const shipId = req.query.shipId as string;
            const year = Number(req.query.year);

            if (!shipId || !year) {
                return res.status(400).json({ error: 'Missing shipId or year' });
            }

            const result = await this.complianceUseCase.getAdjustedComplianceBalance(shipId, year);
            res.json(result);
        } catch (error: any) {
            if (error.message === 'Ship/Route not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async getAllShips(req: Request, res: Response) {
        try {
            const ships = await this.complianceUseCase.getAllShips();
            res.json({ ships });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
