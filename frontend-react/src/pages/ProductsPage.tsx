import React from 'react';
import { listProducts } from '../services/products';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState('');

  React.useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    const data = await listProducts(params);
    setItems(data.data || data); // paginated or plain
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="border rounded px-3 py-2 w-full" />
        <button onClick={fetchList} className="px-4 py-2 border rounded">Search</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p)=> <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
