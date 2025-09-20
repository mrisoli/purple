import { describe, expect, it } from 'vitest';
import { validation } from '@/lib/utils';

// Test constants to avoid magic numbers
const PROJECT_NAME_TOO_LONG = 101;
const ACTION_MESSAGE_MAX_LENGTH = 500;
const ACTION_MESSAGE_TOO_LONG = 501;

describe('Validation utilities', () => {
  describe('email validation', () => {
    it('should return null for valid email addresses', () => {
      expect(validation.email('test@example.com')).toBe(null);
      expect(validation.email('user.name@domain.co.uk')).toBe(null);
      expect(validation.email('test+tag@example.org')).toBe(null);
    });

    it('should return error for invalid email addresses', () => {
      expect(validation.email('invalid-email')).toBe(
        'Please enter a valid email address'
      );
      expect(validation.email('test@')).toBe(
        'Please enter a valid email address'
      );
      expect(validation.email('@example.com')).toBe(
        'Please enter a valid email address'
      );
      expect(validation.email('test@.com')).toBe(
        'Please enter a valid email address'
      );
    });

    it('should return error for empty email', () => {
      expect(validation.email('')).toBe('Email is required');
      expect(validation.email('   ')).toBe('Email is required');
    });
  });

  describe('project name validation', () => {
    it('should return null for valid project names', () => {
      expect(validation.projectName('Valid Project')).toBe(null);
      expect(validation.projectName('Learn Spanish')).toBe(null);
      expect(validation.projectName('Build a side project for fun')).toBe(null);
    });

    it('should return error for empty project name', () => {
      expect(validation.projectName('')).toBe('Project name is required');
      expect(validation.projectName('   ')).toBe('Project name is required');
    });

    it('should return error for too short project name', () => {
      expect(validation.projectName('ab')).toBe(
        'Project name must be at least 3 characters'
      );
      expect(validation.projectName('x')).toBe(
        'Project name must be at least 3 characters'
      );
    });

    it('should return error for too long project name', () => {
      const longName = 'a'.repeat(PROJECT_NAME_TOO_LONG);
      expect(validation.projectName(longName)).toBe(
        'Project name must be less than 100 characters'
      );
    });

    it('should handle edge cases with whitespace', () => {
      expect(validation.projectName('  abc  ')).toBe(null); // trims to 'abc'
      expect(validation.projectName('  ab  ')).toBe(
        'Project name must be at least 3 characters'
      ); // trims to 'ab'
    });
  });

  describe('action message validation', () => {
    it('should return null for valid action messages', () => {
      expect(validation.actionMessage('Great progress today!')).toBe(null);
      expect(
        validation.actionMessage('Completed the first milestone of my project.')
      ).toBe(null);
    });

    it('should return error for empty action message', () => {
      expect(validation.actionMessage('')).toBe('Message is required');
      expect(validation.actionMessage('   ')).toBe('Message is required');
    });

    it('should return error for too long action message', () => {
      const longMessage = 'a'.repeat(ACTION_MESSAGE_TOO_LONG);
      expect(validation.actionMessage(longMessage)).toBe(
        'Message must be less than 500 characters'
      );
    });

    it('should handle edge case with exactly 500 characters', () => {
      const maxMessage = 'a'.repeat(ACTION_MESSAGE_MAX_LENGTH);
      expect(validation.actionMessage(maxMessage)).toBe(null);
    });
  });

  describe('required field validation', () => {
    it('should return null for non-empty values', () => {
      expect(validation.required('test')).toBe(null);
      expect(validation.required('123')).toBe(null);
      expect(validation.required('a')).toBe(null);
    });

    it('should return error for empty values', () => {
      expect(validation.required('')).toBe('This field is required');
      expect(validation.required('   ')).toBe('This field is required');
    });

    it('should use custom field name in error message', () => {
      expect(validation.required('', 'Username')).toBe('Username is required');
      expect(validation.required('   ', 'Password')).toBe(
        'Password is required'
      );
    });
  });
});
