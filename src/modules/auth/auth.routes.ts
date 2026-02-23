import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshController
} from './auth.controller.js';
import { validateLoginBody } from './auth.validation.js';

const router = Router();

/**
 * @openapi
 * /v1/auth/login:
 *   post:
 *     operationId: login
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticates a user and sets access/refresh token cookies.
 *     security: []
 *     parameters:
 *      - in: query
 *        name: mode
 *        required: false
 *        schema:
 *          type: string
 *          enum: [json]
 *        description: Optional. Use `json` to return tokens in response body (for tooling/testing).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 1
 *                 example: YourP@ssword123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 username:
 *                   type: string
 *                   format: email
 *       400:
 *         description: Invalid login request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validateLoginBody, loginController);

/**
 * @openapi
 * /v1/auth/logout:
 *   post:
 *     operationId: logout
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     description: Invalidates refresh token and clears auth cookies.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: header
 *        name: X-Refresh-Token
 *        required: true
 *        schema:
 *          type: string
 *        description: Refresh token (JWT). Provide the refresh token returned by /logout.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', logoutController);

/**
 * @openapi
 * /v1/auth/refresh:
 *   post:
 *     operationId: refreshTokens
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Rotates tokens using refresh token cookie.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: header
 *        name: X-Refresh-Token
 *        required: true
 *        schema:
 *          type: string
 *        description: Refresh token (JWT). Provide the refresh token returned by /login.
 *     responses:
 *       200:
 *         description: Tokens refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tokens refreshed
 *       401:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', refreshController);

export default router;
