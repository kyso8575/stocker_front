'use client';

import React from 'react';
import Link from 'next/link';

interface FeaturesSectionProps {
  authenticated: boolean;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ authenticated }) => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Setup",
      description: "Get started in minutes with our intuitive interface. No complex setup required.",
      link: "/signup",
      linkText: "Get Started",
      color: "from-blue-500 to-cyan-500",
      linkColor: "text-blue-400 hover:text-blue-300"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Risk-Free Trading",
      description: "Practice with $100,000 virtual money. Learn without losing real capital.",
      link: authenticated ? "/portfolio" : "/login",
      linkText: "Start Demo",
      color: "from-green-500 to-emerald-500",
      linkColor: "text-green-400 hover:text-green-300"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Advanced Analytics",
      description: "Professional charts, technical indicators, and real-time market data.",
      link: "/sp500",
      linkText: "Explore Data",
      color: "from-indigo-500 to-blue-500",
      linkColor: "text-indigo-400 hover:text-indigo-300"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      title: "Market News",
      description: "Stay informed with real-time news and expert market analysis.",
      link: "#",
      linkText: "Available Now",
      color: "from-cyan-500 to-blue-500",
      linkColor: "text-cyan-400",
      isExternal: false
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Portfolio Tracking",
      description: "Monitor your investments with detailed performance analytics.",
      link: authenticated ? "/portfolio" : "/login",
      linkText: "View Portfolio",
      color: "from-sky-500 to-blue-500",
      linkColor: "text-sky-400 hover:text-sky-300"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Watchlist",
      description: "Create custom watchlists and track your favorite stocks.",
      link: authenticated ? "/watchlist" : "/login",
      linkText: "Manage Watchlist",
      color: "from-blue-500 to-indigo-500",
      linkColor: "text-blue-400 hover:text-blue-300"
    }
  ];

  return (
    <section className="py-24 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Succeed</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From beginner to pro, our comprehensive suite of tools helps you make informed decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 mb-6">
                {feature.description}
              </p>
              {feature.link === "#" ? (
                <span className={`inline-flex items-center ${feature.linkColor} font-semibold`}>
                  {feature.linkText}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                  </svg>
                </span>
              ) : (
                <Link href={feature.link} className={`inline-flex items-center ${feature.linkColor} font-semibold`}>
                  {feature.linkText}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 