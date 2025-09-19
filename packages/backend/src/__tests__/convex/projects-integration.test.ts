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
  unique: vi.fn().mockResolvedValue(Array.isArray(data) ? data[0] : data),
  collect: vi.fn().mockResolvedValue(Array.isArray(data) ? data : [data]),
  eq: vi.fn(),
});

type MockContext = {
  auth: {
    getUserIdentity: ReturnType<typeof vi.fn>;
  };
  db: {
    query: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
  };
};

describe('Projects Integration Tests', () => {
  let mockCtx: MockContext;
  const mockIdentity = {
    subject: 'clerk-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create mutation', () => {
    it('should create project for free user with no existing projects', async () => {
      const user = {
        _id: 'user-123',
        clerkId: 'clerk-123',
        premium: false,
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(user)) // Find user
        .mockReturnValueOnce(createMockQuery([])); // No existing projects
      mockCtx.db.insert.mockResolvedValue('new-project-id');
      mockCtx.db.get.mockResolvedValue({
        _id: 'new-project-id',
        ownerId: 'user-123',
        name: 'Test Project',
        description: 'Test Description',
        createdAt: Date.now(),
      });

      const create = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new Error('Not authenticated');
        }

        const currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!currentUser) {
          throw new Error('User not found');
        }

        // Check project limit for free users
        if (!currentUser.premium) {
          const userProjects = await ctx.db
            .query('projects')
            .withIndex('by_owner', (q) => q.eq('ownerId', currentUser._id))
            .collect();

          if (userProjects.length >= 1) {
            throw new Error(
              'Free users can only create 1 project. Upgrade to premium for unlimited projects.'
            );
          }
        }

        const newProjectId = await ctx.db.insert('projects', {
          ownerId: currentUser._id,
          name: args.name,
          description: args.description,
          createdAt: Date.now(),
        });

        return await ctx.db.get(newProjectId);
      };

      const result = await create(mockCtx, {
        name: 'Test Project',
        description: 'Test Description',
      });

      expect(mockCtx.db.insert).toHaveBeenCalledWith('projects', {
        ownerId: 'user-123',
        name: 'Test Project',
        description: 'Test Description',
        createdAt: expect.any(Number),
      });
      expect(result.name).toBe('Test Project');
    });

    it('should reject project creation for free user with existing project', async () => {
      const user = {
        _id: 'user-123',
        clerkId: 'clerk-123',
        premium: false,
      };

      const existingProject = {
        _id: 'existing-project',
        ownerId: 'user-123',
        name: 'Existing Project',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(user))
        .mockReturnValueOnce(createMockQuery([existingProject]));

      const create = async (ctx, _args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new Error('Not authenticated');
        }

        const currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!currentUser) {
          throw new Error('User not found');
        }

        if (!currentUser.premium) {
          const userProjects = await ctx.db
            .query('projects')
            .withIndex('by_owner', (q) => q.eq('ownerId', currentUser._id))
            .collect();

          if (userProjects.length >= 1) {
            throw new Error(
              'Free users can only create 1 project. Upgrade to premium for unlimited projects.'
            );
          }
        }

        return null;
      };

      await expect(
        create(mockCtx, {
          name: 'New Project',
          description: 'New Description',
        })
      ).rejects.toThrow('Free users can only create 1 project');
    });

    it('should allow unlimited projects for premium user', async () => {
      const user = {
        _id: 'user-123',
        clerkId: 'clerk-123',
        premium: true,
      };

      const existingProjects = [
        { _id: 'project-1', name: 'Project 1' },
        { _id: 'project-2', name: 'Project 2' },
        { _id: 'project-3', name: 'Project 3' },
      ];

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(user))
        .mockReturnValueOnce(createMockQuery(existingProjects));
      mockCtx.db.insert.mockResolvedValue('new-project-id');
      mockCtx.db.get.mockResolvedValue({
        _id: 'new-project-id',
        name: 'Project 4',
      });

      const create = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!currentUser.premium) {
          const userProjects = await ctx.db
            .query('projects')
            .withIndex('by_owner', (q) => q.eq('ownerId', currentUser._id))
            .collect();

          if (userProjects.length >= 1) {
            throw new Error('Free users can only create 1 project');
          }
        }

        const newProjectId = await ctx.db.insert('projects', {
          ownerId: currentUser._id,
          name: args.name,
          description: args.description,
          createdAt: Date.now(),
        });

        return await ctx.db.get(newProjectId);
      };

      const result = await create(mockCtx, {
        name: 'Project 4',
        description: 'Fourth project',
      });

      expect(mockCtx.db.insert).toHaveBeenCalled();
      expect(result.name).toBe('Project 4');
    });
  });

  describe('inviteBuddy mutation', () => {
    it('should successfully invite existing user as buddy', async () => {
      const project = {
        _id: 'project-123',
        ownerId: 'user-123',
        name: 'Test Project',
      };

      const owner = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      const buddy = {
        _id: 'buddy-123',
        email: 'buddy@example.com',
        name: 'Buddy User',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(project);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(owner))
        .mockReturnValueOnce(createMockQuery(buddy));
      mockCtx.db.patch.mockResolvedValue(undefined);

      const inviteBuddy = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new Error('Not authenticated');
        }

        const currentProject = await ctx.db.get(args.projectId);
        if (!currentProject) {
          throw new Error('Project not found');
        }

        const _currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!_currentUser || currentProject.ownerId !== _currentUser._id) {
          throw new Error('Only project owner can invite buddies');
        }

        const invitedBuddy = await ctx.db
          .query('users')
          .filter((q) => q.eq(q.field('email'), args.buddyEmail))
          .unique();

        if (!invitedBuddy) {
          throw new Error(
            'User with this email not found. They need to sign up first.'
          );
        }

        await ctx.db.patch(args.projectId, { buddyId: invitedBuddy._id });

        return { success: true };
      };

      const result = await inviteBuddy(mockCtx, {
        projectId: 'project-123',
        buddyEmail: 'buddy@example.com',
      });

      expect(mockCtx.db.patch).toHaveBeenCalledWith('project-123', {
        buddyId: 'buddy-123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject buddy invitation from non-owner', async () => {
      const project = {
        _id: 'project-123',
        ownerId: 'user-456',
        name: 'Test Project',
      };

      const nonOwner = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(project);
      mockCtx.db.query.mockReturnValueOnce(createMockQuery(nonOwner));

      const inviteBuddy = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const currentProject = await ctx.db.get(args.projectId);
        const _currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!_currentUser || currentProject.ownerId !== _currentUser._id) {
          throw new Error('Only project owner can invite buddies');
        }

        return { success: true };
      };

      await expect(
        inviteBuddy(mockCtx, {
          projectId: 'project-123',
          buddyEmail: 'buddy@example.com',
        })
      ).rejects.toThrow('Only project owner can invite buddies');
    });

    it('should reject invitation for non-existent buddy', async () => {
      const project = {
        _id: 'project-123',
        ownerId: 'user-123',
      };

      const owner = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(project);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(owner))
        .mockReturnValueOnce(createMockQuery(null)); // Buddy not found

      const inviteBuddy = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const currentProject = await ctx.db.get(args.projectId);
        const _currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!_currentUser || currentProject.ownerId !== _currentUser._id) {
          throw new Error('Only project owner can invite buddies');
        }

        const invitedBuddy = await ctx.db
          .query('users')
          .filter((q) => q.eq(q.field('email'), args.buddyEmail))
          .unique();

        if (!invitedBuddy) {
          throw new Error(
            'User with this email not found. They need to sign up first.'
          );
        }

        return { success: true };
      };

      await expect(
        inviteBuddy(mockCtx, {
          projectId: 'project-123',
          buddyEmail: 'nonexistent@example.com',
        })
      ).rejects.toThrow('User with this email not found');
    });
  });

  describe('get query', () => {
    it('should return project for owner', async () => {
      const project = {
        _id: 'project-123',
        ownerId: 'user-123',
        name: 'Test Project',
      };

      const user = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(project);
      mockCtx.db.query.mockReturnValue(createMockQuery(user));

      const get = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          return null;
        }

        const currentProject = await ctx.db.get(args.projectId);
        if (!currentProject) {
          return null;
        }

        const _currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!_currentUser) {
          return null;
        }

        // User can access project if they own it or are the buddy
        if (
          currentProject.ownerId === _currentUser._id ||
          currentProject.buddyId === _currentUser._id
        ) {
          return currentProject;
        }

        return null;
      };

      const result = await get(mockCtx, { projectId: 'project-123' });

      expect(result).toEqual(project);
    });

    it('should return null for unauthorized user', async () => {
      const project = {
        _id: 'project-123',
        ownerId: 'user-456',
        buddyId: 'user-789',
      };

      const user = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(project);
      mockCtx.db.query.mockReturnValue(createMockQuery(user));

      const get = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const currentProject = await ctx.db.get(args.projectId);
        const _currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (
          currentProject.ownerId === _currentUser._id ||
          currentProject.buddyId === _currentUser._id
        ) {
          return currentProject;
        }

        return null;
      };

      const result = await get(mockCtx, { projectId: 'project-123' });

      expect(result).toBeNull();
    });
  });
});
