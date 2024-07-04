import readUserSession from '../../../..//lib/actions';
import { redirect } from 'next/navigation';
import MigrationAgent from '../components/MigrationAgent';

export default async function MigratePage() {
    const {data} = await readUserSession();

    if(!data.session){
        return redirect("/auth-server-action")
    }
    return(
        <main>
            <div className='pt-32'>
                <MigrationAgent />
            </div>
        </main>
    )
}