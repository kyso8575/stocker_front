import React from 'react';

interface StockKeyInfoProps {
  marketCapitalization: number;
  weekHigh52?: number;
  weekLow52?: number;
  avgVolume?: number;
  avgVolume10Day?: number;  // 10일 평균 거래량
  peRatio?: number;
  dividendYield?: number;
  beta?: number;
  pb?: number;                  // Price to Book
  volatility90Day?: number;     // 90일 변동성
  priceToSales?: number;        // Price to Sales
  weekPriceReturn52?: number;   // 52주 수익률
  returnOnEquity?: number;      // 자기자본이익률
  currency: string;
}

const StockKeyInfo: React.FC<StockKeyInfoProps> = ({
  marketCapitalization,
  weekHigh52 = 0,
  weekLow52 = 0,
  avgVolume = 0,
  avgVolume10Day = 0,
  peRatio = 0,
  dividendYield = 0,
  beta = 0,
  pb = 0,
  volatility90Day = 0,
  priceToSales = 0,
  weekPriceReturn52 = 0,
  returnOnEquity = 0,
  currency
}) => {
  const formatNumber = (num: number, decimals = 2): string => {
    if (num === 0) return 'N/A';
    return num.toLocaleString('en-US', { maximumFractionDigits: decimals });
  };

  const formatVolume = (vol: number): string => {
    if (vol === 0) return 'N/A';
    if (vol < 1000) return vol.toString();
    if (vol < 1000000) return (vol / 1000).toFixed(1) + 'K';
    if (vol < 1000000000) return (vol / 1000000).toFixed(1) + 'M';
    return (vol / 1000000000).toFixed(1) + 'B';
  };

  const formatPercent = (percent: number): string => {
    if (percent === 0) return 'N/A';
    return percent.toFixed(2) + '%';
  };

  // 시가총액 포맷팅
  const formatMarketCap = (cap: number): string => {
    if (cap === 0) return 'N/A';
    if (cap < 1000) return cap.toFixed(2) + ' M';
    return (cap / 1000).toFixed(2) + ' B';
  };

  return (
    <div className="md:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
      <h2 className="text-xl font-bold text-white mb-5 border-b-2 border-white/20 pb-2">Key Information</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">Market Cap</p>
          <p className="text-lg text-white">{formatMarketCap(marketCapitalization)} {currency}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">52 Week High</p>
          <p className="text-lg text-white">{formatNumber(weekHigh52)} {currency}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">52 Week Low</p>
          <p className="text-lg text-white">{formatNumber(weekLow52)} {currency}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">3M Avg. Volume</p>
          <p className="text-lg text-white">{formatVolume(avgVolume)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">10D Avg. Volume</p>
          <p className="text-lg text-white">{formatVolume(avgVolume10Day)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">P/E Ratio</p>
          <p className="text-lg text-white">{formatNumber(peRatio)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">Price to Book</p>
          <p className="text-lg text-white">{formatNumber(pb)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">Price to Sales</p>
          <p className="text-lg text-white">{formatNumber(priceToSales)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">Dividend Yield</p>
          <p className="text-lg text-white">{formatPercent(dividendYield)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">Beta</p>
          <p className="text-lg text-white">{formatNumber(beta)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">90 Day Volatility</p>
          <p className="text-lg text-white">{formatPercent(volatility90Day)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">52 Week Return</p>
          <p className="text-lg text-white">{formatPercent(weekPriceReturn52)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium mb-1">ROE</p>
          <p className="text-lg text-white">{formatPercent(returnOnEquity)}</p>
        </div>
      </div>
    </div>
  );
};

export default StockKeyInfo; 