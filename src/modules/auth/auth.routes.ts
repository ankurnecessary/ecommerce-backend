import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshController
} from './auth.controller.js';

const router = Router();

router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshController);

export default router;
