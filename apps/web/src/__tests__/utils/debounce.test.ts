import { describe, expect, it, vi } from 'vitest';
import { debounce } from '@/lib/utils';

// Test constants to avoid magic numbers
const DEBOUNCE_DELAY = 100;
const TEST_NUMBER = 123;

describe('Debounce utility', () => {
  it('should call function after specified delay', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    debouncedFn('test');
    expect(mockFn).not.toHaveBeenCalled();

    // Wait for the debounce delay plus a bit more
    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_DELAY + 10));

    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should debounce multiple calls', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    expect(mockFn).not.toHaveBeenCalled();

    // Wait for the debounce delay
    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_DELAY + 10));

    expect(mockFn).toHaveBeenCalledWith('third');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should work with functions that have multiple parameters', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    debouncedFn('param1', 'param2', TEST_NUMBER);

    // Wait for the debounce delay
    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_DELAY + 10));

    expect(mockFn).toHaveBeenCalledWith('param1', 'param2', TEST_NUMBER);
  });

  it('should work with functions that return values', async () => {
    const mockFn = vi.fn(() => 'result');
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    // Note: debounced functions don't return values since they're async
    const result = debouncedFn('test');
    expect(result).toBeUndefined();

    // Wait for the debounce delay
    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_DELAY + 10));

    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should handle basic functionality', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    // Should create a debounced function
    expect(typeof debouncedFn).toBe('function');

    // Should not call immediately
    debouncedFn('test');
    expect(mockFn).not.toHaveBeenCalled();
  });
});
