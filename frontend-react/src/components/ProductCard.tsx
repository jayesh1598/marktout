import { Link } from 'react-router-dom';
type Props = { product: any };
export default function ProductCard({ product }: Props) {
  const img = (product.images?.[0]) || 'https://picsum.photos/seed/p/400/300';
  return (
    <Link to={`/product/${product.id}`} className="border rounded-lg overflow-hidden hover:shadow transition">
      <img src={img} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-3">
        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-2 font-bold">₹ {Number(product.price).toFixed(2)}</div>
      </div>
    </Link>
  );
}
