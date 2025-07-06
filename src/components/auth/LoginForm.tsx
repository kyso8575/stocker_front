"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthInput from './AuthInput';
import { login } from '@/lib/api';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.usernameOrEmail) {
      newErrors.usernameOrEmail = '사용자명 또는 이메일을 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password
      });

      console.log('로그인 성공:', result);
      
      setIsLoading(false);
      onSuccess?.();
      
      // 로그인 성공 후 페이지 새로고침하여 Navbar 업데이트
      window.location.href = '/';
      
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다';
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-500/10 border-2 border-red-400/30 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400 font-medium">{errors.general}</p>
          </div>
        </div>
      )}

      <AuthInput
        id="usernameOrEmail"
        name="usernameOrEmail"
        type="text"
        label="사용자명 또는 이메일"
        placeholder="username 또는 email@example.com"
        value={formData.usernameOrEmail}
        onChange={handleInputChange}
        required
        autoComplete="username"
        error={errors.usernameOrEmail}
        icon={
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <AuthInput
        id="password"
        name="password"
        type="password"
        label="비밀번호"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleInputChange}
        required
        autoComplete="current-password"
        error={errors.password}
        showPasswordToggle
        onPasswordToggle={() => setShowPassword(!showPassword)}
        showPassword={showPassword}
        icon={
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded focus:ring-blue-400 focus:ring-2 transition-all duration-200"
          />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">로그인 상태 유지</span>
        </label>
        <button
          type="button"
          className="text-sm text-blue-400 hover:text-cyan-400 font-medium transition-colors duration-200 underline decoration-1 underline-offset-2"
        >
          비밀번호 찾기
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        {isLoading ? (
          <div className="flex items-center justify-center relative z-10">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="relative z-10">로그인 중...</span>
          </div>
        ) : (
          <span className="relative z-10">로그인</span>
        )}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-gray-400">또는</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center px-4 py-3 border-2 border-white/20 rounded-2xl text-gray-300 font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-200 transform hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center px-4 py-3 border-2 border-white/20 rounded-2xl text-gray-300 font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-200 transform hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
          Twitter
        </button>
      </div>
    </form>
  );
} 