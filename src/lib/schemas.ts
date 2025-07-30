import { z } from 'zod';
import { commonSchemas } from './zod';

// Elite Dangerous Commander Schemas
export const commanderSchema = z.object({
  id: commonSchemas.id,
  name: commonSchemas.commanderName,
  inaraId: z.string().min(1, 'Inara ID is required'),
  rankCombat: z.number().min(0).max(8, 'Combat rank must be between 0 and 8'),
  rankTrade: z.number().min(0).max(8, 'Trade rank must be between 0 and 8'),
  rankExplorer: z
    .number()
    .min(0)
    .max(8, 'Explorer rank must be between 0 and 8'),
  rankExobiologist: z
    .number()
    .min(0)
    .max(8, 'Exobiologist rank must be between 0 and 8'),
  rankMercenary: z
    .number()
    .min(0)
    .max(8, 'Mercenary rank must be between 0 and 8'),
  rankFederal: z
    .number()
    .min(0)
    .max(14, 'Federal rank must be between 0 and 14'),
  rankImperial: z
    .number()
    .min(0)
    .max(14, 'Imperial rank must be between 0 and 14'),
  lastSync: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User Authentication Schemas
export const loginSchema = z.object({
  email: commonSchemas.email,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters'),
    email: commonSchemas.email,
    password: commonSchemas.password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = z.object({
  email: commonSchemas.email,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: commonSchemas.password,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  });

// Inara API Schemas
export const inaraApiKeySchema = z.object({
  apiKey: commonSchemas.inaraApiKey,
});

export const inaraCommanderSearchSchema = z.object({
  commanderName: commonSchemas.commanderName,
});

export const inaraSyncSchema = z.object({
  apiKey: commonSchemas.inaraApiKey,
  commanderName: commonSchemas.commanderName.optional(),
});

// Ribbon Generation Schemas
export const ribbonTypeSchema = z.enum([
  'combat',
  'explorer',
  'trader',
  'exobiologist',
  'mercenary',
  'federal',
  'imperial',
]);

export const ribbonSchema = z.object({
  id: commonSchemas.id,
  type: ribbonTypeSchema,
  level: z.number().min(1).max(8, 'Ribbon level must be between 1 and 8'),
  name: z.string().min(1, 'Ribbon name is required'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid background color format'),
});

export const ribbonLayoutSchema = z.object({
  arrangement: z.enum(['horizontal', 'vertical', 'grid']),
  spacing: z.number().min(0).max(50, 'Spacing must be between 0 and 50'),
  showLabels: z.boolean(),
  showDescriptions: z.boolean(),
  maxRibbonsPerRow: z
    .number()
    .min(1)
    .max(10, 'Max ribbons per row must be between 1 and 10'),
});

export const ribbonGenerationSchema = z.object({
  commanderId: commonSchemas.id,
  layout: ribbonLayoutSchema,
  selectedRibbons: z
    .array(ribbonSchema)
    .min(1, 'At least one ribbon must be selected'),
  exportFormat: z.enum(['svg', 'png']).default('svg'),
  exportSize: z
    .object({
      width: z
        .number()
        .min(100)
        .max(2000, 'Width must be between 100 and 2000'),
      height: z
        .number()
        .min(50)
        .max(1000, 'Height must be between 50 and 1000'),
    })
    .optional(),
});

// User Preferences Schemas
export const userPreferencesSchema = z.object({
  ribbonLayout: ribbonLayoutSchema,
  displayOptions: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    showRibbonNames: z.boolean().default(true),
    showRibbonDescriptions: z.boolean().default(false),
    autoSync: z.boolean().default(true),
    syncInterval: z
      .number()
      .min(1)
      .max(24, 'Sync interval must be between 1 and 24 hours')
      .default(6),
  }),
  notifications: z.object({
    emailNotifications: z.boolean().default(false),
    syncNotifications: z.boolean().default(true),
    achievementNotifications: z.boolean().default(true),
  }),
});

// API Response Schemas
export const apiResponseSchema = <T extends z.ZodSchema>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    timestamp: z.date(),
  });

export const paginatedResponseSchema = <T extends z.ZodSchema>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().positive(),
      limit: z.number().positive(),
      total: z.number().nonnegative(),
      totalPages: z.number().nonnegative(),
    }),
    timestamp: z.date(),
  });

// Error Response Schema
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.unknown()).optional(),
  timestamp: z.date(),
});

// File Upload Schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z
    .number()
    .positive()
    .default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z
    .array(z.string())
    .default(['image/svg+xml', 'image/png', 'image/jpeg']),
});

// Search and Filter Schemas
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query too long'),
  filters: z
    .object({
      ribbonTypes: z.array(ribbonTypeSchema).optional(),
      minLevel: z.number().min(1).max(8).optional(),
      maxLevel: z.number().min(1).max(8).optional(),
    })
    .optional(),
  sortBy: z.enum(['name', 'level', 'type', 'created']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Export types
export type Commander = z.infer<typeof commanderSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type InaraApiKeyInput = z.infer<typeof inaraApiKeySchema>;
export type InaraCommanderSearchInput = z.infer<
  typeof inaraCommanderSearchSchema
>;
export type InaraSyncInput = z.infer<typeof inaraSyncSchema>;
export type RibbonType = z.infer<typeof ribbonTypeSchema>;
export type Ribbon = z.infer<typeof ribbonSchema>;
export type RibbonLayout = z.infer<typeof ribbonLayoutSchema>;
export type RibbonGenerationInput = z.infer<typeof ribbonGenerationSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
