import type { ZodType, z } from 'zod';

export const validate = <Schema extends ZodType>(
  data: unknown,
  schema: Schema
): {
  error: string | null;
  value: z.infer<Schema> | null;
} => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      // error: result.error.errors[0].message,
      error: result.error.message,
      value: null
    };
  }

  return {
    error: null,
    value: result.data
  };
};
