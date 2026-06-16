import React from 'react';
import { 
  X, 
  Heart, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  Leaf
} from 'lucide-react';
import { PRODUCTS, Product } from '../../data/products';
import ProductPlaceholderImage from './ProductPlaceholderImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onAddToBasket: (product: Product, size: string) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  onToggleWishlist,
  onAddToBasket
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  // Retrieve full product data for wishlisted items
  const wishlistedProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  return (
    <div 
      id="wishlist-overlay-drawer" 
      className="fixed inset-0 bg-stone-900/60 z-50 flex justify-end transition-all animate-fadeIn"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-[#FAF9F5] w-full max-w-md h-full flex flex-col justify-between shadow-2xl overflow-hidden relative z-10 animate-slideLeft">
        
        {/* Header styling matching traditional clinical vault */}
        <div className="bg-gradient-to-r from-amber-950 via-[#442614] to-amber-955 p-5 text-honey text-white flex justify-between items-center border-b border-amber-900/10">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-500" />
            <div>
              <h3 className="font-serif font-black text-base text-amber-100 leading-none">
                My Sacred Wishlist
              </h3>
              <p className="text-[9.5px] text-amber-200/80 font-mono mt-1 uppercase tracking-wider">
                Preserved Ayurvedic Remedies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-amber-900/40 hover:bg-amber-900/60 text-stone-200 hover:text-white rounded-full p-1.5 transition-all cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 bg-white border border-dashed border-amber-900/20 rounded-full flex items-center justify-center mx-auto shadow-3xs">
                <Heart className="w-7 h-7 text-stone-300" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-amber-955 text-sm uppercase tracking-wider">
                  Wishlist is Empty
                </h4>
                <p className="text-xs text-stone-500 font-serif leading-relaxed max-w-xs mx-auto">
                  Mark products with the heart icon while exploring our clinical catalogue to preserve your custom remedies here!
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-amber-900 text-white font-mono font-bold text-[10px] uppercase tracking-wider py-2 px-5 rounded-lg hover:bg-stone-850 transition-colors cursor-pointer"
              >
                Browse Remedies
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] font-mono tracking-wider text-stone-500 uppercase font-black">
                {wishlistedProducts.length} Sacred product(s) marked as favorite:
              </p>

              <div className="space-y-3.5">
                {wishlistedProducts.map(product => (
                  <div 
                    key={product.id}
                    className="p-3.5 bg-white border border-amber-900/10 rounded-xl flex gap-3.5 items-stretch hover:shadow-xs transition-shadow relative group"
                  >
                    {/* Small Product Thumnail */}
                    <div className="w-20 h-20 bg-stone-50 rounded-lg overflow-hidden shrink-0 border border-stone-100 flex items-center justify-center p-1.5 self-center">
                      <ProductPlaceholderImage 
                        product={product} 
                        size="sm" 
                        className="max-h-16 object-contain"
                      />
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 flex flex-col justify-between text-left">
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif font-black text-stone-900 text-xs sm:text-sm group-hover:text-amber-900 transition-colors leading-tight">
                            {product.name}
                          </h4>
                          <span className="font-mono font-black text-amber-950 text-xs">
                            ₹{product.price}
                          </span>
                        </div>
                        <p className="text-[9.5px] text-amber-800 italic leading-none">
                          {product.sanskritName}
                        </p>
                        <p className="text-stone-500 text-[10.5px] line-clamp-1">
                          {product.category.replace('-', ' & ')} • {product.sizeOptions[0]}
                        </p>
                      </div>

                      {/* Item Bottom actions: Add to Basket & Remove from Favorites */}
                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-stone-100">
                        <button
                          onClick={() => onToggleWishlist(product.id)}
                          className="text-[9.5px] font-mono font-bold text-stone-400 hover:text-red-700 uppercase flex items-center gap-1 cursor-pointer transition-colors"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>

                        <button
                          onClick={() => {
                            onAddToBasket(product, product.sizeOptions[0]);
                          }}
                          className="bg-amber-900 hover:bg-[#2d1b10] text-[#faf2e6] text-[9.5px] font-mono font-black uppercase tracking-wider px-2.5 py-1.5 rounded flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
                        >
                          <Plus className="w-3.5 h-3.5" /> Basket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer styling matches basket */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 bg-stone-100 border-t border-stone-200">
            <button
              onClick={() => {
                // Add all to basket
                wishlistedProducts.forEach(product => {
                  onAddToBasket(product, product.sizeOptions[0]);
                });
                onClose();
              }}
              className="w-full bg-emerald-800 hover:bg-emerald-950 text-emerald-50 text-center text-xs font-mono font-black uppercase py-3 rounded-lg shadow-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Add All to Inquiry Basket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
