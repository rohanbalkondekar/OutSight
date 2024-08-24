import Leftbar from '@/app/(root)/components/Leftbar';
import { getCurrentUser } from '@/lib/actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const TerminalPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const leftbarLinks = [
    { href: "/dashboard", label:'Dashboard'},
    { href: `/projects/${id}/migrate`, label: 'Code Migration' },
    { href: `/projects/${id}/terminal`, label: 'Terminal' },
  ];

  const { user} = await getCurrentUser();
  if(!user){
      return redirect("/signin")
  }

  return (
    <div className="flex">
      <Leftbar links={leftbarLinks}/>
      <div className="flex-grow p-4">
        <h1>Terminal Page for Project ID: {id}</h1>
      </div>
    </div>
  );
};

export default TerminalPage;
