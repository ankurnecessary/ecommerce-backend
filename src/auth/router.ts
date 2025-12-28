import { Router } from 'express';
import { login } from './controller.js';
import { validate } from '../shared/middlewares/validate.js';
import { loginInputSchema } from './model.js';
import { LOGIN_RATE_LIMITS } from '../config/constants.js';
import { createRateLimiter } from '../shared/middlewares/rate-limiter.js';

const router = Router();

// [x]: Add specific rate-limiter for auth routes
// [x]: Write test case for validation implemented for auth request data validation

export const authLimiter = createRateLimiter({
  windowMs: LOGIN_RATE_LIMITS.TIME_WINDOW,
  max: LOGIN_RATE_LIMITS.CONNECTIONS_PER_IP,
  message: LOGIN_RATE_LIMITS.MESSAGE
});
router.use(authLimiter);
router.post('/login', validate(loginInputSchema), login);

export default router;
