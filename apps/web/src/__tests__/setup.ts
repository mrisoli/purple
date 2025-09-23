import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Configure vitest environment
globalThis.vi = vi;

// Ensure DOM globals are available
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Type definitions for mock components
type LinkProps = {
  children: React.ReactNode;
  href: string;
  [key: string]: unknown;
};

type ClerkButtonProps = {
  children?: React.ReactNode;
  mode?: string;
  [key: string]: unknown;
};

type AuthProps = {
  children: React.ReactNode;
};

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  useParams: () => ({
    id: 'test-id',
  }),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: LinkProps) => {
    return React.createElement('a', { href, ...props }, children);
  },
}));

// Mock Clerk components
vi.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children, ...props }: ClerkButtonProps) =>
    React.createElement(
      'button',
      { 'data-testid': 'sign-in-button', type: 'button', ...props },
      children
    ),
  SignUpButton: ({ children, ...props }: ClerkButtonProps) =>
    React.createElement(
      'button',
      { 'data-testid': 'sign-up-button', type: 'button', ...props },
      children
    ),
  UserButton: (props: ClerkButtonProps) =>
    React.createElement('button', {
      'data-testid': 'user-button',
      type: 'button',
      ...props,
    }),
  useUser: () => ({
    user: null,
    isLoaded: true,
  }),
}));

// Mock Convex React components
vi.mock('convex/react', () => ({
  Authenticated: ({ children }: AuthProps) => children,
  Unauthenticated: ({ children }: AuthProps) => children,
  AuthLoading: ({ children }: AuthProps) => children,
  useQuery: () => null,
  useMutation: () => vi.fn(),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_CONVEX_URL = 'https://test-convex-url.convex.cloud';
