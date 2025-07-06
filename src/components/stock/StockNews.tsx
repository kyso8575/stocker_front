import React from 'react';
import NewsItem, { NewsItemProps } from './NewsItem';

interface StockNewsProps {
  newsItems: NewsItemProps[];
  loading?: boolean;
}

const StockNews: React.FC<StockNewsProps> = ({ newsItems, loading = false }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
      <div className="flex justify-between items-center mb-5 border-b-2 border-white/20 pb-2">
        <h2 className="text-xl font-bold text-white">Related News</h2>
      </div>
      
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-gray-300">Loading news...</span>
          </div>
        ) : newsItems.length > 0 ? (
          newsItems.map((news) => (
            <NewsItem key={news.id} news={news} />
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">No recent news found for this stock.</p>
        )}
      </div>
    </div>
  );
};

export default StockNews; 