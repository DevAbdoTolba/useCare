/**
 * Minimal fetch wrapper. Reads VITE_API_URL from .env.
 * Today every method returns fixture data via the per-entity modules.
 * When a real backend exists, swap the bodies to call this client.
 *
 * Usage:
 *   import { apiGet, apiPost } from './client';
 *   const users = await apiGet('/users');
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

/** @param {string} path */
function url(path) {
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** @param {Response} res */
async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

export async function apiGet(path)             { return handle(await fetch(url(path))); }
export async function apiPost(path, body)      { return handle(await fetch(url(path), { method: 'POST',   headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })); }
export async function apiPut(path, body)       { return handle(await fetch(url(path), { method: 'PUT',    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })); }
export async function apiPatch(path, body)     { return handle(await fetch(url(path), { method: 'PATCH',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })); }
export async function apiDelete(path)          { return handle(await fetch(url(path), { method: 'DELETE' })); }
