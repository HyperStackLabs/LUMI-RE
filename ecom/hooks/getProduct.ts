import { Product } from "@/types/types";
import betterFetch from "@/utils/betterFetch";
import { useState, useEffect } from "react";

export default function useProductType(type: string){
    const [products, setProducts] = useState<Product[]>()
    useEffect(() => {
      async function getProducts(){
        const response = await betterFetch(`http://localhost:4000/products/${type}`, {
          method: 'POST',
          body: JSON.stringify({type})
        })
        const res = await response.json()
        setProducts(res)
      }
      getProducts()
    }, [])
    return {products, setProducts}
}