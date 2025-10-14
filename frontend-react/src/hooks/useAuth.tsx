import React from 'react';
import { login as loginApi, logout as logoutApi, me } from '../services/auth';

type User = any;
type AuthCtx = { user: User|null; loading: boolean; login: (email:string, password:string)=>Promise<void>; logout: ()=>Promise<void>; };
const Ctx = React.createContext<AuthCtx>({ user:null, loading:true, login: async()=>{}, logout: async()=>{} });

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = React.useState<User|null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try { const u = await me(); setUser(u); } catch { setUser(null); } finally { setLoading(false); }
    })();
  }, []);

  const login = async (email:string, password:string) => {
    const res = await loginApi({ email, password });
    localStorage.setItem('token', res.token);
    const u = await me();
    setUser(u);
  };

  const logout = async () => {
    try { await logoutApi(); } catch {}
    localStorage.removeItem('token');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => React.useContext(Ctx);
