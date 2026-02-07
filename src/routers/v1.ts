import { Router } from 'express';
import type { Request, Response } from 'express';
import authRouter from '@/modules/auth/auth.routes.js';

const router = Router();

// curl http://localhost:5000/api/v1
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to ecommerce APIs V1!' });
});
router.use('/auth', authRouter);
export default router;
