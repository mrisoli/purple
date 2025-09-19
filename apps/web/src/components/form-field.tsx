import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormFieldProps = {
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
};

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
      <Label className="font-medium text-sm" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <Input
        aria-describedby={(() => {
          if (error) {
            return `${id}-error`;
          }
          if (description) {
            return `${id}-description`;
          }
          return;
        })()}
        aria-invalid={hasError}
        className={cn(hasError && 'border-red-500 focus-visible:ring-red-500')}
        id={id}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {error && (
        <div
          className="flex items-start gap-2 text-red-600 text-sm"
          id={`${id}-error`}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {description && !error && (
        <p className="text-muted-foreground text-sm" id={`${id}-description`}>
          {description}
        </p>
      )}
    </div>
  );
}
