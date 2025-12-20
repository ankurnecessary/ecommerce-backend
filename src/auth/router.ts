import { Router } from 'express';
import { login } from './controller.js';
const router = Router();

// [ ] Add specific rate-limiter for /login route
router.post('/login', login);

export default router;
