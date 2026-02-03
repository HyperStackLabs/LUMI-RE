'use client'
import { useState } from "react"
const Footer = () => {
const [isDarkMode, setIsDarkMode] = useState(true)
  return <>
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
  </>
}

export default Footer