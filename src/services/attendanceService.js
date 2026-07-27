/**
 * Attendance API service.
 *
 * This module handles all communication with the Google Apps Script backend.
 * The upload strategy (currently Base64 inline) can be swapped to Google Drive
 * or any other mechanism by modifying `preparePhotoPayload` without touching UI code.
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Mengkompresi gambar dan mengubahnya menjadi Base64.
 * Ini sangat penting karena kamera HP menghasilkan file berukuran MB (jutaan karakter Base64).
 * Google Sheets memiliki batas 50.000 karakter per cell, jadi gambar harus dikompres
 * secara agresif agar string Base64-nya muat di dalam cell.
 *
 * @param {File} file - File gambar.
 * @returns {Promise<string>} Base64 data URL.
 */
export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Dimensi maksimal (diperkecil agar size sangat ringan)
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Kompresi kualitas JPEG ke 60% agar ukurannya di bawah 30-40KB
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
    };
    reader.onerror = () => reject(new Error('Gagal membaca file foto.'));
  });
}

/**
 * Prepares the photo payload for the API request.
 *
 * @param {File} file - The image file.
 * @returns {Promise<string>} The photo payload (Base64 string).
 */
export async function preparePhotoPayload(file) {
  return compressImage(file);
}

/**
 * Formats the current local date as DD-MM-YYYY.
 *
 * @returns {string} Formatted date string.
 */
export function getCurrentDate() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * Formats the current local time as HH:mm:ss.
 *
 * @returns {string} Formatted time string.
 */
export function getCurrentTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * Submits attendance data to the API.
 *
 * @param {Object} data - The attendance form data.
 * @param {string} data.nama - Member name.
 * @param {string} data.status - Attendance status.
 * @param {string} data.keterangan - Reason (if applicable).
 * @param {File} data.foto - Photo file.
 * @param {AbortSignal} signal - AbortController signal for timeout handling.
 * @returns {Promise<Object>} API response: { success: boolean, message: string }.
 * @throws {Error} On network error, timeout, or server error.
 */
export async function submitAttendance({ nama, status, keterangan, foto }, signal) {
  if (!API_URL) {
    throw new Error('API URL belum dikonfigurasi. Silakan atur VITE_API_URL di file .env');
  }

  const fotoPayload = await preparePhotoPayload(foto);

  const body = {
    tanggal: getCurrentDate(),
    jam: getCurrentTime(),
    nama,
    status,
    keterangan: keterangan || '',
    foto: fotoPayload,
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('Gagal memproses respons dari server.');
  }

  return result;
}
