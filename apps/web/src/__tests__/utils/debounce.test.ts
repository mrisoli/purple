import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from '@/lib/utils';

// Test constants to avoid magic numbers
const DEBOUNCE_DELAY = 100;
const HALF_DELAY = 50;
const TEST_NUMBER = 123;

describe('Debounce utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call function after specified delay', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    debouncedFn('test');
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(DEBOUNCE_DELAY);
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should debounce multiple calls', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(DEBOUNCE_DELAY);
    expect(mockFn).toHaveBeenCalledWith('third');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on subsequent calls', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    debouncedFn('first');
    vi.advanceTimersByTime(HALF_DELAY);
    debouncedFn('second');
    vi.advanceTimersByTime(HALF_DELAY);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(HALF_DELAY);
    expect(mockFn).toHaveBeenCalledWith('second');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should work with functions that have multiple parameters', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    debouncedFn('param1', 'param2', TEST_NUMBER);
    vi.advanceTimersByTime(DEBOUNCE_DELAY);

    expect(mockFn).toHaveBeenCalledWith('param1', 'param2', TEST_NUMBER);
  });

  it('should work with functions that return values', () => {
    const mockFn = vi.fn(() => 'result');
    const debouncedFn = debounce(mockFn, DEBOUNCE_DELAY);

    // Note: debounced functions don't return values since they're async
    const result = debouncedFn('test');
    expect(result).toBeUndefined();

    vi.advanceTimersByTime(DEBOUNCE_DELAY);
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
