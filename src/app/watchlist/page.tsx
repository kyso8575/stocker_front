'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWatchlist, removeFromWatchlist, WatchlistItem } from '@/lib/api';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const items = await getWatchlist();
      setWatchlist(items);
    } catch (error) {
      setError('관심목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      await removeFromWatchlist(symbol);
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
    } catch (error) {
      // 에러 처리
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">관심목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchWatchlist} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">관심목록</h1>
            <Link 
              href="/sp500" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              주식 검색
            </Link>
          </div>

          {watchlist.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">관심목록이 비어있습니다</h3>
              <p className="text-gray-500 mb-6">관심 있는 주식을 추가해보세요!</p>
              <Link 
                href="/sp500" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                주식 찾아보기
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {watchlist.map((item) => {
                const isPositive = item.change >= 0;
                const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

                return (
                  <div key={item.symbol} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {item.logo && (
                          <img
                            src={item.logo}
                            alt={item.symbol}
                            className="w-12 h-12 rounded-lg bg-white border"
                          />
                        )}
                        <div>
                          <Link 
                            href={`/stock/${item.symbol}`}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {item.symbol} <span className="text-gray-500 text-sm">{item.name}</span>
                          </Link>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-gray-900 font-medium">
                              ${item.price?.toFixed(2)} {item.currency}
                            </span>
                            <span className={`text-sm font-medium ${changeColor}`}>
                              {isPositive ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link 
                          href={`/stock/${item.symbol}`}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          상세보기
                        </Link>
                        <button
                          onClick={() => handleRemoveFromWatchlist(item.symbol)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          제거
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 