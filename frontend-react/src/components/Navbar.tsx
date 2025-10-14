import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="w-full border-b bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">MarkTout</Link>
        <nav className="flex gap-4 items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/cart" className="hover:underline">Cart</Link>
          {user ? (
            <button onClick={logout} className="px-3 py-1 rounded border">Logout</button>
          ) : (
            <Link to="/login" className="px-3 py-1 rounded border">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
