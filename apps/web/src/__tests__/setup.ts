import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Configure vitest environment
globalThis.vi = vi;

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
  default: ({ children, href, ...props }: any) => {
    return React.createElement('a', { href, ...props }, children);
  },
}));

// Mock Clerk components
vi.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children, mode, ...props }: any) => 
    React.createElement('button', { 'data-testid': 'sign-in-button', ...props }, children),
  SignUpButton: ({ children, mode, ...props }: any) => 
    React.createElement('button', { 'data-testid': 'sign-up-button', ...props }, children),
  UserButton: (props: any) => 
    React.createElement('button', { 'data-testid': 'user-button', ...props }),
  useUser: () => ({
    user: null,
    isLoaded: true,
  }),
}));

// Mock Convex React components
vi.mock('convex/react', () => ({
  Authenticated: ({ children }: any) => children,
  Unauthenticated: ({ children }: any) => children,
  AuthLoading: ({ children }: any) => children,
  useQuery: () => undefined,
  useMutation: () => vi.fn(),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_CONVEX_URL = 'https://test-convex-url.convex.cloud';
