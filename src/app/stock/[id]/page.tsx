'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import StockDetailHeader from '../../../components/stock/StockDetailHeader';
import StockKeyInfo from '../../../components/stock/StockKeyInfo';
import CompanyInfo from '../../../components/stock/CompanyInfo';
import StockChart from '../../../components/stock/StockChart';
import StockNews from '../../../components/stock/StockNews';
import { NewsItemProps } from '../../../components/stock/NewsItem';

const StockDetailPage = () => {
  const params = useParams();
  const stockSymbol = params.id as string;

  // States
  const [timeRange, setTimeRange] = useState('1d');
  const [stockData, setStockData] = useState<any>(null);
  const [financialData, setFinancialData] = useState<any>(null);
  const [newsData, setNewsData] = useState<NewsItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultNewsDate, setDefaultNewsDate] = useState('');
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    country: '',
    industry: '',
    ipoDate: '',
    exchange: '',
    weburl: '',
    symbol: '',
    displaySymbol: '',
    currency: '',
    logo: ''
  });

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
  const fetchNewsData = async (symbol: string, daysBack: number = 0): Promise<NewsItemProps[]> => {
    const today = new Date();
    const startDate = formatDate(getPreviousDate(today, daysBack));
    const endDate = daysBack === 0 ? formatDate(today) : formatDate(getPreviousDate(today, Math.max(0, daysBack - 2)));
    
    try {
      const newsResponse = await fetch(`http://localhost:8080/api/news/companies/${symbol}?from=${startDate}&to=${endDate}&count=3`);
      
      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        
        if (newsData && newsData.data && Array.isArray(newsData.data) && newsData.data.length > 0) {
          return newsData.data.map((item: any, index: number) => ({
            id: item.id || String(index),
            title: item.headline || item.title || 'No title',
            date: item.datetime 
              ? (() => {
                  // datetime이 숫자(Unix 타임스탬프)인 경우
                  if (typeof item.datetime === 'number') {
                    // API에서 초 단위로 제공하는 경우 밀리초로 변환
                    const timestamp = item.datetime.toString().length === 10 
                      ? item.datetime * 1000  // 10자리 숫자는 초 단위 타임스탬프
                      : item.datetime;        // 13자리 숫자는 이미 밀리초 단위
                    return new Date(timestamp).toISOString().split('T')[0];
                  } 
                  // datetime이 문자열 형태의 날짜인 경우
                  else if (typeof item.datetime === 'string') {
                    return item.datetime.includes('T') 
                      ? item.datetime.split('T')[0]  // ISO 형식 (YYYY-MM-DDT...)
                      : item.datetime;               // 이미 YYYY-MM-DD 형식
                  }
                  return startDate;  // 기본값으로 시작 날짜 사용
                })() 
              : startDate,
            summary: item.summary || item.description || 'No summary available',
            link: item.url || item.source || '#',
            image: item.image || item.imageUrl || undefined
          }));
        }
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  // Fetch stock data from API using SSE
  useEffect(() => {
    let eventSource: EventSource | null = null;

    // 1. 먼저 현재가를 가져오기
    const fetchCurrentPrice = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/trades/${stockSymbol}/price`);
        if (res.ok) {
          const priceData = await res.json();
          setStockData({
            symbol: priceData.symbol,
            price: priceData.price,
            currency: priceData.currency,
            timestamp: priceData.timestamp
          });
          setError(null);
        } else {
          setError('현재가를 불러오지 못했습니다.');
        }
      } catch (err) {
        setError('현재가를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 2. SSE 연결해서 실시간 업데이트
    const connectToStockStream = () => {
      try {
        eventSource = new EventSource(`http://localhost:8080/api/trades/stream/${stockSymbol}`);
        eventSource.onopen = () => {
        };
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'initial') {
              if (data.message === '데이터를 찾을 수 없습니다') {
                setError('주식 데이터를 찾을 수 없습니다. 티커를 확인해주세요.');
              } else {
                setStockData(data);
                setError(null);
              }
            } else if (data.trade) {
              setStockData((prevData: any) => ({
                ...prevData,
                trade: data.trade,
                timestamp: data.timestamp
              }));
            }
          } catch (parseError) {
          }
        };
        eventSource.onerror = (error) => {
        };
      } catch (err) {
      }
    };

    // 추가로 기본 재무 데이터 가져오기 (SSE와 별도로)
    const fetchFinancialData = async () => {
      try {
        const financialResponse = await fetch(`http://localhost:8080/api/financial-metrics/${stockSymbol}`);
        
        if (financialResponse.ok) {
          const financialData = await financialResponse.json();
          setFinancialData(financialData);
        }
      } catch (financialErr) {
      }
    };

    // 뉴스 데이터 가져오기 (SSE와 별도로)
    const fetchNewsDataAsync = async () => {
      const TARGET_NEWS_COUNT = 3;
      let allNewsItems: NewsItemProps[] = [];
      let daysBack = 0;
      const MAX_DAYS_BACK = 14;
      const STEP_DAYS = 1;
      
      while (allNewsItems.length < TARGET_NEWS_COUNT && daysBack <= MAX_DAYS_BACK) {
        const news = await fetchNewsData(stockSymbol, daysBack);
        
        allNewsItems = [...allNewsItems, ...news].filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id)
        );
        
        daysBack += STEP_DAYS;
      }
      
      if (allNewsItems.length > 0) {
        allNewsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setNewsData(allNewsItems);
      }
    };

    if (stockSymbol) {
      fetchCurrentPrice();
      connectToStockStream();
      fetchFinancialData();
      fetchNewsDataAsync();
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [stockSymbol]);

  useEffect(() => {
    setDefaultNewsDate(formatDate(new Date()));
  }, []);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/company-profiles/${stockSymbol}`);
        if (res.ok) {
          const result = await res.json();
          const data = result.data || {};
          setCompanyInfo({
            name: data.name || '',
            country: data.country || '',
            industry: data.finnhubIndustry || '',
            ipoDate: data.ipo || '',
            exchange: data.exchange || '',
            weburl: data.weburl || '',
            symbol: data.symbol || '',
            displaySymbol: data.displaySymbol || '',
            currency: data.currency || 'USD',
            logo: data.logo || ''
          });
        }
      } catch (e) {
        // 에러 무시
      }
    };
    if (stockSymbol) fetchCompanyInfo();
  }, [stockSymbol]);

  // Format date from array to string (YYYY-MM-DD)
  const formatDateArray = (dateArray: number[] | null | undefined): string => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return 'N/A';
    }
    
    return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading stock data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !stockData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load stock data. Please try again later.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Direct access to response, trying different possible structures
  let stockDataObj = stockData?.data;
  
  if (!stockDataObj) {
    // Try alternate structures if data doesn't exist
    stockDataObj = stockData;
  }
  
  // Try to find stock info in different possible locations
  let stockInfo = stockDataObj?.stock || {};
  if (!stockInfo || Object.keys(stockInfo).length === 0) {
    stockInfo = stockDataObj || {};
  }
  
  // 재무 데이터 추출
  const financialInfo = financialData?.data || {};
  
  // StockKeyInfo에 financial-metrics 데이터 매핑
  const keyInfoProps = {
    marketCapitalization: financialInfo?.marketCapitalization || 0,
    shareOutstanding: 0,
    open: 0,
    previousClose: 0,
    high: 0,
    low: 0,
    currency: stockInfo?.currency || 'USD',
    weekHigh52: financialInfo?.fiftyTwoWeekHigh || 0,
    weekLow52: financialInfo?.fiftyTwoWeekLow || 0,
    volume: 0,
    avgVolume: financialInfo?.threeMonthAverageTradingVolume || 0,
    avgVolume10Day: financialInfo?.tenDayAverageTradingVolume || 0,
    peRatio: financialInfo?.priceToEarningsRatio || 0,
    dividendYield: financialInfo?.dividendYieldIndicatedAnnual || 0,
    beta: financialInfo?.beta || 0,
    eps: 0,
    pb: financialInfo?.priceToBookRatio || 0,
    priceToSales: financialInfo?.priceToSalesRatio || 0,
    volatility90Day: financialInfo?.threeMonthADReturnStd || 0,
    enterpriseValue: 0,
    weekPriceReturn52: financialInfo?.fiftyTwoWeekPriceReturnDaily || 0,
    returnOnEquity: financialInfo?.returnOnEquity || 0,
  };

  // Try different possibilities for the data structure
  let currentPrice = 0;
  if (typeof stockDataObj?.price === 'number') {
    currentPrice = stockDataObj.price;
  } else if (Array.isArray(stockDataObj?.data) && stockDataObj.data.length > 0 && typeof stockDataObj.data[0].price === 'number') {
    currentPrice = stockDataObj.data[0].price;
  } else if (typeof stockInfo?.currentPrice === 'number') {
    currentPrice = stockInfo.currentPrice;
  }
  
  const change = stockDataObj?.change || stockInfo?.change || 0;
  const percentChange = stockDataObj?.percentChange || stockInfo?.percentChange || 0;
  
  // Format for IPO date and update date with null safety
  const ipoDate = formatDateArray(stockInfo?.ipo);


  // Default company name for safety
  const companyName = stockInfo?.name || 'Company';
  const ticker = stockInfo?.ticker || stockSymbol || 'Unknown';
  const currency = stockInfo?.currency || 'USD';

  // 뉴스 데이터가 없을 경우 대체할 Mock 데이터
  const defaultNewsItems: NewsItemProps[] = [
    {
      id: '1',
      title: `No recent news for ${companyName}`,
      date: defaultNewsDate,
      summary: `There are currently no recent news articles about ${companyName} stock in the last 7 days.`,
      link: '#',
      image: undefined
    }
  ];

  // 사용할 뉴스 데이터 (API에서 가져온 데이터 또는 대체 데이터)
  const newsItems = newsData.length > 0 ? newsData : defaultNewsItems;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Stock Detail Header */}
      <StockDetailHeader 
        name={companyInfo.name}
        ticker={companyInfo.symbol || companyInfo.displaySymbol || ticker}
        currentPrice={currentPrice}
        change={change}
        percentChange={percentChange}
        currency={companyInfo.currency || currency}
        logo={companyInfo.logo}
      />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Key Information - 재무 데이터 추가 */}
          <StockKeyInfo {...keyInfoProps} />
          
          {/* Company Information */}
          <CompanyInfo 
            name={companyInfo.name}
            country={companyInfo.country}
            industry={companyInfo.industry}
            ipoDate={companyInfo.ipoDate}
            exchange={companyInfo.exchange}
            weburl={companyInfo.weburl}
          />
        </div>

        {/* Chart Section */}
        <StockChart symbol={stockSymbol} />
        
        {/* News Section - 실제 API 데이터 사용 */}
        <StockNews newsItems={newsItems} />
      </main>
    </div>
  );
};

export default StockDetailPage; 