// News related types
export interface NewsArticle {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  link: string;
  originalDatetime?: number | string;
}

export interface NewsItemProps {
  id: string;
  title: string;
  date: string;
  summary: string;
  link: string;
  image?: string;
}

// Market data types
export interface TopMoversData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  logo?: string;
}

export interface SP500Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  marketCap: number;
  industry: string;
  previousPrice: number;
  logo?: string;
  currency: string;
  exchange: string;
  weburl?: string;
  high: number;
  low: number;
}

// Company info types
export interface CompanyInfo {
  name: string;
  country: string;
  industry: string;
  ipoDate: string;
  exchange: string;
  weburl: string;
  symbol: string;
  displaySymbol: string;
  currency: string;
  logo: string;
}

// Stock price types
export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  currency: string;
  timestamp?: number;
}

// Financial data types
export interface FinancialData {
  symbol: string;
  revenue?: number;
  profit?: number;
  marketCap?: number;
  pe?: number;
  pb?: number;
  debt?: number;
  cash?: number;
}

// Auth related types
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  user?: any;
  message?: string;
}

export interface LogoutResponse {
  message?: string;
}

export interface User {
  id?: string;
  username?: string;
  email?: string;
  fullName?: string;
}

// Watchlist related types
export interface WatchlistItem {
  symbol: string;
  addedAt?: string;
} 