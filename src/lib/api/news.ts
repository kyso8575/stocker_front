import { apiRequest, formatDate, getPreviousDate } from './client';
import { NewsArticle, NewsItemProps } from './types';

// Market news API
export const fetchMarketNews = async (count: number = 6): Promise<NewsArticle[]> => {
  const today = new Date();
  const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
  const startDate = formatDate(twoWeeksAgo);
  const endDate = formatDate(today);
  
  try {
    const data = await apiRequest<any>(`/news/market?from=${startDate}&to=${endDate}&count=${count}`);
    
    // 다양한 응답 구조 처리
    let newsArray = [];
    
    if (data && data.data && Array.isArray(data.data)) {
      newsArray = data.data;
    } else if (data && data.news && Array.isArray(data.news)) {
      newsArray = data.news;
    } else if (data && Array.isArray(data)) {
      newsArray = data;
    } else if (data && data.data && data.data.data && Array.isArray(data.data.data)) {
      newsArray = data.data.data;
    } else {
      console.log('No valid news array found in response. Available keys:', Object.keys(data || {}));
      return [];
    }
    
    if (newsArray.length > 0) {
      return newsArray.map((item: any) => ({
        title: item.headline || item.title || item.name || 'No title',
        date: item.datetime || item.date || item.publishedAt || item.published_at
          ? (() => {
              const dateValue = item.datetime || item.date || item.publishedAt || item.published_at;
              if (typeof dateValue === 'number') {
                const timestamp = dateValue.toString().length === 10 
                  ? dateValue * 1000 
                  : dateValue;
                return new Date(timestamp).toLocaleDateString();
              } else if (typeof dateValue === 'string') {
                return dateValue.includes('T') 
                  ? new Date(dateValue).toLocaleDateString()
                  : new Date(dateValue).toLocaleDateString();
              }
              return new Date().toLocaleDateString();
            })() 
          : new Date().toLocaleDateString(),
        description: item.summary || item.description || item.content || item.excerpt || 'No description available',
        imageUrl: item.image || item.imageUrl || item.urlToImage || item.url_to_image || '/images/news-placeholder.jpg',
        link: item.url || item.source || item.link || '#',
        originalDatetime: item.datetime || item.date || item.publishedAt || item.published_at
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching market news:', error);
    return [];
  }
};

// Company news API
export const fetchCompanyNews = async (symbol: string, daysBack: number = 0): Promise<NewsItemProps[]> => {
  const today = new Date();
  const startDate = formatDate(getPreviousDate(today, daysBack));
  const endDate = daysBack === 0 ? formatDate(today) : formatDate(getPreviousDate(today, Math.max(0, daysBack - 2)));
  
  try {
    const newsData = await apiRequest<any>(`/news/companies/${symbol}?from=${startDate}&to=${endDate}&count=3`);
    
    let newsArray = [];
    if (newsData && newsData.success && newsData.data && newsData.data.data && Array.isArray(newsData.data.data)) {
      newsArray = newsData.data.data;
    } else if (newsData && newsData.data && Array.isArray(newsData.data)) {
      newsArray = newsData.data;
    } else {
      console.warn('Unexpected news data structure:', newsData);
      return [];
    }
    
    if (newsArray.length > 0) {
      return newsArray.map((item: any, index: number) => ({
        id: item.id || String(index),
        title: item.headline || item.title || 'No title',
        date: item.datetime 
          ? (() => {
              if (typeof item.datetime === 'number') {
                const timestamp = item.datetime.toString().length === 10 
                  ? item.datetime * 1000 
                  : item.datetime;
                return new Date(timestamp).toISOString().split('T')[0];
              } else if (typeof item.datetime === 'string') {
                return item.datetime.includes('T') 
                  ? item.datetime.split('T')[0]
                  : item.datetime;
              }
              return startDate;
            })() 
          : startDate,
        summary: item.summary || item.description || 'No summary available',
        link: item.url || item.source || '#',
        image: item.image || item.imageUrl || undefined
      }));
    }
    
    return [];
  } catch (error) {
    console.error('News fetch error:', error);
    return [];
  }
}; 