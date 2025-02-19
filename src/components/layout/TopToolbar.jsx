import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export default function TopToolbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <div className={`h-12 ${
      isDark 
        ? 'bg-[#242424] border-gray-700' 
        : 'bg-white border-gray-200'
      } border-b flex items-center px-4`}
    >
      <div className="flex items-center space-x-1">
        <button
          onClick={() => navigate('/dashboard')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            location.pathname === '/dashboard'
              ? isDark
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-blue-600 bg-blue-50'
              : isDark
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Database Management
        </button>
        <button
          onClick={() => navigate('/monitoring')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            location.pathname === '/monitoring'
              ? isDark
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-blue-600 bg-blue-50'
              : isDark
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Monitoring
        </button>
      </div>
    </div>
  );
} 