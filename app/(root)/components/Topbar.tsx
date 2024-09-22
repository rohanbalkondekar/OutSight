import UserProfile from '@/components/auth/user-profile';
import { ChevronDownIcon, ChevronUpIcon, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface TopbarLink {
  href: string;
  label: string;
}

interface TopbarProps {
  links: TopbarLink[];
}

const Topbar: React.FC<TopbarProps> = ({ links }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className='w-full bg-gray-800 flex items-center justify-between py-4 px-10'>
      {/* Hamburger Icon & Menu */}
      <div className='flex items-center'>
        {!isDropdownOpen && (
          <button
            onClick={toggleDropdown}
            className='text-white text-lg flex items-center hover:text-blue-400 transition-colors'
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        )}
        {isDropdownOpen && (
          <ul className='ml-4 flex space-x-8'>
            <button
              onClick={toggleDropdown}
              className='text-white text-lg flex items-center hover:text-blue-400 transition-colors'
            >
              <ChevronUpIcon className='h-5 w-5 mr-2' />
            </button>
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
        )}
      </div>

      {/* UserProfile */}
      <div className='ml-auto'>
        <UserProfile />
      </div>
    </nav>
  );
};

export default Topbar;
