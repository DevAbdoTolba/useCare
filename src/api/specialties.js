import { getDb, warnReadOnly } from './client.js';

export async function listSpecialties()           { return (await getDb()).specialties; }
export async function getSpecialty(id)            { return (await getDb()).specialties.find((s) => s.id === Number(id)); }

// Read-only on npoint — mutations are local-only.
export async function createSpecialty(payload)    { warnReadOnly('createSpecialty'); return { id: Date.now(), ...payload }; }
export async function updateSpecialty(id, patch)  { warnReadOnly('updateSpecialty'); return { id, ...patch }; }
export async function deleteSpecialty(id)         { warnReadOnly('deleteSpecialty'); return { id, deleted: true }; }
