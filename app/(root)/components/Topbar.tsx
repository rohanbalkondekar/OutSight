import Link from "next/link";
import readUserSession from "@/lib/actions";
import UserProfile from "@/components/auth/user-profile";

// Initialize Supabase client

async function Topbar() {
    const{data} = await readUserSession();


    return (
        <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-dark-2 px-6 py-10">
            <Link href='/' className='flex items-center gap-4'>
            </Link>

            <UserProfile />
        </nav>
    )
}

export default Topbar;
