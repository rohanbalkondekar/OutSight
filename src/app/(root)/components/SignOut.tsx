import { Button } from "../../../../..../../components/ui/button";
import readUserSession from "../../../../lib/actions";
import createSupabaseServerClient from "../../../../lib/supabase/server";
import { redirect } from "next/navigation";


export default function SignOut(){
    

    const logout = async () =>{
        "use server";

        const {data} = await readUserSession();
        const supabase = await createSupabaseServerClient();
        await supabase.auth.signOut();
        
        if(!data.session){
            return redirect("/auth-server-action")
        }
    }
    return(
        <form action={logout}>
            <Button className="button">
                SignOut
            </Button>
        </form>
    )
}