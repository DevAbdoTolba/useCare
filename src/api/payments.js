import { apiFetch } from './http.js';

/** Payments — backed by the Django backend (server-side PayPal). 12% platform cut. */
export const PLATFORM_FEE_RATE = 0.12;

export async function listPayments() {
  const data = await apiFetch('/payments/?page_size=1000');
  return data.results ?? data;
}

/** Total of paid payments (admin sees all of them). */
export async function getTotalPaid() {
  const paid = (await listPayments()).filter((p) => p.status === 'paid');
  return paid.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
}

/**
 * Step 1 — open a PayPal order for an appointment. Returns
 * { id, paypal_order_id, approval_url, amount, demo }. Redirect the buyer to
 * approval_url (real sandbox) or capture straight away when demo === true.
 */
export async function createPayment(appointmentId, { returnUrl, cancelUrl } = {}) {
  return apiFetch('/payments/create/', {
    method: 'POST',
    body: { appointment: appointmentId, return_url: returnUrl, cancel_url: cancelUrl },
  });
}

/** Step 2 — capture an approved order. */
export async function capturePayment(paymentId) {
  return apiFetch(`/payments/${paymentId}/capture/`, { method: 'POST' });
}

/** Re-sync a payment whose capture was interrupted. */
export async function verifyPayment(paymentId) {
  return apiFetch(`/payments/${paymentId}/verify/`, { method: 'POST' });
}
