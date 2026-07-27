/**
 * Attendance API service.
 *
 * This module handles all communication with the Google Apps Script backend.
 * The upload strategy (currently Base64 inline) can be swapped to Google Drive
 * or any other mechanism by modifying `preparePhotoPayload` without touching UI code.
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Converts a File object to a Base64 data URL string.
 *
 * @param {File} file - The image file to convert.
 * @returns {Promise<string>} Base64 data URL.
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal membaca file foto.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Prepares the photo payload for the API request.
 *
 * Currently converts photo to Base64 string.
 * To switch to Google Drive upload in the future:
 *   1. Upload the file to Google Drive here.
 *   2. Return the Drive file URL/ID instead of Base64.
 *
 * @param {File} file - The image file.
 * @returns {Promise<string>} The photo payload (Base64 string or future Drive URL).
 */
export async function preparePhotoPayload(file) {
  return fileToBase64(file);
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
