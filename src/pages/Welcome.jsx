import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { useTheme } from '../contexts/ThemeContext';

export default function Welcome() {
  const [activeForm, setActiveForm] = useState('login');
  const { isDark } = useTheme();

  const switchForm = (formType) => {
    setActiveForm(formType);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className="flex-1 flex">
        {/* Left Side - Content */}
        <div className="w-1/2 p-12 flex flex-col justify-between">
          {/* Logo and Branding */}
          <div>
            <div className="flex items-center space-x-2">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-purple-500"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-transparent bg-clip-text">
                SynapseAI
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-md">
            <h1 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your AI-Powered Database Assistant
            </h1>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your databases with natural language. Let AI handle the complexity while you focus on what matters.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveForm('login')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all
                  ${activeForm === 'login'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveForm('signup')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all
                  ${activeForm === 'signup'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center space-x-6">
            <a href="#" className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
              Documentation
            </a>
            <a href="#" className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
              GitHub
            </a>
            <a href="#" className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-orange-500/10 backdrop-blur-3xl" />
          
          {/* Form Container */}
          <div className="relative h-full flex items-center justify-center p-12">
            <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl 
              ${isDark ? 'bg-[#242424] border border-gray-700' : 'bg-white'}`}
            >
              {activeForm === 'login' ? (
                <LoginForm onSwitchForm={() => switchForm('signup')} />
              ) : (
                <SignupForm onSwitchForm={() => switchForm('login')} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 