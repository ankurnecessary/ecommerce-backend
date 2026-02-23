import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { validateLoginBody } from '@/modules/auth/auth.validation.js';
import { HttpError } from '@/shared/errors/HttpError.js';
import { ERROR_CODES } from '@/shared/config/constants.js';

describe('validateLoginBody', () => {
  it('calls next for a valid login payload', () => {
    const req = {
      body: {
        username: 'user@example.com',
        password: 'password123'
      }
    } as Request;
    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    validateLoginBody(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('throws HttpError(400) for invalid email', () => {
    const req = {
      body: {
        username: 'not-an-email',
        password: 'password123'
      }
    } as Request;
    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    try {
      validateLoginBody(req, res, next);
      throw new Error('Expected validateLoginBody to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).statusCode).toBe(400);
      expect((error as HttpError).code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect((error as HttpError).message).toBe('Invalid email address');
      expect((error as HttpError).details).toBeDefined();
    }

    expect(next).not.toHaveBeenCalled();
  });

  it('throws HttpError(400) for missing password', () => {
    const req = {
      body: {
        username: 'user@example.com',
        password: ''
      }
    } as Request;
    const res = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    try {
      validateLoginBody(req, res, next);
      throw new Error('Expected validateLoginBody to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).statusCode).toBe(400);
      expect((error as HttpError).code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect((error as HttpError).message).toBe('Password is required');
      expect((error as HttpError).details).toBeDefined();
    }

    expect(next).not.toHaveBeenCalled();
  });
});
