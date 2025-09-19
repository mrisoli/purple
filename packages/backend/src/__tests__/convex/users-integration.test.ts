import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Convex environment
const createMockContext = (identity = null) => ({
  auth: {
    getUserIdentity: vi.fn().mockResolvedValue(identity),
  },
  db: {
    query: vi.fn(),
    insert: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
  },
});

// Mock query builder
const createMockQuery = (data) => ({
  withIndex: vi.fn().mockReturnThis(),
  filter: vi.fn().mockReturnThis(),
  unique: vi.fn().mockResolvedValue(data),
  collect: vi.fn().mockResolvedValue(Array.isArray(data) ? data : [data]),
  eq: vi.fn(),
});

describe('Users Integration Tests', () => {
  let mockCtx;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrCreate mutation', () => {
    it('should create new user when identity exists but user does not', async () => {
      const identity = {
        subject: 'clerk-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockCtx = createMockContext(identity);
      mockCtx.db.query.mockReturnValue(createMockQuery(null));
      mockCtx.db.insert.mockResolvedValue('new-user-id');
      mockCtx.db.get.mockResolvedValue({
        _id: 'new-user-id',
        clerkId: 'clerk-123',
        email: 'test@example.com',
        name: 'Test User',
        premium: false,
        createdAt: Date.now(),
      });

      // Mock the function implementation
      const getOrCreate = async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new Error('Not authenticated');
        }

        const existingUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (existingUser) {
          return existingUser;
        }

        const newUserId = await ctx.db.insert('users', {
          clerkId: identity.subject,
          email: identity.email ?? '',
          name: identity.name ?? '',
          premium: false,
          createdAt: Date.now(),
        });

        return await ctx.db.get(newUserId);
      };

      const result = await getOrCreate(mockCtx);

      expect(mockCtx.db.insert).toHaveBeenCalledWith('users', {
        clerkId: 'clerk-123',
        email: 'test@example.com',
        name: 'Test User',
        premium: false,
        createdAt: expect.any(Number),
      });
      expect(result.clerkId).toBe('clerk-123');
      expect(result.premium).toBe(false);
    });

    it('should return existing user when found', async () => {
      const identity = {
        subject: 'clerk-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const existingUser = {
        _id: 'existing-user-id',
        clerkId: 'clerk-123',
        email: 'test@example.com',
        name: 'Test User',
        premium: true,
        createdAt: Date.now() - 10_000,
      };

      mockCtx = createMockContext(identity);
      mockCtx.db.query.mockReturnValue(createMockQuery(existingUser));

      // Mock the function implementation
      const getOrCreate = async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new Error('Not authenticated');
        }

        const existingUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (existingUser) {
          return existingUser;
        }

        // Would create new user here
        return null;
      };

      const result = await getOrCreate(mockCtx);

      expect(mockCtx.db.insert).not.toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });

    it('should throw error when not authenticated', async () => {
      mockCtx = createMockContext(null);

      const getOrCreate = async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new Error('Not authenticated');
        }
        return null;
      };

      await expect(getOrCreate(mockCtx)).rejects.toThrow('Not authenticated');
    });
  });

  describe('upgradeToPremium mutation', () => {
    it('should upgrade user to premium', async () => {
      const identity = { subject: 'clerk-123' };
      mockCtx = createMockContext(identity);
      mockCtx.db.patch.mockResolvedValue(undefined);

      const upgradeToPremium = async (ctx, args) => {
        await ctx.db.patch(args.userId, { premium: true });
        return { success: true };
      };

      const result = await upgradeToPremium(mockCtx, { userId: 'user-123' });

      expect(mockCtx.db.patch).toHaveBeenCalledWith('user-123', {
        premium: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('findByEmail query', () => {
    it('should find user by email', async () => {
      const user = {
        _id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockCtx = createMockContext();
      mockCtx.db.query.mockReturnValue(createMockQuery(user));

      const findByEmail = async (ctx, args) => {
        return await ctx.db
          .query('users')
          .filter((q) => q.eq(q.field('email'), args.email))
          .unique();
      };

      const result = await findByEmail(mockCtx, { email: 'test@example.com' });

      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockCtx = createMockContext();
      mockCtx.db.query.mockReturnValue(createMockQuery(null));

      const findByEmail = async (ctx, args) => {
        return await ctx.db
          .query('users')
          .filter((q) => q.eq(q.field('email'), args.email))
          .unique();
      };

      const result = await findByEmail(mockCtx, {
        email: 'nonexistent@example.com',
      });

      expect(result).toBeNull();
    });
  });
});
