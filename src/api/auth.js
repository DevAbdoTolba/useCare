import { getDb, warnReadOnly } from './client.js';

/**
 * Mock auth. No real network call.
 * - login: matches a user by email, ignores password
 * - register: returns the would-be user with status='pending', not persisted
 * - logout: no-op
 */

/** @param {string} email @param {string} _password */
export async function login(email, _password) {
  const db = await getDb();
  const found = db.users.find((u) => u.email === email);
  return {
    token: 'dummy-token',
    user:
      found ?? {
        id: 0, name: 'Guest', email, role: 'patient', status: 'approved',
      },
  };
}

export async function register(payload) {
  warnReadOnly('register');
  return { token: 'dummy-token', user: { id: 99, status: 'pending', ...payload } };
}

export async function logout() {
  return true;
}
