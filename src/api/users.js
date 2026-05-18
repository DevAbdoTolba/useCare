import { users } from '../schema/fixtures.js';

// TODO: replace fixture reads with apiGet/apiPost/etc. once backend exists.

export async function listUsers()                { return users; }
export async function getUser(id)                { return users.find((u) => u.id === Number(id)); }
export async function listPendingUsers()         { return users.filter((u) => u.status === 'pending'); }
export async function listDoctors()              { return users.filter((u) => u.role === 'doctor' && u.status === 'approved'); }
export async function approveUser(id)            { return { id, status: 'approved' }; }
export async function rejectUser(id)             { return { id, status: 'rejected' }; }
export async function updateUser(id, patch)      { return { id, ...patch }; }
export async function deleteUser(id)             { return { id, deleted: true }; }
