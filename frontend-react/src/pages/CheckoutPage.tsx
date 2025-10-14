import React from 'react';
import { listAddresses, createAddress } from '../services/addresses';
import { placeOrder } from '../services/orders';
import RazorpayCheckoutButton from '../components/RazorpayCheckoutButton';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const [addresses, setAddresses] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState<number|undefined>();
  const [creating, setCreating] = React.useState(false);
  const [form, setForm] = React.useState<any>({ name:'', phone:'', line1:'', line2:'', city:'', state:'', postal_code:'', country:'' });
  const [msg, setMsg] = React.useState('');
  const nav = useNavigate();

  const load = async () => setAddresses(await listAddresses());
  React.useEffect(()=>{ load(); }, []);

  const create = async () => {
    const a = await createAddress(form);
    setSelected(a.id);
    setCreating(false);
    await load();
  };

  const order = async () => {
    if (!selected) return;
    const o = await placeOrder(selected);
    setMsg('Order placed! #' + o.id);
    setTimeout(()=> nav('/'), 1200);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="space-y-2">
        <div className="font-semibold">Choose address</div>
        {addresses.map(a => (
          <label key={a.id} className="flex items-center gap-2 border rounded p-2">
            <input type="radio" name="addr" checked={selected===a.id} onChange={()=>setSelected(a.id)} />
            <div>{a.name}, {a.line1}, {a.city}, {a.state} - {a.postal_code}</div>
          </label>
        ))}
        <button onClick={()=>setCreating(v=>!v)} className="px-3 py-1 border rounded">{creating?'Cancel':'Add new address'}</button>
        {creating && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['name','phone','line1','line2','city','state','postal_code','country'].map(k=> (
              <input key={k} placeholder={k} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} className="border rounded px-3 py-2"/>
            ))}
            <button onClick={create} className="px-3 py-2 border rounded col-span-full">Save address</button>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button disabled={!selected} onClick={order} className="px-4 py-2 border rounded disabled:opacity-50">Place COD</button>
        {selected && <RazorpayCheckoutButton addressId={selected} onSuccess={()=> setMsg("Payment success!")} />}
      </div>
      {msg && <div className="text-green-600">{msg}</div>}
    </div>
  );
}
