import React from 'react';
import { TrendingUp } from 'lucide-react';

const MonthlyEarnings: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Earnings</h3>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-500 font-medium">+9%</span>
          <span className="text-sm text-gray-500">than last year</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">$6,820</p>
      </div>

      <div className="h-20">
        <svg className="w-full h-full" viewBox="0 0 200 50">
          <path
            d="M0,40 Q50,20 100,30 T200,25"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          <path
            d="M0,40 Q50,20 100,30 T200,25 L200,50 L0,50 Z"
            fill="url(#gradient)"
            opacity="0.2"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center ml-auto">
          <span className="text-white font-bold">$</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyEarnings;