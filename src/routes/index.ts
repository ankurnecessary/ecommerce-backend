import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// curl http://localhost:5000/api
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to ecommerce APIs!' });
});
export default router;
