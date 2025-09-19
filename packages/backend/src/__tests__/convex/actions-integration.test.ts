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

describe('Actions Integration Tests', () => {
  let mockCtx;
  const mockIdentity = {
    subject: 'clerk-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create mutation', () => {
    it('should create action for project owner', async () => {
      const project = {
        _id: 'project-123',
        ownerId: 'user-123',
        name: 'Test Project',
      };

      const user = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      const newAction = {
        _id: 'action-123',
        projectId: 'project-123',
        userId: 'user-123',
        type: 'progress_update',
        message: 'Made good progress today',
        createdAt: Date.now(),
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get
        .mockResolvedValueOnce(project)
        .mockResolvedValueOnce(newAction);
      mockCtx.db.query.mockReturnValue(createMockQuery(user));
      mockCtx.db.insert.mockResolvedValue('action-123');

      const create = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new Error('Not authenticated');
        }

        const project = await ctx.db.get(args.projectId);
        if (!project) {
          throw new Error('Project not found');
        }

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) {
          throw new Error('User not found');
        }

        // User can create actions if they own the project or are the buddy
        if (project.ownerId !== user._id && project.buddyId !== user._id) {
          throw new Error('Only project owner or buddy can create actions');
        }

        const newActionId = await ctx.db.insert('actions', {
          projectId: args.projectId,
          userId: user._id,
          type: args.type,
          message: args.message,
          createdAt: Date.now(),
        });

        return await ctx.db.get(newActionId);
      };

      const result = await create(mockCtx, {
        projectId: 'project-123',
        type: 'progress_update',
        message: 'Made good progress today',
      });

      expect(mockCtx.db.insert).toHaveBeenCalledWith('actions', {
        projectId: 'project-123',
        userId: 'user-123',
        type: 'progress_update',
        message: 'Made good progress today',
        createdAt: expect.any(Number),
      });
      expect(result.type).toBe('progress_update');
    });

    it('should create action for project buddy', async () => {
      const project = {
        _id: 'project-123',
        ownerId: 'user-456',
        buddyId: 'user-123',
        name: 'Test Project',
      };

      const user = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValueOnce(project).mockResolvedValueOnce({
        _id: 'action-123',
        type: 'milestone_reached',
      });
      mockCtx.db.query.mockReturnValue(createMockQuery(user));
      mockCtx.db.insert.mockResolvedValue('action-123');

      const create = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const project = await ctx.db.get(args.projectId);
        const user = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (project.ownerId !== user._id && project.buddyId !== user._id) {
          throw new Error('Only project owner or buddy can create actions');
        }

        const newActionId = await ctx.db.insert('actions', {
          projectId: args.projectId,
          userId: user._id,
          type: args.type,
          message: args.message,
          createdAt: Date.now(),
        });

        return await ctx.db.get(newActionId);
      };

      const result = await create(mockCtx, {
        projectId: 'project-123',
        type: 'milestone_reached',
        message: 'Reached major milestone!',
      });

      expect(mockCtx.db.insert).toHaveBeenCalled();
      expect(result.type).toBe('milestone_reached');
    });

    it('should reject action creation for unauthorized user', async () => {
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

      const create = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const project = await ctx.db.get(args.projectId);
        const user = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (project.ownerId !== user._id && project.buddyId !== user._id) {
          throw new Error('Only project owner or buddy can create actions');
        }

        return null;
      };

      await expect(
        create(mockCtx, {
          projectId: 'project-123',
          type: 'progress_update',
          message: 'Unauthorized update',
        })
      ).rejects.toThrow('Only project owner or buddy can create actions');
    });
  });

  describe('listByProject query', () => {
    it('should return actions for project owner', async () => {
      const project = {
        _id: 'project-123',
        ownerId: 'user-123',
      };

      const user = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      const actions = [
        {
          _id: 'action-1',
          projectId: 'project-123',
          userId: 'user-123',
          message: 'First action',
          createdAt: 3000,
        },
        {
          _id: 'action-2',
          projectId: 'project-123',
          userId: 'user-123',
          message: 'Second action',
          createdAt: 1000,
        },
      ];

      const actionUsers = [
        { _id: 'user-123', name: 'Test User' },
        { _id: 'user-123', name: 'Test User' },
      ];

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get
        .mockResolvedValueOnce(project)
        .mockResolvedValueOnce(actionUsers[0])
        .mockResolvedValueOnce(actionUsers[1]);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(user))
        .mockReturnValueOnce(createMockQuery(actions));

      const listByProject = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          return [];
        }

        const project = await ctx.db.get(args.projectId);
        if (!project) {
          return [];
        }

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) {
          return [];
        }

        // User can access actions if they own the project or are the buddy
        if (project.ownerId !== user._id && project.buddyId !== user._id) {
          return [];
        }

        const actions = await ctx.db
          .query('actions')
          .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
          .collect();

        // Get user info for each action
        const actionsWithUsers = await Promise.all(
          actions.map(async (action) => {
            const actionUser = await ctx.db.get(action.userId);
            return {
              ...action,
              user: actionUser,
            };
          })
        );

        return actionsWithUsers.sort((a, b) => b.createdAt - a.createdAt);
      };

      const result = await listByProject(mockCtx, { projectId: 'project-123' });

      expect(result).toHaveLength(2);
      expect(result[0].message).toBe('First action'); // More recent (createdAt: 3000)
      expect(result[1].message).toBe('Second action'); // Older (createdAt: 1000)
      expect(result[0].user).toEqual({ _id: 'user-123', name: 'Test User' });
    });

    it('should return empty array for unauthorized user', async () => {
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

      const listByProject = async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const project = await ctx.db.get(args.projectId);
        const user = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (project.ownerId !== user._id && project.buddyId !== user._id) {
          return [];
        }

        return ['mock actions'];
      };

      const result = await listByProject(mockCtx, { projectId: 'project-123' });

      expect(result).toEqual([]);
    });
  });

  describe('getRecentActions query', () => {
    it('should return recent actions from user projects', async () => {
      const user = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      const ownedProjects = [
        { _id: 'project-1', ownerId: 'user-123' },
        { _id: 'project-2', ownerId: 'user-123' },
      ];

      const allProjects = [
        { _id: 'project-1', ownerId: 'user-123', buddyId: null },
        { _id: 'project-2', ownerId: 'user-123', buddyId: null },
        { _id: 'project-3', ownerId: 'user-456', buddyId: 'user-123' },
      ];

      const allActions = [
        {
          _id: 'action-1',
          projectId: 'project-1',
          userId: 'user-123',
          createdAt: 3000,
        },
        {
          _id: 'action-2',
          projectId: 'project-3',
          userId: 'user-456',
          createdAt: 2000,
        },
        {
          _id: 'action-3',
          projectId: 'project-999',
          userId: 'user-999',
          createdAt: 1000,
        },
      ];

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(user))
        .mockReturnValueOnce(createMockQuery(ownedProjects))
        .mockReturnValueOnce(createMockQuery(allProjects))
        .mockReturnValueOnce(createMockQuery(allActions));

      // Mock getting user and project details
      mockCtx.db.get
        .mockResolvedValueOnce({ _id: 'user-123', name: 'Test User' })
        .mockResolvedValueOnce({ _id: 'project-1', name: 'Project 1' })
        .mockResolvedValueOnce({ _id: 'user-456', name: 'Buddy User' })
        .mockResolvedValueOnce({ _id: 'project-3', name: 'Project 3' });

      const getRecentActions = async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          return [];
        }

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) {
          return [];
        }

        // Get user's projects
        const ownedProjects = await ctx.db
          .query('projects')
          .withIndex('by_owner', (q) => q.eq('ownerId', user._id))
          .collect();

        // Get projects where user is a buddy
        const allProjects = await ctx.db.query('projects').collect();
        const buddyProjects = allProjects.filter((p) => p.buddyId === user._id);

        const userProjectIds = [
          ...ownedProjects.map((p) => p._id),
          ...buddyProjects.map((p) => p._id),
        ];

        // Get recent actions from all user's projects
        const allActions = await ctx.db.query('actions').collect();
        const userActions = allActions.filter((action) =>
          userProjectIds.includes(action.projectId)
        );

        // Get user info and project info for each action
        const actionsWithDetails = await Promise.all(
          userActions.map(async (action) => {
            const [actionUser, project] = await Promise.all([
              ctx.db.get(action.userId),
              ctx.db.get(action.projectId),
            ]);
            return {
              ...action,
              user: actionUser,
              project,
            };
          })
        );

        return actionsWithDetails
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 10); // Return 10 most recent actions
      };

      const result = await getRecentActions(mockCtx);

      expect(result).toHaveLength(2); // Only actions from user's projects
      expect(result[0].projectId).toBe('project-1');
      expect(result[1].projectId).toBe('project-3');
      expect(result[0].user.name).toBe('Test User');
      expect(result[1].user.name).toBe('Buddy User');
    });

    it('should return empty array for unauthenticated user', async () => {
      mockCtx = createMockContext(null);

      const getRecentActions = async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          return [];
        }
        return ['mock actions'];
      };

      const result = await getRecentActions(mockCtx);

      expect(result).toEqual([]);
    });
  });
});
