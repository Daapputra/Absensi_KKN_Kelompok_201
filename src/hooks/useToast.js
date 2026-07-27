import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing toast notifications.
 *
 * @returns {{ toasts: Array, addToast: Function, removeToast: Function }}
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback(
    (message, type = 'success', duration = 4000) => {
      const id = ++counterRef.current;
      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
      setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast],
  );

  return { toasts, addToast, removeToast };
}
