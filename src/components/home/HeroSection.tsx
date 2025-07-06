'use client';

import React from 'react';
import Link from 'next/link';
import { checkLoginStatus } from '@/lib/api';

interface HeroSectionProps {
  authenticated: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ authenticated }) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative container mx-auto px-4 py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              🚀 Next Generation Trading Platform
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Smart
            </span>
            <br />
            <span className="text-white">Stock Trading</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
            AI-powered insights, real-time data, and risk-free simulation trading.<br />
            Master the markets with professional-grade tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/signup" 
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="relative z-10">Start Trading Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              href={authenticated ? "/portfolio" : "/login"} 
              className="px-8 py-4 border-2 border-blue-400 text-blue-400 font-semibold rounded-2xl hover:bg-blue-400 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Try Demo Account
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">$100K</div>
              <div className="text-gray-300">Demo Balance</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300">S&P 500 Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300">Real-time Data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 