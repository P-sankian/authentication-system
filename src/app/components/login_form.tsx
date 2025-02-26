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
import { NextRouter } from "next/router"

const formSchema = z.object({
    username: z.string().min(2, {
      
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
          username: "",
          password: ""
        },
      })
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // password and username check will be implemented later, for now i will focus on routing and UI design
        router.push("/")

        
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
                        <Input placeholder="Please enter your username" {...field} />
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
                <Button type="submit" className="bg-gray-500 w-20 h-8 hover:bg-green-500">register</Button>
                <Link href="/signup" className="text-blue-500 text-sm">don't have an account?</Link>
                </div>
                
                
              </form>
            </Form>
    )
}