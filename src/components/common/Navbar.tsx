'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { checkLoginStatus, logout } from '@/lib/api';

interface Stock {
  symbol: string;
  name: string;
  logo?: string;
}

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 인증 상태 확인 (컴포넌트 마운트 시에만)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkLoginStatus();
        const isAuth = !!userData;
        setAuthenticated(isAuth);
        setUser(userData);
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        setAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // 스크롤 감지 (클라이언트에서만)
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // 초기 스크롤 상태 설정
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // S&P 500 주식 목록 가져오기
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

  // 검색어에 따른 필터링
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.symbol.localeCompare(b.symbol))
      .slice(0, 10);
      setFilteredStocks(filtered);
      setShowDropdown(true);
    } else {
      setFilteredStocks([]);
      setShowDropdown(false);
    }
  }, [searchTerm, stocks]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const symbol = searchTerm.trim().toUpperCase();
      router.push(`/stock/${symbol}`);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  const handleStockSelect = (stock: Stock) => {
    router.push(`/stock/${stock.symbol}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setAuthenticated(false);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 에러가 발생해도 로컬 상태는 업데이트
      setAuthenticated(false);
      setUser(null);
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 서버 사이드 렌더링 시 기본 스타일 사용
  const headerClassName = isClient 
    ? `sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-800/85 backdrop-blur-md shadow-2xl border-b border-white/15' 
          : 'bg-slate-800/75 backdrop-blur-sm'
      }`
    : 'sticky top-0 z-50 transition-all duration-300 bg-slate-800/75 backdrop-blur-sm';

  return (
    <header className={headerClassName}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Stocker
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/sp500" 
              className="relative text-gray-200 hover:text-white font-medium transition-colors duration-200 group"
            >
              S&P 500
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {authenticated && (
              <>
                <Link 
                  href="/portfolio" 
                  className="relative text-gray-200 hover:text-white font-medium transition-colors duration-200 group"
                >
                  모의투자
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  href="/watchlist" 
                  className="relative text-gray-200 hover:text-white font-medium transition-colors duration-200 group"
                >
                  관심목록
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div ref={searchRef} className="relative hidden sm:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80 pl-12 pr-4 py-3 bg-white/15 border border-white/25 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-300 transition-all duration-200 hover:bg-white/20 focus:bg-white/15 backdrop-blur-sm"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-300 hover:text-blue-400 hover:bg-blue-400/15 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
              
              {/* Enhanced Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-700/95 border border-white/25 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto backdrop-blur-md">
                  {loading ? (
                    <div className="p-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400 mx-auto mb-2"></div>
                      <span className="text-gray-200 text-sm">Loading stocks...</span>
                    </div>
                  ) : filteredStocks.length > 0 ? (
                    <div className="py-2">
                      {filteredStocks.map((stock) => (
                        <button
                          key={stock.symbol}
                          onClick={() => handleStockSelect(stock)}
                          className="w-full text-left px-4 py-3 hover:bg-white/15 transition-colors duration-150 flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-3">
                            {stock.logo ? (
                              <img 
                                src={stock.logo} 
                                alt={stock.name} 
                                className="w-8 h-8 rounded-lg"
                                onError={(e) => {
                                  // 로고 로드 실패 시 기본 아이콘으로 대체
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center';
                                    fallback.innerHTML = `<span class="text-white font-semibold text-sm">${stock.symbol.charAt(0)}</span>`;
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">{stock.symbol.charAt(0)}</span>
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {stock.symbol}
                              </div>
                              <div className="text-sm text-gray-200 truncate max-w-48">{stock.name}</div>
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  ) : searchTerm.trim() && (
                    <div className="p-6 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                      </svg>
                      <p className="text-gray-300 text-sm">No stocks found</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {authenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-200 hidden sm:block">
                  안녕하세요, {user?.fullName || user?.username || '사용자'}님!
                </span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoggingOut ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      로그아웃 중...
                    </div>
                  ) : (
                    '로그아웃'
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/signup" 
                  className="text-gray-200 hover:text-white font-medium transition-colors duration-200"
                >
                  회원가입
                </Link>
                <Link 
                  href="/login" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                >
                  로그인
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
