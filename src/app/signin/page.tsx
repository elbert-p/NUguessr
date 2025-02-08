"use client"
 
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import '@fontsource/titillium-web'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"

/* 
export default function SignInPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const supabase = createClient()
 
  const searchParams = useSearchParams()
 
  const next = searchParams.get("next")
 
  async function signInWithGoogle() {
    setIsGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`,
        },
      })
 
      if (error) {
        throw error
      }
    } catch (error) {
      toast({
        title: "Please try again.",
        description: "There was an error logging in with Google.",
        variant: "destructive",
      })
      setIsGoogleLoading(false)
    }
  }
 
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className=" text-5xl font-[1000] text-black" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            Sign up with Google:
          </p>
    <Button 
    className="text-white items-center bg-gray-400 hover:bg-red-700 py-7 px-9 rounded-full text-2xl shadow-lg transition-all hover:scale-105"
      type="button"
      variant="outline"
      onClick={signInWithGoogle}
      disabled={isGoogleLoading}
    >
      {isGoogleLoading ? (
        <Icons.loaderCircle className="mr-2 size-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 size-6" />
      )}{" "}
      Sign up

    </Button>
    </div>
  )
} */