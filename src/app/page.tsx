// for the homepage, we need side bar component, avatar component, icons, carousel cards for friends and buttons for making a call
"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import {auth} from "@/lib/firebase"
export default function Home() {
 const router = useRouter();
 const [loading,setloading] = useState(true);
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth,(user)=> {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
      setloading(false);
    });
    return () => unsubscribe() // cleanup function to prevent memory leaks
 }, [router]);

if (loading) {
  return <div> loading ...</div>
  
} 
return (
  <div> hello world</div>
)

}
