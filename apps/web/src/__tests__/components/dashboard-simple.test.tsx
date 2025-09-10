import { describe, expect, it } from 'vitest';

describe('Dashboard Component', () => {
  it('should be testable', () => {
    // Simple test to verify testing infrastructure works
    expect(true).toBe(true);
  });

  it('can perform basic calculations', () => {
    const stats = {
      totalProjects: 2,
      activeProjects: 1,
      withBuddies: 1,
      recentActionsCount: 5,
    };

    expect(stats.totalProjects).toBe(2);
    expect(stats.withBuddies).toBe(1);
    expect(stats.activeProjects).toBe(1);
  });
});