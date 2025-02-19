import { useTheme } from '../contexts/ThemeContext';
import TopToolbar from '../components/layout/TopToolbar';

export default function Monitoring() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'}`}>
      <TopToolbar />
      <header className={`h-14 ${
        isDark 
          ? 'bg-[#242424] border-gray-700' 
          : 'bg-white border-gray-200 shadow-sm'
        } border-b flex items-center px-4 transition-colors duration-200`}>
        <div className="flex items-center space-x-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-purple-500"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-transparent bg-clip-text">
            SynapseAI
          </span>
        </div>
      </header>
      
      <div className="p-8">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Monitoring Dashboard
        </h1>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Coming soon...
        </p>
      </div>
    </div>
  );
} 