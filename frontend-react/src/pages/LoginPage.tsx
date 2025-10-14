import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await login(email, password); nav('/'); }
    catch (e:any) { setError(e.message); }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} className="border rounded w-full px-3 py-2" placeholder="Email" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border rounded w-full px-3 py-2" placeholder="Password" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="px-4 py-2 border rounded">Login</button>
      </form>
    </div>
  );
}
