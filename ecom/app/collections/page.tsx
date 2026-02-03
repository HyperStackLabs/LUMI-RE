'use client'
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ArrowRight, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Mock Data ---
const COLLECTIONS = [
  {
    id: 1,
    name: "The Midnight Series",
    category: "Timepieces",
    year: "2024",
    description: "Engineering meets the abyss. A collection defined by matte black ceramics and luminescent details.",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2574&auto=format&fit=crop",
    featured: true
  },
  {
    id: 2,
    name: "Solaris Alta",
    category: "Fine Jewelry",
    year: "2024",
    description: "Capturing the raw power of the sun in 24k gold and yellow diamonds.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2669&auto=format&fit=crop",
    featured: true
  },
  {
    id: 3,
    name: "Aviator Legacy",
    category: "Timepieces",
    year: "2023",
    description: "A tribute to the pioneers of flight. Leather, steel, and precision chronograph movements.",
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=2546&auto=format&fit=crop",
    featured: false
  },
  {
    id: 4,
    name: "Silk & Stone",
    category: "Couture",
    year: "2023",
    description: "Architectural tailoring meets soft, flowing organic fabrics.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2673&auto=format&fit=crop",
    featured: false
  },
  {
    id: 5,
    name: "Bridal Ethereal",
    category: "Fine Jewelry",
    year: "2022",
    description: "For the moment that lasts forever. Flawless diamonds set in platinum.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2670&auto=format&fit=crop",
    featured: false
  },
  {
    id: 6,
    name: "Noir Leather",
    category: "Couture",
    year: "2023",
    description: "Hand-stitched Italian leather accessories for the modern executive.",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2695&auto=format&fit=crop",
    featured: false
  }
];

const CollectionsPage = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Config
  const theme = {
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]",
    text: isDarkMode ? "text-white" : "text-[#1a1a1a]",
    subText: isDarkMode ? "text-gray-400" : "text-gray-600",
    accent: "text-[#D4AF37]",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    navBg: isDarkMode ? "bg-[#0A0A0A]/80" : "bg-[#F9F9F9]/80",
    cardOverlay: isDarkMode ? "bg-black/40" : "bg-black/20",
  };

  const categories = ["All", "Timepieces", "Fine Jewelry", "Couture"];
  
  const filteredCollections = activeCategory === "All" 
    ? COLLECTIONS 
    : COLLECTIONS.filter(c => c.category === activeCategory);

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans selection:bg-[#D4AF37] selection:text-white ${theme.bg} ${theme.text}`}>

      {/* --- Navigation (Condensed for Template) --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md ${isScrolled ? `py-4 ${theme.navBg} border-b ${theme.border}` : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-serif tracking-widest font-bold cursor-pointer" onClick={() => router.push('/')}>
            LUMIÈRE<span className="text-[#D4AF37]">.</span>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="hover:text-[#D4AF37] transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <ShoppingBag size={18} className="hover:text-[#D4AF37] cursor-pointer" />
            <Menu size={24} className="md:hidden cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1505562130589-9d54b8d7e7e5?q=80&w=2670&auto=format&fit=crop" 
            alt="Collections Hero" 
            className="w-full h-full object-cover animate-slow-zoom" 
          />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/50' : 'bg-black/30'}`}></div>
        </div>
        
        <div className="relative z-10 text-center px-6 animate-fade-up">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            The <span className="italic font-light">Archives</span>
          </h1>
          <p className="text-gray-200 text-sm md:text-base tracking-[0.2em] uppercase font-light max-w-lg mx-auto">
            Explore our seasonal drops and timeless curations.
          </p>
        </div>
      </header>

      {/* --- Filter Bar --- */}
      <section className={`sticky top-20 z-40 backdrop-blur-lg border-b ${theme.border} ${theme.navBg}`}>
        <div className="max-w-7xl mx-auto px-6 py-6 overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-center md:justify-center space-x-8 md:space-x-12 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 relative group
                  ${activeCategory === cat ? theme.accent : theme.subText} hover:${theme.accent}`}
              >
                {cat}
                {/* Active Dot */}
                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4AF37] rounded-full transition-opacity duration-300 ${activeCategory === cat ? 'opacity-100' : 'opacity-0'}`}></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- Collections Grid --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          
          {filteredCollections.map((collection, index) => (
            <div 
              key={collection.id} 
              className={`group cursor-pointer ${index % 2 !== 0 ? 'md:mt-24' : ''}`} // Staggered Grid Effect
            >
              {/* Image Container */}
              <div className="relative overflow-hidden w-full mb-8">
                {/* Overlay on Hover */}
                <div className={`absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center bg-black/40`}>
                   <button className="border border-white text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                     View Lookbook
                   </button>
                </div>
                
                {/* Image */}
                <img 
                  src={collection.image} 
                  alt={collection.name} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                />

                {/* Corner Year Tag */}
                <div className="absolute top-0 right-0 bg-black/60 backdrop-blur-sm text-white px-4 py-2 text-xs uppercase tracking-widest z-10 border-l border-b border-gray-700">
                   {collection.year}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex flex-col items-start pr-8">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 bg-[#D4AF37]"></div>
                   <span className="text-[#D4AF37] text-xs uppercase tracking-widest">{collection.category}</span>
                 </div>
                 <h2 className={`text-3xl md:text-4xl font-serif mb-4 group-hover:text-[#D4AF37] transition-colors duration-300`}>
                   {collection.name}
                 </h2>
                 <p className={`text-sm leading-7 font-light ${theme.subText} line-clamp-2`}>
                   {collection.description}
                 </p>
                 
                 <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                    <span className={theme.text}>Discover</span>
                    <ArrowUpRight size={14} className={theme.accent} />
                 </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* --- Editorial / Highlight Section --- */}
      <section className="relative w-full py-32 border-t border-b border-[#D4AF37]/30 mt-12">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f0f0f0]'}`}></div>
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(45deg, #D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-6">
           <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-8">Coming Soon</p>
           <h2 className="text-4xl md:text-6xl font-serif mb-8">The Obsidian Gala</h2>
           <p className={`text-lg md:text-xl font-light leading-relaxed mb-12 ${theme.subText}`}>
             A limited edition couture collection inspired by the volcanic landscapes of Iceland. 
             Featuring crushed velvet, raw black diamonds, and architectural silhouettes.
           </p>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
             <input 
               type="email" 
               placeholder="Enter your email for early access"
               className={`w-full md:w-96 px-6 py-4 bg-transparent border-b ${theme.border} outline-none text-center md:text-left focus:border-[#D4AF37] transition-colors`}
             />
             <button className="px-10 py-4 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors w-full md:w-auto">
               Notify Me
             </button>
           </div>
        </div>
      </section>
      {/* Styles */}
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

export default CollectionsPage;