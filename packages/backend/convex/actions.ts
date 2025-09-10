import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const listByProject = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
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
  },
});

export const create = mutation({
  args: {
    projectId: v.id('projects'),
    type: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
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
  },
});

export const getRecentActions = query({
  handler: async (ctx) => {
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
  },
});
