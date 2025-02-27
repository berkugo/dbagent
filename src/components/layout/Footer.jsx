import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Footer({ activeConnectionId, connections, connectionStatus }) {
  const { isDark } = useTheme();

  return (
    <footer className={`text-sm px-4 py-2 border-t ${
      isDark
      ? 'bg-[#242424] text-gray-400 border-gray-700'
      : 'bg-white text-gray-600 border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {activeConnectionId && connections && connections.find(c => c.connectionId === activeConnectionId) && (
            <>
              <span className="text-sm font-medium">
                Connected to: {connections.find(c => c.connectionId === activeConnectionId).connectionInfo.host}:{connections.find(c => c.connectionId === activeConnectionId).connectionInfo.port}
              </span>
              <span className="text-sm font-medium">
                Database: {connections.find(c => c.connectionId === activeConnectionId).connectionInfo.database}
              </span>
            </>
          )}
          {connectionStatus && connectionStatus.message && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border
              ${connectionStatus.type === 'error' 
                ? 'bg-red-950/30 text-red-400 border-red-800/30' :
              connectionStatus.type === 'success' 
                ? 'bg-green-950/30 text-green-400 border-green-800/30' :
              connectionStatus.type === 'loading' 
                ? 'bg-blue-950/30 text-blue-400 border-blue-800/30' : 
                'bg-gray-800/30 text-gray-400 border-gray-700/30'
              }`
            }>
              {connectionStatus.isLoading ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none" 
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                  />
                </svg>
              ) : (
                <span className="flex-shrink-0">
                  {connectionStatus.type === 'error' && 
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  {connectionStatus.type === 'success' && 
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                </span>
              )}
              <span className="truncate">
                {connectionStatus.message}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>Version 1.0.0</span>
          <a 
            href="https://github.com/yourusername/yourrepo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
} 