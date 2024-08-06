// pages/founders.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Founder {
  id: number;
  name: string;
  company: string;
  photoUrl: string;
  companyLogoUrl_1: string;
  companyLogoUrl_2: string;
  linkedinUrl: string;
}

const founders: Founder[] = [
  {
    id: 1,
    name: 'Aman Gokrani',
    company: 'Microsoft AI Scientist',
    photoUrl: '/photos/aman.jpeg',
    companyLogoUrl_1: '/photos/Microsoft.png',
    companyLogoUrl_2: '/photos/Nuance.png',
    linkedinUrl: 'https://www.linkedin.com/in/agokrani/',
  },
  {
    id: 2,
    name: 'Rohan Balkondekar',
    company: 'Tesla Data Analyst',
    photoUrl: '/photos/rohan.jpeg',
    companyLogoUrl_1: '/photos/Airarabia.png',
    companyLogoUrl_2: '/photos/lyzr.svg',
    linkedinUrl: 'https://rohanbalkondekar.com/',
  },
  {
    id: 3,
    name: 'Shashwat Tiwari',
    company: 'Tesla Data Analyst',
    photoUrl: '/photos/shashwat.jpeg',
    companyLogoUrl_1: '/photos/artium.jpg',
    companyLogoUrl_2: '/photos/iauro.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/shashwattiwari02/',
  },
  {
    id: 4,
    name: 'Dwi Anugrah Kuantanu',
    company: 'Tesla Data Analyst',
    photoUrl: '/photos/anugrah.jpg',
    companyLogoUrl_1: '/photos/tesla.png',
    companyLogoUrl_2: '/photos/bosch.png',
    linkedinUrl: 'https://www.kuantanu.com/',
  },
];


const FoundersPage: React.FC = () => {
    return (
      <div className="flex flex-col items-center min-h-screen">
        <div className="flex items-center justify-center w-full h-40">
          <h1 className="text-white text-6xl font-bold">Founders</h1>
        </div>
        <div className="flex flex-wrap justify-around w-full">
          {founders.map((founder) => (
            <div key={founder.id} className="bg-white rounded-xl p-6 text-center m-6 w-80 shadow-lg">
              <Link href={founder.linkedinUrl} legacyBehavior>
                <a target="_blank" rel="noopener noreferrer">
                  <div className="w-36 h-36 mx-auto rounded-full overflow-hidden">
                    <Image src={founder.photoUrl} alt={founder.name} width={150} height={150} className="object-cover" />
                  </div>
                </a>
              </Link>
              <h3 className="mt-4 text-xl font-semibold text-gray-600">{founder.name}</h3>
              <p className="mt-2 text-gray-600">{founder.company}</p>
              <div className="mt-4">
                <Image src={founder.companyLogoUrl_1} alt={`${founder.name}'s company logo`} width={100} height={50} className="object-contain mx-auto" />
              </div>
              <div className="mt-4">
                <Image src={founder.companyLogoUrl_2} alt={`${founder.name}'s company logo`} width={100} height={50} className="object-contain mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default FoundersPage;