"use client"
import { useRouter } from 'next/navigation'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {auth, db} from "@/lib/firebase"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";





const formSchema = z.object({
    username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }), 
  
  email: z.string().regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // email checking using regex
    { message: "Invalid email format" }
  ),
    password: z.string().min(8, {
        message: "password must be at least 8 characters"
    })
  })

async function saveUserData(userId: string, username: string) {
    try {
      // Save user data (username) to Firestore
      await setDoc(doc(db, "users", userId), {
        username: username,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }



export  default function Signupform() {
    // Initialize router
    const router = useRouter()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
          
        },
      })
      async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);
    
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          console.log("User created:", userCredential.user);
          await saveUserData(userCredential.user.uid, values.username);
          router.push("/signup/profile-complete"); // go to profile creation tab
        } catch (error: any) {
          setError(error.message);   // obviously, use other components to show
          console.error("Signup error:", error);
        } finally {
          setLoading(false);
        }
      }
    return(
        
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
              <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        this will be the name that will be shown publicly
                        
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                    
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        please enter your email address
                        
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                    
                  )}
                />
                   <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please use a secure password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                    
                    
                  )}
                />
                
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-center">
                <Button type="submit" className="bg-gray-500 w-20 h-8 hover:bg-green-500" disabled={loading}>

            {loading ? "Registering..." : "Register"}
          </Button>
                
                </div>
                
                
              </form>
            </Form>
    )
}