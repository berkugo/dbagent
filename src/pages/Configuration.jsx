import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

export default function Configuration() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  const configOptions = [
    {
      id: 'cluster',
      name: 'Cluster Management',
      description: 'Configure and manage your PostgreSQL cluster settings',
      icon: (
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      color: 'bg-red-500/10 border-red-500/20',
      hoverColor: 'hover:bg-red-500/20',
      textColor: 'text-red-400'
    },
    {
      id: 'pgpool',
      name: 'PgPool Configuration',
      description: 'Manage connection pooling and load balancing settings',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
      color: 'bg-cyan-500/10 border-cyan-500/20',
      hoverColor: 'hover:bg-cyan-500/20',
      textColor: 'text-cyan-400'
    },
    {
      id: 'patroni',
      name: 'Patroni Configuration',
      description: 'Configure high-availability and automatic failover',
      icon: (
        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      color: 'bg-indigo-500/10 border-indigo-500/20',
      hoverColor: 'hover:bg-indigo-500/20',
      textColor: 'text-indigo-400'
    },
    {
      id: 'backup',
      name: 'Backup & Recovery',
      description: 'Configure automated backups and recovery options',
      icon: (
        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
      ),
      color: 'bg-green-500/10 border-green-500/20',
      hoverColor: 'hover:bg-green-500/20',
      textColor: 'text-green-400'
    },
    {
      id: 'security',
      name: 'Security Settings',
      description: 'Configure authentication, encryption and access control',
      icon: (
        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      color: 'bg-yellow-500/10 border-yellow-500/20',
      hoverColor: 'hover:bg-yellow-500/20',
      textColor: 'text-yellow-400'
    },
    {
      id: 'performance',
      name: 'Performance Tuning',
      description: 'Optimize database performance and resource utilization',
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'bg-purple-500/10 border-purple-500/20',
      hoverColor: 'hover:bg-purple-500/20',
      textColor: 'text-purple-400'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#1C1C1C] text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-16">
          <div className="container mx-auto px-4 py-8 flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold">Configuration</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {configOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`p-6 rounded-lg border ${option.color} ${option.hoverColor} transition-all duration-200 cursor-pointer ${
                    isDark ? 'bg-[#242424]' : 'bg-white'
                  }`}
                  onClick={() => navigate(`/configuration/${option.id}`)}
                >
                  <div className="flex items-start mb-4">
                    <div className="mr-4">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg font-medium ${option.textColor}`}>{option.name}</h3>
                      <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  );
} 