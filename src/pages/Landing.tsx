import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Settings, Zap, Eye, Layers, Database } from 'lucide-react';
import Logo from '../components/Logo';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-blue-600 text-white px-6 py-2 text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-medium">New</span>
            <span>Frontend Pages included!</span>
          </div>
          <button className="text-white hover:text-gray-200">×</button>
        </div>
      </nav>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-800">About Us</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Blog</a>
              <div className="flex items-center space-x-1">
                <a href="#" className="text-gray-600 hover:text-gray-800">Portfolio</a>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
              </div>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
              <a href="#" className="text-gray-600 hover:text-gray-800">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
            </nav>

            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Most powerful &
            <br />
            <span className="text-blue-600">developer friendly</span>
            <br />
            dashboard
          </h1>
          
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-gray-600">52,589+ developers & agencies using our templates</span>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-12">
            <Link 
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Log In
            </Link>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-blue-600 ml-1" />
              </div>
              <span>See how it works</span>
            </button>
          </div>

          {/* Technology Icons */}
          <div className="flex items-center justify-center space-x-8 mb-16">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="font-bold text-gray-800">N</span>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">TS</span>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-gray-600" />
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Yearly breakup</h3>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeDasharray="75, 25"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">$36,358</p>
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-green-600">↗ +9%</span>
                    <span className="text-gray-500">than last year</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-600">2024</span>
                </div>
                <span className="text-gray-400">2023</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Monthly earnings</h3>
              <div>
                <p className="text-2xl font-bold text-gray-800">$6,820</p>
                <div className="flex items-center space-x-1 text-sm mb-4">
                  <span className="text-red-500">↗ +9%</span>
                  <span className="text-gray-500">than last year</span>
                </div>
                <div className="h-12 bg-gradient-to-r from-cyan-200 to-cyan-400 rounded-lg"></div>
              </div>
              <div className="flex justify-end mt-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;