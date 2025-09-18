import '@testing-library/jest-dom';
import { vi } from 'vitest';

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

// Mock environment variables
process.env.NEXT_PUBLIC_CONVEX_URL = 'https://test-convex-url.convex.cloud';
