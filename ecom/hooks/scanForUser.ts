import { useEffect, useState } from "react"
import betterFetch from "@/utils/betterFetch"
import { IUser } from "@/types/types"

export default function useUserScan(){
    const [currentUser, setUser] = useState<IUser | null>(null)
    useEffect(()  => {
    async function scanForUser(){
        try {
            const response = await betterFetch('http://localhost:4000/verify-token', {
                method: 'GET'
            })
                const res = await response.json()
                setUser(res)
                console.log(res)
            } catch (e) {
                console.log("No user found or API offline");
            }
            return {currentUser, setUser}
        }
        scanForUser()
    }, [])
    return {currentUser, setUser}
}