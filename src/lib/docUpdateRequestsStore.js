/**
 * Standalone localStorage store for doctor document-update requests (mock).
 *
 * A doctor can't silently swap their résumé/license — those are the admin's
 * basis for approval. Instead they file a change request that lands here as
 * "pending" until an admin approves it (which then patches the user) or rejects
 * it. Same localStorage pattern as the ratings / specialty-suggestion stores.
 */
const KEY = 'usecare_doc_update_requests';

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export function listPendingRequests() {
  return readAll().filter((r) => r.status === 'pending');
}

/** The doctor's current pending request, if any. */
export function getPendingRequestForDoctor(doctorId) {
  return readAll().find((r) => r.doctor_id === Number(doctorId) && r.status === 'pending') ?? null;
}

/**
 * File a new request. Any earlier pending request from the same doctor is
 * dropped so there's only ever one in flight.
 */
export function addDocUpdateRequest(doctor, { resume_url, license_url }) {
  const all = readAll().filter((r) => !(r.doctor_id === doctor.id && r.status === 'pending'));
  const id = readAll().reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
  const rec = {
    id,
    doctor_id: doctor.id,
    doctor_name: doctor.name,
    resume_url: String(resume_url || '').trim(),
    license_url: String(license_url || '').trim(),
    status: 'pending',
  };
  all.push(rec);
  writeAll(all);
  return rec;
}

/** Approve or reject a request. */
export function setDocRequestStatus(id, status) {
  const all = readAll().map((r) => (r.id === id ? { ...r, status } : r));
  writeAll(all);
  return all.find((r) => r.id === id);
}
