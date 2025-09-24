import { v } from 'convex/values';
import { query } from './_generated/server';

// Time constants
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const DAYS_IN_WEEK = 7;
const PERCENTAGE_MULTIPLIER = 100;

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
    const milestoneReached = actions.filter(
      (a) => a.type === 'milestone_reached'
    ).length;
    const progressUpdates = actions.filter(
      (a) => a.type === 'progress_update'
    ).length;
    const challengesFaced = actions.filter(
      (a) => a.type === 'challenge_faced'
    ).length;
    const helpRequests = actions.filter((a) => a.type === 'help_needed').length;

    // Calculate engagement metrics
    const daysSinceCreation = Math.floor(
      (Date.now() - project.createdAt) / MILLISECONDS_PER_DAY
    );
    const avgActionsPerDay =
      daysSinceCreation > 0 ? totalActions / daysSinceCreation : 0;

    // Recent activity (last 7 days)
    const sevenDaysAgo = Date.now() - DAYS_IN_WEEK * MILLISECONDS_PER_DAY;
    const recentActions = actions.filter(
      (a) => a.createdAt > sevenDaysAgo
    ).length;

    // Activity streak (consecutive days with actions)
    const actionDates = actions
      .map((a) => new Date(a.createdAt).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort();

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(
      Date.now() - MILLISECONDS_PER_DAY
    ).toDateString();

    if (actionDates.includes(today) || actionDates.includes(yesterday)) {
      let checkDate = actionDates.includes(today)
        ? new Date()
        : new Date(Date.now() - MILLISECONDS_PER_DAY);

      while (actionDates.includes(checkDate.toDateString())) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - MILLISECONDS_PER_DAY);
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
      completionRate:
        totalActions > 0
          ? Number(
              (
                (milestoneReached / totalActions) *
                PERCENTAGE_MULTIPLIER
              ).toFixed(1)
            )
          : 0,
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
    const allActions: { createdAt: number; type: string }[] = [];
    for (const project of projects) {
      const actions = await ctx.db
        .query('actions')
        .withIndex('by_project', (q) => q.eq('projectId', project._id))
        .collect();
      allActions.push(...actions);
    }

    const totalProjects = projects.length;
    const projectsWithBuddy = projects.filter((p) => p.buddyId).length;
    const totalActions = allActions.length;
    const totalMilestones = allActions.filter(
      (a) => a.type === 'milestone_reached'
    ).length;

    // Most active day of week
    const dayActions = new Array(DAYS_IN_WEEK).fill(0);
    for (const action of allActions) {
      const dayOfWeek = new Date(action.createdAt).getDay();
      dayActions[dayOfWeek]++;
    }

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const mostActiveDay = dayNames[dayActions.indexOf(Math.max(...dayActions))];

    return {
      totalProjects,
      projectsWithBuddy,
      totalActions,
      totalMilestones,
      avgActionsPerProject:
        totalProjects > 0
          ? Number((totalActions / totalProjects).toFixed(2))
          : 0,
      buddyMatchRate:
        totalProjects > 0
          ? Number(
              (
                (projectsWithBuddy / totalProjects) *
                PERCENTAGE_MULTIPLIER
              ).toFixed(1)
            )
          : 0,
      mostActiveDay,
    };
  },
});
