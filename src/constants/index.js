/**
 * List of KKN 201 group members for the attendance dropdown.
 */
export const MEMBERS = [
  'Achmad Malik Achnida Syam',
  'Dini Mulyani',
  'Faiza Alipvia Khoerunnnisa',
  'Farhana Nour Azizah',
  'Fikri Akmal Aufaa Fadhlurrahman',
  'Ilham Farhan Ramadhan',
  'Ilma Siti Hafizhah',
  'Kelvin Marthin Saruning',
  'Marsha Nur Fauziah',
  'Muhammad Nur Daffa Naufal Putra',
  'Nazelia Lestari Budiawan',
  'Santi Aulia',
  'Seila Zahra Nurhaliza',
  'Shafira Wahyudiani',
  'Zikna Azkiya',
];

/**
 * Available attendance statuses.
 */
export const ATTENDANCE_STATUSES = ['Hadir', 'Izin', 'Sakit'];

/**
 * Statuses that require a reason (keterangan).
 */
export const STATUSES_REQUIRING_REASON = ['Izin', 'Sakit'];

/**
 * Maximum photo file size in bytes (5 MB).
 */
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

/**
 * Accepted image MIME types.
 */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/**
 * API request timeout in milliseconds (20 seconds).
 */
export const API_TIMEOUT = 20_000;

/**
 * Cooldown period after successful submission in milliseconds (5 seconds).
 */
export const SUBMIT_COOLDOWN = 5_000;
