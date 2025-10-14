import { api } from '../lib/apiClient';

export const listAddresses = () => api('/addresses');
export const createAddress = (payload: any) => api('/addresses', { method: 'POST', body: JSON.stringify(payload) });
export const updateAddress = (id: number, payload: any) => api(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteAddress = (id: number) => api(`/addresses/${id}`, { method: 'DELETE' });