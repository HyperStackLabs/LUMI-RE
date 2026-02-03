'use client'
import { useState, useEffect, use } from 'react';
import { 
  ShoppingBag, 
  Sun, 
  Moon, 
  Star, 
  ArrowLeft, 
  ThumbsUp,
  Truck, 
  Shield, 
  ChevronDown, 
  Minus, 
  Plus, 
  Share2 
} from 'lucide-react';
import { Product, Comment } from '@/types/types';
import Navbar from '@/components/Navbar';
import { IUser } from '@/app/page';

const ProductPage = ({params}: {params: Promise<{id: string}>}) => {
  const resolvedParams = use(params);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [currentUser, setUser] = useState<IUser | null>(null)
  const [newComment, setComment] = useState<Comment>({
    title: '',
    rating: 0,
    content: '',
    date: new Date().toISOString(),
  })
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>([])
  
  // Accordion States
  const [openSection, setOpenSection] = useState<string | null>("details");
  const id = resolvedParams.id
  const product_type = localStorage.getItem('product-type')
  const product = products.find(p => p.id.toString() === id)
  function getRandomIndex(array: any) {
    return Math.floor(Math.random() * array.length);
  }
  const randomIndex = getRandomIndex(products)
  const starRating = product?.comments.reduce((acc, item) => acc + (item.rating / product.comments.length), 0)

  useEffect(() => {
      async function scanForUser(){
        try {
          const response = await fetch('http://localhost:4000/verify-token', {
              headers: {'Content-Type': "application/json"},
              credentials: 'include'
          })
          if(response.ok) {
              const res = await response.json()
              setUser(res)
              setComment({...newComment, author: res.author, profilePicture: res.profilePicture})
              console.log(res)
          }
        } catch (e) {
            console.log("No user found or API offline");
        }
      }
      scanForUser()
    }, [])
  useEffect(() => {
    async function getProducts(type: string){
      const response = await fetch(`http://localhost:4000/products/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({type})
      })
      const res = await response.json()
      console.log(product)
      setProducts(res)
    }
    product_type && getProducts(product_type)
  }, [])
  async function addToCart(id: string){
    try {
      if(!product) return
      const response = await fetch(`http://localhost:4000/cart/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({product, quantity})
      })
      if(response.ok) {
        console.log('Added to cart successfully')
      }
    } catch(error) {
      console.log('Error adding to cart:', error)
    }
  }
  async function postComment(id: string, user: IUser){
    try{
      const response = await fetch(`http://localhost:4000/product-details/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...newComment, user})
      })
      console.log(newComment)
      if(response.ok){
        setComment({
          title: '',
          rating: 0,
          content: '',
          date: new Date().toISOString(),
        })
      }
    }catch(error){
      console.log(error)
    }
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Theme Config
  const theme = {
    bg: isDarkMode ? "bg-[#0A0A0A]" : "bg-[#F9F9F9]",
    text: isDarkMode ? "text-white" : "text-[#1a1a1a]",
    subText: isDarkMode ? "text-gray-400" : "text-gray-600",
    accent: "text-[#D4AF37]",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    navBg: isDarkMode ? "bg-[#0A0A0A]/90" : "bg-[#F9F9F9]/90",
    inputBg: isDarkMode ? "bg-[#111]" : "bg-gray-100",
  };

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.text}`}>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans selection:bg-[#D4AF37] selection:text-white ${theme.bg} ${theme.text}`}>
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* --- Left Column: Image Gallery --- */}
            <div className="w-full lg:w-3/5">
               {/* Main Image */}
               <div className="relative w-full overflow-hidden mb-4 bg-gray-100 dark:bg-[#111]">
                 <img 
                   src={product.images[activeImage]} 
                   alt={product.name} 
                   className="w-full h-full object-cover animate-fade-in transition-transform duration-700 hover:scale-110 cursor-zoom-in"
                 />
               </div>

               {/* Thumbnails */}
               <div className="grid grid-cols-4 gap-4">
                 {product.images.map((img, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => setActiveImage(idx)}
                     className={`aspect-square cursor-pointer overflow-hidden border transition-all duration-300 ${activeImage === idx ? 'border-[#D4AF37] opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                   >
                     <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                   </div>
                 ))}
               </div>
            </div>

            {/* --- Right Column: Product Details (Sticky) --- */}
            <div className="w-full lg:w-2/5 relative">
              <div className="sticky top-32">
                
                {/* Breadcrumb / Collection */}
                <div className="flex items-center justify-between mb-4">
                   <span className={`text-xs uppercase tracking-[0.2em] ${theme.subText}`}>{product.collection}</span>
                   <button className={`${theme.subText} hover:text-[#D4AF37] transition-colors`}>
                     <Share2 size={16} />
                   </button>
                </div>

                {/* Title & Price */}
                <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4 mb-8">
                   <span className="text-2xl font-light">${product.price.toLocaleString()}</span>
                   
                   {/* Reviews */}
                   <div className="flex items-center gap-1">
                      <div className="flex text-[#D4AF37]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < starRating ? "#D4AF37" : "transparent"} />
                        ))}
                      </div>
                      <span className={`text-xs ${theme.subText} ml-1`}>({product.comments.length} Reviews)</span>
                   </div>
                </div>

                {/* Description */}
                <p className={`text-sm leading-7 mb-10 font-light ${theme.subText}`}>
                  {product.description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-6 mb-10">
                   {/* Quantity */}
                   <div className={`flex items-center border ${theme.border} h-14 w-32 justify-between px-4`}>
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-[#D4AF37]"><Minus size={16} /></button>
                      <span className="text-sm font-medium">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="hover:text-[#D4AF37]"><Plus size={16} /></button>
                   </div>

                   {/* Add to Cart */}
                   <button onClick={() => currentUser?.id && addToCart(currentUser.id)} className="flex-1 h-14 bg-[#D4AF37] text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors duration-300">
                     Add to Bag
                   </button>
                </div>

                <div className={`w-full ${theme.border} mb-8`}></div>

                {/* Accordions */}
                <div className="space-y-4">
                  
                  {/* Specifications */}
                  <div>
                    <button 
                      onClick={() => toggleSection('details')}
                      className="w-full flex items-center justify-between py-2 text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
                    >
                      <span>Specifications</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${openSection === 'details' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'details' ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                       <div className="grid grid-cols-2 gap-y-3 pb-4">
                          {product.specs}
                       </div>
                    </div>
                  </div>
                  
                  <div className={`w-full ${theme.border}`}></div>

                  {/* Shipping */}
                  <div>
                    <button 
                      onClick={() => toggleSection('shipping')}
                      className="w-full flex items-center justify-between py-2 text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
                    >
                      <span className="flex items-center gap-3"><Truck size={14} /> Shipping & Returns</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${openSection === 'shipping' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'shipping' ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                       <p className={`text-xs leading-6 ${theme.subText} pb-4`}>
                         Complimentary insured overnight shipping on all orders over $10,000. 
                         We accept returns within 14 days of delivery, provided the piece is unworn and protective seals are intact.
                       </p>
                    </div>
                  </div>

                  <div className={`w-full ${theme.border}`}></div>

                  {/* Warranty */}
                  <div>
                    <button 
                      onClick={() => toggleSection('warranty')}
                      className="w-full flex items-center justify-between py-2 text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
                    >
                      <span className="flex items-center gap-3"><Shield size={14} /> Warranty</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${openSection === 'warranty' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'warranty' ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                       <p className={`text-xs leading-6 ${theme.subText} pb-4`}>
                         The Sovereign Chrono is backed by our 5-year International Warranty, covering any manufacturing defects or movement irregularities.
                       </p>
                    </div>
                  </div>
                   <div className={`w-full ${theme.border}`}></div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
      <section className={`py-24 border-t ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-12">
              <div>
                <h3 className="text-2xl font-serif mb-2">Client Reflections</h3>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-light">{starRating?.toFixed(1)}</span>
                  <div className="flex flex-col">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star onClick={() => setComment({...newComment, rating: i})} key={i} size={14} fill={i < starRating ? "#D4AF37" : "transparent"} />
                      ))}
                    </div>
                    <span className={`text-xs ${theme.subText} mt-1`}>Based on {product.comments.length} Reviews</span>
                  </div>
                </div>
              </div>

              {/* Static Input Form */}
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-widest font-semibold">Share your experience</p>
                <input 
                  type="text" 
                  onChange={e => setComment({...newComment, title: e.target.value})}
                  placeholder="Title of your review" 
                  className={`w-full bg-transparent border-b ${theme.border} py-3 text-sm outline-none focus:border-[#D4AF37] transition-colors`}
                />
                <textarea 
                  rows={4} 
                  onChange={e => setComment({...newComment, content: e.target.value})}
                  placeholder="Your thoughts..." 
                  className={`w-full bg-transparent border-b ${theme.border} py-3 text-sm outline-none focus:border-[#D4AF37] transition-colors resize-none`}
                />
                <button
                  onClick={() => currentUser && postComment(product.id, currentUser)}
                  className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-colors w-full"
                  disabled={!currentUser}
                >
                  Submit Review
                </button>
                <div className="space-y-2 pt-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button" 
                    onClick={() => setComment({...newComment, rating: star})}
                    className="focus:outline-none transition-transform active:scale-95 group"
                  >
                    <Star
                      size={18}
                      className="transition-colors duration-200"
                      // If the star index is less than or equal to current review score, color it Gold
                      color={star <= newComment.rating ? "#D4AF37" : "#4B5563"} 
                      fill={star <= newComment.rating ? "#D4AF37" : "transparent"}
                    />
                  </button>
                ))}
                <span className="text-xs text-[#D4AF37] ml-3 font-serif">
                  {newComment.rating > 0 ? `${newComment.rating} / 5` : ''}
                </span>
              </div>
            </div>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-12">
              {product.comments.map(comment => {
                return <>
                  <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    {comment.author ? <img src={comment.profilePicture} className='object-cover rounded-full h-10 w-10'/> : <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-[#D4AF37] font-serif">
                      {comment.author && comment?.author[0]}
                    </div>}
                    <div>
                      <h4 className="text-sm font-semibold">{comment.author}</h4>
                    </div>
                  </div>
                  <span className={`text-xs ${theme.subText}`}>2 days ago</span>
                </div>
                
                <div className="flex text-[#D4AF37] gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i <= Math.ceil(comment.rating) ? "#D4AF37" : 'transparent'} />)}
                </div>
                
                <h5 className="text-lg font-serif">{comment.title}</h5>
                <p className={`text-sm leading-7 ${theme.subText} font-light`}>
                  {comment.content}
                </p>
              </div>

              <div className={`w-full h-px ${theme.border}`}></div>
                </>
              })}
              <button className={`text-xs uppercase tracking-widest ${theme.subText} hover:text-[#D4AF37] transition-colors border-b border-transparent hover:border-[#D4AF37] pb-1 w-fit`}>
                Load More Reviews
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* --- Related Products --- */}
      <section className={`py-24 border-t ${theme.border}`}>
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-serif mb-12 text-center">You May Also Admire</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1, 2, 3].map((item) => (
                  <div key={item} className="group cursor-pointer">
                     <div className=" bg-gray-100 dark:bg-[#111] overflow-hidden mb-4 relative">
                        <img 
                          src={`https://images.unsplash.com/photo-1547996160-71df45efd2d7?q=80&w=2670&auto=format&fit=crop`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt="Related"
                        />
                         {/* Quick Add Button Slide Up */}
                         <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                            <button className="w-full py-3 bg-[#D4AF37] text-black text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-colors">
                                View Piece
                            </button>
                         </div>
                     </div>
                     <h3 className="text-lg font-serif">{products[randomIndex].name}</h3>
                     <p className={`text-sm ${theme.subText}`}>{products[randomIndex].price}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
      {/* Styles */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProductPage;