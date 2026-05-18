/**
 * Local fallback fixtures.
 * Identical shape to the JSON hosted on npoint.io — the api/client.js
 * module falls back to these when VITE_API_URL is unset or REPLACE_ME so
 * the dev server still works offline.
 */
import seed from './seed.json';

export const { specialties, users, appointments, availabilities } = seed;
