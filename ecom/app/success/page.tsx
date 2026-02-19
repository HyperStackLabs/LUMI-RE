'use client'
import { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  Printer, 
  ShoppingBag,
  MapPin,
  Clock
} from 'lucide-react';

// 1. Interfaces matching your Backend Response
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  images: string[];
}

interface OrderData {
  id: string;
  total: number;
  currency: string;
  items: OrderItem[];
}

const OrderSuccess = () => {
  
  const [orderDetails, setOrderDetails] = useState<OrderData | null>(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');

    if (!sessionId) return
    fetch(`http://localhost:4000/checkout-session?session_id=${sessionId}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setOrderDetails(data);
      })
      .catch(console.error);
  }, []);

  const theme = {
    bg: "bg-[#0A0A0A]",
    text: "text-white",
    subText: "text-gray-400",
    accent: "text-[#D4AF37]",
    border: "border-gray-800",
    cardBg: "bg-[#111]",
    navBg: "bg-[#0A0A0A]/90"
  };

  return (
    <div className={`min-h-screen w-full font-sans selection:bg-[#D4AF37] selection:text-white ${theme.bg} ${theme.text} flex flex-col`}>
      
      {/* --- Navbar --- */}
      <nav className={`fixed top-0 w-full z-50 border-b ${theme.border} ${theme.navBg} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <a href="/" className="text-2xl font-serif tracking-widest font-bold">
            LUMIÈRE<span className="text-[#D4AF37]">.</span>
          </a>
          <a href="/settings/profile-settings" className="hidden md:block text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
             My Account
          </a>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 py-32">
        
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at center, #D4AF37 1px, transparent 0)', backgroundSize: '60px 60px' }}>
        </div>
        
        {/* Conditional Rendering: Show content only after data loads */}
        {orderDetails ? (
        <div className="max-w-4xl w-full relative z-10 animate-fade-up">
          
          {/* Success Icon */}
          <div className="flex justify-center mb-10">
            <div className="relative group">
                <div className="w-24 h-24 rounded-full border border-[#D4AF37] flex items-center justify-center">
                    <Check size={40} className="text-[#D4AF37]" />
                </div>
                <div className="absolute inset-0 rounded-full border border-[#D4AF37] animate-ping opacity-20 duration-[2000ms]"></div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Order Confirmed</p>
            <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">Excellent Choice.</h1>
            <p className={`text-lg font-light ${theme.subText} max-w-lg mx-auto leading-relaxed`}>
              Your acquisition <span className="text-white">#{orderDetails.id.slice(-8).toUpperCase()}</span> has been secured. 
              Our concierge is currently preparing your timepiece for dispatch.
            </p>
          </div>

          {/* Details Card */}
          <div className={`w-full ${theme.cardBg} border ${theme.border} p-8 md:p-12 relative overflow-hidden`}>
             
             {/* Decorative Corner */}
             <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#D4AF37]/40"></div>

             <div className="flex flex-col md:flex-row gap-12">
                
                {/* Left: Shipping (Static for demo, dynamic if you add address to DB) */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-[#D4AF37] mb-6">
                        <MapPin size={16} />
                        <h3 className="text-xs uppercase tracking-widest font-semibold">Destination</h3>
                    </div>
                    
                    <div className="space-y-1 mb-8 pl-6 border-l border-gray-800">
                        <p className={`text-sm ${theme.text}`}>Client</p>
                        <p className={`text-sm ${theme.subText}`}>Address provided during checkout</p>
                    </div>

                    <div className="flex items-center gap-2 text-[#D4AF37] mb-4">
                        <Clock size={16} />
                        <h3 className="text-xs uppercase tracking-widest font-semibold">Estimated Arrival</h3>
                    </div>
                    <p className={`text-sm ${theme.subText} pl-6`}>3 — 5 Business Days</p>
                </div>

                {/* Right: Order Items (Dynamic) */}
                <div className="flex-1 md:border-l border-gray-800 md:pl-12">
                     <div className="flex items-center gap-2 text-[#D4AF37] mb-6">
                        <ShoppingBag size={16} />
                        <h3 className="text-xs uppercase tracking-widest font-semibold">Collection</h3>
                     </div>

                     <div className="flex flex-col gap-4 mb-8">
                        {orderDetails.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                {/* Image Container */}
                                <div className="w-16 h-20 bg-gray-800 overflow-hidden border border-gray-700 shrink-0">
                                   {item.images && item.images.length > 0 ? (
                                      <img src={item.images[0]} className="w-full h-full object-cover opacity-90" alt={item.name} />
                                   ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500">IMG</div>
                                   )}
                                </div>
                                
                                {/* Item Details */}
                                <div>
                                    <h4 className="font-serif text-sm line-clamp-1">{item.name}</h4>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <div className="ml-auto text-sm font-light">
                                  ${item.price.toLocaleString()}
                                </div>
                            </div>
                        ))}
                     </div>

                     {/* Total */}
                     <div className={`flex justify-between items-center pt-6 border-t ${theme.border}`}>
                        <span className={`text-xs uppercase tracking-widest ${theme.subText}`}>Total Amount</span>
                        <span className="text-2xl font-serif text-[#D4AF37]">
                          ${orderDetails.total.toLocaleString()}
                        </span>
                     </div>
                </div>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-16 text-center flex flex-col md:flex-row items-center justify-center gap-6">
             <a href="/" className="group relative px-10 py-4 overflow-hidden border border-[#D4AF37] bg-transparent w-full md:w-auto text-center">
                <span className="absolute inset-0 w-full h-full bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                <span className={`relative z-10 uppercase tracking-[0.2em] text-xs font-semibold flex items-center justify-center gap-2 group-hover:text-black transition-colors ${theme.text}`}>
                    Return to Boutique <ArrowRight size={14} /> 
                </span>
             </a>

             <button className={`uppercase tracking-widest text-xs hover:text-[#D4AF37] transition-all flex items-center gap-2 ${theme.subText}`}>
                <Printer size={14} /> Download Invoice
             </button>
          </div>

        </div>
        ) : (
          /* Loading State */
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border border-gray-800 mb-8"></div>
            <div className="h-8 w-64 bg-gray-800 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-800 rounded"></div>
          </div>
        )}

      </main>
      
      {/* Animation Styles */}
      <style>{`
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;