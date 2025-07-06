'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SP500Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  marketCap: number;
  industry: string;
  previousPrice: number;
  logo?: string;
  currency: string;
  exchange: string;
  weburl?: string;
  high: number;
  low: number;
}

const SP500Table: React.FC = () => {
  const [stocks, setStocks] = useState<SP500Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof SP500Stock>('symbol');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // S&P 500 데이터 가져오기
  useEffect(() => {
    const fetchSP500Data = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8080/api/sp500/table');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // API 응답 구조: { success: true, message: "...", data: { data: [...] } }
        let stocksArray = [];
        if (data && data.data && data.data.data && Array.isArray(data.data.data)) {
          stocksArray = data.data.data;
        } else if (data && data.data && Array.isArray(data.data)) {
          stocksArray = data.data;
        } else {
          throw new Error('Invalid data format received from API');
        }
        
        if (stocksArray.length > 0) {
          // API 응답을 SP500Stock 형식으로 변환
          const formattedStocks: SP500Stock[] = stocksArray.map((item: any) => ({
            symbol: item.symbol || '',
            name: item.name || '',
            price: item.price || 0,
            change: item.change || 0,
            percentChange: item.percentChange || 0,
            marketCap: item.marketCap || 0,
            industry: item.industry || '',
            previousPrice: item.previousPrice || 0,
            logo: item.logo || '',
            currency: item.currency || 'USD',
            exchange: item.exchange || '',
            weburl: item.weburl || '',
            high: item.high || 0,
            low: item.low || 0
          }));
          
          setStocks(formattedStocks);
        } else {
          throw new Error('No stock data found in API response');
        }
      } catch (err) {
        console.error('Error fetching S&P 500 data:', err);
        setError('S&P 500 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSP500Data();
  }, []);

  const handleSort = (field: keyof SP500Stock) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const filteredStocks = sortedStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20">
      <div className="p-6 border-b border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">S&P 500 Index</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by symbol or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
          <div className="text-sm text-gray-300">
            Showing {filteredStocks.length} of {stocks.length} stocks
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleSort('symbol')}
              >
                Symbol
                {sortField === 'symbol' && (
                  <span className="ml-1 text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleSort('name')}
              >
                Company Name
                {sortField === 'name' && (
                  <span className="ml-1 text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleSort('industry')}
              >
                Industry
                {sortField === 'industry' && (
                  <span className="ml-1 text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleSort('price')}
              >
                Price
                {sortField === 'price' && (
                  <span className="ml-1 text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleSort('high')}
              >
                High
                {sortField === 'high' && (
                  <span className="ml-1 text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleSort('low')}
              >
                Low
                {sortField === 'low' && (
                  <span className="ml-1 text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleSort('change')}
              >
                Change
                {sortField === 'change' && (
                  <span className="ml-1 text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleSort('percentChange')}
              >
                % Change
                {sortField === 'percentChange' && (
                  <span className="ml-1 text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {filteredStocks.map((stock) => {
              const isPositive = stock.change >= 0;
              const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
              
              return (
                <tr key={stock.symbol} className="hover:bg-white/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {stock.logo && (
                        <img 
                          src={stock.logo} 
                          alt={`${stock.name} logo`} 
                          className="h-6 w-6 mr-2 rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <Link 
                        href={`/stock/${stock.symbol}`}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        {stock.symbol}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {stock.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {stock.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                    ${stock.high.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                    ${stock.low.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${changeColor}`}>
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${changeColor}`}>
                    {isPositive ? '+' : ''}{stock.percentChange.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No stocks found matching your search criteria.
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-400">
          {error}
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              // 데이터 다시 로드
              const fetchSP500Data = async () => {
                try {
                  setLoading(true);
                  setError(null);
                  
                  const response = await fetch('http://localhost:8080/api/sp500/table');

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  const data = await response.json();
                  
                  // API 응답 구조: { success: true, message: "...", data: { data: [...] } }
                  let stocksArray = [];
                  if (data && data.data && data.data.data && Array.isArray(data.data.data)) {
                    stocksArray = data.data.data;
                  } else if (data && data.data && Array.isArray(data.data)) {
                    stocksArray = data.data;
                  } else {
                    throw new Error('Invalid data format received from API');
                  }
                  
                  if (stocksArray.length > 0) {
                    // API 응답을 SP500Stock 형식으로 변환
                    const formattedStocks: SP500Stock[] = stocksArray.map((item: any) => ({
                      symbol: item.symbol || '',
                      name: item.name || '',
                      price: item.price || 0,
                      change: item.change || 0,
                      percentChange: item.percentChange || 0,
                      marketCap: item.marketCap || 0,
                      industry: item.industry || '',
                      previousPrice: item.previousPrice || 0,
                      logo: item.logo || '',
                      currency: item.currency || 'USD',
                      exchange: item.exchange || '',
                      weburl: item.weburl || '',
                      high: item.high || 0,
                      low: item.low || 0
                    }));
                    
                    setStocks(formattedStocks);
                  } else {
                    throw new Error('No stock data found in API response');
                  }
                } catch (err) {
                  console.error('Error fetching S&P 500 data:', err);
                  setError('S&P 500 데이터를 불러오는데 실패했습니다.');
                } finally {
                  setLoading(false);
                }
              };
              fetchSP500Data();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors ml-4"
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
};

export default SP500Table; 