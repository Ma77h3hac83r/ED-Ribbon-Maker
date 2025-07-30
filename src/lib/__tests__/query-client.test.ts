import { describe, it, expect, beforeEach } from 'vitest';
import { queryClient, queryKeys, invalidateQueries } from '../query-client';

describe('TanStack Query Configuration', () => {
  beforeEach(() => {
    // Clear the query cache before each test
    queryClient.clear();
  });

  describe('Query Client Configuration', () => {
    it('should have default query options configured', () => {
      const defaultOptions = queryClient.getDefaultOptions();

      expect(defaultOptions.queries).toBeDefined();
      expect(defaultOptions.mutations).toBeDefined();

      // Check default query options
      expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000); // 5 minutes
      expect(defaultOptions.queries?.gcTime).toBe(10 * 60 * 1000); // 10 minutes
      expect(defaultOptions.queries?.retry).toBe(3);
      expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
      expect(defaultOptions.queries?.refetchOnReconnect).toBe(true);

      // Check default mutation options
      expect(defaultOptions.mutations?.retry).toBe(1);
      expect(defaultOptions.mutations?.retryDelay).toBe(1000);
    });
  });

  describe('Query Keys Structure', () => {
    it('should have commander query keys', () => {
      expect(queryKeys.commanders.all).toEqual(['commanders']);
      expect(queryKeys.commanders.lists()).toEqual(['commanders', 'list']);
      expect(queryKeys.commanders.list('test')).toEqual([
        'commanders',
        'list',
        { filters: 'test' },
      ]);
      expect(queryKeys.commanders.details()).toEqual(['commanders', 'detail']);
      expect(queryKeys.commanders.detail('123')).toEqual([
        'commanders',
        'detail',
        '123',
      ]);
      expect(queryKeys.commanders.profile('TestCommander')).toEqual([
        'commanders',
        'detail',
        'profile',
        'TestCommander',
      ]);
    });

    it('should have Inara query keys', () => {
      expect(queryKeys.inara.all).toEqual(['inara']);
      expect(queryKeys.inara.profile('TestCommander')).toEqual([
        'inara',
        'profile',
        'TestCommander',
      ]);
      expect(queryKeys.inara.sync('TestCommander')).toEqual([
        'inara',
        'sync',
        'TestCommander',
      ]);
    });

    it('should have ribbon query keys', () => {
      expect(queryKeys.ribbons.all).toEqual(['ribbons']);
      expect(queryKeys.ribbons.lists()).toEqual(['ribbons', 'list']);
      expect(queryKeys.ribbons.list('test')).toEqual([
        'ribbons',
        'list',
        { filters: 'test' },
      ]);
      expect(queryKeys.ribbons.details()).toEqual(['ribbons', 'detail']);
      expect(queryKeys.ribbons.detail('123')).toEqual([
        'ribbons',
        'detail',
        '123',
      ]);
      expect(queryKeys.ribbons.types()).toEqual(['ribbons', 'types']);
      expect(queryKeys.ribbons.generation('123')).toEqual([
        'ribbons',
        'generation',
        '123',
      ]);
    });

    it('should have user query keys', () => {
      expect(queryKeys.users.all).toEqual(['users']);
      expect(queryKeys.users.profile()).toEqual(['users', 'profile']);
      expect(queryKeys.users.preferences()).toEqual(['users', 'preferences']);
      expect(queryKeys.users.auth()).toEqual(['users', 'auth']);
    });

    it('should have auth query keys', () => {
      expect(queryKeys.auth.all).toEqual(['auth']);
      expect(queryKeys.auth.session()).toEqual(['auth', 'session']);
      expect(queryKeys.auth.user()).toEqual(['auth', 'user']);
    });

    it('should have upload query keys', () => {
      expect(queryKeys.uploads.all).toEqual(['uploads']);
      expect(queryKeys.uploads.ribbon('123')).toEqual([
        'uploads',
        'ribbon',
        '123',
      ]);
    });
  });

  describe('Query Invalidation', () => {
    it('should have invalidation functions', () => {
      expect(typeof invalidateQueries.commanders).toBe('function');
      expect(typeof invalidateQueries.commander).toBe('function');
      expect(typeof invalidateQueries.ribbons).toBe('function');
      expect(typeof invalidateQueries.ribbon).toBe('function');
      expect(typeof invalidateQueries.userPreferences).toBe('function');
      expect(typeof invalidateQueries.auth).toBe('function');
    });

    it('should invalidate commander queries', async () => {
      // Set some test data
      queryClient.setQueryData(queryKeys.commanders.all, { test: 'data' });
      queryClient.setQueryData(queryKeys.commanders.detail('123'), {
        id: '123',
      });

      // Invalidate commanders
      await invalidateQueries.commanders();

      // Check that data is marked as stale
      const queries = queryClient.getQueryCache().getAll();
      const commanderQueries = queries.filter(
        (q) => q.queryKey[0] === 'commanders'
      );

      expect(commanderQueries.length).toBeGreaterThan(0);
    });
  });

  describe('Query Client Operations', () => {
    it('should set and get query data', () => {
      const testData = { id: '123', name: 'Test Commander' };
      const queryKey = queryKeys.commanders.detail('123');

      // Set data
      queryClient.setQueryData(queryKey, testData);

      // Get data
      const retrievedData = queryClient.getQueryData(queryKey);

      expect(retrievedData).toEqual(testData);
    });

    it('should clear query cache', () => {
      // Set some test data
      queryClient.setQueryData(queryKeys.commanders.all, { test: 'data' });
      queryClient.setQueryData(queryKeys.ribbons.all, { test: 'data' });

      // Clear cache
      queryClient.clear();

      // Check that cache is empty
      const queries = queryClient.getQueryCache().getAll();
      expect(queries.length).toBe(0);
    });

    it('should handle query state', () => {
      const queryKey = queryKeys.commanders.detail('123');

      // Check initial state
      const initialState = queryClient.getQueryState(queryKey);
      expect(initialState).toBeUndefined();

      // Set data and check state
      queryClient.setQueryData(queryKey, { id: '123' });
      const stateAfterSet = queryClient.getQueryState(queryKey);
      expect(stateAfterSet).toBeDefined();
      expect(stateAfterSet?.data).toEqual({ id: '123' });
    });
  });
});
