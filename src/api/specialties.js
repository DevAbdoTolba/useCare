import { specialties } from '../schema/fixtures.js';

// TODO: replace fixture reads with apiGet/apiPost/etc. once backend exists.

export async function listSpecialties()           { return specialties; }
export async function getSpecialty(id)            { return specialties.find((s) => s.id === Number(id)); }
export async function createSpecialty(payload)    { return { id: Date.now(), ...payload }; }
export async function updateSpecialty(id, patch)  { return { id, ...patch }; }
export async function deleteSpecialty(id)         { return { id, deleted: true }; }
