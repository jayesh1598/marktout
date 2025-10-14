import { api } from '../lib/apiClient';

export const register = (data: {name:string; email:string; password:string}) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = async (data: {email:string; password:string}) => {
  const res = await api('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  localStorage.setItem('token', res.token);
  return res;
};
export const me = () => api('/auth/me');
export const logout = async () => {
  await api('/auth/logout', { method: 'POST' });
  localStorage.removeItem('token');
};