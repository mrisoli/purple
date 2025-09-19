import { beforeEach, describe, expect, it, vi } from 'vitest';

// Type definitions for test mocks
interface MockIdentity {
  subject: string;
  email?: string;
}

interface MockUser {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  premium: boolean;
  createdAt: number;
}

interface MockProject {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  buddyId?: string;
  createdAt: number;
}

interface MockQuery {
  withIndex: ReturnType<typeof vi.fn>;
  filter: ReturnType<typeof vi.fn>;
  unique: ReturnType<typeof vi.fn>;
  collect: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  field: ReturnType<typeof vi.fn>;
}

interface MockDatabase {
  query: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
}

interface MockContext {
  auth: {
    getUserIdentity: ReturnType<typeof vi.fn>;
  };
  db: MockDatabase;
}

// Mock Convex environment
const createMockContext = (
  identity: MockIdentity | null = null
): MockContext => ({
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
const createMockQuery = (
  data: MockUser | MockProject | MockUser[] | MockProject[] | null
): MockQuery => ({
  withIndex: vi.fn().mockReturnThis(),
  filter: vi.fn().mockReturnThis(),
  unique: vi.fn().mockResolvedValue(Array.isArray(data) ? data[0] : data),
  collect: vi.fn().mockResolvedValue(Array.isArray(data) ? data : [data]),
  eq: vi.fn(),
  field: vi.fn().mockReturnValue('email'),
});

// Helper functions to reduce cognitive complexity
const getUserFromAuth = async (ctx: MockContext) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }

  const currentUser = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: MockQuery) =>
      q.eq('clerkId', identity.subject)
    )
    .unique();

  if (!currentUser) {
    throw new Error('User not found');
  }

  return { identity, currentUser };
};

const checkProjectLimit = async (ctx: MockContext, user: MockUser) => {
  if (!user.premium) {
    const userProjects = await ctx.db
      .query('projects')
      .withIndex('by_owner', (q: MockQuery) => q.eq('ownerId', user._id))
      .collect();

    if (userProjects.length >= 1) {
      throw new Error(
        'Free users can only create 1 project. Upgrade to premium for unlimited projects.'
      );
    }
  }
};

interface CreateProjectArgs {
  name: string;
  description: string;
}

interface InviteBuddyArgs {
  projectId: string;
  buddyEmail: string;
}

const createProjectMutation = async (
  ctx: MockContext,
  args: CreateProjectArgs
) => {
  const { currentUser } = await getUserFromAuth(ctx);
  await checkProjectLimit(ctx, currentUser);

  const newProjectId = await ctx.db.insert('projects', {
    ownerId: currentUser._id,
    name: args.name,
    description: args.description,
    createdAt: Date.now(),
  });

  return await ctx.db.get(newProjectId);
};

const inviteBuddyMutation = async (ctx: MockContext, args: InviteBuddyArgs) => {
  const { currentUser } = await getUserFromAuth(ctx);

  const currentProject = await ctx.db.get(args.projectId);
  if (!currentProject) {
    throw new Error('Project not found');
  }

  if (currentProject.ownerId !== currentUser._id) {
    throw new Error('Only project owner can invite buddies');
  }

  const invitedBuddy = await ctx.db
    .query('users')
    .filter((q: MockQuery) => q.eq(q.field('email'), args.buddyEmail))
    .unique();

  if (!invitedBuddy) {
    throw new Error(
      'User with this email not found. They need to sign up first.'
    );
  }

  await ctx.db.patch(args.projectId, { buddyId: invitedBuddy._id });

  return { success: true };
};

interface GetProjectArgs {
  projectId: string;
}

const getProjectQuery = async (ctx: MockContext, args: GetProjectArgs) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  const currentProject = await ctx.db.get(args.projectId);
  if (!currentProject) {
    return null;
  }

  const currentUser = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: MockQuery) =>
      q.eq('clerkId', identity.subject)
    )
    .unique();

  if (!currentUser) {
    return null;
  }

  // User can access project if they own it or are the buddy
  if (
    currentProject.ownerId === currentUser._id ||
    currentProject.buddyId === currentUser._id
  ) {
    return currentProject;
  }

  return null;
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
      const mockFreeUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
        premium: false,
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(mockFreeUser)) // Find user
        .mockReturnValueOnce(createMockQuery([])); // No existing projects
      mockCtx.db.insert.mockResolvedValue('new-project-id');
      mockCtx.db.get.mockResolvedValue({
        _id: 'new-project-id',
        ownerId: 'user-123',
        name: 'Test Project',
        description: 'Test Description',
        createdAt: Date.now(),
      });

      const create = createProjectMutation;

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
      const mockLimitedUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
        premium: false,
      };

      const mockExistingProject = {
        _id: 'existing-project',
        ownerId: 'user-123',
        name: 'Existing Project',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(mockLimitedUser))
        .mockReturnValueOnce(createMockQuery([mockExistingProject]));

      const create = async (ctx: MockContext, _args: CreateProjectArgs) => {
        const { currentUser } = await getUserFromAuth(ctx);
        await checkProjectLimit(ctx, currentUser);
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
      const mockPremiumUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
        premium: true,
      };

      const mockExistingProjects = [
        { _id: 'project-1', name: 'Project 1' },
        { _id: 'project-2', name: 'Project 2' },
        { _id: 'project-3', name: 'Project 3' },
      ];

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(mockPremiumUser))
        .mockReturnValueOnce(createMockQuery(mockExistingProjects));
      mockCtx.db.insert.mockResolvedValue('new-project-id');
      mockCtx.db.get.mockResolvedValue({
        _id: 'new-project-id',
        name: 'Project 4',
      });

      const create = createProjectMutation;

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
      const mockInviteProject = {
        _id: 'project-123',
        ownerId: 'user-123',
        name: 'Test Project',
      };

      const mockOwner = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      const mockBuddy = {
        _id: 'buddy-123',
        email: 'buddy@example.com',
        name: 'Buddy User',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(mockInviteProject);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(mockOwner))
        .mockReturnValueOnce(createMockQuery(mockBuddy));
      mockCtx.db.patch.mockResolvedValue(undefined);

      const inviteBuddy = inviteBuddyMutation;

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
      const mockRestrictedProject = {
        _id: 'project-123',
        ownerId: 'user-456',
        name: 'Test Project',
      };

      const mockNonOwner = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(mockRestrictedProject);
      mockCtx.db.query.mockReturnValueOnce(createMockQuery(mockNonOwner));

      const inviteBuddy = async (ctx: MockContext, args: InviteBuddyArgs) => {
        const { currentUser } = await getUserFromAuth(ctx);
        const currentProject = await ctx.db.get(args.projectId);

        if (currentProject.ownerId !== currentUser._id) {
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
      const mockNonExistentProject = {
        _id: 'project-123',
        ownerId: 'user-123',
      };

      const mockProjectOwner = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(mockNonExistentProject);
      mockCtx.db.query
        .mockReturnValueOnce(createMockQuery(mockProjectOwner))
        .mockReturnValueOnce(createMockQuery(null)); // Buddy not found

      const inviteBuddy = async (ctx: MockContext, args: InviteBuddyArgs) => {
        const { currentUser } = await getUserFromAuth(ctx);
        const currentProject = await ctx.db.get(args.projectId);

        if (currentProject.ownerId !== currentUser._id) {
          throw new Error('Only project owner can invite buddies');
        }

        const invitedBuddy = await ctx.db
          .query('users')
          .filter((q: MockQuery) => q.eq(q.field('email'), args.buddyEmail))
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
      const mockAccessibleProject = {
        _id: 'project-123',
        ownerId: 'user-123',
        name: 'Test Project',
      };

      const mockProjectUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(mockAccessibleProject);
      mockCtx.db.query.mockReturnValue(createMockQuery(mockProjectUser));

      const get = getProjectQuery;

      const result = await get(mockCtx, { projectId: 'project-123' });

      expect(result).toEqual(mockAccessibleProject);
    });

    it('should return null for unauthorized user', async () => {
      const mockInaccessibleProject = {
        _id: 'project-123',
        ownerId: 'user-456',
        buddyId: 'user-789',
      };

      const mockUnauthorizedUser = {
        _id: 'user-123',
        clerkId: 'clerk-123',
      };

      mockCtx = createMockContext(mockIdentity);
      mockCtx.db.get.mockResolvedValue(mockInaccessibleProject);
      mockCtx.db.query.mockReturnValue(createMockQuery(mockUnauthorizedUser));

      const get = async (ctx: MockContext, args: GetProjectArgs) => {
        const identity = await ctx.auth.getUserIdentity();
        const currentProject = await ctx.db.get(args.projectId);
        const currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q: MockQuery) =>
            q.eq('clerkId', identity.subject)
          )
          .unique();

        if (
          currentProject.ownerId === currentUser._id ||
          currentProject.buddyId === currentUser._id
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
