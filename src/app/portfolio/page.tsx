'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import HoldingsList from '@/components/portfolio/HoldingsList';
import PortfolioChart from '@/components/portfolio/PortfolioChart';
import TransactionHistory from '@/components/portfolio/TransactionHistory';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  logo?: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  date: string;
  logo?: string;
}

export interface PortfolioData {
  totalValue: number;
  cashBalance: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: Holding[];
  dailyPerformance: Array<{
    date: string;
    value: number;
  }>;
}

interface AccountStatus {
  hasAccount: boolean;
  createdAt: string | null;
  balance: number | null;
  updatedAt: string | null;
}

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'history'>('overview');

  // 가상 계좌 상태 확인
  useEffect(() => {
    const checkAccountStatus = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const statusResponse = await fetch('http://localhost:8080/api/virtual-account/status', {
          credentials: 'include',
        });
        
        if (statusResponse.status === 401) {
          throw new Error('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
        }
        
        if (!statusResponse.ok) {
          throw new Error('계좌 상태를 확인할 수 없습니다.');
        }
        
        const statusData = await statusResponse.json();
        
        if (!statusData.success) {
          throw new Error(statusData.message || '계좌 상태를 확인할 수 없습니다.');
        }

        setAccountStatus(statusData.data);
        
        // 계좌가 있으면 포트폴리오 데이터 로드
        if (statusData.data.hasAccount) {
          await loadPortfolioData();
        }
        
      } catch (err) {
        console.error('계좌 상태 확인 실패:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    checkAccountStatus();
  }, []);

  // 포트폴리오 데이터 로드
  const loadPortfolioData = async () => {
    try {
      // 포트폴리오 요약 정보 가져오기
      const summaryResponse = await fetch('http://localhost:8080/api/virtual-account/summary', {
        credentials: 'include', // 쿠키 포함
      });
      
      if (summaryResponse.status === 401) {
        throw new Error('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
      }
      
      if (!summaryResponse.ok) {
        throw new Error('포트폴리오 요약 정보를 불러올 수 없습니다.');
      }
      
      const summaryData = await summaryResponse.json();
      
      if (!summaryData.success) {
        throw new Error(summaryData.message || '포트폴리오 데이터를 불러올 수 없습니다.');
      }

      const summary = summaryData.data;
      
      // 보유 종목 데이터 변환
      const holdings: Holding[] = summary.holdings.map((holding: any) => ({
        id: holding.symbol,
        symbol: holding.symbol,
        name: holding.symbol, // API에서 회사명이 제공되지 않으므로 심볼 사용
        quantity: holding.quantity,
        averagePrice: holding.avgPrice,
        currentPrice: holding.currentPrice,
        totalValue: holding.marketValue,
        gainLoss: holding.unrealizedProfit,
        gainLossPercent: holding.profitRate,
        logo: holding.logo
      }));

      // 거래 내역 데이터 변환
      const transactions: Transaction[] = summary.recentTrades.map((trade: any) => ({
        id: trade.id.toString(),
        symbol: trade.symbol,
        name: trade.symbol, // API에서 회사명이 제공되지 않으므로 심볼 사용
        type: trade.tradeType as 'BUY' | 'SELL',
        quantity: trade.quantity,
        price: trade.price,
        total: trade.totalAmount,
        date: trade.tradeDate,
        logo: holdings.find(h => h.symbol === trade.symbol)?.logo
      }));

      // 포트폴리오 데이터 구성
      const portfolioData: PortfolioData = {
        totalValue: summary.totalMarketValue,
        cashBalance: summary.totalBalance - summary.totalInvested,
        totalGainLoss: summary.totalProfit,
        totalGainLossPercent: summary.profitRate,
        holdings: holdings,
        dailyPerformance: [
          // 실제 API에서 일별 성과 데이터가 제공되지 않으므로 현재 값으로 생성
          { date: new Date().toISOString().split('T')[0], value: summary.totalMarketValue }
        ]
      };

      setPortfolioData(portfolioData);
      setTransactions(transactions);
      
    } catch (err) {
      console.error('포트폴리오 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  // 계좌 초기화 함수
  const initializeAccount = async () => {
    // 확인 대화상자 표시
    const isConfirmed = window.confirm(
      '정말로 계좌를 초기화하시겠습니까?\n\n⚠️ 주의: 초기화하면 모든 거래 내역과 포트폴리오 데이터가 영구적으로 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.'
    );
    
    if (!isConfirmed) {
      return; // 사용자가 취소한 경우
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/virtual-account/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('가상 계좌가 초기화되었습니다!');
          window.location.reload();
        } else {
          alert(data.message || '계좌 초기화에 실패했습니다.');
        }
      } else {
        alert('계좌 초기화에 실패했습니다.');
      }
    } catch (err) {
      console.error('계좌 초기화 오류:', err);
      alert('계좌 초기화 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">포트폴리오를 불러올 수 없습니다</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            {error.includes('로그인이 필요합니다') ? (
              <>
                <Link 
                  href="/login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  로그인하기
                </Link>
                <Link 
                  href="/signup"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  회원가입
                </Link>
              </>
            ) : (
              <>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  다시 시도
                </button>
                <button 
                  onClick={initializeAccount} 
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  계좌 초기화
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 계좌가 없는 경우 시작 화면 표시
  if (accountStatus && !accountStatus.hasAccount) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">모의 투자 시작하기</h1>
              <p className="text-xl text-gray-600 mb-8">
                가상의 자금으로 실제 주식 시장을 경험해보세요.<br />
                리스크 없이 투자 전략을 연습하고 포트폴리오를 관리할 수 있습니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">모의 투자 특징</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">초기 자금 $100,000</h3>
                  <p className="text-gray-600 text-sm">충분한 자금으로 다양한 투자 기회를 탐색하세요</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">실시간 시장 데이터</h3>
                  <p className="text-gray-600 text-sm">실제 주식 가격으로 현실적인 투자 경험</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">리스크 없는 연습</h3>
                  <p className="text-gray-600 text-sm">실제 손실 없이 투자 전략을 테스트하세요</p>
                </div>
              </div>
            </div>

            <button 
              onClick={initializeAccount}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🚀 모의 투자 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">포트폴리오를 불러올 수 없습니다</h2>
          <p className="text-gray-600 mb-6">가상 계좌를 초기화해주세요.</p>
          <button 
            onClick={initializeAccount} 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            계좌 초기화
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">모의 투자 포트폴리오</h1>
              <p className="text-gray-600">당신의 투자 성과를 확인하고 관리하세요</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={initializeAccount}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                계좌 초기화
              </button>
              <Link 
                href="/portfolio/trade" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                주식 거래하기
              </Link>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="mb-8">
          <PortfolioSummary 
            totalValue={portfolioData.totalValue}
            cashBalance={portfolioData.cashBalance}
            totalGainLoss={portfolioData.totalGainLoss}
            totalGainLossPercent={portfolioData.totalGainLossPercent}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: '개요', icon: '📊' },
                { key: 'holdings', label: '보유 종목', icon: '📈' },
                { key: 'history', label: '거래 내역', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PortfolioChart dailyPerformance={portfolioData.dailyPerformance} />
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 보유 종목</h3>
                <div className="space-y-3">
                  {portfolioData.holdings.slice(0, 4).map((holding) => (
                    <div key={holding.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {holding.logo && (
                          <img 
                            src={holding.logo} 
                            alt={holding.name} 
                            className="w-8 h-8 rounded mr-3"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{holding.symbol}</p>
                          <p className="text-sm text-gray-600">{holding.quantity}주</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${holding.totalValue.toLocaleString()}</p>
                        <p className={`text-sm ${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss.toFixed(2)} ({holding.gainLossPercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'holdings' && (
            <HoldingsList holdings={portfolioData.holdings} />
          )}

          {activeTab === 'history' && (
            <TransactionHistory transactions={transactions} />
          )}
        </div>
      </div>
    </div>
  );
} 