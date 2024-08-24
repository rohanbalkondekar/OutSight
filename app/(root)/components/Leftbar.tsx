import UserProfile from '@/components/auth/user-profile';
import Link from 'next/link';

interface LeftbarLink {
  href: string;
  label: string;
}

interface LeftbarProps {
  links: LeftbarLink[];
}

const Leftbar: React.FC<LeftbarProps> = ({ links }) => {
  return (
    <nav className='w-64 bg-gray-800 h-100 flex flex-col'>
      <ul className='flex-grow p-4 pt-16 space-y-8'>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <span className="text-white text-lg hover:text-blue-400 transition-colors">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className='p-8'>
        <UserProfile />
      </div>
    </nav>
  );
};

export default Leftbar;
