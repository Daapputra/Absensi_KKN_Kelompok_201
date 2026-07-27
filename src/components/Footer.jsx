import { Heart } from 'lucide-react';

/**
 * Footer component with KKN group info and copyright.
 */
export default function Footer() {
  return (
    <footer className="animate-fade-in delay-500 mt-6 pb-8 text-center">
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <span>Dibuat dengan</span>
        <Heart className="h-3 w-3 fill-red-400 text-red-400" />
        <span>oleh</span>
      </div>
      <p className="mt-1 text-xs font-semibold text-gray-500">
        Kelompok KKN 201 — Desa Sukarama
      </p>
      <p className="mt-0.5 text-[11px] text-gray-400">
        Universitas Islam Negeri Sunan Gunung Djati Bandung
      </p>
      <p className="mt-1 text-[11px] text-gray-300">
        &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
