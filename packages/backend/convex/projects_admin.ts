import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const update = mutation({
  args: {
    projectId: v.id('projects'),
    name: v.string(),
    description: v.string(),
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

    if (!user || project.ownerId !== user._id) {
      throw new Error('Only project owner can edit this project');
    }

    await ctx.db.patch(args.projectId, {
      name: args.name,
      description: args.description,
    });

    return await ctx.db.get(args.projectId);
  },
});

export const remove = mutation({
  args: {
    projectId: v.id('projects'),
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

    if (!user || project.ownerId !== user._id) {
      throw new Error('Only project owner can delete this project');
    }

    // Get all actions for this project
    const actions = await ctx.db
      .query('actions')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Delete all actions first
    await Promise.all(actions.map((action) => ctx.db.delete(action._id)));

    // Delete the project
    await ctx.db.delete(args.projectId);

    return { success: true };
  },
});

export const removeBuddy = mutation({
  args: {
    projectId: v.id('projects'),
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

    if (!user || project.ownerId !== user._id) {
      throw new Error('Only project owner can remove buddy');
    }

    await ctx.db.patch(args.projectId, {
      buddyId: undefined,
    });

    return await ctx.db.get(args.projectId);
  },
});
