import { users } from '../schema/fixtures.js';

/**
 * Mock auth. Always succeeds for any non-empty email/password.
 * Returns the first user with that email if found, else a fake patient user.
 * No real network call yet — see src/api/client.js for the real wrapper.
 */

/** @param {string} email @param {string} password */
export async function login(email, password) {
  // TODO: replace with real call to POST /auth/login
  const found = users.find((u) => u.email === email);
  return {
    token: 'dummy-token',
    user: found ?? {
      id: 0, name: 'Guest', email, role: 'patient', status: 'approved',
    },
  };
}

export async function register(payload) {
  // TODO: replace with real call to POST /auth/register
  return { token: 'dummy-token', user: { id: 99, status: 'pending', ...payload } };
}

export async function logout() {
  // TODO: replace with real call to POST /auth/logout
  return true;
}
