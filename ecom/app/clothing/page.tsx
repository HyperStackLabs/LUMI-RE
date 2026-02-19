'use client'
import { useState, useEffect } from 'react';
import { 
  ChevronDown,
  Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar';
import betterFetch from '@/utils/betterFetch';
import useProductType from '@/hooks/getProduct';

const WatchesPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const {products} = useProductType('clothing')
  const route = useRouter()

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter Logic
  const categories = ["All", 'Jacket', 'Dress', 'Sweater', 'Suit'];
  const filteredJewelry = activeFilter === "All" 
    ? clothing
    : clothing?.filter(w => w.category === activeFilter);

  // Theme Config
  const theme = {
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]",
    text: isDarkMode ? "text-white" : "text-[#1a1a1a]",
    subText: isDarkMode ? "text-gray-400" : "text-gray-600",
    accent: "text-[#D4AF37]",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    navBg: isDarkMode ? "bg-[#0A0A0A]/80" : "bg-[#F9F9F9]/80",
    cardBg: isDarkMode ? "bg-[#111]" : "bg-white",
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans selection:bg-[#D4AF37] selection:text-white ${theme.bg} ${theme.text}`}>

      {/* --- Navigation --- */}
      <Navbar />

      {/* --- Hero Section --- */}
      <header className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1619163259394-44586db3d893?q=80&w=2672&auto=format&fit=crop" 
            alt="Watches Hero" 
            className="w-full h-full object-cover animate-slow-zoom" 
          />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-black/40'}`}></div>
        </div>
        
        <div className="relative z-10 text-center px-6 animate-fade-up">
          <p className="text-[#D4AF37] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Swiss Engineering</p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-2">
            Timepieces
          </h1>
        </div>
      </header>

      {/* --- Filter Bar --- */}
      <div className={`sticky top-20 z-40 ${theme.bg} border-b ${theme.border} transition-colors duration-700`}>
         <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide w-full md:w-auto">
                {categories.map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`text-xs uppercase tracking-widest whitespace-nowrap transition-colors duration-300 
                        ${activeFilter === cat ? theme.accent : theme.subText} hover:${theme.accent}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Sort / Count */}
            <div className={`hidden md:flex items-center gap-4 text-xs uppercase tracking-widest ${theme.subText}`}>
                <span>{filteredJewelry?.length} Results</span>
                <div className="h-4 bg-gray-600"></div>
                <button className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors">
                    Sort By <ChevronDown size={14} />
                </button>
            </div>
         </div>
      </div>

      {/* --- Product Grid --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {filteredJewelry?.map((product) => (
            <div 
              key={product.id} 
              className="group flex flex-col items-center"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Image Card */}
              <div className="relative w-full overflow-hidden mb-6 bg-gray-100 dark:bg-[#111]">
                 {/* Favorite Icon */}
                 <button className="absolute top-4 right-4 z-20 text-white/50 hover:text-[#D4AF37] transition-colors">
                    <Heart size={20} />
                 </button>

                 {/* Image */}
                 <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                 />
                 
                 {/* Overlay & Action */}
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                 
                 {/* Quick Add Button Slide Up */}
                 <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                    <button onClick={() => {localStorage.setItem('product-type', product.type), route.push(`/product-details/${product.id}`)}} className="w-full py-4 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors">
                        Add to Bag — ${product.price.toLocaleString()}
                    </button>
                 </div>
              </div>

              {/* Info */}
              <div className="text-center w-full relative">
                 <p className={`text-[10px] uppercase tracking-[0.2em] mb-2 ${theme.subText}`}>
                    {product.collection}
                 </p>
                 <h3 className={`text-xl font-serif mb-2 ${theme.text}`}>
                    {product.name}
                 </h3>
                 {/* Price / Specs Swap on Hover */}
                 <div className="h-6 overflow-hidden relative w-full">
                    <div className={`absolute w-full transition-all duration-500 ${hoveredProduct === product.id ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                         <p className={`text-sm font-light ${theme.text}`}>${product.price.toLocaleString()}</p>
                    </div>
                    <div className={`absolute w-full transition-all duration-500 ${hoveredProduct === product.id ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                         <p className="text-xs uppercase tracking-wider text-[#D4AF37]">{product.specs}</p>
                    </div>
                 </div>
              </div>

            </div>
          ))}
        </div>
      </section>
      {/* Global Animations */}
      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 1s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>

    </div>
  );
};

export default WatchesPage;