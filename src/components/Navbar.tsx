import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">Stocker</Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Market</Link>
          <Link href="/stock/list" className="text-gray-600 hover:text-blue-600">Stocks</Link>
          <Link href="/news" className="text-gray-600 hover:text-blue-600">News</Link>
          <Link href="/analysis" className="text-gray-600 hover:text-blue-600">Analysis</Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search stocks..."
              className="border rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
