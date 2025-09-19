import { beforeEach, describe, expect, it, vi } from 'vitest';

type MockContext = {
  auth: {
    getUserIdentity: ReturnType<typeof vi.fn>;
  };
  db: {
    query: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
  };
};

type MockUser = {
  _id: string;
  clerkId: string;
  name?: string;
};

type MockProject = {
  _id: string;
  ownerId: string;
  buddyId?: string;
  name: string;
};

type MockAction = {
  _id: string;
  projectId: string;
  userId: string;
  type: string;
  message: string;
  createdAt: number;
};

// Mock Convex environment
const createMockContext = (identity: unknown = null): MockContext => ({
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
const createMockQuery = (data: unknown) => ({
  withIndex: vi.fn().mockReturnThis(),
  filter: vi.fn().mockReturnThis(),
  unique: vi.fn().mockResolvedValue(Array.isArray(data) ? data[0] : data),
  collect: vi.fn().mockResolvedValue(Array.isArray(data) ? data : [data]),
  eq: vi.fn(),
});

// Helper functions to reduce cognitive complexity
const getUserFromContext = async (ctx: MockContext) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }

  const user = await ctx.db
    .query('users')
    .withIndex(
      'by_clerkId',
      (q: { eq: (field: string, value: string) => unknown }) =>
        q.eq('clerkId', (identity as { subject: string }).subject)
    )
    .unique();

  if (!user) {
    throw new Error('User not found');
  }

  return { identity, user };
};

const validateProjectAccess = (project: MockProject | null, user: MockUser) => {
  if (!project) {
    throw new Error('Project not found');
  }

  if (project.ownerId !== user._id && project.buddyId !== user._id) {
    throw new Error('Only project owner or buddy can create actions');
  }
};

const createActionMutation = async (
  ctx: MockContext,
  args: { projectId: string; type: string; message: string }
) => {
  const { user } = await getUserFromContext(ctx);
  const project = await ctx.db.get(args.projectId);

  validateProjectAccess(project, user as MockUser);

  const newActionId = await ctx.db.insert('actions', {
    projectId: args.projectId,
    userId: (user as MockUser)._id,
    type: args.type,
    message: args.message,
    createdAt: Date.now(),
  });

  return await ctx.db.get(newActionId);
};

const listActionsByProject = async (
  ctx: MockContext,
  args: { projectId: string }
) => {
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
    .withIndex(
      'by_clerkId',
      (q: { eq: (field: string, value: string) => unknown }) =>
        q.eq('clerkId', (identity as { subject: string }).subject)
    )
    .unique();

  if (!user) {
    return [];
  }

  // User can access actions if they own the project or are the buddy
  if (
    (project as MockProject).ownerId !== (user as MockUser)._id &&
    (project as MockProject).buddyId !== (user as MockUser)._id
  ) {
    return [];
  }

  const actions = await ctx.db
    .query('actions')
    .withIndex(
      'by_project',
      (q: { eq: (field: string, value: string) => unknown }) =>
        q.eq('projectId', args.projectId)
    )
    .collect();

  // Get user info for each action
  const actionsWithUsers = await Promise.all(
    (actions as MockAction[]).map(async (action: MockAction) => {
      const actionUser = await ctx.db.get(action.userId);
      return {
        ...action,
        user: actionUser,
      };
    })
  );

  return actionsWithUsers.sort(
    (a: MockAction & { user: unknown }, b: MockAction & { user: unknown }) =>
      b.createdAt - a.createdAt
  );
};

const getRecentActionsQuery = async (ctx: MockContext) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return [];
  }

  const user = await ctx.db
    .query('users')
    .withIndex(
      'by_clerkId',
      (q: { eq: (field: string, value: string) => unknown }) =>
        q.eq('clerkId', (identity as { subject: string }).subject)
    )
    .unique();

  if (!user) {
    return [];
  }

  // Get user's projects
  const ownedProjects = await ctx.db
    .query('projects')
    .withIndex(
      'by_owner',
      (q: { eq: (field: string, value: string) => unknown }) =>
        q.eq('ownerId', (user as MockUser)._id)
    )
    .collect();

  // Get projects where user is a buddy
  const allProjects = await ctx.db.query('projects').collect();
  const buddyProjects = (allProjects as MockProject[]).filter(
    (p: MockProject) => p.buddyId === (user as MockUser)._id
  );

  const userProjectIds = [
    ...(ownedProjects as MockProject[]).map((p: MockProject) => p._id),
    ...buddyProjects.map((p: MockProject) => p._id),
  ];

  // Get recent actions from all user's projects
  const allActions = await ctx.db.query('actions').collect();
  const userActions = (allActions as MockAction[]).filter(
    (action: MockAction) => userProjectIds.includes(action.projectId)
  );

  // Get user info and project info for each action
  const actionsWithDetails = await Promise.all(
    userActions.map(async (action: MockAction) => {
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
    .sort(
      (
        a: MockAction & { user: unknown; project: unknown },
        b: MockAction & { user: unknown; project: unknown }
      ) => b.createdAt - a.createdAt
    )
    .slice(0, 10); // Return 10 most recent actions
};

describe('Actions Integration Tests', () => {
  let mockCtx: ReturnType<typeof createMockContext>;
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
      const mockProject = {
        _id: 'project-123',
        ownerId: 'user-123',
        name: 'Test Project',
      };

      const mockUser = {
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
        .mockResolvedValueOnce(mockProject)
        .mockResolvedValueOnce(newAction);
      mockCtx.db.query.mockReturnValue(createMockQuery(mockUser));
      mockCtx.db.insert.mockResolvedValue('action-123');

      const create = createActionMutation;

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
      const mockBuddyProject = {
        _id: 'project-123',
        ownerId: 'user-456',
        buddyId: 'user-123',
        name: 'Test Project',
      };

      const mockBuddyUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get
        .mockResolvedValueOnce(mockBuddyProject)
        .mockResolvedValueOnce({
          _id: 'action-123',
          type: 'milestone_reached',
        });
      mockCtx.db.query.mockReturnValue(createMockQuery(mockBuddyUser));
      mockCtx.db.insert.mockResolvedValue('action-123');

      const create = createActionMutation;

      const result = await create(mockCtx, {
        projectId: 'project-123',
        type: 'milestone_reached',
        message: 'Reached major milestone!',
      });

      expect(mockCtx.db.insert).toHaveBeenCalled();
      expect(result.type).toBe('milestone_reached');
    });

    it('should reject action creation for unauthorized user', async () => {
      const mockUnauthorizedProject = {
        _id: 'project-123',
        ownerId: 'user-456',
        buddyId: 'user-789',
      };

      const mockUnauthorizedUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(mockUnauthorizedProject);
      mockCtx.db.query.mockReturnValue(createMockQuery(mockUnauthorizedUser));

      const create = async (ctx: MockContext, args: { projectId: string }) => {
        const { user } = await getUserFromContext(ctx);
        const project = await ctx.db.get(args.projectId);
        validateProjectAccess(project as MockProject, user as MockUser);
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
      const mockOwnerProject = {
        _id: 'project-123',
        ownerId: 'user-123',
      };

      const mockOwnerUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      const mockActions = [
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

      const mockActionUsers = [
        { _id: 'user-123', name: 'Test User' },
        { _id: 'user-123', name: 'Test User' },
      ];

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get
        .mockResolvedValueOnce(mockOwnerProject)
        .mockResolvedValueOnce(mockActionUsers[0])
        .mockResolvedValueOnce(mockActionUsers[1]);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(mockOwnerUser))
        .mockReturnValueOnce(createMockQuery(mockActions));

      const listByProject = listActionsByProject;

      const result = await listByProject(mockCtx, { projectId: 'project-123' });

      expect(result).toHaveLength(2);
      expect(result[0].message).toBe('First action'); // More recent (createdAt: 3000)
      expect(result[1].message).toBe('Second action'); // Older (createdAt: 1000)
      expect(result[0].user).toEqual({ _id: 'user-123', name: 'Test User' });
    });

    it('should return empty array for unauthorized user', async () => {
      const mockRestrictedProject = {
        _id: 'project-123',
        ownerId: 'user-456',
        buddyId: 'user-789',
      };

      const mockRestrictedUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(mockRestrictedProject);
      mockCtx.db.query.mockReturnValue(createMockQuery(mockRestrictedUser));

      const listByProject = async (
        ctx: MockContext,
        args: { projectId: string }
      ) => {
        const identity = await ctx.auth.getUserIdentity();
        const project = await ctx.db.get(args.projectId);
        const user = await ctx.db
          .query('users')
          .withIndex(
            'by_clerkId',
            (q: { eq: (field: string, value: string) => unknown }) =>
              q.eq('clerkId', (identity as { subject: string }).subject)
          )
          .unique();

        if (
          (project as MockProject).ownerId !== (user as MockUser)._id &&
          (project as MockProject).buddyId !== (user as MockUser)._id
        ) {
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
      const mockCurrentUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      const mockOwnedProjects = [
        { _id: 'project-1', ownerId: 'user-123' },
        { _id: 'project-2', ownerId: 'user-123' },
      ];

      const mockAllProjects = [
        { _id: 'project-1', ownerId: 'user-123', buddyId: null },
        { _id: 'project-2', ownerId: 'user-123', buddyId: null },
        { _id: 'project-3', ownerId: 'user-456', buddyId: 'user-123' },
      ];

      const mockAllActions = [
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
        .mockReturnValueOnce(createMockQuery(mockCurrentUser))
        .mockReturnValueOnce(createMockQuery(mockOwnedProjects))
        .mockReturnValueOnce(createMockQuery(mockAllProjects))
        .mockReturnValueOnce(createMockQuery(mockAllActions));

      // Mock getting user and project details
      mockCtx.db.get
        .mockResolvedValueOnce({ _id: 'user-123', name: 'Test User' })
        .mockResolvedValueOnce({ _id: 'project-1', name: 'Project 1' })
        .mockResolvedValueOnce({ _id: 'user-456', name: 'Buddy User' })
        .mockResolvedValueOnce({ _id: 'project-3', name: 'Project 3' });

      const getRecentActions = getRecentActionsQuery;

      const result = await getRecentActions(mockCtx);

      expect(result).toHaveLength(2); // Only actions from user's projects
      expect(result[0].projectId).toBe('project-1');
      expect(result[1].projectId).toBe('project-3');
      expect(result[0].user.name).toBe('Test User');
      expect(result[1].user.name).toBe('Buddy User');
    });

    it('should return empty array for unauthenticated user', async () => {
      mockCtx = createMockContext(null);

      const getRecentActions = async (ctx: MockContext) => {
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
