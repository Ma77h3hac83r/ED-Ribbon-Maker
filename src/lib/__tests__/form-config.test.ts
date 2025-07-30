import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useZodForm, formUtils, formErrorHandler } from '../form-config';
import { loginSchema, registerSchema } from '../schemas';

// Mock React Hook Form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

describe('React Hook Form Configuration', () => {
  describe('useZodForm Hook', () => {
    it('should create form with Zod resolver', () => {
      const mockUseForm = vi.fn();
      const { useForm } = require('react-hook-form');
      vi.mocked(useForm).mockImplementation(mockUseForm);

      renderHook(() => useZodForm(loginSchema));

      expect(mockUseForm).toHaveBeenCalledWith({
        resolver: expect.any(Object), // zodResolver
        mode: 'onChange',
        reValidateMode: 'onChange',
      });
    });

    it('should merge custom options with defaults', () => {
      const mockUseForm = vi.fn();
      const { useForm } = require('react-hook-form');
      vi.mocked(useForm).mockImplementation(mockUseForm);

      const customOptions = {
        mode: 'onBlur' as const,
        defaultValues: { email: 'test@example.com' },
      };

      renderHook(() => useZodForm(loginSchema, customOptions));

      expect(mockUseForm).toHaveBeenCalledWith({
        resolver: expect.any(Object),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { email: 'test@example.com' },
      });
    });
  });

  describe('Form Utilities', () => {
    describe('getFieldError', () => {
      it('should get error message for simple field', () => {
        const errors = {
          email: { message: 'Invalid email' },
        };

        const error = formUtils.getFieldError(errors, 'email');
        expect(error).toBe('Invalid email');
      });

      it('should get error message for nested field', () => {
        const errors = {
          layout: {
            spacing: { message: 'Spacing must be positive' },
          },
        };

        const error = formUtils.getFieldError(errors, 'layout.spacing');
        expect(error).toBe('Spacing must be positive');
      });

      it('should return undefined for non-existent field', () => {
        const errors = {
          email: { message: 'Invalid email' },
        };

        const error = formUtils.getFieldError(errors, 'password');
        expect(error).toBeUndefined();
      });
    });

    describe('hasFieldError', () => {
      it('should return true for field with error', () => {
        const errors = {
          email: { message: 'Invalid email' },
        };

        const hasError = formUtils.hasFieldError(errors, 'email');
        expect(hasError).toBe(true);
      });

      it('should return false for field without error', () => {
        const errors = {
          email: { message: 'Invalid email' },
        };

        const hasError = formUtils.hasFieldError(errors, 'password');
        expect(hasError).toBe(false);
      });
    });

    describe('getAllErrors', () => {
      it('should extract all error messages', () => {
        const errors = {
          email: { message: 'Invalid email' },
          password: { message: 'Password too short' },
          layout: {
            spacing: { message: 'Spacing must be positive' },
          },
        };

        const allErrors = formUtils.getAllErrors(errors);
        expect(allErrors).toEqual([
          'Invalid email',
          'Password too short',
          'Spacing must be positive',
        ]);
      });

      it('should return empty array for no errors', () => {
        const errors = {};

        const allErrors = formUtils.getAllErrors(errors);
        expect(allErrors).toEqual([]);
      });
    });

    describe('validateFormData', () => {
      it('should validate data against schema', () => {
        const validData = {
          email: 'test@example.com',
          password: 'password123',
        };

        const result = formUtils.validateFormData(loginSchema, validData);
        expect(result.success).toBe(true);
      });

      it('should return errors for invalid data', () => {
        const invalidData = {
          email: 'invalid-email',
          password: 'short',
        };

        const result = formUtils.validateFormData(loginSchema, invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.length).toBeGreaterThan(0);
        }
      });
    });

    describe('transformFormData', () => {
      it('should transform empty strings to undefined', () => {
        const data = {
          name: 'Test',
          email: '',
          description: 'Some description',
          optional: '',
        };

        const transformed = formUtils.transformFormData(data);
        expect(transformed).toEqual({
          name: 'Test',
          email: undefined,
          description: 'Some description',
          optional: undefined,
        });
      });

      it('should handle nested objects', () => {
        const data = {
          user: {
            name: 'Test',
            email: '',
          },
          settings: {
            theme: 'dark',
            notifications: '',
          },
        };

        const transformed = formUtils.transformFormData(data);
        expect(transformed).toEqual({
          user: {
            name: 'Test',
            email: undefined,
          },
          settings: {
            theme: 'dark',
            notifications: undefined,
          },
        });
      });

      it('should handle arrays', () => {
        const data = {
          tags: ['tag1', '', 'tag3'],
          items: [
            { name: 'Item 1', description: '' },
            { name: 'Item 2', description: 'Description' },
          ],
        };

        const transformed = formUtils.transformFormData(data);
        expect(transformed).toEqual({
          tags: ['tag1', undefined, 'tag3'],
          items: [
            { name: 'Item 1', description: undefined },
            { name: 'Item 2', description: 'Description' },
          ],
        });
      });
    });
  });

  describe('Form Error Handler', () => {
    describe('handleSubmitError', () => {
      it('should handle API validation errors', () => {
        const mockSetError = vi.fn();
        const error = {
          response: {
            data: {
              errors: {
                email: 'Email already exists',
                password: 'Password too weak',
              },
            },
          },
        };

        formErrorHandler.handleSubmitError(error, mockSetError);

        expect(mockSetError).toHaveBeenCalledWith('email', {
          type: 'server',
          message: 'Email already exists',
        });
        expect(mockSetError).toHaveBeenCalledWith('password', {
          type: 'server',
          message: 'Password too weak',
        });
      });

      it('should handle general errors', () => {
        const mockSetError = vi.fn();
        const consoleSpy = vi
          .spyOn(console, 'error')
          .mockImplementation(() => {});
        const error = {
          message: 'Network error',
        };

        formErrorHandler.handleSubmitError(error, mockSetError);

        expect(consoleSpy).toHaveBeenCalledWith(
          'Form submission error:',
          'Network error'
        );
        expect(mockSetError).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
      });
    });

    describe('clearErrors', () => {
      it('should call clearErrors function', () => {
        const mockClearErrors = vi.fn();

        formErrorHandler.clearErrors(mockClearErrors);

        expect(mockClearErrors).toHaveBeenCalled();
      });
    });

    describe('focusFirstError', () => {
      it('should focus on first error field', () => {
        const mockSetFocus = vi.fn();
        const errors = {
          password: { message: 'Password too short' },
          email: { message: 'Invalid email' },
        };

        formErrorHandler.focusFirstError(errors, mockSetFocus);

        expect(mockSetFocus).toHaveBeenCalledWith('password');
      });

      it('should not call setFocus if no errors', () => {
        const mockSetFocus = vi.fn();
        const errors = {};

        formErrorHandler.focusFirstError(errors, mockSetFocus);

        expect(mockSetFocus).not.toHaveBeenCalled();
      });
    });
  });
});
