/**
 * Header component displaying the KKN 201 logo, title and subtitle.
 */
export default function Header() {
  return (
    <header className="animate-fade-in-up text-center pt-8 pb-2 px-4 sm:pt-10">
      {/* Logo KKN */}
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg shadow-primary-500/15 ring-2 ring-primary-100 sm:h-28 sm:w-28">
        <img
          src="/logo-kkn.jpg"
          alt="Logo KKN 201 Desa Sukarama"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
        Absensi Kelompok KKN 201
      </h1>

      {/* Subtitles */}
      <p className="mt-1.5 text-base font-semibold text-primary-700 sm:text-lg">
        Desa Sukarama
      </p>
      <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
        Universitas Islam Negeri Sunan Gunung Djati Bandung
      </p>
    </header>
  );
}
