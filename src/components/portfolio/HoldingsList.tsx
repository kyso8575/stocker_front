import React from 'react';
import Link from 'next/link';
import { Holding } from '@/app/portfolio/page';

interface HoldingsListProps {
  holdings: Holding[];
}

const HoldingsList: React.FC<HoldingsListProps> = ({ holdings }) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">보유 종목</h3>
        <p className="text-sm text-gray-600 mt-1">총 {holdings.length}개 종목 보유 중</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                종목
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                보유 수량
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                평균 단가
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                현재 가격
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                총 가치
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                손익
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                수익률
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdings.map((holding) => {
              const isPositive = holding.gainLoss >= 0;
              const gainLossColor = isPositive ? 'text-green-600' : 'text-red-600';
              const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';

              return (
                <tr key={holding.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {holding.logo && (
                        <img 
                          src={holding.logo} 
                          alt={`${holding.name} logo`}
                          className="h-10 w-10 rounded-full mr-3"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <Link 
                          href={`/stock/${holding.symbol}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {holding.symbol}
                        </Link>
                        <div className="text-sm text-gray-500">{holding.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {holding.quantity.toLocaleString()}주
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    ${formatCurrency(holding.averagePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    ${formatCurrency(holding.currentPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    ${formatCurrency(holding.totalValue)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${gainLossColor}`}>
                    {isPositive ? '+' : ''}${formatCurrency(Math.abs(holding.gainLoss))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bgColor} ${gainLossColor}`}>
                      {isPositive ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <div className="flex space-x-2 justify-center">
                      <Link
                        href={`/portfolio/trade?symbol=${holding.symbol}&action=buy`}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        매수
                      </Link>
                      <Link
                        href={`/portfolio/trade?symbol=${holding.symbol}&action=sell`}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        매도
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">보유 종목이 없습니다</h3>
          <p className="text-gray-600 mb-6">첫 번째 주식을 구매하여 투자를 시작해보세요!</p>
          <Link 
            href="/portfolio/trade"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            주식 거래하기
          </Link>
        </div>
      )}
    </div>
  );
};

export default HoldingsList; 