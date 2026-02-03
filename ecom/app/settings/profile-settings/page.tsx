'use client'
import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  User, 
  ShoppingBag, 
  Shield, 
  ChevronRight
} from 'lucide-react';
import { IUser } from '@/app/page';
import Link from 'next/link';

const ProfileSettings = () => {
  const [currentUser, setUser] = useState<IUser | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [edited, setEdited] = useState({
    profilePicture: '',
    userName: '',
    bio: '',
    id: currentUser?.id
  })
  
  // Theme Config
  const theme = {
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]",
    text: isDarkMode ? "text-white" : "text-[#1a1a1a]",
    subText: isDarkMode ? "text-gray-400" : "text-gray-500",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    inputBorder: isDarkMode ? "border-gray-800" : "border-gray-300",
    cardBg: isDarkMode ? "bg-[#111]" : "bg-white",
    sidebarBg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F5F5F5]",
  };

  // Static Menu Items
  const menuItems = [
    { id: 'profile', label: 'Public Profile', icon: User, active: true, link: '/settings/profile-settings' },
    { id: 'orders', label: 'Order History', icon: ShoppingBag, active: false, link: '/settings/order-history'},
    { id: 'security', label: 'Login & Security', icon: Shield, active: false, link: '/settings/password-settings' },
  ];

  useEffect(() => {
      async function scanForUser(){
        try {
          const response = await fetch('http://localhost:4000/verify-token', {
              headers: { 'Content-Type': "application/json" },
              credentials: 'include'
          })
          if(response.ok) {
              const res: IUser = await response.json()
              setUser(res)
              console.log(res)
          }
        } catch (e) {
            console.log("No user found or API offline");
        }
      }
      scanForUser()
    }, [])

    async function editUserDetails(id: string){
      await fetch(`http://localhost:4000/change-profile/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(edited)
      })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreviewImage(base64String);
          setEdited({ ...edited, profilePicture: base64String });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemoveImage = () => {
      setPreviewImage(null);
      setEdited({ ...edited, profilePicture: '' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 font-sans selection:bg-[#D4AF37] selection:text-white ${theme.bg} ${theme.text}`}>
      <header className={`fixed top-0 w-full z-50 backdrop-blur-md border-b ${theme.border} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              href="/"
              className={`flex items-center gap-2 text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors ${theme.subText}`}
            >
              <ArrowLeft size={16} /> <span className="hidden md:inline">Back to Boutique</span>
            </Link>
            
            {/* Logo */}
            <div className="text-xl font-serif tracking-widest font-bold">
              LUMIÈRE<span className="text-[#D4AF37]">.</span> <span className="text-xs font-sans font-light opacity-50 ml-2">SETTINGS</span>
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
              <Link
                href={item.link}
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
              </Link>
            ))}
          </nav>
        </aside>

        {/* --- Content Area (Profile Tab) --- */}
        <section className="flex-1 max-w-2xl animate-fade-up">
          
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-4">Edit Profile</h1>
            <p className={`text-sm font-light ${theme.subText}`}>
              Manage your public appearance and personal details.
            </p>
          </div>

          {/* --- Avatar Visual Only --- */}
          <div className="flex items-center gap-8 mb-16">
            <div className="relative group">
              {/* Gold Ring Container */}
              <div className="w-32 h-32 rounded-full border-[#D4AF37] p-1 relative overflow-hidden flex items-center justify-center">
                {previewImage || currentUser?.profilePicture ? <img 
                  src={previewImage || currentUser?.profilePicture}
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                :
                <User className='size-13'/>
              }
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-full"
                >
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              
              {/* Decorative dot */}
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-[#D4AF37] rounded-full border-2 border-black z-10"></div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-serif">Profile Picture</h3>
              <p className={`text-xs ${theme.subText} max-w-[200px] leading-relaxed`}>
                Upload a high-resolution image. 
                <br />Max size 10MB.
              </p>
              <div className="flex gap-4 mt-1">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors border-b border-[#D4AF37] pb-0.5 w-fit"
                >
                  Upload New
                </button>
                <button 
                  onClick={handleRemoveImage}
                  className={`text-xs uppercase tracking-widest hover:text-red-400 transition-colors border-b border-transparent hover:border-red-400 pb-0.5 w-fit ${theme.subText}`}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* --- Form Fields (Static) --- */}
          <div className="space-y-12">
            
            {/* Username Input */}
            <div className="relative group">
              <input 
                type="text"
                defaultValue={currentUser?.fullName}
                onChange={e => setEdited({...edited, userName: e.target.value})}
                className={`peer w-full py-3 bg-transparent border-b ${theme.inputBorder} outline-none focus:border-[#D4AF37] transition-all duration-300 text-lg font-light tracking-wide`}
              />
              <label className={`absolute left-0 top-3 text-xs uppercase tracking-[0.2em] ${theme.subText} transition-all duration-300 pointer-events-none 
                peer-focus:-translate-y-6 peer-focus:text-[#D4AF37]
                peer-not-placeholder-shown:-translate-y-6`}>
                Username
              </label>
              <p className="absolute right-0 top-4 text-[10px] text-gray-600 tracking-widest">lumiere.com/richard_croft</p>
            </div>

             {/* Bio Input */}
             <div className="relative group">
              <textarea 
                defaultValue={currentUser?.bio}
                onChange={e => setEdited({...edited, bio: e.target.value})}
                placeholder=" "
                rows={3}
                className={`peer w-full py-3 bg-transparent border-b ${theme.inputBorder} outline-none focus:border-[#D4AF37] transition-all duration-300 text-lg font-light tracking-wide resize-none`}
              />
              <label className={`absolute left-0 top-3 text-xs uppercase tracking-[0.2em] ${theme.subText} transition-all duration-300 pointer-events-none 
                peer-focus:-translate-y-6 peer-focus:text-[#D4AF37]
                peer-not-placeholder-shown:-translate-y-6`}>
                Bio / About
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 flex items-center justify-end gap-6">
                <button className={`text-xs uppercase tracking-widest ${theme.subText} hover:text-white transition-colors`}>
                    Cancel
                </button>
                
                <button 
                  onClick={() => currentUser?.id && editUserDetails(currentUser.id)} 
                  className="group cursor-pointer relative px-8 py-3 overflow-hidden border border-[#D4AF37] bg-transparent"
                >
                    <span className="absolute inset-0 w-full h-full bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                    <span className={`relative z-10 uppercase tracking-[0.25em] text-xs font-semibold flex items-center gap-2 transition-colors duration-300 group-hover:text-black ${theme.text}`}>
                        Save Changes
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

export default ProfileSettings;