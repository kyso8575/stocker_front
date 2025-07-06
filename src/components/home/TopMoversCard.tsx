import React from 'react';
import Link from 'next/link';

export interface TopMoversData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  logo?: string;
}

interface TopMoversCardProps {
  stock: TopMoversData;
}

const TopMoversCard: React.FC<TopMoversCardProps> = ({ stock }) => {
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const bgColor = isPositive ? 'bg-green-500' : 'bg-red-500';
  
  const icon = isPositive ? (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );

  return (
    <Link 
      href={`/stock/${stock.symbol}`}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {stock.logo ? (
            <img 
              src={stock.logo} 
              alt={stock.name} 
              className="w-8 h-8 rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center';
                  fallback.innerHTML = `<span class="text-white font-semibold text-sm">${stock.symbol.charAt(0)}</span>`;
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{stock.symbol.charAt(0)}</span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            {stock.symbol}
          </h3>
        </div>
        <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-2">${stock.price?.toFixed(2) || '0.00'}</div>
      <div className={`${changeColor} font-medium`}>
        {isPositive ? '+' : ''}{stock.change?.toFixed(2) || '0.00'} ({isPositive ? '+' : ''}{stock.percentChange?.toFixed(2) || '0.00'}%)
      </div>
      <div className="text-sm text-gray-300 mt-2 truncate">{stock.name}</div>
    </Link>
  );
};

export default TopMoversCard; 