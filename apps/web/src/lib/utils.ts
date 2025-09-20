import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validation constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PROJECT_NAME_LENGTH = 3;
const MAX_PROJECT_NAME_LENGTH = 100;
const MAX_ACTION_MESSAGE_LENGTH = 500;
const DEBOUNCE_DELAY = 300;
const CHAR_COUNT_WARNING_THRESHOLD = 0.9;

// Form validation utilities
export const validation = {
  email: (email: string): string | null => {
    if (!email.trim()) {
      return 'Email is required';
    }
    return EMAIL_REGEX.test(email)
      ? null
      : 'Please enter a valid email address';
  },

  projectName: (name: string): string | null => {
    if (!name.trim()) {
      return 'Project name is required';
    }
    if (name.trim().length < MIN_PROJECT_NAME_LENGTH) {
      return 'Project name must be at least 3 characters';
    }
    if (name.trim().length > MAX_PROJECT_NAME_LENGTH) {
      return 'Project name must be less than 100 characters';
    }
    return null;
  },

  actionMessage: (message: string): string | null => {
    if (!message.trim()) {
      return 'Message is required';
    }
    if (message.trim().length > MAX_ACTION_MESSAGE_LENGTH) {
      return 'Message must be less than 500 characters';
    }
    return null;
  },

  required: (value: string, fieldName = 'This field'): string | null => {
    return value.trim() ? null : `${fieldName} is required`;
  },
};

// Debounce utility for input validation
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export { DEBOUNCE_DELAY, CHAR_COUNT_WARNING_THRESHOLD };
