import { Router } from 'express';
import { login } from './controller.js';
import { validate } from '../shared/middlewares/validate.js';
import { loginInputSchema } from './model.js';
import { LOGIN_RATE_LIMITS } from '../config/constants.js';
import { createRateLimiter } from '../shared/middlewares/rate-limiter.js';

const router = Router();

// [x]: Add specific rate-limiter for auth routes
// [x]: Write test cases for rate limiter of /api/auth/login
// [x]: Write test case for validation implemented for auth request data validation
// [ ]: Check whether test command is working perfectly in github workflow.
// [x]: Update .env.example
// [x]: Create .env.test.example

export const authLimiter = createRateLimiter({
  windowMs: LOGIN_RATE_LIMITS.TIME_WINDOW,
  max: LOGIN_RATE_LIMITS.CONNECTIONS_PER_IP,
  message: LOGIN_RATE_LIMITS.MESSAGE
});
router.use(authLimiter);
// [x]: Remove Promise returned in function argument where a void return was expected.eslint@typescript-eslint/no-misused-promises while implementing global error handler
router.post('/login', validate(loginInputSchema), login);

export default router;
