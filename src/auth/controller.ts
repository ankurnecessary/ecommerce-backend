import type { Request, Response } from 'express';
import { VALIDATION_MESSAGES } from '../config/constants.js';

// curl -i -X POST http://localhost:5000/api/auth/login
//  -H "Content-Type: application/json"
//  -d '{"username": "hello@test.com", "password": "Sec1@ret"}'
export const login = (req: Request, res: Response): void => {
  // [ ]: Don't forget to add the openAPI documentation
  // [x]: Put login input validator in it's own middleware and remove it from controller
  try {
    // Does combination of username and password exist in the database
    // ???

    // If everything goes fine
    res.status(200).json({
      message: VALIDATION_MESSAGES.LOGIN_SUCCESSFUL,
      data: {
        username: req.body.username
      }
    });
  } catch (err) {
    res.status(500).json({
      errors: [{ message: 'An unexpected error occurred' }]
    });
  }
};
