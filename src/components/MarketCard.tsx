import React from 'react';
import Link from 'next/link';
import { StockData } from './StockCard';

const MarketCard: React.FC<{ market: StockData }> = ({ market }) => {
  const isPositive = !market.change.startsWith('-');
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <Link href={market.id ? `/stock/${market.id}` : '#'} className="block h-full">
      <div className="bg-white p-4 rounded-lg shadow-md h-auto min-w-[180px] hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
        <div className="mb-3">
          <h3 className="text-[1.3rem] font-bold text-gray-800 mb-1">{market.name}</h3>
        </div>

        <div>
          <p className="text-[2rem] font-bold text-gray-900 mb-1">
            {market.value}
          </p>
          <div className="flex items-center justify-between">
            <p className={`text-base ${changeColor} font-medium`}>
              {isPositive ? '▲' : '▼'} {market.change.replace(/[-+]/, '')}
            </p>
            <span className={`text-sm font-medium ${changeColor} bg-${isPositive ? 'green' : 'red'}-50 px-2 py-1 rounded-full`}>
              {market.changePercent}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MarketCard; 