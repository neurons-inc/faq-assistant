import React from 'react';
import Image from 'next/image';


export const GreetingHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-2">
      <h1 className="text-2xl font-bold text-gray-900">
        Hi, I&apos;m your FAQ Assistant
      </h1>
      <div className="relative group cursor-pointer">
        <Image
          src="/faq.png"
          alt="FAQ Assistant"
          width={48}  // 12 * 4 = 48px (since w-12 is 3rem or 48px)
          height={48} // 12 * 4 = 48px (matching the height class)
          className="w-12 h-12 transition-transform transform group-hover:scale-110"
        />
        <span className="absolute -top-1 -right-1 text-1xl animate-bounce group-hover:animate-none">
          💧
        </span>
      </div>
    </div>
  );
};