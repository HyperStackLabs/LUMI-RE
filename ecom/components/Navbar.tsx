'use client'
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import Link from "next/link";
import { IUser } from "@/app/page";
import { ShoppingBag, Search, Menu, X, Sun, Moon, Settings, LogOut, ChevronDown, Trash2 } from 'lucide-react';

// 1. Interface Definition
export interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  images: string[];
  category: string;
  type: string;
  specs: string;
  quantity: number
}

function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentUser, setUser] = useState<IUser | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const route = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // 2. Cart State & Refs
  const [cart, setCart] = useState<Product[]>([]) // Typed as Product[]
  const [cartOpen, setCartOpen] = useState(false)
  const cartDropdownRef = useRef<HTMLDivElement>(null)

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
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
  const subtotal = Array.isArray(cart) ? cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0

  async function handleLogout(){
    try{
      if(currentUser !== null){
        const response = await fetch(`http://localhost:4000/auth/logout`, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          credentials: 'include'
        })
        if(response.ok) {
          setUser(null)
          console.log('Logged out successfully')
        }
      }
    }catch(error){
      console.log(error)
    }
  }
  
  useEffect(() => {
      async function scanForUser(){
        try {
          const response = await fetch('http://localhost:4000/verify-token', {
              headers: { 'Content-Type': "application/json" },
              credentials: 'include'
          })
          if(response.ok) {
              const res = await response.json()
              setUser(res)
              console.log(res)
          }
        } catch (e) {
            console.log("No user found or API offline");
        }
      }
      scanForUser()
    }, [])

    useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Updated Click Outside Logic to handle Cart as well
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // User Dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      // Cart Dropdown
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function getCart(id: string){
        try{
            const response = await fetch(`http://localhost:4000/cart/${id}`, {
                headers: { 'Content-Type': "application/json" },
            })            
            if (response.ok) {
                const res = await response.json()
                // ONLY set cart if it is an array
                if (Array.isArray(res)) {
                    setCart(res)
                } else {
                    setCart([])
                }
            } else {
                console.log("Failed to fetch cart")
                setCart([])
            }
        } catch(error){
            console.log('Cart fetch error:', error)
            setCart([])
        }
    }
    
    // Only fetch if user is logged in
    if (currentUser?.id) {
        getCart(currentUser.id)
    } else {
        setCart([]) // Reset cart if no user
    }
  }, [currentUser?.id])

  async function removeFromCart(productID: string){
    try{
        const response = await fetch(`http://localhost:4000/cart/${currentUser?.id}`, {
            headers: { 'Content-Type': "application/json" },
            method: 'DELETE',
            body: JSON.stringify({productID})
        })
        const res = await response.json()
        setCart(prevCart => Array.isArray(prevCart) ? prevCart.filter(item => item.id !== productID) : [])
    }catch(error){
        console.log(error)
    }
  }
  async function checkout(id: string){
    try{
      const response = await fetch('http://localhost:4000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({id})
      })
      const data = await response.json()
      if(data.url){
        window.location = data.url
      }else{
        console.log('No data url found to start checkout process.')
      }
    }catch(error){
      console.log(error)
    }
  }
  return <>
    <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md 
        ${isScrolled ? `py-4 ${theme.navBg} ${theme.border} border-b` : `py-8 bg-transparent border-transparent`}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="text-2xl font-serif tracking-widest font-bold cursor-pointer hover:opacity-80 transition-opacity" onClick={() => route.push('/')}>
            LUMIÈRE<span className="text-[#D4AF37]">.</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-12 text-xs uppercase tracking-[0.2em] font-medium">
            {['Watches', 'Jewelry', 'Clothing', 'Collections'].map((item) => (
              <a 
                key={item} 
                href={`${item.toLowerCase()}`} 
                className="relative group overflow-hidden"
              >
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">{item}</span>
                <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-[#D4AF37]">
                  {item}
                </span>
                <span className="absolute bottom-0 left-0 w-full  bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            ))}
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-6">
            <button onClick={toggleTheme} className="hover:text-[#D4AF37] transition-colors duration-300">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Search size={18} className="hidden md:block hover:text-[#D4AF37] cursor-pointer transition-colors" />
            
            {/* 5. Cart Dropdown UI Implementation */}
            <div className="relative" ref={cartDropdownRef}>
                <button 
                    onClick={() => { setCartOpen(!cartOpen); setUserMenuOpen(false); }}
                    className="relative hover:text-[#D4AF37] cursor-pointer transition-colors flex items-center outline-none"
                >
                    <ShoppingBag size={18} />
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                </button>

                {cartOpen && (
                    <div className={`absolute right-0 top-full mt-8 w-96 ${theme.dropdownBg} backdrop-blur-xl border ${theme.border} shadow-2xl animate-fade-in origin-top-right z-50 flex flex-col`}>
                        {/* Decorative Top Line */}
                        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
                        
                        {/* Cart Header */}
                        <div className={`px-6 py-4 border-b border-gray-800/50 flex justify-between items-center ${theme.text}`}>
                            <span className="text-xs uppercase tracking-widest font-semibold">Shopping Bag ({cart.length})</span>
                            <button onClick={() => setCartOpen(false)}><X size={14} className="hover:text-[#D4AF37]" /></button>
                        </div>

                        {/* Cart Items List */}
                        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {cart.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className={`text-sm ${theme.subText} font-light`}>Your bag is currently empty.</p>
                                </div>
                            ) : (
                                cart.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex gap-4 animate-fade-in">
                                        {/* Image */}
                                        <div className="w-16 h-20 bg-gray-800 overflow-hidden shrink-0 border border-gray-800/50">
                                            {item.images && item.images.length > 0 ? (
                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-[9px] text-gray-500">NO IMG</div>
                                            )}
                                        </div>
                                        
                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1">{item.collection}</p>
                                                <h4 className={`text-sm font-serif leading-tight ${theme.text}`}>{item.name}</h4>
                                                {item.specs && <p className={`text-[10px] ${theme.subText} mt-1 truncate`}>{item.specs}</p>}
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className={`text-sm font-light ${theme.subText}`}>${item.price.toLocaleString()} x {item.quantity}</span>
                                                <button 
                                                    onClick={() => currentUser?.id && removeFromCart(item.id)}
                                                    className="text-[10px] uppercase tracking-widest text-red-400 hover:text-white transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
                                                >
                                                    <Trash2 size={10} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {cart.length > 0 && (
                            <div className={`p-6 border-t ${theme.border} ${theme.navBg}`}>
                                <div className="flex justify-between items-center mb-6">
                                    <span className={`text-xs uppercase tracking-widest ${theme.subText}`}>Subtotal</span>
                                    <span className={`text-lg font-serif ${theme.text}`}>${subtotal.toLocaleString()}</span>
                                </div>
                                <button onClick={() => currentUser?.id && checkout(currentUser?.id)} className="w-full cursor-pointer group relative px-6 py-3 overflow-hidden border border-[#D4AF37] bg-transparent">
                                    <span className="absolute inset-0 w-full h-full bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                                    <span className={`relative z-10 text-center block uppercase tracking-[0.25em] text-xs font-semibold group-hover:text-black transition-colors duration-300 ${theme.text}`}>
                                        Checkout
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {!currentUser ? (
                <button onClick={() => route.push('/auth')} className={`hidden cursor-pointer md:block px-6 py-2 text-xs uppercase tracking-widest transition-all duration-300 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>Sign in</button>
             ) : (
             <div className="relative" ref={dropdownRef}>
                  {/* User Trigger */}
                  <button 
                    onClick={() => {setUserMenuOpen(!userMenuOpen); setCartOpen(false)}}
                    className="flex items-center space-x-3 focus:outline-none group"
                  >
                    <div className="h-2 w-2 rounded-full bg-[#D4AF37] group-hover:shadow-[0_0_8px_#D4AF37] transition-shadow"></div>
                    <span className="text-xs uppercase tracking-[0.2em] font-medium hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                        {currentUser.fullName}
                        <ChevronDown size={12} className={`transition-transform duration-300 ${userMenuOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className={`absolute right-0 top-full mt-8 w-56 ${theme.dropdownBg} backdrop-blur-xl border ${theme.border} shadow-2xl animate-fade-in origin-top-right z-50 flex flex-col py-2`}>
                        {/* Decorative Top Border */}
                        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
                        
                        <div className="px-6 py-4 border-b border-gray-800/50 mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500">Signed in as</p>
                            <p className={`text-xs mt-1 truncate ${theme.text}`}>{currentUser.email}</p>
                        </div>

                        <Link href='/settings/profile-settings' className={`group px-6 py-3 text-left text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-all flex items-center gap-3 ${theme.subText} hover:bg-white/5`}>
                            <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> 
                            <span>Settings</span>
                        </Link>
                        
                        <button 
                            onClick={handleLogout}
                            className={`group px-6 py-3 text-left text-xs uppercase tracking-widest hover:text-red-400 transition-all flex items-center gap-3 ${theme.subText} hover:bg-white/5`}
                        >
                            <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
                            <span>Sign Out</span>
                        </button>
                    </div>
                  )}
              </div>
             )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className={`absolute top-full left-0 w-full h-screen ${theme.bg} flex flex-col items-center justify-center space-y-8 animate-fade-in md:hidden border-t ${theme.border}`}>
             {['Watches', 'Jewelry', 'Clothing', 'Collections', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-2xl font-serif tracking-wider hover:text-[#D4AF37] transition-colors">
                {item}
              </a>
            ))}
            {currentUser && (
              <button onClick={handleLogout} className="text-sm uppercase tracking-widest text-red-400 mt-8 border-b border-red-400 pb-1">
               Sign Out
              </button>
            )}
          </div>
        )}
      </nav>
      {/* Animation Styles */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-5px); }
          100% { opacity: 1; transform: translateY(0); }
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
  </>
}

export default Navbar