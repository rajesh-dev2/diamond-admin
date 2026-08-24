import React, { useEffect, useState } from 'react';
import './style.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

let toasts: ToastItem[] = [];
let listeners: Array<(items: ToastItem[]) => void> = [];
let counter = 0;

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

function show(type: ToastType, message: string, duration = 3000) {
  const id = ++counter;
  toasts = [...toasts, { id, type, message }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, duration);
}

export const toast = {
  success: (message: string, duration?: number) => show('success', message, duration),
  error: (message: string, duration?: number) => show('error', message, duration),
  info: (message: string, duration?: number) => show('info', message, duration),
};

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>(toasts);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((l) => l !== setItems);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="common-toast-container">
      {items.map((item) => (
        <div key={item.id} className={`common-toast common-toast-${item.type}`}>
          {item.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
