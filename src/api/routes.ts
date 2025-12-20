import { Router } from 'express';
import indexRouter from '../index/routes.js';
import authRouter from '../auth/routes.js';
const apiRouter = Router();

apiRouter.use('/', indexRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
