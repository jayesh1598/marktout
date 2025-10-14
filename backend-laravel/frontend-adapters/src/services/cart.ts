import { api } from '../lib/apiClient';

export const getCart = () => api('/cart');
export const addToCart = (product_id: number, quantity = 1) =>
  api('/cart/items', { method: 'POST', body: JSON.stringify({ product_id, quantity }) });
export const updateCartItem = (itemId: number, quantity: number) =>
  api(`/cart/items/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) });
export const removeCartItem = (itemId: number) =>
  api(`/cart/items/${itemId}`, { method: 'DELETE' });
export const clearCart = () => api('/cart', { method: 'DELETE' });