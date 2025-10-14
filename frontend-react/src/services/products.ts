import { api } from '../lib/apiClient';
export const listProducts = (params: URLSearchParams) => api(`/products?${params.toString()}`);
export const getProduct = (id: string|number) => api(`/products/${id}`);
