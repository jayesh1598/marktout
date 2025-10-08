import { ImageWithFallback } from './figma/ImageWithFallback';

interface CategoryCardProps {
  image: string;
  title: string;
  productCount?: number;
}

export function CategoryCard({ image, title, productCount }: CategoryCardProps) {
  return (
    <div className="group relative rounded-lg overflow-hidden cursor-pointer">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <ImageWithFallback 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Category Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-white mb-1">{title}</h3>
          {productCount && (
            <p className="text-white text-sm">{productCount} Products</p>
          )}
        </div>
      </div>
    </div>
  );
}
