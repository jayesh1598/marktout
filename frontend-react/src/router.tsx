import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

export const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <ProductsPage /> },
    { path: 'product/:id', element: <ProductDetailPage /> },
    { path: 'login', element: <LoginPage /> },
    { path: 'cart', element: <CartPage /> },
    { path: 'checkout', element: <CheckoutPage /> },
  ]}
]);

export default function Routes() { return <RouterProvider router={router} />; }
