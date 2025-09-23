import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Dashboard from '@/app/dashboard/page';
import { useMutation, useQuery } from 'convex/react';

describe('User Journey Integration Tests', () => {
  const mockCreateProject = vi.fn();
  const mockGetOrCreateUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock returns
    (useQuery as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce({ _id: 'user-1', premium: false })
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(mockCreateProject);
  });

  it('renders dashboard for authenticated user', async () => {
    render(<Dashboard />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument();
    expect(screen.getByText('Your Projects')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('shows empty state when user has no projects', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('No projects yet')).toBeInTheDocument();
      expect(screen.getByText('Create your first project to start your accountability journey!')).toBeInTheDocument();
    });
  });

  it('allows creating a new project', async () => {
    const user = userEvent.setup();
    
    mockCreateProject.mockResolvedValue({ _id: 'new-project-id' });

    render(<Dashboard />);

    // Click "New Project" button
    const newProjectButton = screen.getByRole('button', { name: /new project/i });
    await user.click(newProjectButton);

    // Fill out project form
    const nameInput = screen.getByLabelText(/project name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await user.type(nameInput, 'Learn TypeScript');
    await user.type(descriptionInput, 'Master TypeScript fundamentals and advanced concepts');

    // Submit form
    const createButton = screen.getByRole('button', { name: /create project/i });
    await user.click(createButton);

    // Verify project creation was called
    await waitFor(() => {
      expect(mockCreateProject).toHaveBeenCalledWith({
        name: 'Learn TypeScript',
        description: 'Master TypeScript fundamentals and advanced concepts',
      });
    });
  });

  it('displays existing projects correctly', async () => {
    // Reset mocks for this test
    vi.clearAllMocks();
    
    // Mock with existing projects
    (useQuery as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce({ _id: 'user-1', premium: false })
      .mockReturnValueOnce([
        {
          _id: 'project-1',
          name: 'Learn React',
          description: 'Master React fundamentals',
          buddyId: 'buddy-1',
          createdAt: Date.now() - 86400000,
        },
        {
          _id: 'project-2',
          name: 'Build Portfolio',
          description: 'Create an awesome portfolio website',
          buddyId: null,
          createdAt: Date.now() - 172800000,
        },
      ])
      .mockReturnValueOnce([
        {
          _id: 'action-1',
          type: 'progress_update',
          message: 'Completed first chapter',
          createdAt: Date.now() - 3600000,
          user: { name: 'Test User' },
          project: { name: 'Learn React' },
        },
      ]);
    
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(mockCreateProject);

    render(<Dashboard />);

    // Check projects are displayed
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(screen.getByText('Build Portfolio')).toBeInTheDocument();
      expect(screen.getByText('Has Buddy')).toBeInTheDocument();
      expect(screen.getByText('Needs Buddy')).toBeInTheDocument();
    });

    // Check recent activity
    expect(screen.getByText('Completed first chapter')).toBeInTheDocument();
    expect(screen.getByText(/Test User in "Learn React"/)).toBeInTheDocument();
  });

  it('shows upgrade prompt for free users with max projects', async () => {
    // Reset mocks for this test
    vi.clearAllMocks();
    
    // Mock free user with one project (at limit)
    (useQuery as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce({ _id: 'user-1', premium: false })
      .mockReturnValueOnce([
        {
          _id: 'project-1',
          name: 'Learn React',
          description: 'Master React fundamentals',
          buddyId: null,
          createdAt: Date.now(),
        },
      ])
      .mockReturnValueOnce([]);
    
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(mockCreateProject);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Unlock More Projects')).toBeInTheDocument();
      expect(screen.getByText('You\'ve used your free project!')).toBeInTheDocument();
    });
  });

  it('handles project creation validation errors', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    // Click "New Project" button
    const newProjectButton = screen.getByRole('button', { name: /new project/i });
    await user.click(newProjectButton);

    // Try to submit without required fields
    const createButton = screen.getByRole('button', { name: /create project/i });
    await user.click(createButton);

    // Should show validation error (from our validation logic)
    await waitFor(() => {
      expect(mockCreateProject).not.toHaveBeenCalled();
    });
  });
});