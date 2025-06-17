import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  try {
    const response = await login(username, password);
    localStorage.setItem('token', response.token);
    navigate('/dashboard');
  } catch (error) {
    console.error(error);
  }  
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="relative mb-8">
            {/* Illustration */}
            <div className="relative">
              <div className="w-80 h-64 bg-white rounded-2xl shadow-lg p-6 mb-8 relative overflow-hidden">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                </div>
                <div className="absolute top-16 left-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </div>
                <div className="absolute top-24 left-24 space-y-1">
                  <div className="w-16 h-2 bg-gray-300 rounded"></div>
                  <div className="w-12 h-2 bg-gray-200 rounded"></div>
                </div>
                <div className="absolute bottom-6 left-6 w-16 h-8 bg-red-500 rounded"></div>
              </div>
              
              {/* Character */}
              <div className="absolute -bottom-8 -right-4">
                <div className="w-32 h-40 relative">
                  <div className="w-16 h-16 bg-blue-200 rounded-full absolute top-0 left-8"></div>
                  <div className="w-20 h-24 bg-teal-400 rounded-t-2xl absolute top-12 left-6"></div>
                  <div className="w-24 h-16 bg-blue-600 rounded-b-2xl absolute top-28 left-4"></div>
                  <div className="w-6 h-8 bg-red-500 rounded absolute bottom-0 left-2"></div>
                  <div className="w-6 h-8 bg-red-500 rounded absolute bottom-0 right-2"></div>
                  <div className="absolute top-16 -right-4 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <Logo />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Modernize</h1>
            <p className="text-gray-600">Your Admin Dashboard</p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
            
            <button className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">f</span>
              </div>
              <span className="text-gray-700 font-medium">Sign in with FB</span>
            </button>
          </div>

          <div className="text-center text-gray-500 mb-6">or sign in with</div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remeber this Device
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot Password ?
              </a>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">New to Modernize? </span>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;