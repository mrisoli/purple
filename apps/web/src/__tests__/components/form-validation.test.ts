import { describe, expect, it } from 'vitest';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PROJECT_NAME_LENGTH = 3;
const MAX_PROJECT_NAME_LENGTH = 100;

describe('Form Validation Logic', () => {
  it('should validate required fields', () => {
    const validateRequired = (value: string) => {
      return value.trim().length === 0 ? 'This field is required' : null;
    };

    expect(validateRequired('')).toBe('This field is required');
    expect(validateRequired('   ')).toBe('This field is required');
    expect(validateRequired('Valid input')).toBeNull();
  });

  it('should validate email format', () => {
    const validateEmail = (email: string) => {
      return EMAIL_REGEX.test(email)
        ? null
        : 'Please enter a valid email address';
    };

    expect(validateEmail('test@example.com')).toBeNull();
    expect(validateEmail('user.name@domain.co.uk')).toBeNull();
    expect(validateEmail('invalid-email')).toBe(
      'Please enter a valid email address'
    );
    expect(validateEmail('@example.com')).toBe(
      'Please enter a valid email address'
    );
    expect(validateEmail('test@')).toBe('Please enter a valid email address');
  });

  it('should validate project name length', () => {
    const validateProjectName = (name: string) => {
      if (name.trim().length === 0) {
        return 'Project name is required';
      }
      if (name.trim().length < MIN_PROJECT_NAME_LENGTH) {
        return 'Project name must be at least 3 characters';
      }
      if (name.trim().length > MAX_PROJECT_NAME_LENGTH) {
        return 'Project name must be less than 100 characters';
      }
      return null;
    };

    expect(validateProjectName('')).toBe('Project name is required');
    expect(validateProjectName('ab')).toBe(
      'Project name must be at least 3 characters'
    );
    expect(validateProjectName('Valid Project Name')).toBeNull();
    expect(validateProjectName('a'.repeat(101))).toBe(
      'Project name must be less than 100 characters'
    );
  });

  it('should handle form submission state', () => {
    const formState = {
      isSubmitting: false,
      errors: {} as Record<string, string>,
      values: {
        name: '',
        description: '',
        email: '',
      },
    };

    const setSubmitting = (isSubmitting: boolean) => {
      formState.isSubmitting = isSubmitting;
    };

    const setError = (field: string, error: string) => {
      formState.errors[field] = error;
    };

    const clearError = (field: string) => {
      delete formState.errors[field];
    };

    setSubmitting(true);
    expect(formState.isSubmitting).toBe(true);

    setError('name', 'Name is required');
    expect(formState.errors.name).toBe('Name is required');

    clearError('name');
    expect(formState.errors.name).toBeUndefined();
  });
});
