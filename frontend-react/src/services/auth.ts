import { api } from '../lib/apiClient';
export type LoginRes = { token: string; user: any };
export const register = (data: {name:string; email:string; password:string}) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data: {email:string; password:string}) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) }) as Promise<LoginRes>;
export const me = () => api('/auth/me');
export const logout = () => api('/auth/logout', { method: 'POST' });
