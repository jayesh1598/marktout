import React from 'react';
import { createRazorpayOrder, verifyRazorpay } from '../services/payments';

declare global { interface Window { Razorpay: any; } }

function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = resolve;
    el.onerror = reject;
    document.body.appendChild(el);
  });
}

export default function RazorpayCheckoutButton({ addressId, onSuccess }:{ addressId:number; onSuccess:()=>void }) {
  const [loading, setLoading] = React.useState(false);
  const click = async () => {
    setLoading(true);
    try {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      const order = await createRazorpayOrder(addressId);
      const options: any = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpay_order_id,
        name: 'MarkTout',
        description: 'Order #' + order.local_order_id,
        handler: async function (response: any) {
          await verifyRazorpay(response);
          onSuccess();
        },
        theme: { color: '#121212' },
      };
      const rz = new window.Razorpay(options);
      rz.open();
    } catch (e) {
      console.error(e);
      alert('Payment init failed');
    } finally {
      setLoading(false);
    }
  };
  return <button onClick={click} disabled={loading} className="px-4 py-2 border rounded disabled:opacity-50">{loading?'Starting...':'Pay with Razorpay'}</button>;
}
