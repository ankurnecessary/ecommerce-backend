import Router from 'express';
import indexRouter from './index.js';
const apiRouter = Router();

apiRouter.use('/', indexRouter);

export default apiRouter;
