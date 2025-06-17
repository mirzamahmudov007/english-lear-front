import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const RevenueChart: React.FC = () => {
  const data = [
    { month: 'Jan', value: 2.5, color: 'bg-blue-400' },
    { month: 'Feb', value: 3.8, color: 'bg-blue-500' },
    { month: 'Mar', value: 3.2, color: 'bg-blue-400' },
    { month: 'Apr', value: 4.8, color: 'bg-blue-600' },
    { month: 'May', value: 3.5, color: 'bg-blue-400' },
    { month: 'Jun', value: 4.2, color: 'bg-blue-500' },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Revenue Updates</h3>
          <p className="text-sm text-gray-500">Overview of Profit</p>
        </div>
        <div className="flex items-center space-x-4">
          <select className="text-sm text-gray-600 bg-transparent border border-gray-200 rounded-lg px-3 py-1">
            <option>March 2025</option>
          </select>
          <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      <div className="flex items-end justify-between h-48 mb-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="flex flex-col items-center space-y-1">
              <div 
                className={`${item.color} rounded-t-lg w-8 transition-all duration-300 hover:opacity-80`}
                style={{ height: `${(item.value / maxValue) * 120}px` }}
              ></div>
              <div 
                className="bg-cyan-400 rounded-b-lg w-8"
                style={{ height: `${((item.value * 0.6) / maxValue) * 120}px` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Earnings this month</span>
          </div>
          <p className="text-xl font-bold text-gray-800">$48,820</p>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Expense this month</span>
          </div>
          <p className="text-xl font-bold text-gray-800">$26,498</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded"></div>
            </div>
            <span className="text-lg font-bold text-gray-800">$63,489.50</span>
          </div>
          <span className="text-sm text-gray-500">Total Earnings</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;