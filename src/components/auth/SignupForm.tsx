"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthInput from './AuthInput';

interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface SignupRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export default function SignupForm({ onSuccess, onError }: SignupFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  // 사용자명 중복 체크
  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const response = await fetch(`http://localhost:8080/api/auth/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      console.log('사용자명 중복 체크 응답:', { username, response: data, status: response.status });
      
      if (response.ok) {
        // API 응답 형식: { "exist": true/false, ... }
        const isExist = data.exist === true;
        const isAvailable = !isExist; // exist가 true면 사용 중, false면 사용 가능
        
        setUsernameAvailable(isAvailable);
        if (!isAvailable) {
          setErrors(prev => ({ ...prev, username: '이미 사용 중인 사용자명입니다' }));
        } else {
          setErrors(prev => ({ ...prev, username: '' }));
        }
      } else {
        setUsernameAvailable(false);
        setErrors(prev => ({ ...prev, username: '사용자명 확인 중 오류가 발생했습니다' }));
      }
    } catch (error) {
      console.error('사용자명 중복 체크 에러:', error);
      setUsernameAvailable(false);
      setErrors(prev => ({ ...prev, username: '사용자명 확인 중 오류가 발생했습니다' }));
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // 이메일 중복 체크
  const checkEmail = async (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailAvailable(null);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const response = await fetch(`http://localhost:8080/api/auth/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      console.log('이메일 중복 체크 응답:', { email, response: data, status: response.status });
      
      if (response.ok) {
        // API 응답 형식: { "exist": true/false, ... }
        const isExist = data.exist === true;
        const isAvailable = !isExist; // exist가 true면 사용 중, false면 사용 가능
        
        setEmailAvailable(isAvailable);
        if (!isAvailable) {
          setErrors(prev => ({ ...prev, email: '이미 사용 중인 이메일입니다' }));
        } else {
          setErrors(prev => ({ ...prev, email: '' }));
        }
      } else {
        setEmailAvailable(false);
        setErrors(prev => ({ ...prev, email: '이메일 확인 중 오류가 발생했습니다' }));
      }
    } catch (error) {
      console.error('이메일 중복 체크 에러:', error);
      setEmailAvailable(false);
      setErrors(prev => ({ ...prev, email: '이메일 확인 중 오류가 발생했습니다' }));
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 사용자명 중복 체크 디바운스
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUsername(formData.username);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  // 이메일 중복 체크 디바운스
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkEmail(formData.email);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Reset availability status when user starts typing
    if (name === 'username') {
      setUsernameAvailable(null);
    } else if (name === 'email') {
      setEmailAvailable(null);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username) {
      newErrors.username = '사용자명을 입력해주세요';
    } else if (formData.username.length < 3) {
      newErrors.username = '사용자명은 최소 3자 이상이어야 합니다';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다';
    } else if (usernameAvailable === false) {
      newErrors.username = '이미 사용 중인 사용자명입니다';
    }

    if (!formData.fullName) {
      newErrors.fullName = '이름을 입력해주세요';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = '이름은 최소 2자 이상이어야 합니다';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    } else if (emailAvailable === false) {
      newErrors.email = '이미 사용 중인 이메일입니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 중복 체크가 완료되지 않은 경우 대기
    if (isCheckingUsername || isCheckingEmail) {
      setErrors({ general: '중복 확인이 완료될 때까지 기다려주세요' });
      return;
    }

    // 중복 체크 결과 확인
    if (usernameAvailable === false || emailAvailable === false) {
      setErrors({ general: '사용자명 또는 이메일이 이미 사용 중입니다' });
      return;
    }

    setIsLoading(true);

    try {
      const signupData: SignupRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.fullName
      };

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `회원가입 실패 (${response.status})`);
      }

      const result = await response.json();
      console.log('회원가입 성공:', result);
      
      setIsLoading(false);
      onSuccess?.();
      router.push('/login');
      
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다';
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
    }
  };

  const getStatusIcon = (isChecking: boolean, isAvailable: boolean | null) => {
    if (isChecking) {
      return (
        <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    
    if (isAvailable === true) {
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    
    if (isAvailable === false) {
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    
    return null;
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

      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-semibold text-white">
          사용자명 <span className="text-red-400">*</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-blue-400">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleInputChange}
            className={`block w-full pl-12 pr-12 py-4 bg-white/10 border-2 ${errors.username ? 'border-red-400 focus:border-red-500' : 'border-white/20 focus:border-blue-400'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:bg-white/20 focus:bg-white/10 shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm`}
            placeholder="username123"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {getStatusIcon(isCheckingUsername, usernameAvailable)}
          </div>
        </div>
        {errors.username && (
          <div className="flex items-center space-x-2 text-xs text-red-400 animate-pulse">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.username}</span>
          </div>
        )}
        {usernameAvailable === true && !errors.username && (
          <div className="flex items-center space-x-2 text-xs text-green-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>사용 가능한 사용자명입니다</span>
          </div>
        )}
      </div>

      <AuthInput
        id="fullName"
        name="fullName"
        type="text"
        label="이름"
        placeholder="홍길동"
        value={formData.fullName}
        onChange={handleInputChange}
        required
        autoComplete="name"
        error={errors.fullName}
        icon={
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-white">
          이메일 <span className="text-red-400">*</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-blue-400">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={`block w-full pl-12 pr-12 py-4 bg-white/10 border-2 ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-white/20 focus:border-blue-400'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:bg-white/20 focus:bg-white/10 shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm`}
            placeholder="your@email.com"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {getStatusIcon(isCheckingEmail, emailAvailable)}
          </div>
        </div>
        {errors.email && (
          <div className="flex items-center space-x-2 text-xs text-red-400 animate-pulse">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.email}</span>
          </div>
        )}
        {emailAvailable === true && !errors.email && (
          <div className="flex items-center space-x-2 text-xs text-green-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>사용 가능한 이메일입니다</span>
          </div>
        )}
      </div>

      <AuthInput
        id="password"
        name="password"
        type="password"
        label="비밀번호"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleInputChange}
        required
        autoComplete="new-password"
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

      <AuthInput
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="비밀번호 확인"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        required
        autoComplete="new-password"
        error={errors.confirmPassword}
        showPasswordToggle
        onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        showPassword={showConfirmPassword}
        icon={
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <div className="flex items-start space-x-3 p-4 bg-blue-500/10 rounded-2xl border border-blue-400/20">
        <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-blue-300">
          <p className="font-medium mb-1">비밀번호 요구사항:</p>
          <ul className="space-y-1 text-xs">
            <li>• 최소 8자 이상</li>
            <li>• 대문자, 소문자, 숫자 포함</li>
            <li>• 특수문자 권장</li>
          </ul>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || isCheckingUsername || isCheckingEmail}
        className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        {isLoading ? (
          <div className="flex items-center justify-center relative z-10">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="relative z-10">회원가입 중...</span>
          </div>
        ) : (
          <span className="relative z-10">회원가입</span>
        )}
      </button>
    </form>
  );
} 