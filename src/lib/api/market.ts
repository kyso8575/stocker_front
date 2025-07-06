import { apiRequest } from './client';
import { TopMoversData, SP500Stock } from './types';

// Top movers API
export const fetchTopMovers = async (): Promise<TopMoversData[]> => {
  try {
    const data = await apiRequest<any>('/sp500/table');
    
    if (data.success && data.data && data.data.data) {
      return data.data.data
        .filter((item: any) => item.change !== undefined && item.change !== null)
        .sort((a: any, b: any) => Math.abs(b.change) - Math.abs(a.change))
        .slice(0, 4)
        .map((item: any) => ({
          symbol: item.symbol,
          name: item.name,
          price: item.price,
          change: item.change,
          percentChange: item.percentChange,
          logo: item.logo
        }));
    } else {
      throw new Error('Invalid data format received from API');
    }
  } catch (error) {
    console.error('Error fetching top movers:', error);
    return [];
  }
};

// S&P 500 data API
export const fetchSP500Data = async (): Promise<SP500Stock[]> => {
  try {
    const data = await apiRequest<any>('/sp500/table');
    
    let stocksArray = [];
    if (data && data.data && data.data.data && Array.isArray(data.data.data)) {
      stocksArray = data.data.data;
    } else if (data && data.data && Array.isArray(data.data)) {
      stocksArray = data.data;
    } else {
      throw new Error('Invalid data format received from API');
    }
    
    return stocksArray.map((item: any) => ({
      symbol: item.symbol,
      name: item.name,
      price: item.price,
      change: item.change,
      percentChange: item.percentChange,
      marketCap: item.marketCap,
      industry: item.finnhubIndustry || item.industry,
      previousPrice: item.previousPrice,
      logo: item.logo,
      currency: item.currency,
      exchange: item.exchange,
      weburl: item.weburl,
      high: item.high,
      low: item.low
    }));
  } catch (error) {
    console.error('Error fetching SP500 data:', error);
    return [];
  }
}; 