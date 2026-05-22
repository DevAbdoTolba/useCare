import { getDb } from './client.js';

/** All payment records (sandbox/mock). The platform takes a 12% cut. */
export const PLATFORM_FEE_RATE = 0.12;

export async function listPayments() {
  return (await getDb()).payments ?? [];
}

/** Total amount patients have paid (only "paid" rows count). */
export async function getTotalPaid() {
  const paid = (await listPayments()).filter((p) => p.status === 'paid');
  return paid.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
}
