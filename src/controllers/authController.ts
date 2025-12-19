import type { Request, Response } from 'express';

export const login = (req: Request, res: Response): void => {
  res.status(200).send('You are authenticated.\n');
};
