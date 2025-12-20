import { z } from 'zod';

export const loginInputSchema = z.object({
  username: z.email({ message: 'Username should be a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter'
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one number'
    })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character'
    })
});
export type LoginInput = z.infer<typeof loginInputSchema>;
