import { CheckCircle2, XCircle, X } from 'lucide-react';

/**
 * Toast notification container that renders a stack of toasts.
 *
 * @param {{ toasts: Array, onClose: Function }} props
 */
export default function Toast({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 left-4 z-50 flex flex-col items-center gap-2 sm:left-auto sm:w-96">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex w-full items-start gap-3 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm
            ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
            ${
              toast.type === 'success'
                ? 'bg-primary-600/95 text-white'
                : 'bg-red-600/95 text-white'
            }
          `}
          role="alert"
        >
          {/* Icon */}
          {toast.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}

          {/* Message */}
          <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>

          {/* Close button */}
          <button
            type="button"
            onClick={() => onClose(toast.id)}
            className="shrink-0 rounded-lg p-0.5 transition-colors hover:bg-white/20"
            aria-label="Tutup notifikasi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
