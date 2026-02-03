'use client'
import React, { FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import generateID from '@/hooks/generateID';
import { useRouter } from 'next/navigation';


const LuxuryAuth = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const route = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
    orderHistory: [],
    profilePicture: '',
    cart: []
  })
  const [loginCredentials, setLoginCreds] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  useEffect(() => {
    setLoginCreds({
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe
    })
  }, [credentials])

  const theme = {
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]",
    text: isDarkMode ? "text-white" : "text-[#1a1a1a]",
    subText: isDarkMode ? "text-gray-400" : "text-gray-500",
    inputBg: "bg-transparent",
    inputBorder: isDarkMode ? "border-gray-800" : "border-gray-300",
    accent: "text-[#D4AF37]",
    accentBorder: "border-[#D4AF37]",
  };
  async function LoginToExistingUser(e: React.FormEvent<HTMLElement>){
    e.preventDefault()
    console.log(loginCredentials)
    try{
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(loginCredentials)
      })
      const res = await response.json()
      route.push('/')
    }catch(error){
      console.log(error)
    }
  }
  async function userCreation(e: React.FormEvent<HTMLElement>){
    try{
      e.preventDefault()
      await fetch('http://localhost:4000/auth/signup', {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({...credentials, id: generateID()})
      })
      LoginToExistingUser(e)
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className={`min-h-screen w-full flex relative transition-colors duration-700 ${theme.bg} ${theme.text} font-sans selection:bg-[#D4AF37] selection:text-white`}>
      <a href="/" className={`absolute top-8 left-8 z-50 flex items-center gap-2 text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black md:text-white'}`}>
        <ArrowLeft size={16} /> Back to Boutique
      </a>
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-8 right-8 z-50 text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
      >
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img 
          src={isLogin 
            ? "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2600&auto=format&fit=crop" // Watch/Hands
            : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2670&auto=format&fit=crop" // Gold Jewelry
          }
          alt="Luxury Visual" 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        
        {/* Brand Overlay on Image */}
        <div className="absolute bottom-12 left-12 z-20">
          <h2 className="text-4xl font-serif text-white mb-2 tracking-wide">LUMIÈRE<span className="text-[#D4AF37]">.</span></h2>
          <p className="text-white/80 text-sm tracking-widest uppercase font-light">The Art of Luxury</p>
        </div>
      </div>

      {/* --- Right Side: The Form --- */}
      <div className={`w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-24 transition-all duration-500`}>
        
        <div className="w-full max-w-md animate-fade-up">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-4">
              {isLogin ? "Welcome Back" : "Join the Circle"}
            </h1>
            <p className={`text-sm font-light ${theme.subText}`}>
              {isLogin 
                ? "Sign in to access your curated collection." 
                : "Create an account to unlock exclusive pieces."}
            </p>
          </div>

          {/* Form Fields */}
          <form className="space-y-8" onSubmit={isLogin ? LoginToExistingUser : userCreation}>
            
            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div className="relative group">
                <input 
                  type="text" 
                  onChange={e => setCredentials({...credentials, fullName: e.target.value})}
                  required
                  placeholder=" "
                  className={`peer w-full py-3 bg-transparent border-b ${theme.inputBorder} outline-none focus:border-[#D4AF37] transition-all duration-300 text-lg`}
                />
                <label className={`absolute left-0 top-3 text-sm ${theme.subText} uppercase tracking-widest transition-all duration-300 pointer-events-none 
                  peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#D4AF37]
                  peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:text-xs`}>
                  Full Name
                </label>
              </div>
            )}

            {/* Email Field */}
            <div className="relative group">
              <input 
                type="text" 
                required
                onChange={e => setCredentials({...credentials, email: e.target.value})}
                placeholder=" "
                className={`peer w-full py-3 bg-transparent border-b ${theme.inputBorder} outline-none focus:border-[#D4AF37] transition-all duration-300 text-lg`}
              />
              <label className={`absolute left-0 top-3 text-sm ${theme.subText} uppercase tracking-widest transition-all duration-300 pointer-events-none 
                peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#D4AF37]
                peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:text-xs`}>
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder=" "
                onChange={e => setCredentials({...credentials, password: e.target.value})}
                className={`peer w-full py-3 bg-transparent focus-within:bg-transparent border-b ${theme.inputBorder} outline-none focus:border-[#D4AF37] transition-all duration-300 text-lg pr-10`}
              />
              <label className={`absolute left-0 top-3 text-sm ${theme.subText} uppercase tracking-widest transition-all duration-300 pointer-events-none 
                peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#D4AF37]
                peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:text-xs`}>
                Password
              </label>
              
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-0 top-3 hover:text-[#D4AF37] ${theme.subText} transition-colors`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex justify-between items-center text-xs tracking-wide">
              <label className="flex items-center cursor-pointer gap-2 group">
                 <div
                  onClick={() => {setLoginCreds({...loginCredentials, rememberMe: !loginCredentials.rememberMe}), console.log(loginCredentials.rememberMe)}}
                  className={`w-4 h-4 bg-[#D4AF37] transition-opacity ${
                    loginCredentials.rememberMe ? 'opacity-100' : 'opacity-0'
                  }`}
                ></div>

                 <span className={`${theme.subText} group-hover:text-[#D4AF37] transition-colors`}>Remember me</span>
              </label>
              <a href="#" className={`${theme.subText} hover:text-[#D4AF37] border-b border-transparent hover:border-[#D4AF37] transition-all pb-0.5`}>
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button className="w-full cursor-pointer relative overflow-hidden group py-4 bg-transparent border border-[#D4AF37] mt-8">
               <span className="absolute inset-0 w-full h-full bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
               <span className={`relative z-10 uppercase tracking-[0.2em] text-sm font-semibold group-hover:text-black transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                 {isLogin ? "Enter Boutique" : "Create Account"}
               </span>
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-12 text-center">
            <p className={`${theme.subText} text-sm font-light`}>
              {isLogin ? "Not a member yet?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-3 uppercase tracking-widest text-xs font-bold border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors"
              >
                {isLogin ? "Request Access" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Social Proof / Security Badge (Subtle) */}
          <div className="mt-16 flex justify-center items-center gap-2 opacity-50">
             <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
             <span className="text-[10px] uppercase tracking-[0.3em]">Secure Encryption</span>
             <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
          </div>
        </div>
      </div>

      {/* Tailwind Custom Animations Style Block */}
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

export default LuxuryAuth;