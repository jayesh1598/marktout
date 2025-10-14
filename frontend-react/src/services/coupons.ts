import { api } from '../lib/apiClient';
export const validateCoupon = (code: string) => api('/coupons/validate', { method: 'POST', body: JSON.stringify({ code }) });
