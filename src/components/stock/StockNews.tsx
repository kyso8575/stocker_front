import React from 'react';
import NewsItem, { NewsItemProps } from './NewsItem';

interface StockNewsProps {
  newsItems: NewsItemProps[];
}

const StockNews: React.FC<StockNewsProps> = ({ newsItems }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-5 border-b-2 border-gray-300 pb-2">
        <h2 className="text-xl font-bold text-black">Related News</h2>
      </div>
      
      <div className="space-y-6">
        {newsItems.length > 0 ? (
          newsItems.map((news) => (
            <NewsItem key={news.id} news={news} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No recent news found for this stock.</p>
        )}
      </div>
    </div>
  );
};

export default StockNews; 