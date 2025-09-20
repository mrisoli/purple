import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FormField } from '@/components/form-field';

// Test constants to avoid magic numbers
const WARNING_THRESHOLD_95 = 95;

describe('FormField Component', () => {
  const defaultProps = {
    label: 'Test Field',
    id: 'test-field',
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render label and input', () => {
    render(<FormField {...defaultProps} />);

    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show required asterisk when required prop is true', () => {
    render(<FormField {...defaultProps} required />);

    const label = screen.getByText('Test Field');
    expect(label.parentElement).toHaveTextContent('Test Field*');
  });

  it('should call onChange when input value changes', () => {
    const mockOnChange = vi.fn();
    render(<FormField {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('should display placeholder text', () => {
    render(<FormField {...defaultProps} placeholder="Enter text here" />);

    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('should show error message when error prop is provided', () => {
    render(<FormField {...defaultProps} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();

    // Check that input has error styling
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should show description when description prop is provided', () => {
    render(
      <FormField
        {...defaultProps}
        description="This is a helpful description"
      />
    );

    expect(
      screen.getByText('This is a helpful description')
    ).toBeInTheDocument();
  });

  it('should hide description when error is present', () => {
    render(
      <FormField
        {...defaultProps}
        description="This is a helpful description"
        error="This field is required"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(
      screen.queryByText('This is a helpful description')
    ).not.toBeInTheDocument();
  });

  it('should show character count when showCharCount and maxLength are provided', () => {
    render(
      <FormField
        {...defaultProps}
        maxLength={100}
        showCharCount
        value="hello"
      />
    );

    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('should show warning color for character count when approaching limit', () => {
    render(
      <FormField
        {...defaultProps}
        maxLength={100} // 95% of 100 character limit
        showCharCount
        value={'a'.repeat(WARNING_THRESHOLD_95)}
      />
    );

    const charCount = screen.getByText('95/100');
    expect(charCount).toHaveClass('text-amber-600');
  });

  it('should show normal color for character count when below warning threshold', () => {
    render(
      <FormField
        {...defaultProps}
        maxLength={100}
        showCharCount
        value="hello"
      />
    );

    const charCount = screen.getByText('5/100');
    expect(charCount).toHaveClass('text-muted-foreground');
  });

  it('should set input type correctly', () => {
    render(<FormField {...defaultProps} type="email" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should set maxLength attribute on input', () => {
    render(<FormField {...defaultProps} maxLength={50} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('should associate error message with input using aria-describedby', () => {
    render(<FormField {...defaultProps} error="This field is required" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'test-field-error');

    const errorElement = document.getElementById('test-field-error');
    expect(errorElement).toBeInTheDocument();
  });

  it('should associate description with input using aria-describedby', () => {
    render(<FormField {...defaultProps} description="Helpful description" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'test-field-description');

    const descriptionElement = document.getElementById(
      'test-field-description'
    );
    expect(descriptionElement).toBeInTheDocument();
  });
});
