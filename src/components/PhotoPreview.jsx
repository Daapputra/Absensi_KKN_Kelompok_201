import { RefreshCw, ImageIcon } from 'lucide-react';

/**
 * Photo preview component with change photo button.
 *
 * @param {{ previewUrl: string, onReset: Function }} props
 */
export default function PhotoPreview({ previewUrl, onReset }) {
  if (!previewUrl) return null;

  return (
    <div className="animate-fade-in mt-3 space-y-3">
      {/* Preview image */}
      <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <img
          src={previewUrl}
          alt="Preview foto absensi"
          className="mx-auto max-h-56 w-auto object-contain p-2"
        />

        {/* Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-gray-600 backdrop-blur-sm">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Preview</span>
        </div>
      </div>

      {/* Change photo button */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 active:scale-[0.97]"
      >
        <RefreshCw className="h-4 w-4" />
        Ganti Foto
      </button>
    </div>
  );
}
