import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send(`Welcome to ecomerce APIs on ${process.env.NODE_ENV} server!`);
});

export default router;
