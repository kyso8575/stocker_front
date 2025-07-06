import { apiRequest } from './client';
import { WatchlistItem } from './types';

// Watchlist 가져오기
export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  try {
    const data = await apiRequest<any>('/watchlist', {
      method: 'GET',
      credentials: 'include',
    });
    
    // 실제 관심목록은 data.data에 있음
    return data.data || [];
  } catch (error) {
    console.error('Watchlist 조회 에러:', error);
    throw error;
  }
};

// Watchlist에 주식 추가
export const addToWatchlist = async (symbol: string): Promise<void> => {
  try {
    await apiRequest('/watchlist', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ symbol }),
    });
  } catch (error) {
    console.error('Watchlist 추가 에러:', error);
    throw error;
  }
};

// Watchlist에서 주식 제거
export const removeFromWatchlist = async (symbol: string): Promise<void> => {
  try {
    await apiRequest(`/watchlist/${symbol}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Watchlist 제거 에러:', error);
    throw error;
  }
};

// 특정 주식이 Watchlist에 있는지 확인
export const checkStockInWatchlist = async (symbol: string): Promise<boolean> => {
  try {
    const data = await apiRequest<any>(`/watchlist/check/${symbol}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('checkStockInWatchlist 응답:', data);
    return data.exist === true;
  } catch (error) {
    console.error('Watchlist 확인 에러:', error);
    return false;
  }
}; 