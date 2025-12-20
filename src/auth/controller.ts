import type { Request, Response } from 'express';
import { validate } from '../lib/validate.js';
import { loginInputSchema } from './model.js';
import type {
  ValidationErrorMessage,
  ZodErrorItem
} from '../types/validate.js';

// curl -i -X POST http://localhost:5000/api/auth/login
//  -H "Content-Type: application/json"
//  -d '{"username": "hellotest.com", "password": "Sec@ret"}'
export const login = (req: Request, res: Response): void => {
  // [ ]: Don't forget to add the openAPI documentation
  // [ ]: Write test case for validation implemented for auth request data validation
  try {
    const { error, value } = validate(req.body, loginInputSchema);

    // If there is an error with validation of data
    if (error !== null) {
      const errors: ValidationErrorMessage[] = JSON.parse(error).reduce(
        (acc: ValidationErrorMessage[], error: ZodErrorItem) => {
          acc.push({ message: error.message });
          return acc;
        },
        []
      );
      res.status(400).json({ errors });
      return;
    }

    // Does combination of username and password exist in the database
    // ???

    // If everything goes fine
    res.status(200).json({
      message: 'Your are authentic',
      data: {
        username: value?.username
      }
    });
  } catch (err) {
    res.status(500).json({
      errors: [{ message: 'An unexpected error occurred' }]
    });
  }
};
