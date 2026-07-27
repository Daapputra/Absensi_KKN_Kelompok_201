import { useState, useRef, useCallback, useEffect } from 'react';
import {
  User,
  CheckSquare,
  Camera,
  Send,
  ChevronDown,
  Search,
  FileText,
  AlertCircle,
} from 'lucide-react';
import PhotoPreview from './PhotoPreview';
import LoadingSpinner from './LoadingSpinner';
import {
  MEMBERS,
  ATTENDANCE_STATUSES,
  STATUSES_REQUIRING_REASON,
  MAX_PHOTO_SIZE,
  ACCEPTED_IMAGE_TYPES,
  API_TIMEOUT,
  SUBMIT_COOLDOWN,
} from '../constants';
import { submitAttendance } from '../services/attendanceService';

/**
 * Main attendance form component.
 *
 * @param {{ onSuccess: Function, onError: Function, requestConfirm: Function }} props
 */
export default function AttendanceForm({ onSuccess, onError, requestConfirm }) {
  // ── Form State ──
  const [nama, setNama] = useState('');
  const [status, setStatus] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [foto, setFoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // ── UI State ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [photoError, setPhotoError] = useState('');

  // ── Refs ──
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // ── Derived State ──
  const needsReason = STATUSES_REQUIRING_REASON.includes(status);
  const isFormValid =
    nama !== '' &&
    status !== '' &&
    foto !== null &&
    (!needsReason || keterangan.trim() !== '');

  // ── Close dropdown on outside click ──
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Focus search when dropdown opens ──
  useEffect(() => {
    if (showDropdown && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showDropdown]);

  // ── Filtered members ──
  const filteredMembers = MEMBERS.filter((m) =>
    m.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── Handlers ──
  const handleSelectMember = useCallback((member) => {
    setNama(member);
    setShowDropdown(false);
    setSearchQuery('');
  }, []);

  const handleStatusChange = useCallback((e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (!STATUSES_REQUIRING_REASON.includes(newStatus)) {
      setKeterangan('');
    }
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    setPhotoError('');

    if (!file) return;

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setPhotoError('Format foto harus JPG, JPEG, atau PNG.');
      e.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError('Ukuran foto maksimal 5 MB.');
      e.target.value = '';
      return;
    }

    setFoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleResetPhoto = useCallback(() => {
    setFoto(null);
    setPreviewUrl('');
    setPhotoError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const resetForm = useCallback(() => {
    setNama('');
    setStatus('');
    setKeterangan('');
    handleResetPhoto();
    setSearchQuery('');
  }, [handleResetPhoto]);

  const doSubmit = useCallback(async () => {
    if (!isFormValid || isSubmitting || isCooldown) return;

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const result = await submitAttendance(
        { nama, status, keterangan, foto },
        controller.signal,
      );

      clearTimeout(timeout);

      if (result.success) {
        onSuccess(result.message || 'Absensi berhasil dicatat!');
        resetForm();

        // Cooldown
        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), SUBMIT_COOLDOWN);
      } else {
        onError(result.message || 'Terjadi kesalahan pada server.');
      }
    } catch (error) {
      clearTimeout(timeout);

      if (error.name === 'AbortError') {
        onError('Koneksi timeout, silakan coba kembali.');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        onError('Koneksi jaringan terputus. Periksa koneksi internet Anda.');
      } else {
        onError(error.message || 'Terjadi kesalahan. Silakan coba kembali.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormValid, isSubmitting, isCooldown, nama, status, keterangan, foto, onSuccess, onError, resetForm]);

  const handleSubmit = useCallback(() => {
    if (!isFormValid || isSubmitting || isCooldown) return;
    requestConfirm(doSubmit);
  }, [isFormValid, isSubmitting, isCooldown, requestConfirm, doSubmit]);

  return (
    <div className="space-y-5 px-6 pb-2">
      {/* ── Name Searchable Dropdown ── */}
      <div className="animate-fade-in-up delay-100 relative z-50">
        <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <User className="h-4 w-4 text-primary-600" />
          Nama Anggota
        </label>
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className={`
              flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-sm transition-all
              ${showDropdown ? 'border-primary-400 ring-2 ring-primary-100' : 'border-gray-300 hover:border-primary-300'}
              ${nama ? 'text-gray-900' : 'text-gray-500'}
            `}
          >
            <span className="truncate">{nama || 'Pilih nama anggota...'}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {showDropdown && (
            <div className="animate-slide-down absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              {/* Search Input */}
              <div className="border-b border-gray-200 p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama..."
                    className="w-full rounded-lg bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:bg-primary-50"
                  />
                </div>
              </div>

              {/* Options List */}
              <ul className="max-h-52 overflow-y-auto py-1">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <li key={member}>
                      <button
                        type="button"
                        onClick={() => handleSelectMember(member)}
                        className={`
                          w-full px-4 py-2.5 text-left text-sm transition-colors
                          ${member === nama
                            ? 'bg-primary-50 font-semibold text-primary-700'
                            : 'text-gray-900 hover:bg-gray-100'
                          }
                        `}
                      >
                        {member}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-center text-sm text-gray-500">
                    Nama tidak ditemukan
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── Status Dropdown ── */}
      <div className="animate-fade-in-up delay-200">
        <label
          htmlFor="status"
          className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <CheckSquare className="h-4 w-4 text-primary-600" />
          Status Kehadiran
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className={`
            w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition-all
            outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100
            ${status ? 'text-gray-900' : 'text-gray-500'}
          `}
        >
          <option value="" disabled>
            Pilih status kehadiran...
          </option>
          {ATTENDANCE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* ── Keterangan (conditional) ── */}
      {needsReason && (
        <div className="animate-slide-down">
          <label
            htmlFor="keterangan"
            className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <FileText className="h-4 w-4 text-primary-600" />
            Keterangan
          </label>
          <textarea
            id="keterangan"
            rows={3}
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Masukkan alasan..."
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      )}

      {/* ── Photo Capture ── */}
      <div className="animate-fade-in-up delay-300">
        <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Camera className="h-4 w-4 text-primary-600" />
          Ambil Foto
        </label>

        {!previewUrl && (
          <label
            htmlFor="foto"
            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/80 py-8 transition-all hover:border-primary-400 hover:bg-primary-50/50"
          >
            <div className="rounded-xl bg-white p-3 shadow-sm transition-transform group-hover:scale-105 border border-gray-200">
              <Camera className="h-6 w-6 text-primary-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">
                Ketuk untuk mengambil foto
              </p>
              <p className="mt-0.5 text-xs font-medium text-gray-500">
                JPG, JPEG, atau PNG • Maks. 5 MB
              </p>
            </div>
          </label>
        )}

        <input
          ref={fileInputRef}
          id="foto"
          type="file"
          accept="image/*"
          capture="user"
          onChange={handlePhotoChange}
          className="hidden"
        />

        {/* Photo error */}
        {photoError && (
          <div className="animate-slide-down mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {photoError}
          </div>
        )}

        {/* Photo preview */}
        <PhotoPreview previewUrl={previewUrl} onReset={handleResetPhoto} />
      </div>

      {/* ── Submit Button ── */}
      <div className="animate-fade-in-up delay-400 pt-2 pb-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting || isCooldown}
          className={`
            flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold tracking-wide transition-all
            ${
              isFormValid && !isSubmitting && !isCooldown
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.98]'
                : 'cursor-not-allowed bg-gray-100 text-gray-400'
            }
          `}
        >
          {isSubmitting ? (
            <LoadingSpinner />
          ) : isCooldown ? (
            <span>Mohon tunggu...</span>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Kirim Absensi</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
