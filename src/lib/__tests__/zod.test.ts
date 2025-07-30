import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateWithZod, validatePartial } from '../zod';
import {
  commanderSchema,
  loginSchema,
  registerSchema,
  ribbonSchema,
  ribbonGenerationSchema,
  inaraApiKeySchema,
} from '../schemas';

describe('Zod Configuration', () => {
  describe('Basic Validation', () => {
    it('should validate required fields', () => {
      const schema = z.object({
        name: z.string(),
        email: z.string().email(),
      });

      const result = schema.safeParse({});

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('should validate email format', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Commander Schema', () => {
    it('should validate a valid commander', () => {
      const validCommander = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Commander Test',
        inaraId: '12345',
        rankCombat: 5,
        rankTrade: 3,
        rankExplorer: 7,
        rankExobiologist: 2,
        rankMercenary: 4,
        rankFederal: 8,
        rankImperial: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = commanderSchema.safeParse(validCommander);
      expect(result.success).toBe(true);
    });

    it('should reject invalid commander name', () => {
      const invalidCommander = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Commander@Test!', // Invalid characters
        inaraId: '12345',
        rankCombat: 5,
        rankTrade: 3,
        rankExplorer: 7,
        rankExobiologist: 2,
        rankMercenary: 4,
        rankFederal: 8,
        rankImperial: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = commanderSchema.safeParse(invalidCommander);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('should reject invalid rank values', () => {
      const invalidCommander = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Commander Test',
        inaraId: '12345',
        rankCombat: 15, // Invalid rank
        rankTrade: 3,
        rankExplorer: 7,
        rankExobiologist: 2,
        rankMercenary: 4,
        rankFederal: 8,
        rankImperial: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = commanderSchema.safeParse(invalidCommander);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Authentication Schemas', () => {
    it('should validate valid login data', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should validate valid registration data', () => {
      const validRegister = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = registerSchema.safeParse(validRegister);
      expect(result.success).toBe(true);
    });

    it('should reject registration with mismatched passwords', () => {
      const invalidRegister = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
      };

      const result = registerSchema.safeParse(invalidRegister);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('should reject weak passwords', () => {
      const weakPassword = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
      };

      const result = registerSchema.safeParse(weakPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Ribbon Schemas', () => {
    it('should validate valid ribbon data', () => {
      const validRibbon = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'combat' as const,
        level: 5,
        name: 'Combat Elite',
        description: 'Elite combat rank',
        color: '#FF0000',
        backgroundColor: '#000000',
      };

      const result = ribbonSchema.safeParse(validRibbon);
      expect(result.success).toBe(true);
    });

    it('should reject invalid color format', () => {
      const invalidRibbon = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'combat' as const,
        level: 5,
        name: 'Combat Elite',
        description: 'Elite combat rank',
        color: 'red', // Invalid color format
        backgroundColor: '#000000',
      };

      const result = ribbonSchema.safeParse(invalidRibbon);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Inara API Schema', () => {
    it('should validate valid API key', () => {
      const validApiKey = {
        apiKey: '1234567890abcdef1234567890abcdef',
      };

      const result = inaraApiKeySchema.safeParse(validApiKey);
      expect(result.success).toBe(true);
    });

    it('should reject invalid API key format', () => {
      const invalidApiKey = {
        apiKey: 'short', // Too short
      };

      const result = inaraApiKeySchema.safeParse(invalidApiKey);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Utility Functions', () => {
    it('should validate data with validateWithZod', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = validateWithZod(loginSchema, validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should return errors with validateWithZod', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = validateWithZod(loginSchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('should validate partial data', () => {
      const partialData = {
        email: 'test@example.com',
        // password is missing
      };

      const result = validatePartial(loginSchema, partialData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ email: 'test@example.com' });
      }
    });
  });
});
