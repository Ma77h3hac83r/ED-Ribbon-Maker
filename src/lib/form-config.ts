import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormProps, FieldValues, Path } from 'react-hook-form';
import { z } from 'zod';
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  changePasswordSchema,
  inaraApiKeySchema,
  inaraCommanderSearchSchema,
  ribbonGenerationSchema,
  userPreferencesSchema,
  searchSchema,
} from './schemas';

// Type-safe form hook with Zod validation
export function useZodForm<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
) {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange', // Validate on change for better UX
    reValidateMode: 'onChange',
    ...options,
  });
}

// Pre-configured form hooks for common forms
export function useLoginForm() {
  return useZodForm(loginSchema, {
    defaultValues: {
      email: '',
      password: '',
    },
  });
}

export function useRegisterForm() {
  return useZodForm(registerSchema, {
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
}

export function useResetPasswordForm() {
  return useZodForm(resetPasswordSchema, {
    defaultValues: {
      email: '',
    },
  });
}

export function useChangePasswordForm() {
  return useZodForm(changePasswordSchema, {
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
}

export function useInaraApiKeyForm() {
  return useZodForm(inaraApiKeySchema, {
    defaultValues: {
      apiKey: '',
    },
  });
}

export function useCommanderSearchForm() {
  return useZodForm(inaraCommanderSearchSchema, {
    defaultValues: {
      commanderName: '',
    },
  });
}

export function useRibbonGenerationForm() {
  return useZodForm(ribbonGenerationSchema, {
    defaultValues: {
      commanderId: '',
      layout: {
        arrangement: 'horizontal',
        spacing: 10,
        showLabels: true,
        showDescriptions: false,
        maxRibbonsPerRow: 5,
      },
      selectedRibbons: [],
      exportFormat: 'svg',
    },
  });
}

export function useUserPreferencesForm() {
  return useZodForm(userPreferencesSchema, {
    defaultValues: {
      ribbonLayout: {
        arrangement: 'horizontal',
        spacing: 10,
        showLabels: true,
        showDescriptions: false,
        maxRibbonsPerRow: 5,
      },
      displayOptions: {
        theme: 'auto',
        showRibbonNames: true,
        showRibbonDescriptions: false,
        autoSync: true,
        syncInterval: 6,
      },
      notifications: {
        emailNotifications: false,
        syncNotifications: true,
        achievementNotifications: true,
      },
    },
  });
}

export function useSearchForm() {
  return useZodForm(searchSchema, {
    defaultValues: {
      query: '',
      filters: {
        ribbonTypes: [],
        minLevel: undefined,
        maxLevel: undefined,
      },
      sortBy: 'name',
      sortOrder: 'asc',
    },
  });
}

// Utility functions for form handling
export const formUtils = {
  // Get field error message
  getFieldError: (errors: any, fieldName: string): string | undefined => {
    const field = fieldName.split('.');
    let error = errors;

    for (const key of field) {
      error = error?.[key];
    }

    return error?.message;
  },

  // Check if field has error
  hasFieldError: (errors: any, fieldName: string): boolean => {
    return !!formUtils.getFieldError(errors, fieldName);
  },

  // Get all error messages
  getAllErrors: (errors: any): string[] => {
    const errorMessages: string[] = [];

    const extractErrors = (obj: any, prefix = '') => {
      for (const key in obj) {
        if (obj[key]?.message) {
          errorMessages.push(obj[key].message);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          extractErrors(obj[key], `${prefix}${key}.`);
        }
      }
    };

    extractErrors(errors);
    return errorMessages;
  },

  // Validate form data against schema
  validateFormData: <T>(schema: z.ZodSchema<T>, data: unknown) => {
    return schema.safeParse(data);
  },

  // Transform form data (e.g., for API calls)
  transformFormData: <T>(data: T): T => {
    // Remove empty strings and convert to null/undefined
    const transform = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(transform);
      }

      if (obj && typeof obj === 'object') {
        const transformed: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value === '') {
            transformed[key] = undefined;
          } else if (value && typeof value === 'object') {
            transformed[key] = transform(value);
          } else {
            transformed[key] = value;
          }
        }
        return transformed;
      }

      return obj;
    };

    return transform(data);
  },
};

// Form field types for better TypeScript support
export type FormField<T extends FieldValues> = Path<T>;

// Error handling utilities
export const formErrorHandler = {
  // Handle form submission errors
  handleSubmitError: (error: any, setError: any) => {
    if (error?.response?.data?.errors) {
      // Handle API validation errors
      const apiErrors = error.response.data.errors;
      Object.keys(apiErrors).forEach((field) => {
        setError(field as any, {
          type: 'server',
          message: apiErrors[field],
        });
      });
    } else if (error?.message) {
      // Handle general errors
      console.error('Form submission error:', error.message);
    }
  },

  // Clear form errors
  clearErrors: (clearErrors: any) => {
    clearErrors();
  },

  // Focus on first error field
  focusFirstError: (errors: any, setFocus: any) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      setFocus(firstErrorField as any);
    }
  },
};

export default useZodForm;
