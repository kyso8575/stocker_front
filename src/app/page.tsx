'use client';

import React, { useState, useEffect } from 'react';
import { 
  HeroSection, 
  FeaturesSection, 
  TopMoversSection, 
  NewsSection, 
  CTASection 
} from '../components/home';
import { checkLoginStatus } from '@/lib/api';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkLoginStatus();
        setAuthenticated(!!userData);
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        setAuthenticated(false);
      }
    };

    if (isClient) {
      checkAuth();
    }
  }, [isClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-800 to-slate-800">
      <HeroSection authenticated={authenticated} />
      <FeaturesSection authenticated={authenticated} />
      <TopMoversSection />
      <NewsSection />
      <CTASection />
    </div>
  );
}
