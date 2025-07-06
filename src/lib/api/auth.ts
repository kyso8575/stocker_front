import { apiRequest } from './client';
import { LoginRequest, LoginResponse, LogoutResponse, User } from './types';

// 캐싱을 위한 변수들
let authCache: { user: User | null; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

// 로그인 함수
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const data = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      body: JSON.stringify(credentials),
    });

    // 로그인 성공 시 캐시 무효화
    authCache = null;

    return data;
  } catch (error) {
    console.error('로그인 에러:', error);
    throw error;
  }
};

// 로그아웃 함수
export const logout = async (): Promise<LogoutResponse> => {
  try {
    const data = await apiRequest<LogoutResponse>('/auth/logout', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
    });
    
    // 로그아웃 시 캐시 무효화
    authCache = null;
    
    return data;
  } catch (error) {
    console.error('로그아웃 중 오류:', error);
    // 로그아웃은 실패해도 캐시는 무효화
    authCache = null;
    return { message: '로그아웃되었습니다' };
  }
};

// 로그인 상태 확인 함수 (캐싱 적용)
export const checkLoginStatus = async (): Promise<User | null> => {
  try {
    // 캐시가 유효한 경우 캐시된 결과 반환
    if (authCache && (Date.now() - authCache.timestamp) < CACHE_DURATION) {
      return authCache.user;
    }

    const data = await apiRequest<any>('/auth/me', {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
    });
    
    let user: User | null = null;
    if (data.success) {
      user = data.user;
    }

    // 결과를 캐시에 저장
    authCache = {
      user,
      timestamp: Date.now()
    };

    return user;
  } catch (error) {
    console.error('로그인 상태 확인 실패:', error);
    return null;
  }
};

// 캐시 무효화 함수 (필요한 경우 수동으로 캐시를 지울 때 사용)
export const clearAuthCache = (): void => {
  authCache = null;
};

// 인증 상태 확인 (동기)
export const isAuthenticated = (): boolean => {
  // 쿠키 기반이므로 항상 false 반환 (실제로는 checkLoginStatus 사용)
  return false;
};

// API 요청에 인증 헤더 추가
export const getAuthHeaders = (): Record<string, string> => {
  return {}; // 쿠키는 자동으로 전송되므로 헤더 불필요
}; 