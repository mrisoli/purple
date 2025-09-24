import { v } from 'convex/values';
import { query } from './_generated/server';

export const getProjectAnalytics = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if user has access (owner or buddy)
    if (project.ownerId !== user._id && project.buddyId !== user._id) {
      throw new Error('Access denied');
    }

    // Get all actions for this project
    const actions = await ctx.db
      .query('actions')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    // Calculate analytics
    const totalActions = actions.length;
    const milestoneReached = actions.filter(a => a.type === 'milestone_reached').length;
    const progressUpdates = actions.filter(a => a.type === 'progress_update').length;
    const challengesFaced = actions.filter(a => a.type === 'challenge_faced').length;
    const helpRequests = actions.filter(a => a.type === 'help_needed').length;

    // Calculate engagement metrics
    const daysSinceCreation = Math.floor((Date.now() - project.createdAt) / (1000 * 60 * 60 * 24));
    const avgActionsPerDay = daysSinceCreation > 0 ? totalActions / daysSinceCreation : 0;

    // Recent activity (last 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentActions = actions.filter(a => a.createdAt > sevenDaysAgo).length;

    // Activity streak (consecutive days with actions)
    const actionDates = actions
      .map(a => new Date(a.createdAt).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort();
    
    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (actionDates.includes(today) || actionDates.includes(yesterday)) {
      let checkDate = actionDates.includes(today) ? new Date() : new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      while (actionDates.includes(checkDate.toDateString())) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
      }
    }

    return {
      totalActions,
      milestoneReached,
      progressUpdates,
      challengesFaced,
      helpRequests,
      daysSinceCreation,
      avgActionsPerDay: Number(avgActionsPerDay.toFixed(2)),
      recentActions,
      currentStreak,
      completionRate: totalActions > 0 ? Number(((milestoneReached / totalActions) * 100).toFixed(1)) : 0,
    };
  },
});

export const getUserAnalytics = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    // Get all user's projects
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_owner', (q) => q.eq('ownerId', user._id))
      .collect();

    // Get all actions across all projects
    const allActions = [];
    for (const project of projects) {
      const actions = await ctx.db
        .query('actions')
        .withIndex('by_project', (q) => q.eq('projectId', project._id))
        .collect();
      allActions.push(...actions);
    }

    const totalProjects = projects.length;
    const projectsWithBuddy = projects.filter(p => p.buddyId).length;
    const totalActions = allActions.length;
    const totalMilestones = allActions.filter(a => a.type === 'milestone_reached').length;

    // Most active day of week
    const dayActions = Array(7).fill(0);
    allActions.forEach(action => {
      const dayOfWeek = new Date(action.createdAt).getDay();
      dayActions[dayOfWeek]++;
    });
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mostActiveDay = dayNames[dayActions.indexOf(Math.max(...dayActions))];

    return {
      totalProjects,
      projectsWithBuddy,
      totalActions,
      totalMilestones,
      avgActionsPerProject: totalProjects > 0 ? Number((totalActions / totalProjects).toFixed(2)) : 0,
      buddyMatchRate: totalProjects > 0 ? Number(((projectsWithBuddy / totalProjects) * 100).toFixed(1)) : 0,
      mostActiveDay,
    };
  },
});