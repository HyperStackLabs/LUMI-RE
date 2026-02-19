'use client'
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  ShoppingBag, 
  Shield, 
  ChevronRight,
  Lock,
  LoaderCircle
} from 'lucide-react';
import { IUser } from '@/app/page';
import betterFetch from '@/utils/betterFetch';

const SecuritySettings = () => {
  // Only keeping the Theme State
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const [passwords, setPasswords] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [currentUser, setUser] = useState<IUser | null>(null)

  const theme = {
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]",
    text: isDarkMode ? "text-white" : "text-[#1a1a1a]",
    subText: isDarkMode ? "text-gray-400" : "text-gray-500",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    inputBorder: isDarkMode ? "border-gray-800" : "border-gray-300",
    cardBg: isDarkMode ? "bg-[#111]" : "bg-white",
    sidebarBg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F5F5F5]",
  };

  const menuItems = [
    { id: 'profile', label: 'Public Profile', icon: User, active: false },
    { id: 'orders', label: 'Order History', icon: ShoppingBag, active: false },
    { id: 'security', label: 'Login & Security', icon: Shield, active: true },
  ]
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

  async function changePassword(){
    try{
      setLoading(true)
      console.log(isLoading)
        if(passwords.confirmPassword == passwords.newPassword){
            await betterFetch(`http://localhost:4000/change-password`, {
                method: "PATCH",
                body: JSON.stringify(passwords),
            })
            setLoading(false)
        }
    }catch(error){
        console.log(error)
    }
  }

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 font-sans selection:bg-[#D4AF37] selection:text-white ${theme.bg} ${theme.text}`}>
      {/* --- Header / Navigation --- */}
      <header className={`fixed top-0 w-full z-50 backdrop-blur-md border-b ${theme.border} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
             {/* Back Button */}
            <a 
              href="/"
              className={`flex items-center gap-2 text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors ${theme.subText}`}
            >
              <ArrowLeft size={16} /> <span className="hidden md:inline">Back to Boutique</span>
            </a>
            
            {/* Logo */}
            <div className="text-xl font-serif tracking-widest font-bold">
              LUMIÈRE<span className="text-[#D4AF37]">.</span> <span className="text-xs font-sans font-light opacity-50 ml-2">SECURITY</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      {/* --- Main Layout --- */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24">
        
        {/* --- Sidebar --- */}
        <aside className="w-full md:w-64">
          <h3 className={`text-xs uppercase tracking-[0.2em] font-semibold mb-8 pl-4 ${theme.subText}`}>Account</h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`w-full flex items-center justify-between px-4 py-4 text-sm transition-all duration-300 group border-l-2 cursor-pointer
                  ${item.active 
                    ? `border-[#D4AF37] ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}` 
                    : 'border-transparent hover:border-gray-500'}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={16} className={item.active ? "text-[#D4AF37]" : "text-gray-500"} />
                  <span className={`tracking-wide ${item.active ? theme.text : theme.subText}`}>
                    {item.label}
                  </span>
                </div>
                {item.active && <ChevronRight size={14} className="text-[#D4AF37]" />}
              </div>
            ))}
          </nav>
        </aside>

        {/* --- Content Area (Security Tab) --- */}
        <section className="flex-1 max-w-2xl animate-fade-up">
          
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-4">Login & Security</h1>
            <p className={`text-sm font-light ${theme.subText}`}>
              Update your credentials and manage account protection.
            </p>
          </div>

          <div className="space-y-16">
            
            {/* --- Password Change Section --- */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Lock size={18} className="text-[#D4AF37]" />
                <h3 className="text-lg font-serif">Change Password</h3>
              </div>

              <div className="space-y-8 pl-0 md:pl-8">
                {/* Current Password */}
                <div className="relative group">
                  <input 
                    type="password" 
                    placeholder=" "
                    value={passwords.password}
                    onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                    className={`peer w-full py-3 bg-transparent border-b ${theme.inputBorder} outline-none focus:border-[#D4AF37] transition-all duration-300 text-lg font-light tracking-widest`}
                  />
                  <label className={`absolute left-0 top-3 text-xs uppercase tracking-[0.2em] ${theme.subText} transition-all duration-300 pointer-events-none 
                    peer-focus:-translate-y-6 peer-focus:text-[#D4AF37]
                    peer-not-placeholder-shown:-translate-y-6`}>
                    Current Password
                  </label>
                  <a href="#" className={`absolute right-0 top-4 text-[10px] uppercase tracking-widest hover:text-[#D4AF37] transition-colors ${theme.subText}`}>
                    Forgot?
                  </a>
                </div>

                {/* New Password */}
                <div className="relative group">
                  <input 
                    type="password" 
                    placeholder=" "
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    className={`peer w-full py-3 bg-transparent border-b ${theme.inputBorder} outline-none focus:border-[#D4AF37] transition-all duration-300 text-lg font-light tracking-widest`}
                  />
                  <label className={`absolute left-0 top-3 text-xs uppercase tracking-[0.2em] ${theme.subText} transition-all duration-300 pointer-events-none 
                    peer-focus:-translate-y-6 peer-focus:text-[#D4AF37]
                    peer-not-placeholder-shown:-translate-y-6`}>
                    New Password
                  </label>
                </div>

                {/* Confirm Password */}
                <div className="relative group">
                  <input 
                    type="password" 
                    placeholder=" "
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    className={`peer w-full py-3 bg-transparent border-b ${theme.inputBorder} outline-none focus:border-[#D4AF37] transition-all duration-300 text-lg font-light tracking-widest`}
                  />
                  <label className={`absolute left-0 top-3 text-xs uppercase tracking-[0.2em] ${theme.subText} transition-all duration-300 pointer-events-none 
                    peer-focus:-translate-y-6 peer-focus:text-[#D4AF37]
                    peer-not-placeholder-shown:-translate-y-6`}>
                    Confirm New Password
                  </label>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className={`w-full ${theme.border}`}></div>

            {/* Action Buttons */}
            <div className="pt-8 flex items-center justify-end gap-6">
                <button className={`text-xs uppercase tracking-widest ${theme.subText} hover:text-white transition-colors`}>
                    Cancel
                </button>
                
                <button onClick={changePassword} className="group relative px-8 py-3 overflow-hidden border border-[#D4AF37] bg-transparent" disabled={isLoading}>
                    <span className="absolute inset-0 w-full h-full bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                    <span className={`relative z-10 uppercase tracking-[0.25em] text-xs font-semibold flex items-center gap-2 transition-colors duration-300 group-hover:text-black ${theme.text}`}>
                        {!isLoading ? 'Update Security' : <LoaderCircle className='w-4 h-4 animate-spin' />}
                    </span>
                </button>
            </div>
          </div>
        </section>
      </main>

      {/* Global Animation Styles */}
      <style>{`
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SecuritySettings;