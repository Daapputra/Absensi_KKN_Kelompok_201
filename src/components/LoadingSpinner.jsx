import { Loader2 } from 'lucide-react';

/**
 * Loading spinner with optional text label.
 *
 * @param {{ text?: string }} props
 */
export default function LoadingSpinner({ text = 'Mengirim...' }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="h-5 w-5 animate-spin-custom" />
      <span>{text}</span>
    </span>
  );
}
