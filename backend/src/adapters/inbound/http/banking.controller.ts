import { Request, Response, Router } from 'express';
import { BankingUseCase } from '../../../core/application/BankingUseCase';

export class BankingController {
    public router: Router;

    constructor(private bankingUseCase: BankingUseCase) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/records', this.getBankingRecords.bind(this));
        this.router.post('/bank', this.bankSurplus.bind(this));
        this.router.post('/apply', this.applySurplus.bind(this));
    }

    async getBankingRecords(req: Request, res: Response) {
        try {
            const shipId = req.query.shipId as string;
            const year = Number(req.query.year);

            if (!shipId || !year) {
                return res.status(400).json({ error: 'Missing shipId or year' });
            }

            const records = await this.bankingUseCase.getBankingRecords(shipId, year);
            const totalBanked = await this.bankingUseCase.getTotalBanked(shipId);

            res.json({ records, totalBanked });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async bankSurplus(req: Request, res: Response) {
        try {
            const { shipId, year, amount } = req.body;
            const result = await this.bankingUseCase.bankSurplus(shipId, year, amount);
            res.json(result);
        } catch (error: any) {
            if (error.message === 'Insufficient Compliance Balance to bank') {
                res.status(409).json({ error: error.message });
            } else if (error.message === 'Amount must be positive') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async applySurplus(req: Request, res: Response) {
        try {
            const { shipId, year, amount } = req.body;
            const result = await this.bankingUseCase.applySurplus(shipId, year, amount);
            res.json(result);
        } catch (error: any) {
            if (error.message === 'Insufficient banked surplus') {
                res.status(400).json({ error: error.message });
            } else if (error.message === 'Amount must be positive') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}
