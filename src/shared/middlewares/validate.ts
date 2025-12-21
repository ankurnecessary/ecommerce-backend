import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export const validate =
  <Schema extends ZodType>(schema: Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((error) => error.message);
      return res.status(400).json({
        errors
      });
    }

    req.body = result.data;
    next();
  };
