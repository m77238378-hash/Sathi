import React from 'react';
import { X, CheckCircle, Flame, Leaf, HelpCircle, Plus, Info, Scale, ShoppingBag, AlertTriangle } from 'lucide-react';
import { Product } from '../data/products';
import ProductPlaceholderImage from './ProductPlaceholderImage';

interface CompareProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (p: Product, size: string) => void;
  onRemoveFromCompare: (id: string) => void;
}

export default function CompareProductsModal({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onRemoveFromCompare,
}: CompareProductsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      id="compare-products-modal-overlay" 
      className="fixed inset-0 bg-stone-900/80 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto backdrop-blur-xs"
    >
      <div 
        id="compare-products-modal-card" 
        className="bg-white rounded-2xl w-full max-w-5xl border border-amber-900/25 overflow-hidden shadow-2xl relative my-4 flex flex-col max-h-[92vh]"
      >
        {/* Sticky Header */}
        <div className="bg-gradient-to-r from-[#faf2e6] to-[#fcfaeedb] p-4 sm:p-5 border-b border-amber-900/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-amber-900 text-amber-50 p-1.5 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-stone-900 text-sm sm:text-lg uppercase tracking-wide leading-none">
                Sacred Apothecary Compare
              </h3>
              <p className="text-[10px] text-stone-500 font-mono mt-1">
                SIDE-BY-SIDE THERAPEUTIC COMPOSITION MATRIX
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-stone-100 hover:bg-stone-250 text-stone-600 rounded-full p-2 transition-all cursor-pointer shadow-3xs"
            title="Close Comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Pane */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {products.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Scale className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2] animate-pulse" />
              <h4 className="font-serif font-bold text-stone-850 text-base">No remedies staged for comparison</h4>
              <p className="text-stone-500 text-xs max-w-sm mx-auto">
                Close this window and press the "Compare" indicator button on any catalog items to evaluate their biochemical structures side by side.
              </p>
            </div>
          ) : products.length === 1 ? (
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center items-center gap-4">
                <div className="border border-amber-900/10 p-3 rounded-xl bg-amber-50/50">
                  <ProductPlaceholderImage product={products[0]} size="sm" className="w-20 h-20" />
                  <p className="font-serif text-xs font-bold mt-1 text-stone-850 truncate max-w-[120px]">{products[0].name}</p>
                </div>
                <div className="font-mono text-stone-300 text-xl font-bold">VS</div>
                <div className="border border-dashed border-stone-350 p-6 rounded-xl bg-stone-50 w-24 h-24 flex items-center justify-center">
                  <span className="text-[10px] text-stone-400 font-mono text-center">STAGE PRODUCT 2</span>
                </div>
              </div>
              <h4 className="font-serif font-bold text-stone-850 text-sm">Select another product to activate binary comparison</h4>
              <p className="text-stone-500 text-xs max-w-sm mx-auto leading-relaxed">
                You have staged <strong className="text-amber-900">{products[0].name}</strong>. Add another remedy from the catalog matrix to see biochemical and indication comparisons.
              </p>
              <button
                onClick={onClose}
                className="bg-amber-900 hover:bg-stone-900 text-[#faf2e6] text-xs font-mono font-black uppercase tracking-wider py-2 px-5 rounded-lg transition-colors cursor-pointer"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            /* Traditional Comparison Matrix Grid */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch divide-y md:divide-y-0 md:divide-x divide-stone-200">
              
              {/* Product 1: 6 columns */}
              <div className="md:col-span-6 pb-6 md:pb-0 md:pr-4 space-y-5 text-left">
                <div className="flex justify-between items-start gap-3">
                  <span className="bg-amber-500/10 text-[#a16207] border border-amber-500/30 font-mono font-black text-[8px] uppercase tracking-wider py-0.5 px-2 rounded">
                    FORMULATION A
                  </span>
                  <button
                    onClick={() => onRemoveFromCompare(products[0].id)}
                    className="text-stone-400 hover:text-red-700 font-mono text-[9px] uppercase tracking-wide cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>

                {/* Primary Card Details */}
                <div className="flex items-start gap-4">
                  <ProductPlaceholderImage product={products[0]} size="md" className="w-24 h-24 shrink-0 shadow-3xs rounded-lg" />
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm border border-stone-200">
                      {products[0].category.replace('-', ' & ')}
                    </span>
                    <h4 className="font-serif font-black text-stone-900 text-md sm:text-lg leading-tight mt-1">
                      {products[0].name}
                    </h4>
                    <p className="text-[10px] text-amber-800 italic font-serif">
                      Sanskrit: {products[0].sanskritName}
                    </p>
                    <p className="text-md font-bold font-mono text-stone-950 mt-1">
                      ₹{products[0].price}
                    </p>
                  </div>
                </div>

                {/* Description block */}
                <div className="bg-stone-50/70 p-3 rounded-lg border border-stone-150/60">
                  <span className="text-[9px] font-mono text-stone-450 font-bold block mb-1">TRADITIONAL THERAPEUTIC NARRATIVE:</span>
                  <p className="text-[11.5px] text-stone-650 leading-relaxed font-serif">
                    {products[0].description}
                  </p>
                </div>

                {/* Indications block */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-stone-450 font-bold block">CLINICAL INDICATIONS (Rogaadhikaara):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {products[0].indications.map((ind) => (
                      <span key={ind} className="bg-amber-50 text-amber-950 text-[10px] font-bold border border-amber-900/10 px-2 py-0.5 rounded-sm">
                        ✚ {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botanical Composition */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-stone-450 font-bold block">🌿 BOTANICAL & MINERAL RATIOS:</span>
                  <div className="border border-stone-200/80 rounded-lg overflow-hidden text-[11px] bg-white">
                    <div className="bg-stone-100 p-1.5 px-2.5 font-mono flex justify-between font-bold text-stone-850 uppercase text-[9px] border-b border-stone-200">
                      <span className="w-1/2">Botanical Herb</span>
                      <span className="w-1/6 text-center">Ratio</span>
                      <span className="w-1/3 text-right">Primary Benefit</span>
                    </div>
                    <div className="divide-y divide-stone-100 font-serif">
                      {products[0].ingredients.map((ing, i) => (
                        <div key={i} className="p-1.5 px-2.5 flex justify-between items-center text-stone-700">
                          <span className="w-1/2 font-bold text-stone-900">{ing.name}</span>
                          <span className="w-1/6 text-center font-mono font-bold bg-[#fbf9f4] border border-amber-900/5 text-amber-950 rounded py-0.5 text-[9.5px]">
                            {ing.proportion}
                          </span>
                          <span className="w-1/3 text-right text-stone-500 text-[10px] line-clamp-1" title={ing.benefit}>
                            {ing.benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dosage & Administration */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-dotted border-stone-200 text-xs text-left">
                  <div className="bg-amber-50/20 p-2.5 rounded-lg border border-amber-900/5">
                    <span className="text-[9px] font-mono text-stone-500 font-bold block mb-1">RECOMMENDED DOSAGE:</span>
                    <p className="font-serif leading-relaxed text-stone-750 text-[11px]">
                      {products[0].dosage}
                    </p>
                  </div>
                  <div className="bg-emerald-50/20 p-2.5 rounded-lg border border-emerald-900/5">
                    <span className="text-[9px] font-mono text-stone-500 font-bold block mb-1">VEHICLE (Anupana):</span>
                    <p className="font-serif leading-relaxed text-stone-750 text-[11px]">
                      {products[0].administration}
                    </p>
                  </div>
                </div>

                {/* Stock Level & Buy Action */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  {products[0].stock < 5 ? (
                    <span className="text-[10px] font-mono font-black text-red-600 flex items-center gap-1 animate-pulse bg-red-50 px-2 py-1 rounded border border-red-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> LOW STOCK: {products[0].stock} LEFT
                    </span>
                  ) : (
                    <span className={`text-[10px] font-mono font-bold ${products[0].stock <= 15 ? 'text-amber-700' : 'text-stone-400'}`}>
                      {products[0].stock <= 15 ? `⚠️ ONLY ${products[0].stock} BOTTLES LEFT` : '✓ In Stock & Freshly Sealed'}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      onAddToCart(products[0], products[0].sizeOptions[0]);
                      onClose();
                    }}
                    className="bg-amber-900 hover:bg-stone-900 text-[#faf2e6] transition-all px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> ADD BASKET ₹{products[0].price}
                  </button>
                </div>
              </div>


              {/* Product 2: 6 columns */}
              <div className="md:col-span-6 pt-6 md:pt-0 md:pl-5 space-y-5 text-left">
                <div className="flex justify-between items-start gap-3">
                  <span className="bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 font-mono font-black text-[8px] uppercase tracking-wider py-0.5 px-2 rounded">
                    FORMULATION B
                  </span>
                  <button
                    onClick={() => onRemoveFromCompare(products[1].id)}
                    className="text-stone-400 hover:text-red-700 font-mono text-[9px] uppercase tracking-wide cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>

                {/* Primary Card Details */}
                <div className="flex items-start gap-4">
                  <ProductPlaceholderImage product={products[1]} size="md" className="w-24 h-24 shrink-0 shadow-3xs rounded-lg" />
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm border border-stone-200">
                      {products[1].category.replace('-', ' & ')}
                    </span>
                    <h4 className="font-serif font-black text-stone-900 text-md sm:text-lg leading-tight mt-1">
                      {products[1].name}
                    </h4>
                    <p className="text-[10px] text-amber-800 italic font-serif">
                      Sanskrit: {products[1].sanskritName}
                    </p>
                    <p className="text-md font-bold font-mono text-stone-950 mt-1">
                      ₹{products[1].price}
                    </p>
                  </div>
                </div>

                {/* Description block */}
                <div className="bg-stone-50/70 p-3 rounded-lg border border-stone-150/60">
                  <span className="text-[9px] font-mono text-stone-450 font-bold block mb-1">TRADITIONAL THERAPEUTIC NARRATIVE:</span>
                  <p className="text-[11.5px] text-stone-650 leading-relaxed font-serif">
                    {products[1].description}
                  </p>
                </div>

                {/* Indications block */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-stone-450 font-bold block">CLINICAL INDICATIONS (Rogaadhikaara):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {products[1].indications.map((ind) => (
                      <span key={ind} className="bg-amber-50 text-amber-950 text-[10px] font-bold border border-amber-900/10 px-2 py-0.5 rounded-sm">
                        ✚ {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botanical Composition */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-stone-450 font-bold block">🌿 BOTANICAL & MINERAL RATIOS:</span>
                  <div className="border border-stone-200/80 rounded-lg overflow-hidden text-[11px] bg-white">
                    <div className="bg-stone-100 p-1.5 px-2.5 font-mono flex justify-between font-bold text-stone-850 uppercase text-[9px] border-b border-stone-200">
                      <span className="w-1/2">Botanical Herb</span>
                      <span className="w-1/6 text-center">Ratio</span>
                      <span className="w-1/3 text-right">Primary Benefit</span>
                    </div>
                    <div className="divide-y divide-stone-100 font-serif">
                      {products[1].ingredients.map((ing, i) => (
                        <div key={i} className="p-1.5 px-2.5 flex justify-between items-center text-stone-700">
                          <span className="w-1/2 font-bold text-stone-900">{ing.name}</span>
                          <span className="w-1/6 text-center font-mono font-bold bg-[#fbf9f4] border border-amber-900/5 text-amber-950 rounded py-0.5 text-[9.5px]">
                            {ing.proportion}
                          </span>
                          <span className="w-1/3 text-right text-stone-500 text-[10px] line-clamp-1" title={ing.benefit}>
                            {ing.benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dosage & Administration */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-dotted border-stone-200 text-xs text-left">
                  <div className="bg-amber-50/20 p-2.5 rounded-lg border border-amber-900/5">
                    <span className="text-[9px] font-mono text-stone-500 font-bold block mb-1">RECOMMENDED DOSAGE:</span>
                    <p className="font-serif leading-relaxed text-stone-750 text-[11px]">
                      {products[1].dosage}
                    </p>
                  </div>
                  <div className="bg-emerald-50/20 p-2.5 rounded-lg border border-emerald-900/5">
                    <span className="text-[9px] font-mono text-stone-500 font-bold block mb-1">VEHICLE (Anupana):</span>
                    <p className="font-serif leading-relaxed text-stone-750 text-[11px]">
                      {products[1].administration}
                    </p>
                  </div>
                </div>

                {/* Stock Level & Buy Action */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  {products[1].stock < 5 ? (
                    <span className="text-[10px] font-mono font-black text-red-600 flex items-center gap-1 animate-pulse bg-red-50 px-2 py-1 rounded border border-red-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> LOW STOCK: {products[1].stock} LEFT
                    </span>
                  ) : (
                    <span className={`text-[10px] font-mono font-bold ${products[1].stock <= 15 ? 'text-amber-700' : 'text-stone-400'}`}>
                      {products[1].stock <= 15 ? `⚠️ ONLY ${products[1].stock} BOTTLES LEFT` : '✓ In Stock & Freshly Sealed'}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      onAddToCart(products[1], products[1].sizeOptions[0]);
                      onClose();
                    }}
                    className="bg-amber-900 hover:bg-stone-900 text-[#faf2e6] transition-all px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> ADD BASKET ₹{products[1].price}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer actions info / disclaimers */}
        <div className="bg-stone-50 p-3 text-[10px] text-center text-stone-450 font-serif border-t border-stone-200 select-none shrink-0 leading-normal">
          Formulation data is sourced directly from clinical manuscripts (Charaka and Sushruta Samhita). Consult a registered Ayurvedic Practitioner (Vaidya) before initiating therapeutic compounds.
        </div>
      </div>
    </div>
  );
}
