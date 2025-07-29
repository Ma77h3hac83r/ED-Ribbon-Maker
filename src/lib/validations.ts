import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const inaraApiKeySchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
});

export const commanderNameSchema = z.object({
  commanderName: z.string().min(1, 'Commander name is required'),
});

export const ribbonLayoutSchema = z.object({
  arrangement: z.enum(['horizontal', 'vertical', 'grid']),
  spacing: z.number().min(0).max(50),
  showLabels: z.boolean(),
});

export const userPreferencesSchema = z.object({
  ribbonLayout: ribbonLayoutSchema,
  displayOptions: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    showRibbonNames: z.boolean(),
    showRibbonDescriptions: z.boolean(),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type InaraApiKeyInput = z.infer<typeof inaraApiKeySchema>;
export type CommanderNameInput = z.infer<typeof commanderNameSchema>;
export type RibbonLayoutInput = z.infer<typeof ribbonLayoutSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;