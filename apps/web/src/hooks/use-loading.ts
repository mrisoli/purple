import { useCallback, useState } from 'react';
import { useErrorHandler } from './use-error-handler';

interface UseLoadingOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showErrorToast?: boolean;
  successMessage?: string;
}

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const withLoading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options: UseLoadingOptions = {}
    ): Promise<T | null> => {
      const {
        onSuccess,
        onError,
        showErrorToast = true,
        successMessage,
      } = options;

      setIsLoading(true);

      try {
        const result = await asyncFn();
        
        if (onSuccess) {
          onSuccess();
        }

        if (successMessage) {
          const { toast } = await import('sonner');
          toast.success(successMessage);
        }

        return result;
      } catch (error) {
        const normalizedError = handleError(error, {
          showToast: showErrorToast,
          logError: true,
        });

        if (onError) {
          onError(normalizedError);
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const createLoadingHandler = useCallback(
    <T extends any[]>(
      asyncFn: (...args: T) => Promise<any>,
      options: UseLoadingOptions = {}
    ) => {
      return async (...args: T) => {
        return withLoading(() => asyncFn(...args), options);
      };
    },
    [withLoading]
  );

  return {
    isLoading,
    setIsLoading,
    withLoading,
    createLoadingHandler,
  };
}