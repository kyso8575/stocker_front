import React, { useState } from 'react';
import { Transaction } from '@/app/portfolio/page';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => filterType === 'ALL' || transaction.type === filterType)
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'amount') {
        comparison = a.total - b.total;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalBuyAmount = transactions
    .filter(t => t.type === 'BUY')
    .reduce((sum, t) => sum + t.total, 0);

  const totalSellAmount = transactions
    .filter(t => t.type === 'SELL')
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with Summary */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">거래 내역</h3>
            <p className="text-sm text-gray-600 mt-1">총 {transactions.length}건의 거래</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">총 매수</p>
              <p className="text-lg font-semibold text-green-600">
                ${formatCurrency(totalBuyAmount)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">총 매도</p>
              <p className="text-lg font-semibold text-red-600">
                ${formatCurrency(totalSellAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Filter by Type */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">필터:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'ALL' | 'BUY' | 'SELL')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">전체</option>
              <option value="BUY">매수</option>
              <option value="SELL">매도</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">정렬:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as 'date' | 'amount');
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date-desc">최신순</option>
              <option value="date-asc">오래된순</option>
              <option value="amount-desc">금액 높은순</option>
              <option value="amount-asc">금액 낮은순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                종목
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래 유형
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                수량
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래 가격
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                총 금액
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래 날짜
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => {
              const isBuy = transaction.type === 'BUY';
              const typeColor = isBuy ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';

              return (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {transaction.logo && (
                        <img 
                          src={transaction.logo} 
                          alt={`${transaction.name} logo`}
                          className="h-10 w-10 rounded-full mr-3"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.symbol}</div>
                        <div className="text-sm text-gray-500">{transaction.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColor}`}>
                      {isBuy ? '매수' : '매도'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {transaction.quantity.toLocaleString()}주
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    ${formatCurrency(transaction.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    ${formatCurrency(transaction.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterType === 'ALL' ? '거래 내역이 없습니다' : `${filterType === 'BUY' ? '매수' : '매도'} 거래 내역이 없습니다`}
          </h3>
          <p className="text-gray-600">첫 번째 거래를 시작해보세요!</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 