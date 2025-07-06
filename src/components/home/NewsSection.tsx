'use client';

import React, { useState, useEffect } from 'react';
import { fetchMarketNews, NewsArticle } from '@/lib/api';

const NewsSection: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 뉴스 데이터 로드
  useEffect(() => {
    const loadNewsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allNews = await fetchMarketNews(6);
        
        if (allNews.length > 0) {
          const sortedNews = allNews
            .filter(item => item.originalDatetime)
            .sort((a, b) => {
              const dateA = typeof a.originalDatetime === 'number' 
                ? a.originalDatetime 
                : new Date(a.originalDatetime as string).getTime();
              const dateB = typeof b.originalDatetime === 'number' 
                ? b.originalDatetime 
                : new Date(b.originalDatetime as string).getTime();
              return dateB - dateA;
            })
            .slice(0, 3);
          
          const finalNews = sortedNews.map(({ originalDatetime, ...item }) => item);
          setNewsData(finalNews);
        } else {
          // API에서 데이터를 가져오지 못한 경우 샘플 데이터 사용
          console.log('Using fallback sample news data');
          const sampleNews: NewsArticle[] = [
            {
              title: "S&P 500 Reaches New All-Time High as Tech Stocks Rally",
              date: new Date().toLocaleDateString(),
              description: "The S&P 500 index surged to a new record high today, driven by strong performance from technology stocks. Major tech companies led the rally with impressive gains.",
              imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
              link: "#"
            },
            {
              title: "Federal Reserve Signals Potential Rate Cut in Coming Months",
              date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
              description: "Federal Reserve officials have indicated that interest rates may be reduced in the near future, responding to recent economic data showing cooling inflation.",
              imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
              link: "#"
            },
            {
              title: "Tesla Reports Strong Q4 Earnings, Stock Jumps 8%",
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              description: "Tesla exceeded analyst expectations with its fourth-quarter earnings report, showing strong demand for electric vehicles and improved profit margins.",
              imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
              link: "#"
            }
          ];
          setNewsData(sampleNews);
        }
      } catch (err) {
        console.error('Failed to fetch news data:', err);
        setError('뉴스를 불러오는 중 오류가 발생했습니다.');
        // 에러 발생 시에도 샘플 데이터 사용
        const sampleNews: NewsArticle[] = [
          {
            title: "S&P 500 Reaches New All-Time High as Tech Stocks Rally",
            date: new Date().toLocaleDateString(),
            description: "The S&P 500 index surged to a new record high today, driven by strong performance from technology stocks. Major tech companies led the rally with impressive gains.",
            imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
            link: "#"
          },
          {
            title: "Federal Reserve Signals Potential Rate Cut in Coming Months",
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
            description: "Federal Reserve officials have indicated that interest rates may be reduced in the near future, responding to recent economic data showing cooling inflation.",
            imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
            link: "#"
          },
          {
            title: "Tesla Reports Strong Q4 Earnings, Stock Jumps 8%",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            description: "Tesla exceeded analyst expectations with its fourth-quarter earnings report, showing strong demand for electric vehicles and improved profit margins.",
            imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
            link: "#"
          }
        ];
        setNewsData(sampleNews);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewsData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Latest <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Market News</span>
            </h2>
            <p className="text-xl text-gray-300">Stay ahead with real-time market insights</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Latest <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Market News</span>
          </h2>
          <p className="text-xl text-gray-300">Stay ahead with real-time market insights</p>
        </div>

        {error && (
          <div className="text-center py-12 mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 font-medium mb-4">{error}</p>
              <p className="text-gray-300 text-sm">샘플 뉴스가 표시됩니다.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((article, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="mb-4">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200/1f2937/ffffff?text=Market+News';
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{article.title}</h3>
              <p className="text-gray-300 mb-4 line-clamp-3">{article.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{article.date}</span>
                <a 
                  href={article.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection; 