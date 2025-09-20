import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CHAR_COUNT_WARNING_THRESHOLD, cn } from '@/lib/utils';

type FormTextareaProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  description?: string;
  className?: string;
  maxLength?: number;
  showCharCount?: boolean;
  rows?: number;
};

export function FormTextarea({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  description,
  className,
  maxLength,
  showCharCount = false,
  rows = 3,
}: FormTextareaProps) {
  const hasError = Boolean(error);

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="font-medium text-sm" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <Textarea
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
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
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
      {showCharCount && maxLength && (
        <div className="flex justify-end">
          <span
            className={cn(
              'text-xs',
              value.length > maxLength * CHAR_COUNT_WARNING_THRESHOLD
                ? 'text-amber-600'
                : 'text-muted-foreground'
            )}
          >
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}
