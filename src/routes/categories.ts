import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/parents', (req: Request, res: Response) => {
  res.send([{ id: 'ldsjfd', name: 'Category1' }]);
});

export default router;
