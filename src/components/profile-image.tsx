import "@fontsource/open-sans"
import '@fontsource/titillium-web'
import { useUser } from "../../hooks/use-user"
import { Icons } from "@/components/icons"

export const profileImage = () => {
    const { user } = useUser()
    
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