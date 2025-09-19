import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  toastTitle?: string;
  logError?: boolean;
  fallbackMessage?: string;
  onError?: (error: Error) => void;
}

export function useErrorHandler() {
  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        toastTitle,
        logError = true,
        fallbackMessage = 'Something went wrong. Please try again.',
        onError,
      } = options;

      // Normalize error to Error object
      const normalizedError =
        error instanceof Error
          ? error
          : new Error(typeof error === 'string' ? error : 'Unknown error');

      // Log error for debugging
      if (logError) {
        console.error('Error handled:', normalizedError);
      }

      // Show toast notification
      if (showToast) {
        const message = normalizedError.message || fallbackMessage;

        if (toastTitle) {
          toast.error(toastTitle, {
            description: message,
          });
        } else {
          toast.error(message);
        }
      }

      // Call custom error handler
      if (onError) {
        onError(normalizedError);
      }

      return normalizedError;
    },
    []
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options: ErrorHandlerOptions = {}
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, options);
        return null;
      }
    },
    [handleError]
  );

  const createErrorHandler = useCallback(
    (options: ErrorHandlerOptions = {}) => {
      return (error: unknown) => handleError(error, options);
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
    createErrorHandler,
  };
}
