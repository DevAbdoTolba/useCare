/**
 * Standalone localStorage store for doctor-proposed specialties (mock).
 *
 * When a registering doctor can't find their specialty, they propose a new
 * one. It lands here as "pending" until an admin approves/rejects it on the
 * Specialties page. Read-only npoint can't take writes, so — like the ratings
 * and availability stores — this lives in localStorage and is seeded once from
 * the bundled demo data.
 */
import seed from '../schema/seed.json';

const KEY = 'usecare_specialty_suggestions';

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return [];
  }
  const seeded = (seed.specialty_suggestions ?? []).map((s) => ({ ...s }));
  try { localStorage.setItem(KEY, JSON.stringify(seeded)); } catch { /* ignore */ }
  return seeded;
}

function writeAll(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export function listSuggestions() {
  return readAll();
}

export function listPendingSuggestions() {
  return readAll().filter((s) => s.status === 'pending');
}

/** Record a new proposal. Returns the created suggestion. */
export function addSpecialtySuggestion(name, proposedBy = '') {
  const all = readAll();
  const id = all.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1;
  const rec = { id, name: String(name).trim(), proposed_by: proposedBy, status: 'pending' };
  all.push(rec);
  writeAll(all);
  return rec;
}

/** Approve or reject a suggestion. */
export function setSuggestionStatus(id, status) {
  const all = readAll().map((s) => (s.id === id ? { ...s, status } : s));
  writeAll(all);
  return all.find((s) => s.id === id);
}
