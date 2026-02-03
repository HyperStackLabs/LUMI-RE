'use client'
import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, User, Search, Menu, X, Sun, Moon, ArrowRight, Settings, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const HERO_IMAGE = "https://images.unsplash.com/photo-1547996160-71df45efd2d7?q=80&w=2670&auto=format&fit=crop";
const CRAFTSMANSHIP_IMAGE = "https://images.unsplash.com/photo-1617038224558-28ad3fb558a7?q=80&w=2574&auto=format&fit=crop";

const PRODUCTS = [
  {
    id: 1,
    name: "The Sovereign Chrono",
    link: '/product-details/the-sovereign-chrono',
    category: "Timepieces",
    price: "$24,500",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Ethereal Diamond Band",
    link: '/product-details/ethereal-diamond-band',
    category: "Fine Jewelry",
    price: "$12,800",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Midnight Silk Lapel",
    link:  '/product-details/midnight-silk-lapel',
    category: "Couture",
    price: "$3,200",
    image: "https://wp-media-dejiandkola.s3.eu-west-2.amazonaws.com/2021/12/262199770_5245251982168904_809751595211010048_n.jpg"
  }
];

export interface IUser {
  fullName: string,
  email: string,
  password: string,
  id: string,
  profilePicture: string,
  orderHistory?: {ProductName: string, price: number}[],
  bio: string
}

const LuxuryBrand = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const theme = {
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]",
    text: isDarkMode ? "text-white" : "text-[#1a1a1a]",
    subText: isDarkMode ? "text-gray-400" : "text-gray-600",
    accent: "text-[#D4AF37]", // Gold
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    cardBg: isDarkMode ? "bg-[#111]" : "bg-white",
    navBg: isDarkMode ? "bg-[#0A0A0A]/80" : "bg-[#F9F9F9]/80",
    dropdownBg: isDarkMode ? "bg-[#0A0A0A]/95" : "bg-white/95",
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ease-in-out ${theme.bg} ${theme.text} selection:bg-[#D4AF37] selection:text-white font-sans`}>
      <Navbar />
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE} 
            alt="Luxury Watch" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom" 
          />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-white/10'} mix-blend-multiply`}></div>
          <div className="absolute inset-0 from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 animate-fade-up">
          <p className="text-[#D4AF37] uppercase tracking-[0.4em] text-sm mb-6 font-medium">Est. 1894</p>
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-tight">
            The Art of <br /><span className="italic font-light">Luxury</span>
          </h1>
          <p className="text-gray-200 text-sm md:text-lg tracking-wide max-w-2xl mx-auto mb-10 font-light opacity-90">
            Handcrafted diamond watches & fine gold jewelry for the uncompromising.
          </p>
          <button className="group relative px-10 py-4 overflow-hidden border border-[#D4AF37] text-white">
            <Link href='/collections'>
              <span className="absolute inset-0 w-full h-full bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              <span className="relative z-10 uppercase tracking-[0.25em] text-sm group-hover:text-black transition-colors duration-300">
                Explore Collection
              </span>
            </Link>
          </button>
        </div>
      </header>

      <section className={`py-32 px-6 ${theme.bg}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className={`text-4xl font-serif mb-2 ${theme.text}`}>Curated Selection</h2>
              <div className="w-12 h-[3px] bg-[#D4AF37]"></div>
            </div>
            <a href="#" className={`hidden md:flex items-center gap-2 text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors ${theme.subText}`}>
              View All <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                {/* Image Card */}
                <div className="relative h-[500px] w-full overflow-hidden mb-6">
                  <div className={`absolute inset-0 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`}></div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Floating Action */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                    <button className="bg-[#D4AF37] text-black px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-white transition-colors">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="text-center">
                  <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">{product.category}</p>
                  <h3 className={`text-xl font-serif mb-2 ${theme.text}`}>{product.name}</h3>
                  <p className={`font-light italic text-lg ${theme.subText}`}>{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Craftsmanship / Editorial Section --- */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Styling */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f0f0f0]'}`}></div>
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
            <div className="relative overflow-hidden">
              <img src={CRAFTSMANSHIP_IMAGE} className="w-full h-auto shadow-2xl" alt="Craftsmanship" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-[#D4AF37] hidden md:block"></div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <h2 className={`text-4xl md:text-5xl font-serif mb-8 leading-tight ${theme.text}`}>
              Precision meets <br />
              <span className="text-[#D4AF37] italic">Perfection</span>
            </h2>
            <p className={`text-lg leading-relaxed mb-8 font-light ${theme.subText}`}>
              Our master artisans dedicate hundreds of hours to a single piece. 
              Using only the rarest materials sourced ethically from around the globe, 
              we ensure that every detail reflects the pinnacle of luxury.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 bg-[#D4AF37]"></div>
                <span className={`uppercase tracking-widest text-xs ${theme.text}`}>Swiss Movement</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 bg-[#D4AF37]"></div>
                <span className={`uppercase tracking-widest text-xs ${theme.text}`}>24k Purity Gold</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 bg-[#D4AF37]"></div>
                <span className={`uppercase tracking-widest text-xs ${theme.text}`}>Conflict-Free Diamonds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Exclusive Horizontal Scroll --- */}
      <section className={`py-32 border-t ${theme.border}`}>
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-serif ${theme.text}`}>Exclusive Collections</h2>
        </div>
        
        {/* Simulating Horizontal Scroll Container */}
        <div className="flex overflow-x-auto space-x-8 px-6 pb-12 scrollbar-hide">
          {[1, 2, 3].map((item) => (
            <div key={item} className="min-w-[300px] md:min-w-[400px] group relative cursor-pointer">
               <div className="h-[600px] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                 <img 
                   src={`https://www.bobswatches.com/rolex-blog/wp-content/uploads/2019/02/Rolex_Datejust_116192_5D3_1761-2-Edit-2.jpg`} 
                   className="w-full h-full object-cover" 
                   alt="Collection Item"
                 />
               </div>
               <div className="absolute bottom-10 left-8">
                 <h3 className="text-white text-2xl font-serif">The Royal Edition</h3>
                 <p className="text-white/80 text-sm uppercase tracking-widest mt-2">View Lookbook</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-[#111] border-gray-200'} border-t pt-24 pb-12 text-white`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif tracking-widest font-bold mb-6">
              LUMIÈRE<span className="text-[#D4AF37]">.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-7">
              Redefining the standards of modern luxury with timeless elegance and precision engineering.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="uppercase tracking-widest text-xs font-semibold text-[#D4AF37] mb-8">Boutique</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Watches</li>
              <li className="hover:text-white cursor-pointer transition-colors">Fine Jewelry</li>
              <li className="hover:text-white cursor-pointer transition-colors">Leather Goods</li>
              <li className="hover:text-white cursor-pointer transition-colors">Gifts</li>
            </ul>
          </div>

          <div>
            <h4 className="uppercase tracking-widest text-xs font-semibold text-[#D4AF37] mb-8">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Our Story</li>
              <li className="hover:text-white cursor-pointer transition-colors">Ateliers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Sustainability</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
             <h4 className="uppercase tracking-widest text-xs font-semibold text-[#D4AF37] mb-8">Newsletter</h4>
             <p className="text-gray-400 text-sm mb-6">Be the first to receive updates on new collections.</p>
             <div className="flex border-b border-gray-600 pb-2">
               <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
               />
               <button className="text-gray-400 hover:text-[#D4AF37] uppercase text-xs tracking-widest">
                 Join
               </button>
             </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 border-t border-gray-900 pt-8">
          <p>© 2024 Lumière Luxury. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Global Styles for Animations */}
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
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LuxuryBrand;