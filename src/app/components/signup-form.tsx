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
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "password must be at least 8 characters"
    })
  })


export  default function Signupform() {
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
        //password hashing and post request to the database
        router.push("/login")

        
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
                        This will be the displayed public name
                        
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
                <div className="flex justify-center">
                <Button type="submit" className="bg-gray-500 w-20 h-8 hover:bg-green-500">Register</Button>
                
                </div>
                
                
              </form>
            </Form>
    )
}