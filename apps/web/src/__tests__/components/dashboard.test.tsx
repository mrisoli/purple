import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import Dashboard from '../../app/dashboard/page';

// Mock dependencies
vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(),
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <div data-testid="user-button">UserButton</div>,
}));

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  Authenticated: ({ children }: { children: React.ReactNode }) => children,
  Unauthenticated: ({ children }: { children: React.ReactNode }) => null,
  AuthLoading: ({ children }: { children: React.ReactNode }) => null,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockUseUser = useUser as vi.MockedFunction<typeof useUser>;
const mockUseQuery = useQuery as vi.MockedFunction<typeof useQuery>;
const mockUseMutation = useMutation as vi.MockedFunction<typeof useMutation>;

describe('Dashboard Component', () => {
  const mockMutation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      user: {
        id: 'test-user-id',
        fullName: 'Test User',
        firstName: 'Test',
      },
      isSignedIn: true,
      isLoaded: true,
    } as any);

    mockUseMutation.mockReturnValue(mockMutation);
  });

  it('renders dashboard title', () => {
    mockUseQuery
      .mockReturnValueOnce({ premium: false }) // currentUser
      .mockReturnValueOnce([]) // projects
      .mockReturnValueOnce([]); // recentActions

    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays welcome message with user name', () => {
    mockUseQuery
      .mockReturnValueOnce({ premium: false })
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    render(<Dashboard />);
    expect(screen.getByText(/Welcome back, Test User!/)).toBeInTheDocument();
  });

  it('shows free user status', () => {
    mockUseQuery
      .mockReturnValueOnce({ premium: false })
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    render(<Dashboard />);
    expect(screen.getByText(/\(Free\)/)).toBeInTheDocument();
  });

  it('shows premium user status', () => {
    mockUseQuery
      .mockReturnValueOnce({ premium: true })
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    render(<Dashboard />);
    expect(screen.getByText(/\(Premium\)/)).toBeInTheDocument();
  });

  it('displays project statistics', () => {
    const mockProjects = [
      { _id: '1', name: 'Project 1', buddyId: null },
      { _id: '2', name: 'Project 2', buddyId: 'buddy1' },
    ];

    mockUseQuery
      .mockReturnValueOnce({ premium: false })
      .mockReturnValueOnce(mockProjects)
      .mockReturnValueOnce([]);

    render(<Dashboard />);
    expect(screen.getByText('2')).toBeInTheDocument(); // Total projects
    expect(screen.getByText('1')).toBeInTheDocument(); // Projects with buddies
  });

  it('shows empty state when no projects exist', () => {
    mockUseQuery
      .mockReturnValueOnce({ premium: false })
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    render(<Dashboard />);
    expect(screen.getByText('No projects yet')).toBeInTheDocument();
    expect(
      screen.getByText('Create your first project to start your accountability journey!')
    ).toBeInTheDocument();
  });

  it('shows upgrade prompt for free users with projects', () => {
    const mockProjects = [{ _id: '1', name: 'Project 1', buddyId: null }];

    mockUseQuery
      .mockReturnValueOnce({ premium: false })
      .mockReturnValueOnce(mockProjects)
      .mockReturnValueOnce([]);

    render(<Dashboard />);
    expect(screen.getByText('Unlock More Projects')).toBeInTheDocument();
    expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument();
  });

  it('does not show upgrade prompt for premium users', () => {
    const mockProjects = [{ _id: '1', name: 'Project 1', buddyId: null }];

    mockUseQuery
      .mockReturnValueOnce({ premium: true })
      .mockReturnValueOnce(mockProjects)
      .mockReturnValueOnce([]);

    render(<Dashboard />);
    expect(screen.queryByText('Unlock More Projects')).not.toBeInTheDocument();
  });
});