import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Users, Layers, Grid3X3, Settings, Power, X, Home, Sparkles, Brain } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  name: string;
  icon: JSX.Element;
  path: string;
  badge?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      name: "Mening so'zlarim",
      icon: <BookOpen className="w-5 h-5" />,
      path: '/my-vocabulary',
      badge: "New"
    },
    {
      name: "Bo'limlar",
      icon: <Layers className="w-5 h-5" />,
      path: '/units'
    },
    {
      name: "Kategoriyalar",
      icon: <Grid3X3 className="w-5 h-5" />,
      path: '/categories'
    },
    {
      name: "Quiz",
      icon: <Brain className="w-5 h-5" />,
      path: '/quiz',
      badge: "Hot"
    }
  ];

  const toggleItem = (path: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderMenuItem = (item: MenuItem) => {
    const isExpanded = expandedItems[item.path];

    return (
      <div key={item.path} className="mb-1">
        {item.children ? (
          <div 
            className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group"
            onClick={() => toggleItem(item.path)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                {item.name}
              </span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <div className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
              {isExpanded ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </div>
          </div>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden
              ${isActive 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-10"></div>
                )}
                <div className="flex items-center space-x-3 relative z-10">
                  <div className={`transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-700 group-hover:text-blue-700'
                  }`}>
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full transition-colors duration-200 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : item.badge === 'Hot' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                {isActive && (
                  <div className="w-1 h-6 bg-white rounded-full opacity-80"></div>
                )}
              </>
            )}
          </NavLink>
        )}
        
        {item.children && isExpanded && (
          <div className="ml-8 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.children.map(child => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) => `
                  flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all duration-200
                  ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}
                `}
              >
                <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                <span className="text-sm transition-colors duration-200">
                  {child.name}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white h-screen shadow-xl border-r border-gray-100 flex flex-col
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <Logo />
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Navigation
              </h3>
            </div>
            
            <div className="space-y-1">
              {menuItems.map(renderMenuItem)}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Learning Progress</p>
                <p className="text-xs text-gray-600">Keep it up!</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Words learned</span>
                <span className="font-medium text-gray-800">247/500</span>
              </div>
              <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" style={{ width: '49%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white hover:shadow-md cursor-pointer transition-all duration-200 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">M</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                Mathew Anderson
              </p>
              <p className="text-xs text-gray-500">Premium Member</p>
            </div>
            <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;