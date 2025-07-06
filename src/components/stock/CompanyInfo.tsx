import React from 'react';

interface CompanyInfoProps {
  name: string;
  country: string;
  industry: string;
  ipoDate: string;
  exchange: string;
  weburl?: string;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({
  name,
  country,
  industry,
  ipoDate,
  exchange,
  weburl
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
      <h2 className="text-xl font-bold text-white mb-5 border-b-2 border-white/20 pb-2">Company</h2>
      <div className="mt-4">

        <p className="text-sm text-gray-300 font-medium mb-1">Country</p>
        <p className="text-lg text-white mb-3">{country}</p>

        <p className="text-sm text-gray-300 font-medium mb-1">Industry</p>
        <p className="text-lg text-white mb-3">{industry}</p>
        
        <p className="text-sm text-gray-300 font-medium mb-1">IPO Date</p>
        <p className="text-lg text-white mb-3">{ipoDate}</p>
        
        <p className="text-sm text-gray-300 font-medium mb-1">Exchange</p>
        <p className="text-lg text-white mb-3">{exchange}</p>
        
        {weburl && (
          <>
            <p className="text-sm text-gray-300 font-medium mb-1">Website</p>
            <a href={weburl} target="_blank" rel="noopener noreferrer" className="text-lg text-blue-400 hover:text-blue-300 transition-colors">
              {weburl}
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyInfo; 