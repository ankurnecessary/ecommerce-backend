import { z } from 'zod';
import { REGEX, VALIDATION_MESSAGES } from '../config/constants.js';

export const loginInputSchema = z
  .object({
    username: z.string(),
    password: z.string()
  })
  .superRefine((data, ctx) => {
    const { username, password } = data;
    // [ ]: Add regex in constant.ts
    const isEmail = z.email().safeParse(username).success;
    const hasMinLength = password.length >= 8;
    const hasUpper = REGEX.UPPERCASE.test(password);
    const hasNumber = REGEX.NUMBER.test(password);
    const hasSpecial = REGEX.SPECIAL_CHAR.test(password);

    if (!isEmail || !hasMinLength || !hasUpper || !hasNumber || !hasSpecial) {
      ctx.addIssue({
        code: 'custom',
        message: VALIDATION_MESSAGES.INVALID_USERNAME_PASSWORD
      });
    }
  });
export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z.object({
  username: z.email({ message: VALIDATION_MESSAGES.INVALID_USERNAME_EMAIL }),
  password: z
    .string()
    .min(8, { message: VALIDATION_MESSAGES.INVALID_PASSWORD_LENGTH })
    .regex(REGEX.UPPERCASE, {
      message: VALIDATION_MESSAGES.INVALID_PASSWORD_UPPERCASE
    })
    .regex(REGEX.NUMBER, {
      message: VALIDATION_MESSAGES.INVALID_PASSWORD_NUMBER
    })
    .regex(REGEX.SPECIAL_CHAR, {
      message: VALIDATION_MESSAGES.INVALID_PASSWORD_SPECIAL_CHARACTER
    })
});
export type registerInput = z.infer<typeof loginInputSchema>;
