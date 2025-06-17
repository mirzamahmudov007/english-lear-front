import React, { useState } from 'react';
import { Menu,  Bell, ShoppingCart, MessageSquare, Calendar, Mail, Globe, User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, pageTitle }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Menu 
            className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" 
            onClick={onMenuClick}
          />
          <div className="text-lg font-semibold text-gray-700">{pageTitle}</div>
        </div>

        <div className="flex items-center space-x-6">
          {/* <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm hover:text-blue-600 cursor-pointer transition-colors">
              <Globe className="w-4 h-4" />
              <span>🇺🇸</span>
            </div>
          </div> */}

          <div className="flex items-center space-x-6">
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">M</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-medium">M</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Mathew Anderson</p>
                        <p className="text-sm text-gray-500">mathew@modernize.com</p>
                        <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">Designer</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">My Profile</span>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">My Account</span>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">My Chats</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 py-2">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors">
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Settings</span>
                    </div>
                    <div className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center space-x-3 transition-colors group">
                      <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                      <span className="text-gray-700 group-hover:text-red-600">Logout</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for dropdown */}
      {profileDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setProfileDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Header;