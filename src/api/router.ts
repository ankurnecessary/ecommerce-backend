import { Router } from 'express';
import indexRouter from '../index/router.js';
import authRouter from '../auth/router.js';
const apiRouter = Router();

apiRouter.use('/', indexRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
