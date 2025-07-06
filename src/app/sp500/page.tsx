'use client';

import React from 'react';
import SP500Table from '@/components/stock/SP500Table';

export default function SP500Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              S&P 500
            </span>
          </h1>
          <p className="text-gray-300">
            The S&P 500 is a stock market index that tracks 500 large-cap companies listed on stock exchanges in the United States.
          </p>
        </div>
        
        <SP500Table />
      </div>
    </div>
  );
} 