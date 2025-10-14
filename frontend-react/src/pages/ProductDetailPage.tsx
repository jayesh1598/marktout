import React from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/products';
import { addToCart } from '../services/cart';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = React.useState<any>(null);
  const [qty, setQty] = React.useState(1);
  const [status, setStatus] = React.useState<string>('');

  React.useEffect(() => { (async () => {
    if (!id) return;
    const p = await getProduct(id);
    setProduct(p);
  })(); }, [id]);

  const onAdd = async () => {
    try {
      await addToCart(Number(product.id), qty);
      setStatus('Added to cart');
    } catch (e:any) { setStatus(e.message); }
    setTimeout(()=>setStatus(''), 1500);
  };

  if (!product) return <div className="max-w-6xl mx-auto p-6">Loading...</div>;
  const img = (product.images?.[0]) || 'https://picsum.photos/seed/p/800/500';

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <img src={img} alt={product.name} className="w-full rounded-xl object-cover" />
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="text-gray-700 mb-4">{product.description}</div>
        <div className="text-xl font-semibold mb-4">₹ {Number(product.price).toFixed(2)}</div>
        <div className="flex items-center gap-2 mb-4">
          <input type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value)||1)} className="border rounded px-3 py-2 w-24" />
          <button onClick={onAdd} className="px-4 py-2 border rounded">Add to cart</button>
          <div className="text-sm text-green-600">{status}</div>
        </div>
      </div>
    </div>
  );
}
