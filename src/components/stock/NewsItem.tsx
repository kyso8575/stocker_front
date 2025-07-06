import React from 'react';

export interface NewsItemProps {
  id: string;
  title: string;
  date: string;
  summary: string;
  link: string;
  image?: string;
}

const NewsItem: React.FC<{ news: NewsItemProps }> = ({ news }) => {
  return (
    <div className="border-b border-white/20 pb-6 last:border-b-0 hover:bg-white/10 transition-colors rounded-lg p-3">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4 h-48 md:h-36 flex-shrink-0 flex items-center justify-center bg-white/10 rounded-lg">
          {news.image ? (
            <img 
              src={news.image} 
              alt={news.title} 
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x100/1f2937/ffffff?text=No+Image';
              }} 
            />
          ) : (
            <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
              {news.date}
            </p>
          </div>
          <h3 className="font-bold text-white text-xl mb-2 line-clamp-2 hover:text-blue-300 transition-colors">{news.title}</h3>
          <p className="text-gray-300 mb-3 line-clamp-3 text-sm">{news.summary}</p>
          <a 
            href={news.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center"
          >
            Read More
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem; 