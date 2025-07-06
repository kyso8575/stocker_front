import React from 'react';

interface PortfolioSummaryProps {
  totalValue: number;
  cashBalance: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalValue,
  cashBalance,
  totalGainLoss,
  totalGainLossPercent
}) => {
  const isPositive = totalGainLoss >= 0;
  const investedAmount = totalValue - cashBalance;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Portfolio Value */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">총 자산</p>
            <p className="text-3xl font-bold text-gray-900">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Invested Amount */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">투자 금액</p>
            <p className="text-3xl font-bold text-gray-900">
              ${investedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cash Balance */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">현금 잔액</p>
            <p className="text-3xl font-bold text-gray-900">
              ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Gain/Loss */}
      <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${isPositive ? 'border-green-500' : 'border-red-500'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">총 손익</p>
            <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}${totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ({isPositive ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)
            </p>
          </div>
          <div className={`p-3 ${isPositive ? 'bg-green-100' : 'bg-red-100'} rounded-full`}>
            {isPositive ? (
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary; 