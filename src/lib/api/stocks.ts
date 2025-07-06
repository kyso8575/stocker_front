import { apiRequest } from './client';
import { CompanyInfo, StockPrice, FinancialData } from './types';

// Company info API
export const fetchCompanyInfo = async (symbol: string): Promise<CompanyInfo> => {
  try {
    const result = await apiRequest<any>(`/company-profiles/${symbol}`);
    
    if (result.success && result.data) {
      const data = result.data.profile || result.data;
      return {
        name: data.name || '',
        country: data.country || '',
        industry: data.finnhubIndustry || '',
        ipoDate: data.ipo || '',
        exchange: data.exchange || '',
        weburl: data.weburl || '',
        symbol: data.symbol || data.ticker || '',
        displaySymbol: data.displaySymbol || data.ticker || '',
        currency: data.currency || 'USD',
        logo: data.logo || ''
      };
    } else {
      throw new Error('Invalid company info response format');
    }
  } catch (error) {
    console.error('Error fetching company info:', error);
    return {
      name: '',
      country: '',
      industry: '',
      ipoDate: '',
      exchange: '',
      weburl: '',
      symbol: '',
      displaySymbol: '',
      currency: 'USD',
      logo: ''
    };
  }
};

// Stock price API
export const fetchCurrentStockPrice = async (symbol: string): Promise<StockPrice | null> => {
  try {
    const data = await apiRequest<any>(`/quote/${symbol}`);
    return data;
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return null;
  }
};

// Financial data API
export const fetchFinancialData = async (symbol: string): Promise<FinancialData | null> => {
  try {
    const data = await apiRequest<any>(`/financials/${symbol}`);
    return data;
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return null;
  }
}; 