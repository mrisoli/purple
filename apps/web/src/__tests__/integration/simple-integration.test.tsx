import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Simple smoke test for key components
describe('Simple Integration Tests', () => {
  it.skip('should render landing page without crashing', async () => {
    const LandingPage = await import('@/app/page');

    expect(() => render(<LandingPage.default />)).not.toThrow();
  });

  it.skip('should render about page without crashing', async () => {
    const AboutPage = await import('@/app/about/page');

    expect(() => render(<AboutPage.default />)).not.toThrow();
  });

  it.skip('should render pricing page without crashing', async () => {
    const PricingPage = await import('@/app/pricing/page');

    expect(() => render(<PricingPage.default />)).not.toThrow();
  });

  it('should have working form validation utilities', async () => {
    const { validation } = await import('@/lib/utils');

    // Test project name validation
    expect(validation.projectName('')).toBe('Project name is required');
    expect(validation.projectName('   ')).toBe('Project name is required');
    expect(validation.projectName('a')).toBe(
      'Project name must be at least 3 characters'
    );
    expect(validation.projectName('ab')).toBe(
      'Project name must be at least 3 characters'
    );
    const MAX_PROJECT_NAME_LENGTH = 101;
    expect(validation.projectName('a'.repeat(MAX_PROJECT_NAME_LENGTH))).toBe(
      'Project name must be less than 100 characters'
    );
    expect(validation.projectName('Valid Project Name')).toBe(null);

    // Test email validation (correct function name)
    expect(validation.email('')).toBe('Email is required');
    expect(validation.email('invalid')).toBe(
      'Please enter a valid email address'
    );
    expect(validation.email('test@example.com')).toBe(null);
  });

  it('should have working utility functions', async () => {
    const { cn, debounce } = await import('@/lib/utils');

    // Test className utility
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('class1', null, 'class2')).toBe('class1 class2');

    // Test debounce function exists and is callable
    expect(typeof debounce).toBe('function');

    const mockFn = vi.fn();
    const DEBOUNCE_DELAY = 100;
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);
    expect(typeof debouncedFn).toBe('function');
  });
});
