import { AlertTriangle } from 'lucide-react';

/**
 * Confirmation dialog with backdrop overlay.
 *
 * @param {{ isOpen: boolean, onConfirm: Function, onCancel: Function }} props
 */
export default function ConfirmDialog({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="animate-overlay-in fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="animate-scale-in w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>

        {/* Message */}
        <h2 className="text-center text-lg font-bold text-gray-800">
          Konfirmasi Absensi
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Apakah data absensi sudah benar?
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.97]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition-all hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.97]"
          >
            Ya, Kirim
          </button>
        </div>
      </div>
    </div>
  );
}
