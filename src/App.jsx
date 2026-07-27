import { useState, useCallback } from 'react';
import Header from './components/Header';
import AttendanceForm from './components/AttendanceForm';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from './hooks/useToast';

/**
 * Root application component.
 *
 * Renders a single-page attendance form for KKN 201 — Desa Sukarama.
 */
export default function App() {
  const { toasts, addToast, removeToast } = useToast();
  const [confirmAction, setConfirmAction] = useState(null);

  // ── Toast callbacks for the form ──
  const handleSuccess = useCallback(
    (message) => addToast(message, 'success'),
    [addToast],
  );

  const handleError = useCallback(
    (message) => addToast(message, 'error', 5000),
    [addToast],
  );

  // ── Confirmation flow ──
  const requestConfirm = useCallback((action) => {
    setConfirmAction(() => action);
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmAction) confirmAction();
    setConfirmAction(null);
  }, [confirmAction]);

  const handleCancelConfirm = useCallback(() => {
    setConfirmAction(null);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100/50">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-200/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-100/30 blur-3xl" />
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={confirmAction !== null}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />

      {/* Main content */}
      <main className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col items-stretch justify-center px-4 py-6 sm:py-10">
        {/* Card */}
        <div className="animate-fade-in-up overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl shadow-primary-900/5 backdrop-blur-md">
          <Header />

          {/* Divider */}
          <div className="mx-6 border-t border-gray-100" />

          {/* Form — passes submit action through confirm dialog */}
          <div className="pt-5">
            <AttendanceFormWithConfirm
              onSuccess={handleSuccess}
              onError={handleError}
              requestConfirm={requestConfirm}
            />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}

/**
 * Wrapper that injects the confirm dialog flow into AttendanceForm.
 *
 * AttendanceForm calls `handleSubmit` internally. This wrapper intercepts
 * that flow so the confirm dialog is shown first.
 */
function AttendanceFormWithConfirm({ onSuccess, onError, requestConfirm }) {
  /**
   * We render AttendanceForm and let it handle its own submit.
   * The confirm flow is integrated by having the form call `requestConfirm`
   * with the actual submit function.
   */
  return (
    <AttendanceForm
      onSuccess={onSuccess}
      onError={onError}
      requestConfirm={requestConfirm}
    />
  );
}
