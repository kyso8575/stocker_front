'use client';

import React, { useState, useEffect } from 'react';
import TopMoversCard, { TopMoversData } from './TopMoversCard';
import { fetchTopMovers } from '@/lib/api';

const TopMoversSection: React.FC = () => {
  const [marketData, setMarketData] = useState<TopMoversData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTopMovers();
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Top <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Movers</span>
            </h2>
            <p className="text-xl text-gray-300">S&P 500 stocks with the highest price movements</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Top <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Movers</span>
            </h2>
            <p className="text-xl text-gray-300">S&P 500 stocks with the highest price movements</p>
          </div>
          <div className="text-center py-12">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 font-medium mb-4">{error}</p>
              <button 
                onClick={() => {
                  // Implement the logic to reload the data
                }}
                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-r from-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Top <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Movers</span>
          </h2>
          <p className="text-xl text-gray-300">S&P 500 stocks with the highest price movements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketData.map((stock) => (
            <TopMoversCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopMoversSection; 