/**
 * PayPal sandbox config (mock-friendly).
 *
 * Set VITE_PAYPAL_CLIENT_ID in .env to a sandbox client id to render real
 * PayPal Smart Buttons. When it's missing we fall back to a "demo" payment so
 * the booking flow still works offline without credentials — the integration
 * is wired the same way either side, just like the vuelance checkout.
 */
export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

/** True when a real sandbox client id is configured. */
export const PAYPAL_ENABLED = Boolean(PAYPAL_CLIENT_ID);

/** Options for <PayPalScriptProvider>. */
export const PAYPAL_OPTIONS = {
  clientId: PAYPAL_CLIENT_ID || 'test',
  currency: 'USD',
  intent: 'capture',
};
