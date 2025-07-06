"use client";

import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  logoIcon: React.ReactNode;
  footerText?: string;
  alternateLink?: {
    text: string;
    href: string;
    linkText: string;
  };
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  logoIcon,
  footerText,
  alternateLink
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-800 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern - 홈페이지와 동일한 패턴 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
            {logoIcon}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Stocker
          </h1>
          <p className="text-white text-xl font-semibold mb-1">{title}</p>
          <p className="text-gray-300 text-sm">{subtitle}</p>
          {alternateLink && (
            <p className="text-sm text-gray-300 mt-4">
              {alternateLink.text}{' '}
              <Link href={alternateLink.href} className="font-semibold text-blue-400 hover:text-cyan-400 transition-colors duration-200 underline decoration-2 underline-offset-2">
                {alternateLink.linkText}
              </Link>
            </p>
          )}
        </div>

        {/* Auth Form Container - 홈페이지와 동일한 글래스모피즘 효과 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-[1.02] transition-all duration-300">
          {children}
        </div>

        {/* Footer */}
        {footerText && (
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400 leading-relaxed">
              {footerText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 