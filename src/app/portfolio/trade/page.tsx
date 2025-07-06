'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Stock {
  symbol: string;
  name: string;
  logo?: string;
}

interface StockSearchResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  logo?: string;
}

interface AccountSummary {
  totalBalance: number;
  totalInvested: number;
  totalMarketValue: number;
  holdings: Array<{
    symbol: string;
    quantity: number;
    logo?: string;
  }>;
}

export default function TradePage() {
  const searchParams = useSearchParams();
  const [selectedSymbol, setSelectedSymbol] = useState(searchParams.get('symbol') || '');
  const [action, setAction] = useState<'buy' | 'sell'>(searchParams.get('action') as 'buy' | 'sell' || 'buy');
  const [quantity, setQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountSummary, setAccountSummary] = useState<AccountSummary | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 계좌 정보 로드
  useEffect(() => {
    const loadAccountSummary = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/virtual-account/summary', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAccountSummary(data.data);
          }
        }
      } catch (error) {
        console.error('계좌 정보 로드 실패:', error);
      } finally {
        setLoadingAccount(false);
      }
    };

    loadAccountSummary();
  }, []);

  // S&P 500 주식 목록 가져오기 (Navbar와 동일)
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/sp500');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.stocks) {
            setStocks(data.stocks);
          }
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // 검색어에 따른 필터링 (Navbar와 동일)
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.symbol.localeCompare(b.symbol))
      .slice(0, 10);
      
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery, stocks]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // searchRef 내부에 있는지 확인
      if (searchRef.current && searchRef.current.contains(target)) {
        return; // 검색 영역 내부 클릭이면 드롭다운 유지
      }
      
      // 검색 영역 외부 클릭이면 드롭다운 닫기
      setShowDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load initial stock if symbol is provided
  useEffect(() => {
    if (selectedSymbol) {
      const mockStock: StockSearchResult = {
        symbol: selectedSymbol,
        name: selectedSymbol,
        price: 201.93,
        change: 2.30,
        changePercent: 1.15,
        logo: `https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${selectedSymbol}.png`
      };
      setSelectedStock(mockStock);
    }
  }, [selectedSymbol]);

  const handleStockSelect = async (stock: Stock) => {
    // 매도인 경우 보유 주식인지 확인
    if (action === 'sell') {
      const holding = accountSummary?.holdings.find(h => h.symbol === stock.symbol);
      if (!holding || holding.quantity === 0) {
        alert('보유하지 않은 주식입니다.');
        return;
      }
    }

    // 실제 주식 가격 정보 가져오기 (실제로는 API에서 가져와야 함)
    // 현재는 mock 데이터를 사용하지만, 실제로는 주식 가격 API를 호출해야 함
    const mockStock: StockSearchResult = {
      symbol: stock.symbol,
      name: stock.name,
      price: 201.93, // 실제로는 API에서 가져와야 함
      change: 2.30,
      changePercent: 1.15,
      logo: stock.logo || `https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock.symbol}.png`
    };
    
    setSelectedStock(mockStock);
    setSelectedSymbol(stock.symbol);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    
    // 수량 입력 필드 초기화
    setQuantity('');
  };

  const calculateTotal = () => {
    if (!selectedStock || !quantity) return 0;
    return parseFloat(quantity) * selectedStock.price;
  };

  const getHoldingQuantity = () => {
    if (!accountSummary || !selectedSymbol) return 0;
    const holding = accountSummary.holdings.find(h => h.symbol === selectedSymbol);
    return holding ? holding.quantity : 0;
  };

  const canAfford = () => {
    if (action === 'sell') return parseInt(quantity) <= getHoldingQuantity();
    return calculateTotal() <= (accountSummary?.totalBalance || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || !quantity || !canAfford()) return;

    setIsSubmitting(true);
    
    try {
      const endpoint = action === 'buy' 
        ? 'http://localhost:8080/api/virtual-account/buy'
        : 'http://localhost:8080/api/virtual-account/sell';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          quantity: parseFloat(quantity)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(`${action === 'buy' ? '매수' : '매도'} 주문이 성공적으로 처리되었습니다!`);
          // 계좌 정보 새로고침
          window.location.href = '/portfolio';
        } else {
          alert(data.message || `${action === 'buy' ? '매수' : '매도'} 주문 처리에 실패했습니다.`);
        }
      } else {
        alert(`${action === 'buy' ? '매수' : '매도'} 주문 처리에 실패했습니다.`);
      }
    } catch (error) {
      console.error('거래 처리 오류:', error);
      alert('거래 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCash = accountSummary?.totalBalance || 0;
  const holdingQuantity = getHoldingQuantity();
  const maxQuantity = action === 'buy' 
    ? Math.floor(availableCash / (selectedStock?.price || 1))
    : holdingQuantity;

  // 보유 주식 목록 (매도 시에만 표시)
  const holdings = accountSummary?.holdings.filter(h => h.quantity > 0) || [];

  if (loadingAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/portfolio" className="text-blue-600 hover:text-blue-800 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">주식 거래</h1>
          </div>
          <p className="text-gray-600">모의 투자로 주식을 매수하거나 매도하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">거래 주문</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Action Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">거래 유형</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setAction('buy')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                        action === 'buy'
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                      }`}
                    >
                      💰 매수
                    </button>
                    <button
                      type="button"
                      onClick={() => setAction('sell')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                        action === 'sell'
                          ? 'bg-red-100 text-red-700 border-2 border-red-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                      }`}
                    >
                      💸 매도
                    </button>
                  </div>
                </div>

                {/* Stock Search */}
                <div ref={searchRef} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {action === 'sell' ? '보유 종목 선택' : '종목 검색'}
                  </label>
                  
                  {action === 'sell' && holdings.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-3">보유 중인 종목:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {holdings.map((holding) => (
                          <button
                            key={holding.symbol}
                            type="button"
                            onClick={() => handleStockSelect({
                              symbol: holding.symbol,
                              name: holding.symbol,
                              logo: stocks.find(s => s.symbol === holding.symbol)?.logo
                            })}
                            className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                              selectedSymbol === holding.symbol
                                ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center">
                              {stocks.find(s => s.symbol === holding.symbol)?.logo ? (
                                <img 
                                  src={stocks.find(s => s.symbol === holding.symbol)?.logo} 
                                  alt={holding.symbol} 
                                  className="w-6 h-6 rounded mr-2"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      const fallback = document.createElement('div');
                                      fallback.className = 'w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center mr-2';
                                      fallback.innerHTML = `<span class="text-blue-700 font-semibold text-xs">${holding.symbol.charAt(0)}</span>`;
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center mr-2">
                                  <span className="text-blue-700 font-semibold text-xs">{holding.symbol.charAt(0)}</span>
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{holding.symbol}</div>
                                <div className="text-sm text-gray-600">{holding.quantity}주 보유</div>
                              </div>
                              {selectedSymbol === holding.symbol && (
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="text"
                      placeholder={action === 'sell' ? '보유 종목 검색...' : '종목명 또는 심볼을 입력하세요 (예: AAPL, Apple)'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Search Results */}
                  {showDropdown && (
                    <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto z-50 relative">
                      {loading ? (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <span className="text-gray-500 text-sm">Loading stocks...</span>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.map((stock) => (
                            <button
                              key={stock.symbol}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleStockSelect(stock);
                              }}
                              className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between border-b border-gray-100 last:border-b-0 cursor-pointer ${
                                selectedSymbol === stock.symbol
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center">
                                {stock.logo ? (
                                  <img 
                                    src={stock.logo} 
                                    alt={stock.name} 
                                    className="w-8 h-8 rounded mr-3"
                                    onError={(e) => {
                                      // 로고 로드 실패 시 기본 아이콘으로 대체
                                      e.currentTarget.style.display = 'none';
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        const fallback = document.createElement('div');
                                        fallback.className = 'w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3';
                                        fallback.innerHTML = `<span class="text-blue-700 font-semibold text-sm">${stock.symbol.charAt(0)}</span>`;
                                        parent.appendChild(fallback);
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-blue-700 font-semibold text-sm">{stock.symbol.charAt(0)}</span>
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">{stock.symbol}</p>
                                  <p className="text-sm text-gray-600">{stock.name}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {action === 'sell' && (
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">
                                      {accountSummary?.holdings.find(h => h.symbol === stock.symbol)?.quantity || 0}주 보유
                                    </p>
                                  </div>
                                )}
                                {selectedSymbol === stock.symbol && (
                                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery.trim() && (
                        <div className="p-4 text-center">
                          <p className="text-gray-500 text-sm">No stocks found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Stock Display */}
                {selectedStock && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {selectedStock.logo && (
                          <img 
                            src={selectedStock.logo} 
                            alt={selectedStock.name} 
                            className="w-12 h-12 rounded-lg mr-4 shadow-sm"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{selectedStock.symbol}</h3>
                          <p className="text-sm text-gray-600">{selectedStock.name}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                              선택된 종목
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${selectedStock.price.toFixed(2)}</p>
                        <p className={`text-sm ${selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">수량</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      disabled={!selectedStock}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(maxQuantity.toString())}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedStock}
                    >
                      최대
                    </button>
                  </div>
                  {selectedStock && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        최대 {action === 'buy' ? '구매' : '판매'} 가능: {maxQuantity.toLocaleString()}주
                        {action === 'buy' && (
                          <span className="ml-2">(현재 보유 현금: ${availableCash.toLocaleString()})</span>
                        )}
                      </p>
                      {quantity && (
                        <p className="text-sm text-gray-600">
                          예상 총액: ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                {selectedStock && quantity && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      주문 요약
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">종목:</span>
                        <span className="font-medium text-gray-900">{selectedStock.symbol}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">거래 유형:</span>
                        <span className={`font-medium ${action === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          {action === 'buy' ? '매수' : '매도'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">수량:</span>
                        <span className="font-medium text-gray-900">{parseInt(quantity).toLocaleString()}주</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">예상 가격:</span>
                        <span className="font-medium text-gray-900">${selectedStock.price.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">총 금액:</span>
                          <span className="text-xl font-bold text-gray-900">
                            ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedStock || !quantity || !canAfford() || isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg ${
                    !selectedStock || !quantity || !canAfford() || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : action === 'buy'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      처리 중...
                    </div>
                  ) : (
                    `${action === 'buy' ? '매수' : '매도'} 주문하기`
                  )}
                </button>

                {/* Validation Messages */}
                {quantity && !canAfford() && (
                  <div className="text-red-600 text-sm text-center">
                    {action === 'buy' 
                      ? '잔액이 부족합니다. 수량을 줄이거나 입금하세요.'
                      : '보유 수량이 부족합니다.'
                    }
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Account Info Sidebar */}
          <div className="space-y-6">
            {/* Account Balance */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">계좌 정보</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">사용 가능 현금</span>
                  <span className="font-semibold text-green-600">
                    ${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                {selectedSymbol && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{selectedSymbol} 보유량</span>
                    <span className="font-semibold">
                      {holdingQuantity.toLocaleString()}주
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">총 투자 금액</span>
                  <span className="font-semibold">
                    ${(accountSummary?.totalInvested || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">총 자산</span>
                  <span className="font-semibold">
                    ${(accountSummary?.totalMarketValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액세스</h3>
              <div className="space-y-3">
                <Link 
                  href="/portfolio"
                  className="block w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-center"
                >
                  포트폴리오 보기
                </Link>
                <Link 
                  href="/watchlist"
                  className="block w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
                >
                  관심 종목
                </Link>
                <Link 
                  href="/sp500"
                  className="block w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
                >
                  S&P 500
                </Link>
              </div>
            </div>

            {/* Trading Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 거래 팁</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• 분산 투자를 통해 리스크를 관리하세요</li>
                <li>• 장기적인 관점에서 투자 계획을 세우세요</li>
                <li>• 시장 동향을 파악하고 정보를 수집하세요</li>
                <li>• 감정에 휘둘리지 말고 계획을 지키세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 