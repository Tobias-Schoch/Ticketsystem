import { create } from 'zustand';
import type { Toast, ToastType } from '../types';
import { generateId } from '../utils/dateUtils';

interface ToastState {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (type: ToastType, message: string, duration = 4000) => {
    const toast: Toast = {
      id: generateId(),
      type,
      message,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast].slice(-5), // Keep max 5 toasts
    }));
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// Convenience hook for using toast
export function useToast() {
  const { addToast } = useToastStore();

  return {
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    info: (message: string) => addToast('info', message),
    warning: (message: string) => addToast('warning', message),
  };
}
