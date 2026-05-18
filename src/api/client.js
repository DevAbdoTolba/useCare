/**
 * Mock data client.
 *
 * Strategy:
 *   - The whole mock DB lives as a single JSON object hosted on npoint.io.
 *   - On first call, getDb() fetches that JSON and caches the promise.
 *   - All subsequent calls reuse the cache (one network hit per page load).
 *   - If VITE_API_URL is missing or still the placeholder, we fall back to
 *     local fixtures so the app works offline.
 *
 * Mutations:
 *   - npoint is read-only via API. Mutation methods in api/*.js return
 *     optimistic shapes + console.warn. Refresh the page to reset.
 */

import * as fixtures from '../schema/fixtures.js';

const URL = import.meta.env.VITE_API_URL ?? '';
const USING_FIXTURES = !URL || URL.includes('REPLACE_ME');

/** @type {Promise<{specialties: any[], users: any[], appointments: any[], availabilities: any[]}> | null} */
let _dbPromise = null;

export function getDb() {
  if (_dbPromise) return _dbPromise;

  if (USING_FIXTURES) {
    // eslint-disable-next-line no-console
    console.warn(
      '[useCare] VITE_API_URL not set (or REPLACE_ME) — using local fixtures. ' +
        'Set the npoint URL in .env to share data with the team.'
    );
    _dbPromise = Promise.resolve({
      specialties: fixtures.specialties,
      users: fixtures.users,
      appointments: fixtures.appointments,
      availabilities: fixtures.availabilities,
    });
    return _dbPromise;
  }

  _dbPromise = fetch(URL)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load mock DB: ${r.status}`);
      return r.json();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[useCare] Mock DB fetch failed, falling back to fixtures.', err);
      return {
        specialties: fixtures.specialties,
        users: fixtures.users,
        appointments: fixtures.appointments,
        availabilities: fixtures.availabilities,
      };
    });

  return _dbPromise;
}

/** Bust the in-memory cache (useful if the dev edits the npoint bin). */
export function clearDbCache() {
  _dbPromise = null;
}

/** Helper for mutation stubs to log consistently. */
export function warnReadOnly(method) {
  // eslint-disable-next-line no-console
  console.warn(`[useCare] ${method}: npoint is read-only — change is local-only, lost on refresh.`);
}
