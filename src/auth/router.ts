import { Router } from 'express';
import { login } from './controller.js';
import { validate } from '../shared/middlewares/validate.js';
import { loginInputSchema } from './model.js';
const router = Router();

// [ ] Add specific rate-limiter for /login route
router.post('/login', validate(loginInputSchema), login);

export default router;
