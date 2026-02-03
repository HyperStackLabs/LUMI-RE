'use client'
import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  ShoppingBag, 
  Printer, 
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const OrderSuccess = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Theme Config
  const theme = {
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]",
    text: isDarkMode ? "text-white" : "text-[#1a1a1a]",
    subText: isDarkMode ? "text-gray-400" : "text-gray-600",
    accent: "text-[#D4AF37]",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    cardBg: isDarkMode ? "bg-[#111]" : "bg-white",
  };

  // Mock Order Data
  const order_details

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 font-sans selection:bg-[#D4AF37] selection:text-white ${theme.bg} ${theme.text} flex flex-col`}>
      
      {/* --- Simple Navbar --- */}
      <nav className={`w-full py-8 px-6 flex justify-between items-center absolute top-0 z-50`}>
        <div className="text-2xl font-serif tracking-widest font-bold cursor-pointer" onClick={() => router.push('/')}>
            LUMIÈRE<span className="text-[#D4AF37]">.</span>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="hover:text-[#D4AF37] transition-colors">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 py-20">
        
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at center, #D4AF37 1px, transparent 0)', backgroundSize: '60px 60px' }}>
        </div>
        
        <div className="max-w-3xl w-full relative z-10 animate-fade-up">
          
          {/* Success Icon */}
          <div className="flex justify-center mb-12">
            <div className="relative">
                <div className="w-24 h-24 rounded-full border border-[#D4AF37] flex items-center justify-center">
                    <Check size={40} className="text-[#D4AF37]" />
                </div>
                {/* Pulse Effect */}
                <div className="absolute inset-0 rounded-full border border-[#D4AF37] animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] mb-4">Payment Successful</p>
            <h1 className="text-4xl md:text-6xl font-serif mb-6">Excellent Choice.</h1>
            <p className={`text-lg font-light ${theme.subText} max-w-lg mx-auto leading-relaxed`}>
              Your order <span className={theme.text}>{order_details.id}</span> has been secured. 
              A confirmation email has been sent to your inbox.
            </p>
          </div>

          {/* Order Card */}
          <div className={`w-full ${theme.cardBg} border ${theme.border} p-8 md:p-12 relative overflow-hidden`}>
             {/* Decorative Corner Line */}
             <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-[#D4AF37]/30"></div>

             <div className="flex flex-col md:flex-row justify-between gap-12">
                
                {/* Left: Shipping Info */}
                <div className="flex-1">
                    <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-6">Delivery Details</h3>
                    <div className="space-y-1 mb-8">
                        <p className={`text-sm ${theme.text}`}>Richard Croft</p>
                        <p className={`text-sm ${theme.subText}`}>15 Central Park West</p>
                        <p className={`text-sm ${theme.subText}`}>New York, NY 10023</p>
                        <p className={`text-sm ${theme.subText}`}>United States</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-70">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Est. Delivery: Dec 14 — Dec 16</span>
                    </div>
                </div>

                {/* Right: Summary */}
                <div className="flex-1">
                     <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-6">Order Summary</h3>
                     <div className="flex items-center gap-4 mb-8">
                        {order_details.items.map((img, i) => (
                            <div key={i} className={`w-16 h-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden border ${theme.border}`}>
                                <img src={img} className="w-full h-full object-cover opacity-80" alt="Item" />
                            </div>
                        ))}
                        {order_details.items.length > 2 && (
                             <div className={`w-16 h-20 flex items-center justify-center border ${theme.border} text-xs ${theme.subText}`}>
                                +1
                             </div>
                        )}
                     </div>
                     <div className={`flex justify-between items-center pt-6 border-t ${theme.border}`}>
                        <span className={`text-sm ${theme.subText}`}>Total Amount</span>
                        <span className="text-xl font-serif">{order_details.total}</span>
                     </div>
                </div>
             </div>
          </div>

          {/* What's Next / Concierge Message */}
          <div className="mt-12 text-center">
             <p className={`text-xs uppercase tracking-widest ${theme.subText} mb-8`}>
                Our concierge will contact you shortly to arrange a delivery time.
             </p>

             <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <button 
                  onClick={() => router.push('/')}
                  className="group relative px-8 py-4 overflow-hidden border border-[#D4AF37] bg-transparent w-full md:w-auto"
                >
                    <span className="absolute inset-0 w-full h-full bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                    <span className={`relative z-10 uppercase tracking-[0.25em] text-xs font-semibold flex items-center justify-center gap-2 group-hover:text-black transition-colors ${theme.text}`}>
                        <ArrowRight size={14} /> Continue Shopping
                    </span>
                </button>

                <button className={`uppercase tracking-widest text-xs border-b border-transparent hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all pb-1 flex items-center gap-2 ${theme.subText}`}>
                   <Printer size={14} /> Download Receipt
                </button>
             </div>
          </div>

        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="w-full py-8 text-center">
        <p className={`text-[10px] uppercase tracking-widest ${theme.subText}`}>
            Need assistance? <span className="underline cursor-pointer hover:text-[#D4AF37]">Contact Concierge</span>
        </p>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }
      `}</style>

    </div>
  );
};

export default OrderSuccess;