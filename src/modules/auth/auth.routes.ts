import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshController
} from './auth.controller.js';
import { validateLoginBody } from './auth.validation.js';

const router = Router();

router.post('/login', validateLoginBody, loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshController);

export default router;
