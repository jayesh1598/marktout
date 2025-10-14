import { api } from '../lib/apiClient';

export const listProducts = (params: URLSearchParams) => api(`/products?${params.toString()}`);
export const getProduct = (id: number) => api(`/products/${id}`);