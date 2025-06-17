import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, BookOpen, ShoppingCart, Package, List, CreditCard, Plus, Settings, Power, X } from 'lucide-react';
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
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const menuItems: MenuItem[] = [
    {
      name: "Mening so'zlarim",
      icon: <Users className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
      path: '/my-vocabulary'
    },
    {
      name: "Bo'limlar",
      icon: <Users className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
      path: '/units'
    },
    {
      name: "Kategoriyalar",
      icon: <Users className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
      path: '/categories'
    },
    {
      name: 'Blog',
      icon: <BookOpen className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
      path: '/blog',
      children: [
        {
          name: 'Posts',
          icon: <div className="w-1 h-1 bg-gray-400 rounded-full" />,
          path: '/blog/posts'
        },
        {
          name: 'Detail',
          icon: <div className="w-1 h-1 bg-gray-400 rounded-full" />,
          path: '/blog/detail'
        }
      ]
    },
    {
      name: 'Ecommerce',
      icon: <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
      path: '/ecommerce',
      children: [
        {
          name: 'Shop',
          icon: <div className="w-1 h-1 bg-blue-400 rounded-full" />,
          path: '/ecommerce/shop'
        },
        {
          name: 'Detail',
          icon: <div className="w-1 h-1 bg-blue-400 rounded-full" />,
          path: '/ecommerce/detail'
        },
        {
          name: 'List',
          icon: <div className="w-1 h-1 bg-blue-400 rounded-full" />,
          path: '/ecommerce/list'
        },
        {
          name: 'Checkout',
          icon: <div className="w-1 h-1 bg-blue-400 rounded-full" />,
          path: '/ecommerce/checkout'
        },
        {
          name: 'Add Product',
          icon: <div className="w-1 h-1 bg-blue-400 rounded-full" />,
          path: '/ecommerce/add-product'
        }
      ]
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
      <div key={item.path}>
        {item.children ? (
          <div 
            className={`
              flex items-center justify-between p-3 rounded-lg 
              cursor-pointer transition-colors group
              ${item.name === 'Ecommerce' ? 'bg-blue-50' : ''}
            `}
            onClick={() => toggleItem(item.path)}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className={`
                text-sm font-medium 
                ${item.name === 'Ecommerce' ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-700'} 
                transition-colors
              `}>
                {item.name}
              </span>
            </div>
            {isExpanded ? 
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" /> : 
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
            }
          </div>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between p-3 rounded-lg 
              hover:bg-gray-50 cursor-pointer transition-colors group
              ${isActive ? 'bg-blue-50' : ''}
            `}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className={`
                text-sm font-medium 
                ${item.name === 'Ecommerce' ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-700'} 
                transition-colors
              `}>
                {item.name}
              </span>
            </div>
          </NavLink>
        )}
        
        {item.children && isExpanded && (
          <div className="ml-8 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.children.map(child => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) => `
                  flex items-center space-x-2 p-2 rounded-lg 
                  hover:bg-gray-50 cursor-pointer transition-colors
                  ${isActive ? 'bg-blue-50' : ''}
                `}
              >
                {child.icon}
                <span className={`
                  text-sm 
                  ${item.name === 'Ecommerce' ? 'text-blue-600 hover:text-blue-700' : 'text-gray-600 hover:text-blue-600'} 
                  transition-colors
                `}>
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white h-screen shadow-sm border-r border-gray-100 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Logo />
          <button 
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">APPS</h3>
            
            <div className="space-y-2">
              {menuItems.map(renderMenuItem)}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">M</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">Mathew</p>
              <p className="text-xs text-gray-500">Designer</p>
            </div>
            <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;