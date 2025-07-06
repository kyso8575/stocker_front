'use client';

import React from 'react';
import Link from 'next/link';

const CTASection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Start Your Trading Journey?
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Join thousands of traders who are already using our platform to make smarter investment decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            href="/signup" 
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Create Free Account
          </Link>
          <Link 
            href="/portfolio" 
            className="px-10 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Try Demo Trading
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 