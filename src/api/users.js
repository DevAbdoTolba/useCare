import { getDb, warnReadOnly } from './client.js';

export async function listUsers()             { return (await getDb()).users; }
export async function getUser(id)             { return (await getDb()).users.find((u) => u.id === Number(id)); }
export async function listPendingUsers()      { return (await getDb()).users.filter((u) => u.status === 'pending'); }
export async function listDoctors()           { return (await getDb()).users.filter((u) => u.role === 'doctor' && u.status === 'approved'); }

// Read-only on npoint — mutations are local-only.
export async function approveUser(id)         { warnReadOnly('approveUser');  return { id, status: 'approved' }; }
export async function rejectUser(id)          { warnReadOnly('rejectUser');   return { id, status: 'rejected' }; }
export async function updateUser(id, patch)   { warnReadOnly('updateUser');   return { id, ...patch }; }
export async function deleteUser(id)          { warnReadOnly('deleteUser');   return { id, deleted: true }; }
