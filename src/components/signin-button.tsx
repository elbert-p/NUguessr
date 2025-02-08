import { Button } from "@/components/ui/button"
import "@fontsource/open-sans"
import '@fontsource/titillium-web'
import { useUser } from "../../hooks/use-user"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
 
export function SignInButton() {
    const { user } = useUser()
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
    const supabase = createClient()
    const router = useRouter()
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
    const handleButtonClick = () => {
      if (user?.email) {
        router.push("/profile")
      } 
      else {
        signInWithGoogle()
      }
    }

    const profileImage = () => {
        if (user?.email) {
            return (
            <img
                src={user?.user_metadata.avatar_url}
                alt="Profile image"
                className="w-8 h-8 mr-2 rounded-full"
            />
            )
        }
        else {
            return (
            <Icons.google className="mr-2 size-6" />
            )
        }
    }

    return (
        <Button 
        className="text-white items-center bg-red-600 hover:bg-red-700 py-7 px-6 rounded-full text-2xl shadow-lg transition-all  hover:scale-105"
        type="button"
        onClick={handleButtonClick}
        disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Icons.loaderCircle className="mr-2 size-4 animate-spin" />
          ) : (
          profileImage()
          )}{" "}
          {user?.email ? "Profile" : "Sign up or Log in"}
          </Button>
      )
}