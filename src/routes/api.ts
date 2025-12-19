import Router from 'express';
import indexRouter from './index.js';
import authRouter from './auth.js';
const apiRouter = Router();

apiRouter.use('/', indexRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
