import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { VALIDATION_MESSAGES } from '../config/constants.js';
import { prisma } from '../lib/prisma.js';

// curl -i -X POST http://localhost:5000/api/auth/login
//  -H "Content-Type: application/json"
//  -d '{"username": "hello@test.com", "password": "Sec1@ret"}'
export const login = async (req: Request, res: Response): Promise<void> => {
  // [ ]: Don't forget to add the openAPI documentation
  // [x]: Put login input validator in it's own middleware and remove it from controller
  // [ ]: Vim: Is there a way to scroll a page line by line without moving cursor.
  // [ ]: Update prisma's version
  try {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    // [ ]: Does combination of username and password exist in the database
    // [x]: TEST: If username is invalid
    // [x]: TEST: If combination of username and password is invalid
    // [x]: Rectify API's database connection to postgres DB docker container. Between 2 docker containers
    const user = await prisma.user.findFirst({
      where: {
        email: username
      }
    });
    if (user === null) {
      res.status(401).json({
        errors: [VALIDATION_MESSAGES.INVALID_USERNAME_PASSWORD]
      });
      return;
    }
    // Verify the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        errors: [VALIDATION_MESSAGES.INVALID_USERNAME_PASSWORD]
      });
      return;
    }

    // If everything goes fine
    res.status(200).json({
      message: VALIDATION_MESSAGES.LOGIN_SUCCESSFUL,
      data: {
        username
      }
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'An unknown error occurred';
    res.status(500).json({
      errors: [{ message: errorMessage }]
    });
  }
};
