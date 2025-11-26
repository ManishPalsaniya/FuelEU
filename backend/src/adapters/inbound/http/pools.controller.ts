import { Request, Response, Router } from 'express';
import { PoolUseCase } from '../../../core/application/PoolUseCase';

export class PoolsController {
    public router: Router;

    constructor(private poolUseCase: PoolUseCase) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.getPools.bind(this));
        this.router.post('/', this.createPool.bind(this));
    }

    async getPools(req: Request, res: Response) {
        try {
            const pools = await this.poolUseCase.getPools();
            res.json({ pools });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async createPool(req: Request, res: Response) {
        try {
            const { members, year } = req.body;
            const pool = await this.poolUseCase.createPool(members, year);
            res.json(pool);
        } catch (error: any) {
            if (error.message.includes('Pool constraint fail')) {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}
