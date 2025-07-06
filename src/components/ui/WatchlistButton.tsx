'use client';

import React, { useState, useEffect } from 'react';
import { addToWatchlist, removeFromWatchlist, checkStockInWatchlist } from '@/lib/api';

interface WatchlistButtonProps {
  symbol: string;
  className?: string;
}

export default function WatchlistButton({ symbol, className = '' }: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // 현재 주식이 watchlist에 있는지 확인
  useEffect(() => {
    const checkWatchlistStatus = async () => {
      try {
        setIsChecking(true);
        const exists = await checkStockInWatchlist(symbol);
        setIsInWatchlist(exists);
      } catch (error) {
        console.error('Watchlist 상태 확인 실패:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkWatchlistStatus();
  }, [symbol]);

  const handleToggleWatchlist = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(symbol);
      } else {
        await addToWatchlist(symbol);
      }
      // 상태를 서버에서 다시 확인
      const exists = await checkStockInWatchlist(symbol);
      setIsInWatchlist(exists);
    } catch (error) {
      console.error('Watchlist 토글 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 bg-gray-50 cursor-not-allowed ${className}`}
      >
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        확인 중...
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleWatchlist}
      disabled={isLoading}
      className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
        isInWatchlist
          ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400'
          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
      } ${className}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {isInWatchlist ? '제거 중...' : '추가 중...'}
        </>
      ) : (
        <>
          {isInWatchlist ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              관심목록에서 제거
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              관심목록에 추가
            </>
          )}
        </>
      )}
    </button>
  );
} 