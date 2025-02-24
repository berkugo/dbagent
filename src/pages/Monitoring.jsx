import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/layout/Sidebar';

export default function Monitoring() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="ml-16">
        <div className="p-8">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Monitoring Dashboard
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  );
} 