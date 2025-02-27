import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <aside className={`fixed left-0 top-0 h-full w-16 flex flex-col ${
      isDark
        ? 'bg-[#242424] border-gray-700'
        : 'bg-white border-gray-200'
      } border-r z-50`}>
      
      
      {/* Nav Items */}
      <div className="flex-1 py-4">
        <nav className="space-y-2">
          {/* Profile Button - Moved to top */}
          <button 
            className={`w-full p-3 flex justify-center group relative transition-all duration-200 ${
              location.pathname === '/profile'
                ? 'text-green-400 bg-green-500/10'
                : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
            }`}
            onClick={() => navigate('/profile')}
          >
            {/* Profile Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-900/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Profile
            </span>
            {location.pathname === '/profile' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-green-400 rounded-full" />
            )}
          </button>

          <button 
            className={`w-full p-3 flex justify-center group relative transition-all duration-200 ${
              location.pathname === '/dashboard'
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
            }`}
            onClick={() => navigate('/dashboard')}
          >
            {/* Database Management Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 7c0-1.1.9-2 2-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V7zm0 6c0-1.1.9-2 2-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm0 6c0-1.1.9-2 2-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-900/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Management
            </span>
            {location.pathname === '/dashboard' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-full" />
            )}
          </button>

          <button 
            className={`w-full p-3 flex justify-center group relative transition-all duration-200 ${
              location.pathname === '/monitoring'
                ? 'text-purple-400 bg-purple-500/10'
                : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10'
            }`}
            onClick={() => navigate('/monitoring')}
          >
            {/* Monitoring/Analytics Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-900/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Monitoring
            </span>
            {location.pathname === '/monitoring' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-purple-400 rounded-full" />
            )}
          </button>

          {/* Configuration Button - Tek bir seçenek */}
          <button 
            className={`w-full p-3 flex justify-center group relative transition-all duration-200 ${
              location.pathname === '/configuration'
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-gray-400 hover:text-amber-400 hover:bg-amber-500/10'
            }`}
            onClick={() => navigate('/configuration')}
          >
            {/* Configuration Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-900/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Configuration
            </span>
            {location.pathname === '/configuration' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* Theme Toggle & Logout */}
      <div className="p-3 border-t border-gray-700 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full p-3 text-gray-400 hover:text-gray-300 flex justify-center group relative"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
          <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Toggle Theme
          </span>
        </button>

        <button
          onClick={logout}
          className="w-full p-3 text-gray-400 hover:text-gray-300 flex justify-center group relative"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
} 