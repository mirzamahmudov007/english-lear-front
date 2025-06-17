import React from 'react';

const YearlyBreakup: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Yearly Breakup</h3>
      
      <div className="relative mb-6">
        <div className="w-32 h-32 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeDasharray="75, 25"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="75, 25"
              strokeDashoffset="25"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">$36,358</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600 font-medium">+9%</span>
          <span className="text-sm text-gray-500">last year</span>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">2025</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-gray-400">2025</span>
        </div>
      </div>
    </div>
  );
};

export default YearlyBreakup;