import React from 'react';
import Link from 'next/link';

interface StockDetailHeaderProps {
  name: string;
  ticker: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  currency: string;
  logo?: string;
}

const StockDetailHeader: React.FC<StockDetailHeaderProps> = ({
  name,
  ticker,
  currentPrice,
  change,
  percentChange,
  currency,
  logo
}) => {
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white shadow-sm border-b border-gray-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <div className="flex items-center">
              <Link href="/" className="text-black hover:text-gray-800 mr-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              {logo && (
                <img 
                  src={logo} 
                  alt={`${name} logo`} 
                  className="h-8 w-auto mr-3"
                />
              )}
              <h1 className="text-2xl font-bold text-black">{name}</h1>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold text-gray-800">{currentPrice} {currency}</div>
            <div className={`flex items-center ${changeColor}`}>
              <span className="text-sm font-medium">
                {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)} ({percentChange.toFixed(2)}%)
              </span>
              <span className="ml-2 text-xs text-black">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailHeader; 