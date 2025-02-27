import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

export default function Monitoring() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'}`}>
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-16">
          <div className="p-8 flex-1">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Monitoring Dashboard
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Coming soon...
            </p>
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  );
} 