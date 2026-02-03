import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar3 = () => {
    const isDarkMode = true
    const router = useRouter()
    const [isScrolled, setIsScrolled] = useState(false)
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);
    const theme = {
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]",
    text: isDarkMode ? "text-white" : "text-[#1a1a1a]",
    subText: isDarkMode ? "text-gray-400" : "text-gray-600",
    accent: "text-[#D4AF37]",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    navBg: isDarkMode ? "bg-[#0A0A0A]/80" : "bg-[#F9F9F9]/80",
    cardBg: isDarkMode ? "bg-[#111]" : "bg-white",
  };
  return <nav className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md border-b ${isScrolled ? `${theme.navBg} ${theme.border}` : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <button onClick={() => router.back()} className={`hover:text-[#D4AF37] transition-colors ${theme.subText}`}>
                <ArrowLeft size={20} />
             </button>
             <span className="text-xl font-serif tracking-widest font-bold hidden md:block">
               LUMIÈRE<span className="text-[#D4AF37]">.</span>
             </span>
          </div>
        </div>
    </nav>
}

export default Navbar3