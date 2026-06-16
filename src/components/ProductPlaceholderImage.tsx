import React, { useState } from 'react';
import { Leaf, Award, Compass, Pill, FileCode2, Droplets, Sparkles, Sprout, Image as ImageIcon, Binary } from 'lucide-react';
import { Product } from '../../data/products';
// @ts-ignore
import productImage from '../assets/images/Product.png';

interface PlaceholderProps {
  product: Product;
  className?: string; // custom classes
  size?: 'sm' | 'md' | 'lg';
}

export default function ProductPlaceholderImage({ product, className = '', size = 'md' }: PlaceholderProps) {
  // Theme color styling mapper
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'brown':
        return {
          primary: '#5c3d2e',
          secondary: '#865439',
          accent: '#c68b59',
          bg: 'from-[#fdf6f0] to-[#f5ebd9]',
          bottle: 'from-[#6e473b] to-[#3a1d13]',
          label: 'bg-[#faf2e6] text-[#4d2f1e]'
        };
      case 'emerald':
        return {
          primary: '#065f46',
          secondary: '#047857',
          accent: '#34d399',
          bg: 'from-[#f0fdf4] to-[#dcfce7]',
          bottle: 'from-[#065f46] to-[#022c22]',
          label: 'bg-[#f0fdf4] text-[#064e3b]'
        };
      case 'crimson':
        return {
          primary: '#991b1b',
          secondary: '#b91c1c',
          accent: '#f87171',
          bg: 'from-[#fef2f2] to-[#fee2e2]',
          bottle: 'from-[#991b1b] to-[#450a0a]',
          label: 'bg-[#fdf2f2] text-[#7f1d1d]'
        };
      case 'gold':
        return {
          primary: '#854d0e',
          secondary: '#a16207',
          accent: '#fbbf24',
          bg: 'from-[#fef9c3] to-[#fef08a]',
          bottle: 'from-[#a16207] to-[#422006]',
          label: 'bg-[#fefce8] text-[#713f12]'
        };
      case 'indigo':
        return {
          primary: '#3730a3',
          secondary: '#4338ca',
          accent: '#818cf8',
          bg: 'from-[#e0e7ff] to-[#c7d2fe]',
          bottle: 'from-[#3730a3] to-[#1e1b4b]',
          label: 'bg-[#eef2ff] text-[#312e81]'
        };
      case 'amber':
      default:
        return {
          primary: '#9a3412',
          secondary: '#b45309',
          accent: '#f59e0b',
          bg: 'from-[#fffbeb] to-[#fef3c7]',
          bottle: 'from-[#92400e] to-[#451a03]',
          label: 'bg-[#fffbeb] text-[#78350f]'
        };
    }
  };

  const colors = getThemeColors(product.colorTheme);
  const [showPhoto, setShowPhoto] = useState(size === 'lg');

  // Return specific icon based on type
  const renderIcon = (color: string) => {
    switch (product.iconType) {
      case 'pill':
        return <Pill style={{ color }} className="w-8 h-8 opacity-90 stroke-[1.5]" />;
      case 'flask':
        return <Droplets style={{ color }} className="w-8 h-8 opacity-90 stroke-[1.5]" />;
      case 'droplet':
        return <Droplets style={{ color }} className="w-8 h-8 opacity-90 stroke-[1.5]" />;
      case 'pouch':
        return <Sprout style={{ color }} className="w-8 h-8 opacity-90 stroke-[1.5]" />;
      case 'gem':
        return <Sparkles style={{ color }} className="w-8 h-8 opacity-90 stroke-[1.5]" />;
      case 'leaf':
      default:
        return <Leaf style={{ color }} className="w-8 h-8 opacity-90 stroke-[1.5]" />;
    }
  };

  // Outer container dimensional controls
  const aspectClass = size === 'sm' ? 'h-36 w-36 md:h-40 md:w-40' : size === 'lg' ? 'h-72 md:h-80 w-full' : 'h-48 md:h-56 w-full';

  return (
    <div
      id={`p-placeholder-${product.id}`}
      className={`relative rounded-xl overflow-hidden shadow-xs border border-amber-900/10 bg-gradient-to-br ${colors.bg} flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-md ${aspectClass} ${className}`}
    >
      {/* Premium product photo overlay when toggled */}
      {showPhoto && (
        <img
          src={productImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Dynamic Toggle Button between Traditional Diagram & Organic Photo */}
      {size !== 'sm' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowPhoto(!showPhoto);
          }}
          title={showPhoto ? "Switch to Schematic Diagram" : "Switch to Botanical Photograph"}
          className="absolute top-2 left-2 z-30 p-1.5 rounded-lg bg-white/95 hover:bg-white text-amber-950 border border-amber-900/15 shadow-xs backdrop-blur-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-[9px] font-mono font-bold tracking-wider"
        >
          {showPhoto ? (
            <>
              <Binary className="w-3 h-3 text-emerald-800" />
              <span>SCHEMATIC</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-3 h-3 text-amber-900" />
              <span>VIEW PHOTO</span>
            </>
          )}
        </button>
      )}

      {/* Decorative Traditional Indian Mandala Motif Background Line Art */}
      <div className="absolute inset-0 opacity-[0.06] flex items-center justify-center pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-[150%] h-[150%] animate-[spin_120s_linear_infinite]" fill="currentColor">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M50 5 Q52 45 95 50 Q52 55 50 95 Q48 55 5 50 Q48 45 50 5" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Floating subtle badge indicating product categories */}
      {size !== 'sm' && (
        <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-stone-900/5 text-stone-700 font-mono tracking-widest uppercase">
          {product.category}
        </span>
      )}

      {/* Core Simulated Product Graphic */}
      <div className="flex flex-col items-center justify-center z-10 transition-transform duration-500 group-hover:scale-[1.04]">
        {product.category === 'Asava-Arishta' && (
          /* Classical tall medicine flask */
          <div className="relative w-14 h-28 flex flex-col items-center">
            <div className="w-4 h-4 bg-yellow-800 rounded-sm shadow-xs border border-stone-800" />
            <div className="w-2 h-4 bg-amber-900 border-x border-stone-800" />
            <div className={`w-12 h-20 rounded-t-lg rounded-b-md bg-gradient-to-b ${colors.bottle} relative border border-stone-800 flex items-center justify-center overflow-hidden`}>
              {/* Herbal Liquid Fluid Line */}
              <div className="absolute bottom-0 inset-x-0 h-[80%] bg-amber-900/40 border-t border-amber-600/50" />
              {/* Product mini label */}
              <div className="absolute w-[80%] top-[25%] bottom-[15%] left-[10%] bg-stone-50 border border-amber-900/30 rounded-xs px-0.5 flex flex-col items-center justify-around z-10">
                <span className="text-[6px] font-bold text-emerald-800 leading-none truncate max-w-full font-serif uppercase">
                  {product.sanskritName}
                </span>
                <div className="opacity-85">{renderIcon(colors.secondary)}</div>
                <span className="text-[5px] text-stone-500 font-mono tracking-tighter leading-none">
                  MANGALAM
                </span>
              </div>
              {/* Glass Reflection Highlight */}
              <div className="absolute left-1 top-1 bottom-1 w-1 bg-white/25 rounded-full filter blur-[0.5px]" />
            </div>
          </div>
        )}

        {product.category === 'Vati-Gutika' && (
          /* Emerald Pill Jar */
          <div className="relative w-16 h-24 flex flex-col items-center mt-2">
            <div className="w-10 h-3 bg-stone-100 rounded-sm shadow-sm border border-stone-400 z-10" />
            <div className={`w-14 h-18 rounded-t-md rounded-b-lg bg-gradient-to-b ${colors.bottle} relative border border-stone-800 flex items-center justify-center overflow-hidden`}>
              <div className="absolute w-[86%] top-[15%] bottom-[15%] left-[7%] bg-stone-100 border border-stone-300 rounded-sm p-0.5 flex flex-col items-center justify-around z-10">
                <span className="text-[7px] font-bold text-stone-800 leading-none truncate max-w-full">
                  {product.name.split(' ')[0]}
                </span>
                <div className="opacity-90">{renderIcon(colors.primary)}</div>
                <span className="text-[6px] text-emerald-800 bg-emerald-50 px-1 rounded-sm leading-none font-medium">
                  {product.sizeOptions[0]}
                </span>
              </div>
              {/* Glass highlight */}
              <div className="absolute left-1 top-1 bottom-1 w-1 bg-white/20 rounded-full" />
            </div>
          </div>
        )}

        {product.category === 'Churna' && (
          /* Textured organic plant-colored pouch */
          <div className="relative w-18 h-26 flex flex-col items-center">
            {/* Sealed top of the pouch */}
            <div className="w-16 h-2 bg-stone-200 border border-stone-300 shadow-xs flex items-center justify-around">
              <div className="w-1 h-1 bg-stone-400 rounded-full" />
              <div className="w-1 h-1 bg-stone-400 rounded-full" />
              <div className="w-1 h-1 bg-stone-400 rounded-full" />
            </div>
            {/* Pouch Main Body */}
            <div className="w-16 h-22 rounded-b-xl bg-gradient-to-b from-stone-50 to-stone-100 border border-stone-300 relative flex flex-col items-center pt-2 px-1 shadow-sm overflow-hidden">
              {/* Decorative paper texture underlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] opacity-25" />
              
              <div className={`w-full py-0.5 bg-gradient-to-r from-amber-600/20 to-amber-800/20 text-center`}>
                <span className="text-[7px] font-bold tracking-wider text-amber-900 truncate block uppercase">
                  {product.sanskritName}
                </span>
              </div>
              
              {/* Circular herbal seal */}
              <div className="my-[3px] w-8 h-8 rounded-full border border-dashed border-stone-400 flex items-center justify-center bg-stone-50">
                {renderIcon(colors.secondary)}
              </div>
              
              <span className="text-[6px] text-stone-500 font-serif leading-none italic">
                100% Shuddha Churna
              </span>

              {/* Bottom tag line */}
              <div className="absolute bottom-1 w-full text-center">
                <span className="text-[5px] text-amber-800 tracking-wider">MANGALAM AYURVEDA</span>
              </div>
            </div>
          </div>
        )}

        {product.category === 'Rasayana-Lehya' && (
          /* Wide golden amber glass jar */
          <div className="relative w-18 h-24 flex flex-col items-center">
            <div id="gold-jar-cap" className="w-14 h-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-sm border border-stone-800/50 z-10 shadow-xs" />
            <div className={`w-16 h-17 rounded-b-xl bg-gradient-to-b ${colors.bottle} relative border border-stone-800 flex items-center justify-center overflow-hidden shadow-xs`}>
              <div className="absolute w-[82%] top-[10%] bottom-[10%] left-[9%] bg-white border border-stone-300 rounded-md px-1 py-0.5 flex flex-col items-center justify-around z-10">
                <span className="text-[7px] font-bold text-yellow-900 leading-none truncate max-w-full font-serif text-center">
                  {product.name.replace('Mangalam ', '')}
                </span>
                <div className="opacity-85">{renderIcon(colors.accent)}</div>
                <span className="text-[5px] text-stone-400 leading-none">
                  Aushadhi Rasayana
                </span>
              </div>
              {/* Glass Highlight */}
              <div className="absolute left-1 top-1 bottom-1 w-1 bg-white/20 rounded-full" />
            </div>
          </div>
        )}

        {product.category === 'Taila-Ghrita' && (
          /* Premium medicated oil flask with a dropper */
          <div className="relative w-14 h-26 flex flex-col items-center">
            {/* Dropper bulb and collar */}
            <div className="w-4 h-4 bg-stone-700 rounded-full z-15" />
            <div className="w-5 h-2 bg-stone-200 border-x border-stone-400 z-10" />
            {/* Bottle body */}
            <div className="w-12 h-18 rounded-t-md rounded-b-lg bg-gradient-to-br from-amber-800 to-yellow-950 relative border border-stone-900/60 flex items-center justify-center overflow-hidden">
              <div className="absolute bottom-1 right-1 left-1 top-[50%] bg-gradient-to-t from-yellow-300/30 to-amber-400/10" />
              {/* Label */}
              <div className="absolute w-[85%] top-[15%] bottom-[15%] left-[7.5%] bg-stone-50 border border-stone-200 rounded-sm px-0.5 flex flex-col items-center justify-around z-10">
                <span className="text-[6px] font-bold text-amber-900 uppercase">OIL</span>
                <div className="opacity-90">{renderIcon(colors.secondary)}</div>
                <span className="text-[5px] text-stone-600 text-center leading-none tracking-tight">
                  {product.sanskritName}
                </span>
              </div>
              <div className="absolute left-1 top-1 bottom-1 w-0.5 bg-white/20 rounded-full" />
            </div>
          </div>
        )}

        {product.category === 'Bhasma' && (
          /* Little luxurious glass vial with gold accents */
          <div className="relative w-12 h-20 flex flex-col items-center justify-center mt-3">
            <div className="w-6 h-2 bg-yellow-500 rounded-t-sm border border-stone-600 z-10" />
            <div className="w-1.5 h-1 bg-stone-400 border-x border-stone-600" />
            <div className={`w-10 h-13 rounded-t-md rounded-b-md bg-gradient-to-b ${colors.bottle} relative border border-stone-800 flex items-center justify-center overflow-hidden`}>
              <div className="absolute w-[80%] top-[10%] bottom-[10%] left-[10%] bg-yellow-50 border border-yellow-300 rounded-xs px-0.5 flex flex-col items-center justify-around z-10">
                <span className="text-[5px] font-bold font-serif text-yellow-950 tracking-wide text-center">
                  BHASMA
                </span>
                {renderIcon(colors.accent)}
              </div>
              <div className="absolute left-[2px] top-1 bottom-1 w-0.5 bg-white/30 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* REQUIREMENT COMPLIANCE BANNER: Placeholders for product images - 'Image: [Product Image Placeholder]' */}
      <div className={`absolute bottom-0 inset-x-0 py-1 bg-stone-900/80 backdrop-blur-xs text-center z-25 flex items-center justify-center border-t border-amber-900/30 px-1`}>
        <span className="text-[10px] md:text-xs font-mono font-bold text-amber-100 tracking-wider">
          {showPhoto ? "Image: Product.png [Connected]" : "Image: [Product Image Placeholder]"}
        </span>
      </div>

      {/* Hover action highlight frame, adding extra craft feel */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-700/20 rounded-xl transition-all duration-300 pointer-events-none" />
    </div>
  );
}
