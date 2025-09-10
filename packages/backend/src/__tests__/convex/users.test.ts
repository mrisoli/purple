import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ConvexTestingHelper } from 'convex/testing';
import { api } from '../../convex/_generated/api';
import schema from '../../convex/schema';

describe('Users Convex Functions', () => {
  let t: ConvexTestingHelper;

  beforeEach(async () => {
    t = new ConvexTestingHelper(schema);
    await t.run(async (ctx) => {
      // Clear any existing data
      const users = await ctx.db.query('users').collect();
      for (const user of users) {
        await ctx.db.delete(user._id);
      }
    });
  });

  describe('getOrCreate', () => {
    it('creates a new user when none exists', async () => {
      const mockIdentity = {
        subject: 'test-clerk-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = await t.mutation(api.users.getOrCreate, {}, { identity: mockIdentity });

      expect(result).toBeDefined();
      expect(result?.clerkId).toBe('test-clerk-id');
      expect(result?.email).toBe('test@example.com');
      expect(result?.name).toBe('Test User');
      expect(result?.premium).toBe(false);
    });

    it('returns existing user when one exists', async () => {
      const mockIdentity = {
        subject: 'test-clerk-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Create user first time
      const firstResult = await t.mutation(api.users.getOrCreate, {}, { identity: mockIdentity });
      
      // Call again - should return same user
      const secondResult = await t.mutation(api.users.getOrCreate, {}, { identity: mockIdentity });

      expect(firstResult?._id).toBe(secondResult?._id);
      expect(firstResult?.clerkId).toBe(secondResult?.clerkId);
    });

    it('throws error when not authenticated', async () => {
      await expect(
        t.mutation(api.users.getOrCreate, {})
      ).rejects.toThrow('Not authenticated');
    });
  });

  describe('current', () => {
    it('returns current user when authenticated', async () => {
      const mockIdentity = {
        subject: 'test-clerk-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Create user first
      await t.mutation(api.users.getOrCreate, {}, { identity: mockIdentity });

      // Query current user
      const result = await t.query(api.users.current, {}, { identity: mockIdentity });

      expect(result?.clerkId).toBe('test-clerk-id');
      expect(result?.email).toBe('test@example.com');
    });

    it('returns null when not authenticated', async () => {
      const result = await t.query(api.users.current, {});
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('finds user by email', async () => {
      const mockIdentity = {
        subject: 'test-clerk-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Create user
      await t.mutation(api.users.getOrCreate, {}, { identity: mockIdentity });

      // Find by email
      const result = await t.query(api.users.findByEmail, { email: 'test@example.com' });

      expect(result?.email).toBe('test@example.com');
      expect(result?.name).toBe('Test User');
    });

    it('returns null when user not found', async () => {
      const result = await t.query(api.users.findByEmail, { email: 'notfound@example.com' });
      expect(result).toBeNull();
    });
  });

  describe('upgradeToPremium', () => {
    it('upgrades user to premium', async () => {
      const mockIdentity = {
        subject: 'test-clerk-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Create user
      const user = await t.mutation(api.users.getOrCreate, {}, { identity: mockIdentity });
      expect(user?.premium).toBe(false);

      // Upgrade to premium
      const result = await t.mutation(api.users.upgradeToPremium, { userId: user!._id });
      expect(result.success).toBe(true);

      // Verify user is now premium
      const updatedUser = await t.query(api.users.current, {}, { identity: mockIdentity });
      expect(updatedUser?.premium).toBe(true);
    });
  });
});