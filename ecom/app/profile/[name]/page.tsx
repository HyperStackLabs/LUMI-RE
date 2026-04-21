'use client'
import { useState, useEffect, use } from 'react';
import { 
  User, 
  Package, 
  LogOut, 
  Camera, 
  ShoppingBag,
  TrendingUp 
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar'
import betterFetch from '@/utils/betterFetch';
import { IUser } from '@/types/types';

const ProfilePage = () => {
  const router = useRouter()
  const {name} = useParams()
  const [currentUser, setCurrentUser] = useState<IUser | null>()
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const theme = {
    bg: "bg-[#0A0A0A]",
    cardBg: "bg-[#111]",
    text: "text-white",
    subText: "text-gray-400",
    accent: "text-[#D4AF37]",
    border: "border-gray-800",
    inputBg: "bg-transparent"
  };
  useEffect(() => {
    async function getProfile(username: string | string[]){
        try {
            const response = await fetch(`http://localhost:4000/profile/${username}`, {
                headers: {'Content-Type': 'application/json'}
            })
            if (response.ok) {
                const data = await response.json()
                setCurrentUser(data)
            } else {
                console.log("User not found")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    if (name) {
        getProfile(name)
    }
}, [name])

  const handleLogout = async () => {
    try {
        await betterFetch('http://localhost:4000/auth/logout', { method: 'POST'});
        router.push('/auth');
    } catch(e) { console.error(e) }
  };

  if (isLoading) return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="w-12 h-12 border border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!currentUser) return null;
  const totalInvested = currentUser.OrderHistory.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-[#D4AF37] selection:text-white pt-32 pb-12`}>
      <Navbar />      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
            <div className={`${theme.cardBg} border ${theme.border} p-8 text-center relative overflow-hidden group`}>
                {/* Decorative Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>

                {/* Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="w-full h-full rounded-full border-[1px] border-[#D4AF37] p-1">
                        <img 
                            src={currentUser.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWfAaMBpSBY28pqKilfYlNcx78HPb-hpi_6Q&s"} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>
                <h1 className="text-2xl font-serif mb-2">{currentUser.fullName}</h1>
                <p className={`text-xs uppercase tracking-widest ${theme.subText} mb-6`}>{currentUser.email}</p>
                
                <div className="relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl text-[#D4AF37] font-serif">"</div>
                    <p className={`text-sm font-light italic leading-relaxed ${theme.subText} px-4`}>
                        {currentUser.bio || "Connoisseur of fine timepieces and luxury goods."}
                    </p>
                </div>
                <div className={`grid grid-cols-2 gap-4 mt-8 pt-8 border-t ${theme.border}`}>
                    <div>
                        <p className="text-2xl font-serif">{currentUser.OrderHistory.length}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">Acquisitions</p>
                    </div>
                    <div>
                        <p className="text-2xl font-serif">{currentUser.cart.length}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">In Bag</p>
                    </div>
                </div>
            </div>
            <div className={`${theme.cardBg} border ${theme.border} p-2`}>
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-4 p-4 text-xs uppercase tracking-widest transition-colors ${activeTab === 'overview' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:bg-white/5 text-gray-400'}`}
                >
                    <User size={16} /> Overview
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-4 p-4 text-xs uppercase tracking-widest transition-colors ${activeTab === 'orders' ? 'bg-[#D4AF37] text-black font-bold' : 'hover:bg-white/5 text-gray-400'}`}
                >
                    <Package size={16} /> Order History
                </button>
            </div>
        </div>
        <div className="lg:col-span-8">
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    <div className={`${theme.cardBg} border ${theme.border} p-8 flex flex-col md:flex-row items-center justify-between gap-6`}>
                         <div>
                            <h2 className="text-2xl font-serif mb-2">{`Welcome Back, ${currentUser.fullName.split(' ')[0]}`}.</h2>
                            <p className={`text-sm ${theme.subText}`}>You have {currentUser.cart.length} items waiting in your shopping bag.</p>
                         </div>
                         <button onClick={() => router.push('/')} className="px-8 py-3 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors">
                            Continue Shopping
                         </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Card 1: Latest Purchase */}
                         <div className={`${theme.cardBg} border ${theme.border} p-6`}>
                             <h3 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShoppingBag size={14} /> Latest Purchase
                             </h3>
                             {currentUser.OrderHistory.length > 0 ? (
                                <div>
                                    <p className="text-lg font-serif">{currentUser.OrderHistory[currentUser.OrderHistory.length - 1].ProductName}</p>
                                    <p className={`text-sm ${theme.subText}`}>${currentUser.OrderHistory[currentUser.OrderHistory.length - 1].price.toLocaleString()}</p>
                                </div>
                             ) : (
                                <p className="text-sm text-gray-500 italic">No purchases yet.</p>
                             )}
                         </div>
                         <div className={`${theme.cardBg} border ${theme.border} p-6`}>
                            <h3 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TrendingUp size={14} /> Total Investment
                            </h3>
                            <p className="text-lg font-serif">
                                ${totalInvested.toLocaleString()}
                            </p>
                            <p className={`text-sm ${theme.subText}`}>
                                Lifetime Asset Value
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'orders' && (
                <div className={`${theme.cardBg} border ${theme.border} animate-fade-in`}>
                    <div className="p-8 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-serif">Acquisition History</h2>
                        <span className="text-xs text-gray-500 uppercase tracking-widest">{currentUser.OrderHistory.length} Total</span>
                    </div>
                    
                    {currentUser.OrderHistory.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <p>No acquisitions recorded yet.</p>
                            <button className="mt-4 text-[#D4AF37] border-b border-[#D4AF37] uppercase text-xs tracking-widest pb-1">Browse Collection</button>
                        </div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-12 px-8 py-4 bg-white/5 text-[10px] uppercase tracking-widest text-gray-400">
                                <div className="col-span-8">Product Name</div>
                                <div className="col-span-4 text-right">Price</div>
                            </div>
                            
                            {currentUser.OrderHistory.slice().reverse().map((order, idx) => (
                                <div key={idx} className="grid grid-cols-12 px-8 py-6 border-b border-gray-800 hover:bg-white/5 transition-colors items-center group">
                                    <div className="col-span-8 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] opacity-50 group-hover:opacity-100"></div>
                                        <div>
                                            <p className="font-serif text-lg">{order.ProductName}</p>
                                            <p className="text-xs text-gray-500">Verified Purchase</p>
                                        </div>
                                    </div>
                                    <div className="col-span-4 text-right">
                                        <p className="text-[#D4AF37] font-light">${order.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;