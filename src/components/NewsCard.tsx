import React, { useState } from 'react';

export interface NewsArticle {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  
  // 이미지 URL 유효성 검사
  const isValidImageUrl = (url: string) => {
    return url && 
      url.startsWith('http') && 
      !url.includes('Placeholder') && 
      url.length > 15;
  };
  
  // 대체 이미지 URL
  const fallbackImage = '/images/news-placeholder.jpg'; // 기본 대체 이미지
  
  // 사용할 이미지 URL 결정
  const imageUrl = isValidImageUrl(article.imageUrl) && !imageError 
    ? article.imageUrl 
    : fallbackImage;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative h-[16rem] w-full bg-gray-100">
        <img 
          src={imageUrl}
          alt={article.title}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-[0.75rem] text-gray-500 mb-1">{article.date}</p>
        <h4 className="text-[1.25rem] font-bold text-gray-800 mb-2 line-clamp-2">{article.title}</h4>
        <p className="text-[0.875rem] text-gray-600 mb-3 flex-grow line-clamp-3">{article.description}</p>
        <a 
          href={article.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline text-[0.875rem] font-medium self-start flex items-center"
        >
          Read More
          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default NewsCard; 