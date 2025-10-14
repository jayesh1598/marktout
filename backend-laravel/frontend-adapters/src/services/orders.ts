import { api } from '../lib/apiClient';

export const placeOrder = (address_id: number) =>
  api('/orders', { method: 'POST', body: JSON.stringify({ address_id }) });
export const myOrders = () => api('/orders');
export const orderDetail = (id: number) => api(`/orders/${id}`);