import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
      <footer className="text-center text-sm text-gray-500 py-8">© MarkTout</footer>
    </div>
  );
}
