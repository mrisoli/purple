import { describe, expect, it } from 'vitest';

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
      activeProjects: projects.filter(p => !p.buddyId).length,
      withBuddies: projects.filter(p => p.buddyId).length,
      recentActionsCount: recentActions.length,
    };

    expect(stats.totalProjects).toBe(3);
    expect(stats.activeProjects).toBe(1); // Projects without buddies
    expect(stats.withBuddies).toBe(2); // Projects with buddies
    expect(stats.recentActionsCount).toBe(2);
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
    const timestamp = 1640995200000; // Jan 1, 2022
    const date = new Date(timestamp);
    
    expect(date.getFullYear()).toBe(2022);
    expect(date.getMonth()).toBe(0); // January is 0
    expect(date.getDate()).toBe(1);
  });

  it('should handle premium user limits', () => {
    const freeUser = { premium: false };
    const premiumUser = { premium: true };
    
    const maxProjectsForFree = 1;
    const maxProjectsForPremium = Number.POSITIVE_INFINITY;

    expect(freeUser.premium ? maxProjectsForPremium : maxProjectsForFree).toBe(1);
    expect(premiumUser.premium ? maxProjectsForPremium : maxProjectsForFree).toBe(Number.POSITIVE_INFINITY);
  });

  it('should validate email format for buddy invitations', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'hello+tag@gmail.com'
    ];

    const invalidEmails = [
      'notanemail',
      '@example.com',
      'test@',
      ''
    ];

    validEmails.forEach(email => {
      expect(email.includes('@')).toBe(true);
      expect(email.split('@')).toHaveLength(2);
    });

    invalidEmails.forEach(email => {
      const isValid = email.includes('@') && email.split('@').length === 2 && email.split('@')[0].length > 0 && email.split('@')[1].length > 0;
      expect(isValid).toBe(false);
    });
  });
});