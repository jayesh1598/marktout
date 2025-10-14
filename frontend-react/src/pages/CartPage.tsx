import React from 'react';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../services/cart';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const [cart, setCart] = React.useState<any>(null);
  const nav = useNavigate();

  const load = async () => {
    const c = await getCart();
    setCart(c);
  };
  React.useEffect(()=>{ load(); }, []);

  const changeQty = async (itemId:number, qty:number) => {
    await updateCartItem(itemId, qty);
    await load();
  };
  const remove = async (itemId:number) => {
    await removeCartItem(itemId);
    await load();
  };
  const clear = async () => { await clearCart(); await load(); };

  if (!cart) return <div className="max-w-4xl mx-auto p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.cart.items.length === 0 ? <div>Cart is empty</div> : (
        <div className="space-y-3">
          {cart.cart.items.map((it:any)=>(
            <div key={it.id} className="flex items-center justify-between border rounded p-3">
              <div className="font-medium">{it.product.name}</div>
              <div className="flex items-center gap-2">
                <input type="number" min={1} value={it.quantity} onChange={e=>changeQty(it.id, parseInt(e.target.value)||1)} className="w-20 border rounded px-2 py-1" />
                <button onClick={()=>remove(it.id)} className="px-2 py-1 border rounded">Remove</button>
              </div>
            </div>
          ))}
          <div className="border-t pt-3 flex items-center justify-between">
            <div>Subtotal: <b>₹ {cart.subtotal.toFixed(2)}</b> | Discount: <b>₹ {cart.discount.toFixed(2)}</b> | Total: <b>₹ {cart.total.toFixed(2)}</b></div>
            <button onClick={()=>nav('/checkout')} className="px-4 py-2 border rounded">Checkout</button>
          </div>
          <button onClick={clear} className="px-3 py-1 border rounded">Clear Cart</button>
        </div>
      )}
    </div>
  );
}
