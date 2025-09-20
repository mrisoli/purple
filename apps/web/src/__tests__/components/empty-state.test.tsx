import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Target } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';

describe('EmptyState Component', () => {
  it('should render title and description', () => {
    render(
      <EmptyState
        icon={Target}
        title="No projects yet"
        description="Create your first project to get started!"
      />
    );

    expect(screen.getByText('No projects yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first project to get started!')).toBeInTheDocument();
  });

  it('should render icon', () => {
    render(
      <EmptyState
        icon={Target}
        title="Test Title"
        description="Test Description"
      />
    );

    // Check if the icon's svg element is rendered
    const svgIcon = document.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  it('should render action button when action prop is provided', () => {
    const mockAction = vi.fn();
    
    render(
      <EmptyState
        icon={Target}
        title="No projects yet"
        description="Create your first project to get started!"
        action={{
          label: 'Create Project',
          onClick: mockAction,
        }}
      />
    );

    const button = screen.getByRole('button', { name: 'Create Project' });
    expect(button).toBeInTheDocument();
  });

  it('should not render action button when action prop is not provided', () => {
    render(
      <EmptyState
        icon={Target}
        title="No projects yet"
        description="Create your first project to get started!"
      />
    );

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('should call action.onClick when button is clicked', () => {
    const mockAction = vi.fn();
    
    render(
      <EmptyState
        icon={Target}
        title="No projects yet"
        description="Create your first project to get started!"
        action={{
          label: 'Create Project',
          onClick: mockAction,
        }}
      />
    );

    const button = screen.getByRole('button', { name: 'Create Project' });
    fireEvent.click(button);
    
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <EmptyState
        icon={Target}
        title="Test Title"
        description="Test Description"
        className="custom-class"
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });
});