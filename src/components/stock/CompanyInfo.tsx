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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-black mb-5 border-b-2 border-gray-300 pb-2">Company</h2>
      <div className="mt-4">

        <p className="text-sm text-gray-500 font-medium mb-1">Country</p>
        <p className="text-lg text-black mb-3">{country}</p>

        <p className="text-sm text-gray-500 font-medium mb-1">Industry</p>
        <p className="text-lg text-black mb-3">{industry}</p>
        
        <p className="text-sm text-gray-500 font-medium mb-1">IPO Date</p>
        <p className="text-lg text-black mb-3">{ipoDate}</p>
        
        <p className="text-sm text-gray-500 font-medium mb-1">Exchange</p>
        <p className="text-lg text-black mb-3">{exchange}</p>
        
        {weburl && (
          <>
            <p className="text-sm text-gray-500 font-medium mb-1">Website</p>
            <a href={weburl} target="_blank" rel="noopener noreferrer" className="text-lg text-blue-600 hover:underline">
              {weburl}
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyInfo; 