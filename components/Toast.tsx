
import React, { useEffect } from 'react';
import { InfoIcon, CheckCircleIcon, WarningIcon, CloseIcon } from './icons';

export type ToastType = 'info' | 'success' | 'error';

export interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
  onDismiss: (id: number) => void;
}

const toastConfig = {
  info: {
    icon: <InfoIcon />,
    bg: 'bg-blue-500',
  },
  success: {
    icon: <CheckCircleIcon />,
    bg: 'bg-brand-accent',
  },
  error: {
    icon: <WarningIcon />,
    bg: 'bg-red-500',
  },
};

const Toast: React.FC<ToastProps> = ({ id, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onDismiss]);
  
  const config = toastConfig[type];

  return (
    <div className={`flex items-center p-4 rounded-lg shadow-2xl text-white ${config.bg} animate-fade-in`}>
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button onClick={() => onDismiss(id)} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full inline-flex hover:bg-white/20">
        <CloseIcon />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: Omit<ToastProps, 'onDismiss'>[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
