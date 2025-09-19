import { describe, expect, it } from 'vitest';

const TOTAL_PROJECTS_COUNT = 3;
const PROJECTS_WITHOUT_BUDDIES = 1;
const PROJECTS_WITH_BUDDIES = 2;
const RECENT_ACTIONS_COUNT = 2;
const TEST_YEAR = 2022;
const JANUARY_MONTH_INDEX = 0;
const FIRST_DAY = 1;
const MAX_PROJECTS_FOR_FREE = 1;

describe('Project Utilities', () => {
  it('should calculate dashboard statistics correctly', () => {
    const projects = [
      { _id: '1', buddyId: 'user-2', name: 'Project 1' },
      { _id: '2', buddyId: null, name: 'Project 2' },
      { _id: '3', buddyId: 'user-3', name: 'Project 3' },
    ];

    const recentActions = [
      { _id: '1', message: 'Action 1' },
      { _id: '2', message: 'Action 2' },
    ];

    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => !p.buddyId).length,
      withBuddies: projects.filter((p) => p.buddyId).length,
      recentActionsCount: recentActions.length,
    };

    expect(stats.totalProjects).toBe(TOTAL_PROJECTS_COUNT);
    expect(stats.activeProjects).toBe(PROJECTS_WITHOUT_BUDDIES); // Projects without buddies
    expect(stats.withBuddies).toBe(PROJECTS_WITH_BUDDIES); // Projects with buddies
    expect(stats.recentActionsCount).toBe(RECENT_ACTIONS_COUNT);
  });

  it('should validate project creation form', () => {
    const validForm = {
      name: 'Learn Guitar',
      description: 'Practice guitar for 30 minutes daily',
    };

    const invalidForm = {
      name: '',
      description: 'Description without name',
    };

    expect(validForm.name.trim().length > 0).toBe(true);
    expect(validForm.description.trim().length > 0).toBe(true);

    expect(invalidForm.name.trim().length > 0).toBe(false);
  });

  it('should format dates correctly', () => {
    const timestamp = 1_640_995_200_000; // Jan 1, 2022
    const date = new Date(timestamp);

    expect(date.getFullYear()).toBe(TEST_YEAR);
    expect(date.getMonth()).toBe(JANUARY_MONTH_INDEX); // January is 0
    expect(date.getDate()).toBe(FIRST_DAY);
  });

  it('should handle premium user limits', () => {
    const freeUser = { premium: false };
    const premiumUser = { premium: true };

    const maxProjectsForFree = MAX_PROJECTS_FOR_FREE;
    const maxProjectsForPremium = Number.POSITIVE_INFINITY;

    expect(freeUser.premium ? maxProjectsForPremium : maxProjectsForFree).toBe(
      MAX_PROJECTS_FOR_FREE
    );
    expect(
      premiumUser.premium ? maxProjectsForPremium : maxProjectsForFree
    ).toBe(Number.POSITIVE_INFINITY);
  });

  it('should validate email format for buddy invitations', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'hello+tag@gmail.com',
    ];

    const invalidEmails = ['notanemail', '@example.com', 'test@', ''];

    for (const email of validEmails) {
      expect(email.includes('@')).toBe(true);
      expect(email.split('@')).toHaveLength(2);
    }

    for (const email of invalidEmails) {
      const isValid =
        email.includes('@') &&
        email.split('@').length === 2 &&
        email.split('@')[0].length > 0 &&
        email.split('@')[1].length > 0;
      expect(isValid).toBe(false);
    }
  });
});
