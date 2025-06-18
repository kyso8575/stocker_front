'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Next.js 이미지 최적화 컴포넌트 사용
import Link from 'next/link';
import StockCard, { StockData } from '../components/StockCard';
import MarketCard from '../components/MarketCard';
import NewsCard, { NewsArticle } from '../components/NewsCard';

// --- 페이지 컴포넌트 ---

export default function Home() {
  // --- 상태 관리 ---
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  // --- 샘플 데이터 (실제로는 API 호출 등을 통해 가져옴) ---
  const marketOverviewData: StockData[] = [
    { name: 'KOSPI', value: '3,245.20', change: '+38.45', changePercent: '+1.2%', id: 'kospi' },
    { name: 'KOSDAQ', value: '1,028.15', change: '-8.25', changePercent: '-0.8%', id: 'kosdaq' },
    { name: 'KRX', value: '2,156.80', change: '+10.75', changePercent: '+0.5%', id: 'krx' },
  ];

  const topMoversData: StockData[] = [
    { name: 'Samsung Electronics', ticker: '005930.KS', value: '72,500', change: '+2,300', changePercent: '+3.2%', currency: '₩', id: '005930' },
    { name: 'SK Hynix', ticker: '000660.KS', value: '125,000', change: '-2,700', changePercent: '-2.1%', currency: '₩', id: '000660' },
    { name: 'NAVER', ticker: '035420.KS', value: '245,500', change: '+4,500', changePercent: '+1.8%', currency: '₩', id: '035420' },
    { name: 'Kakao', ticker: '035720.KS', value: '58,800', change: '+1,400', changePercent: '+2.5%', currency: '₩', id: '035720' },
  ];

  // 날짜 포맷팅 함수 (YYYY-MM-DD)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 이전 날짜 계산 함수
  const getPreviousDate = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  // 뉴스 데이터 가져오는 함수
  const fetchNewsData = async (daysBack: number = 0, count: number = 3): Promise<NewsArticle[]> => {
    const today = new Date();
    const startDate = formatDate(getPreviousDate(today, daysBack + 1)); // 하루 더 이전 날짜부터
    const endDate = formatDate(getPreviousDate(today, daysBack === 0 ? 0 : Math.max(0, daysBack - 1)));
    
    console.log(`Fetching news from ${startDate} to ${endDate} (days back: ${daysBack})`);
    
    try {
      const response = await fetch(`http://localhost:8080/api/stocks/news/market?from=${startDate}&to=${endDate}&count=${count}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching news: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`News data received for date range ${startDate} to ${endDate}:`, data);
      
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((item: any, index: number) => ({
          title: item.headline || item.title || 'No title',
          date: item.datetime 
            ? (() => {
                // datetime이 숫자(Unix 타임스탬프)인 경우
                if (typeof item.datetime === 'number') {
                  // API에서 초 단위로 제공하는 경우 밀리초로 변환
                  const timestamp = item.datetime.toString().length === 10 
                    ? item.datetime * 1000  // 10자리 숫자는 초 단위 타임스탬프
                    : item.datetime;        // 13자리 숫자는 이미 밀리초 단위
                  return new Date(timestamp).toLocaleDateString();
                } 
                // datetime이 문자열 형태의 날짜인 경우
                else if (typeof item.datetime === 'string') {
                  return item.datetime.includes('T') 
                    ? new Date(item.datetime).toLocaleDateString()  // ISO 형식
                    : new Date(item.datetime).toLocaleDateString();  // 그 외 형식
                }
                return new Date().toLocaleDateString();  // 기본값
              })() 
            : new Date().toLocaleDateString(),
          description: item.summary || item.description || 'No description available',
          imageUrl: item.image || item.imageUrl || '/images/news-placeholder.jpg',
          link: item.url || item.source || '#'
        }));
      }
      return [];
    } catch (error) {
      console.error(`Error fetching news for date range ${startDate} to ${endDate}:`, error);
      return [];
    }
  };

  // 뉴스 데이터 로드
  useEffect(() => {
    const loadNewsData = async () => {
      setIsLoading(true);
      setNewsError(null); // 에러 상태 초기화
      try {
        // 뉴스 데이터 가져오기 - 최소 3개 확보
        const TARGET_NEWS_COUNT = 3;
        let allNewsItems: NewsArticle[] = [];
        let daysBack = 0;
        const MAX_DAYS_BACK = 14; // 최대 14일 전까지 확인
        
        // 목표 뉴스 개수를 채우거나 최대 날짜까지 도달할 때까지 반복
        while (allNewsItems.length < TARGET_NEWS_COUNT && daysBack <= MAX_DAYS_BACK) {
          const news = await fetchNewsData(daysBack);
          console.log(`Fetched ${news.length} news items for days back: ${daysBack}`);
          
          // 가져온 뉴스를 추가
          allNewsItems = [...allNewsItems, ...news];
          
          // 날짜 범위 확장 (2일씩 확장)
          daysBack += 2;
        }
        
        if (allNewsItems.length > 0) {
          console.log(`Total news items collected: ${allNewsItems.length}`);
          // 중복 제거 및 최대 3개만 표시
          const uniqueNews = allNewsItems
            .filter((item, index, self) => 
              index === self.findIndex((t) => t.title === item.title)
            )
            .slice(0, 3);
          
          setNewsData(uniqueNews);
        } else {
          console.log('No news found in the last 14 days');
          setNewsError('최근 14일간 뉴스를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Failed to fetch news data:', err);
        setNewsError('뉴스 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNewsData();
  }, []);

  return (
    <div>
      {/* --- Hero Section - 파란색 배경 --- */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Smart Stock Trading Platform
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Make informed decisions with real-time market data and advanced analytics
              </p>
              <Link href="/signup" className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-md hover:bg-gray-100 transition duration-200 inline-block text-lg">
                Get Started
              </Link>
            </div>
            <div className="md:w-1/2">
              {/* Placeholder for the dashboard image */}
              <div className="bg-gray-700 rounded-lg shadow-xl p-6 h-80 md:h-96 flex items-center justify-center">
                <span className="text-gray-400">Dashboard Image Placeholder</span>
                {/* 실제 이미지 컴포넌트 사용 예시 */}
                {/* <Image src="/images/dashboard.png" alt="Stock Dashboard" width={500} height={300} objectFit="contain" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Market Overview - 회색 배경 --- */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Market Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketOverviewData.map((market) => (
              <MarketCard key={market.name} market={market} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Top Movers - 흰색 배경 --- */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Top Movers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topMoversData.map((stock) => (
              <StockCard key={stock.name} stock={stock} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Latest Market News - 회색 배경 --- */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Latest Market News</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : newsError ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium mb-4">{newsError}</p>
                <button 
                  onClick={() => {
                    setNewsError(null);
                    setIsLoading(true);
                    // 뉴스 데이터 다시 로드
                    const loadNewsData = async () => {
                      try {
                        const TARGET_NEWS_COUNT = 3;
                        let allNewsItems: NewsArticle[] = [];
                        let daysBack = 0;
                        const MAX_DAYS_BACK = 14;
                        
                        while (allNewsItems.length < TARGET_NEWS_COUNT && daysBack <= MAX_DAYS_BACK) {
                          const news = await fetchNewsData(daysBack);
                          allNewsItems = [...allNewsItems, ...news];
                          daysBack += 2;
                        }
                        
                        if (allNewsItems.length > 0) {
                          const uniqueNews = allNewsItems
                            .filter((item, index, self) => 
                              index === self.findIndex((t) => t.title === item.title)
                            )
                            .slice(0, 3);
                          setNewsData(uniqueNews);
                        } else {
                          setNewsError('최근 14일간 뉴스를 찾을 수 없습니다.');
                        }
                      } catch (err) {
                        setNewsError('뉴스 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
                      } finally {
                        setIsLoading(false);
                      }
                    };
                    loadNewsData();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsData.map((article, index) => (
                <NewsCard key={`${article.title}-${index}`} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
