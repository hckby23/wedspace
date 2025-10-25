
import { useState } from 'react';

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
  try {
    if (typeof window !== 'undefined') {
      const message = [title, description]
        .filter(Boolean)
        .map((v) => (typeof v === 'string' ? v : ''))
        .join(' — ');
      window.alert(message || '');
    }
  } catch {}
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
