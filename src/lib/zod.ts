import { z } from 'zod';

// Custom error messages for better UX
export const customErrorMap: z.ZodErrorMap = (error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.invalid_type:
      if (error.received === 'undefined' || error.received === 'null') {
        return { message: 'This field is required' };
      }
      return {
        message: `Expected ${error.expected}, received ${error.received}`,
      };
    case z.ZodIssueCode.invalid_string:
      if (error.validation === 'email') {
        return { message: 'Please enter a valid email address' };
      }
      if (error.validation === 'url') {
        return { message: 'Please enter a valid URL' };
      }
      break;
    case z.ZodIssueCode.too_small:
      if (error.type === 'string') {
        return { message: `Must be at least ${error.minimum} characters` };
      }
      if (error.type === 'number') {
        return { message: `Must be at least ${error.minimum}` };
      }
      break;
    case z.ZodIssueCode.too_big:
      if (error.type === 'string') {
        return { message: `Must be no more than ${error.maximum} characters` };
      }
      if (error.type === 'number') {
        return { message: `Must be no more than ${error.maximum}` };
      }
      break;
  }
  return { message: ctx.defaultError };
};

// Set the custom error map globally
z.setErrorMap(customErrorMap);

// Common validation patterns
export const patterns = {
  commanderName: /^[A-Za-z0-9_\-\s]+$/,
  inaraApiKey: /^[A-Za-z0-9]{32,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
} as const;

// Common validation schemas
export const commonSchemas = {
  id: z.string().uuid('Invalid ID format'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  commanderName: z
    .string()
    .min(1, 'Commander name is required')
    .max(50, 'Commander name must be less than 50 characters')
    .regex(
      patterns.commanderName,
      'Commander name contains invalid characters'
    ),
  inaraApiKey: z
    .string()
    .min(32, 'API key must be at least 32 characters')
    .regex(patterns.inaraApiKey, 'Invalid API key format'),
  url: z.string().url('Please enter a valid URL'),
  positiveNumber: z.number().positive('Must be a positive number'),
  nonNegativeNumber: z.number().nonnegative('Must be a non-negative number'),
  date: z.date().or(z.string().datetime()),
} as const;

// Utility functions for validation
export const validateWithZod = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors?.map((err) => err.message) || [
      'Validation failed',
    ],
  };
};

export const validatePartial = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: Partial<T> }
  | { success: false; errors: string[] } => {
  const partialSchema = schema.partial();
  const result = partialSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors?.map((err) => err.message) || [
      'Validation failed',
    ],
  };
};

// Type helpers
export type InferSchema<T extends z.ZodSchema> = z.infer<T>;
export type SchemaInput<T extends z.ZodSchema> = z.input<T>;
export type SchemaOutput<T extends z.ZodSchema> = z.output<T>;

export default z;
