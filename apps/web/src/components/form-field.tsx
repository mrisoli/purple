import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password';
  error?: string;
  description?: string;
  className?: string;
}

export function FormField({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  error,
  description,
  className,
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={cn(
          hasError && 'border-red-500 focus-visible:ring-red-500'
        )}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${id}-error` : description ? `${id}-description` : undefined
        }
      />
      {error && (
        <div
          id={`${id}-error`}
          className="flex items-start gap-2 text-red-600 text-sm"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {description && !error && (
        <p id={`${id}-description`} className="text-muted-foreground text-sm">
          {description}
        </p>
      )}
    </div>
  );
}