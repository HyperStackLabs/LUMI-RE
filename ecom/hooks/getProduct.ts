import { useState, useEffect } from "react";
import { Product } from "@/types/types"; // Adjust path to your types
import betterFetch from "@/utils/betterFetch";

export default function useProductType(type: string) {
    // 1. Initialize with empty array [] so .map doesn't crash on load
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function getProducts(){
        try {
            setLoading(true);
            const response = await betterFetch(`http://localhost:4000/products/${type}`, {
              method: 'POST',
              body: JSON.stringify({type})
            })
            const res = await response.json()
            setProducts(res)
        } catch (error) {
            console.log("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
      }

      if (type) {
          getProducts();
      }
    }, [type]) // 2. Critical: Add 'type' here so it re-runs if you change categories

    return { products, loading, setProducts }
}