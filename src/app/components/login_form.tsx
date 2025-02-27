"use client"
import { useRouter } from 'next/navigation'


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
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


const formSchema = z.object({
    email: z.string().min(2, {
      
    }),
    password: z.string().min(8, {
        
    })
  })


export  default function Loginform() {
    // Initialize router
    const router = useRouter()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: ""
        },
      })
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);

      async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
          console.log("User logged in:", userCredential.user);
          router.push("/");
        } catch (error: any) {
          setError(error.message);
          console.error("Login error:", error);
        } finally {
          setLoading(false);
        }
      }
    return(
        
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormDescription>
                        
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
                        <Input type="password" placeholder="Please enter your password" {...field} />
                      </FormControl>
                      <FormDescription>
                        
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                    
                  )}
                />
                <div className="space-x-8">
                <Button type="submit" className="bg-gray-500 w-20 h-8 hover:bg-green-500">Login</Button>
                <Link href="/signup" className="text-blue-500 text-sm">don't have an account?</Link>
                </div>
                
                
              </form>
            </Form>
    )
}