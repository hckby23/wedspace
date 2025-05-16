
import { useState } from 'react';
import { toast as sonnerToast } from "sonner";

// Define proper types for toast
export interface ToastProps {
  description?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

export type ToastActionElement = React.ReactElement;

export function toast({ title, description, action, duration }: ToastProps) {
  return sonnerToast(title as string, {
    description,
    action,
    duration,
  });
}

export const useToast = () => {
  const [toasts, setToasts] = useState<{
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    variant?: "default" | "destructive";
    duration?: number;
  }[]>([]);

  return {
    toast: (props: ToastProps) => toast(props),
    toasts,
    addToast: (toast: any) => {
      setToasts((currentToasts) => [
        ...currentToasts,
        { ...toast, id: toast.id || String(Date.now()) }
      ]);
    },
    removeToast: (id: string) => {
      setToasts((currentToasts) => currentToasts.filter(
        (toast) => toast.id !== id
      ));
    },
  };
};
