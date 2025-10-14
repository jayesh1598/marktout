import { api } from '../lib/apiClient';
export const createRazorpayOrder = (address_id: number) => api('/payments/razorpay/order', { method: 'POST', body: JSON.stringify({ address_id }) });
export const verifyRazorpay = (payload: any) => api('/payments/razorpay/verify', { method: 'POST', body: JSON.stringify(payload) });
