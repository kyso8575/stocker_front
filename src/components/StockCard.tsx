import React from 'react';
import Link from 'next/link';

export interface StockData {
  name: string;
  ticker?: string; // Ticker는 선택 사항일 수 있음 (예: KOSPI)
  value: string; // 숫자를 문자열로 처리하여 포맷팅 유연성 확보 (예: 3,245.20)
  change: string; // 예: +38.45, -8.25
  changePercent: string; // 예: +1.2%, -0.8%
  currency?: string; // 통화 기호 (예: ₩)
  id?: string; // 주식 상세 페이지 ID
}

const StockCard: React.FC<{ stock: StockData }> = ({ stock }) => {
  const isPositive = !stock.change.startsWith('-');
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <Link href={stock.id ? `/stock/${stock.id}` : '#'} className="block">
      <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[180px] hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold text-gray-700">{stock.name}</h3>
          {stock.changePercent && (
            <span className={`text-sm font-medium ${changeColor}`}>
              {stock.changePercent}
            </span>
          )}
        </div>
        {stock.ticker && (
          <p className="text-xs text-gray-500 mb-1 ">{stock.ticker}</p>
        )}
        <p className="text-[1.6rem] font-bold text-gray-900 mt-3">
          {stock.currency}{stock.value}
        </p>
        <p className={`text-sm ${changeColor}`}>
          {isPositive ? '▲' : '▼'} {stock.change.replace(/[-+]/, '')} Today
        </p>
      </div>
    </Link>
  );
};

export default StockCard; 