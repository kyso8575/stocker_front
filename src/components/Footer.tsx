import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Stocker Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Stocker</h4>
            <p className="text-sm">Your trusted partner for stock market insights and analysis</p>
          </div>
          {/* Quick Links */}
          <div>
            <h5 className="text-md font-semibold text-white mb-3">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Markets</Link></li>
              <li><Link href="/stock/list" className="hover:text-white">Stocks</Link></li>
              <li><Link href="/news" className="hover:text-white">News</Link></li>
              <li><Link href="/analysis" className="hover:text-white">Analysis</Link></li>
            </ul>
          </div>
          {/* Resources */}
          <div>
            <h5 className="text-md font-semibold text-white mb-3">Resources</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/api-docs" className="hover:text-white">API Documentation</Link></li>
              <li><Link href="/guide" className="hover:text-white">Trading Guide</Link></li>
              <li><Link href="/research" className="hover:text-white">Market Research</Link></li>
            </ul>
          </div>
          {/* Connect */}
          <div>
            <h5 className="text-md font-semibold text-white mb-3">Connect</h5>
            <div className="flex space-x-4">
              {/* 소셜 미디어 아이콘 (예시 - 실제 아이콘 컴포넌트나 SVG 사용) */}
              <a href="#" className="hover:text-white">T</a>
              <a href="#" className="hover:text-white">L</a>
              <a href="#" className="hover:text-white">F</a>
              <a href="#" className="hover:text-white">I</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm">
          © {new Date().getFullYear()} Stocker. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 