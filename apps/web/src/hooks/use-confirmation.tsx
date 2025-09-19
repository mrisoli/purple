import { useCallback, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ConfirmationOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
};

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    confirmText: 'Continue',
    cancelText: 'Cancel',
    variant: 'default',
  });

  const confirm = useCallback(
    (options: ConfirmationOptions = {}): Promise<boolean> => {
      return new Promise((resolve) => {
        setState((prev) => ({
          ...prev,
          ...options,
          isOpen: true,
          onConfirm: () => {
            setState((current) => ({ ...current, isOpen: false }));
            resolve(true);
          },
          onCancel: () => {
            setState((current) => ({ ...current, isOpen: false }));
            resolve(false);
          },
        }));
      });
    },
    []
  );

  const confirmDelete = useCallback(
    (itemName?: string): Promise<boolean> => {
      return confirm({
        title: `Delete ${itemName || 'item'}?`,
        description: `Are you sure you want to delete this ${itemName || 'item'}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive',
      });
    },
    [confirm]
  );

  const confirmDestructive = useCallback(
    (action: string, itemName?: string): Promise<boolean> => {
      return confirm({
        title: `${action} ${itemName || 'item'}?`,
        description: `Are you sure you want to ${action.toLowerCase()} this ${itemName || 'item'}? This action cannot be undone.`,
        confirmText: action,
        cancelText: 'Cancel',
        variant: 'destructive',
      });
    },
    [confirm]
  );

  const ConfirmationDialog = useCallback(() => {
    return (
      <AlertDialog onOpenChange={() => state.onCancel?.()} open={state.isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={state.onCancel}>
              {state.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={state.onConfirm}
              variant={state.variant}
            >
              {state.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }, [state]);

  return {
    confirm,
    confirmDelete,
    confirmDestructive,
    ConfirmationDialog,
  };
}
