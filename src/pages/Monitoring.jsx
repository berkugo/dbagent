import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { 
  FaServer, 
  FaChartLine, 
  FaExclamationTriangle, 
  FaDatabase, 
  FaNetworkWired, 
  FaCloudDownloadAlt,
  FaChartBar,
  FaChartPie,
  FaSearch,
  FaDog,
  FaRocket
} from 'react-icons/fa';

export default function Monitoring() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const monitoringTools = [
    {
      id: 'zabbix',
      name: 'Zabbix',
      description: 'Enterprise-class open source distributed monitoring solution',
      icon: <FaServer className="w-10 h-10 text-red-500" />,
      color: 'bg-red-500/10 border-red-500/20',
      hoverColor: 'hover:bg-red-500/20',
      textColor: 'text-red-400',
      metrics: [
        { name: 'Servers Monitored', value: '24', trend: 'up' },
        { name: 'Active Alerts', value: '3', trend: 'down' },
        { name: 'Uptime', value: '99.8%', trend: 'stable' }
      ],
      status: 'connected'
    },
    {
      id: 'grafana',
      name: 'Grafana',
      description: 'Multi-platform open source analytics and interactive visualization',
      icon: <FaChartPie className="w-10 h-10 text-orange-500" />,
      color: 'bg-orange-500/10 border-orange-500/20',
      hoverColor: 'hover:bg-orange-500/20',
      textColor: 'text-orange-400',
      metrics: [
        { name: 'Active Dashboards', value: '12', trend: 'up' },
        { name: 'Data Sources', value: '5', trend: 'stable' },
        { name: 'Users', value: '8', trend: 'up' }
      ],
      status: 'connected'
    },
    {
      id: 'prometheus',
      name: 'Prometheus',
      description: 'Open-source systems monitoring and alerting toolkit',
      icon: <FaChartBar className="w-10 h-10 text-amber-500" />,
      color: 'bg-amber-500/10 border-amber-500/20',
      hoverColor: 'hover:bg-amber-500/20',
      textColor: 'text-amber-400',
      metrics: [
        { name: 'Time Series', value: '1.2M', trend: 'up' },
        { name: 'Alerts Configured', value: '45', trend: 'up' },
        { name: 'Scrape Targets', value: '120', trend: 'stable' }
      ],
      status: 'connected'
    },
    {
      id: 'elasticsearch',
      name: 'Elasticsearch',
      description: 'Distributed, RESTful search and analytics engine',
      icon: <FaSearch className="w-10 h-10 text-blue-500" />,
      color: 'bg-blue-500/10 border-blue-500/20',
      hoverColor: 'hover:bg-blue-500/20',
      textColor: 'text-blue-400',
      metrics: [
        { name: 'Indices', value: '32', trend: 'stable' },
        { name: 'Documents', value: '15.4M', trend: 'up' },
        { name: 'Cluster Health', value: 'Green', trend: 'stable' }
      ],
      status: 'connected'
    },
    {
      id: 'datadog',
      name: 'Datadog',
      description: 'Monitoring and security platform for cloud applications',
      icon: <FaDog className="w-10 h-10 text-purple-500" />,
      color: 'bg-purple-500/10 border-purple-500/20',
      hoverColor: 'hover:bg-purple-500/20',
      textColor: 'text-purple-400',
      metrics: [
        { name: 'Hosts', value: '18', trend: 'up' },
        { name: 'Monitors', value: '56', trend: 'up' },
        { name: 'Events/day', value: '2.3K', trend: 'up' }
      ],
      status: 'disconnected'
    },
    {
      id: 'newrelic',
      name: 'New Relic',
      description: 'Observability platform built to help engineers create perfect software',
      icon: <FaRocket className="w-10 h-10 text-green-500" />,
      color: 'bg-green-500/10 border-green-500/20',
      hoverColor: 'hover:bg-green-500/20',
      textColor: 'text-green-400',
      metrics: [
        { name: 'Applications', value: '7', trend: 'stable' },
        { name: 'Transactions', value: '1.8M', trend: 'up' },
        { name: 'Error Rate', value: '0.02%', trend: 'down' }
      ],
      status: 'disconnected'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-400">↑</span>;
      case 'down':
        return <span className="text-red-400">↓</span>;
      case 'stable':
        return <span className="text-gray-400">→</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'}`}>
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-16">
          <div className="p-8 flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-200">Database Monitoring</h1>
                <p className="text-gray-400 mt-1">
                  Connect and monitor your database infrastructure with popular monitoring tools
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                  <span className="flex items-center">
                    <FaCloudDownloadAlt className="w-4 h-4 mr-1.5" />
                    Connect Tool
                  </span>
                </button>
                <button className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                  <span className="flex items-center">
                    <FaChartLine className="w-4 h-4 mr-1.5" />
                    View Dashboard
                  </span>
                </button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-6 rounded-lg border border-gray-700 ${isDark ? 'bg-[#242424]' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-500/20 mr-4">
                    <FaServer className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm font-medium">Servers Monitored</h3>
                    <p className="text-2xl font-semibold text-gray-200 mt-1">24</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-green-400 text-sm flex items-center">
                    <span className="mr-1">↑</span> 2 new servers added this week
                  </span>
                </div>
              </div>
              
              <div className={`p-6 rounded-lg border border-gray-700 ${isDark ? 'bg-[#242424]' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-amber-500/20 mr-4">
                    <FaExclamationTriangle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm font-medium">Active Alerts</h3>
                    <p className="text-2xl font-semibold text-gray-200 mt-1">7</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-red-400 text-sm flex items-center">
                    <span className="mr-1">↑</span> 3 critical alerts need attention
                  </span>
                </div>
              </div>
              
              <div className={`p-6 rounded-lg border border-gray-700 ${isDark ? 'bg-[#242424]' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-500/20 mr-4">
                    <FaDatabase className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm font-medium">Database Health</h3>
                    <p className="text-2xl font-semibold text-gray-200 mt-1">92%</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-green-400 text-sm flex items-center">
                    <span className="mr-1">↑</span> Improved by 4% since last week
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`px-4 py-2 text-sm font-medium relative ${
                  activeTab === 'overview' 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
                {activeTab === 'overview' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                )}
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium relative ${
                  activeTab === 'tools' 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('tools')}
              >
                Monitoring Tools
                {activeTab === 'tools' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                )}
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium relative ${
                  activeTab === 'alerts' 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('alerts')}
              >
                Alerts
                {activeTab === 'alerts' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                )}
              </button>
            </div>

            {/* Monitoring Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monitoringTools.map((tool) => (
                <div 
                  key={tool.id}
                  className={`p-6 rounded-lg border ${tool.color} transition-all duration-200 cursor-pointer ${tool.hoverColor} ${
                    isDark ? 'bg-[#242424]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start mb-4">
                    <div className="mr-4 flex-shrink-0">
                      {tool.icon}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className={`text-lg font-medium ${tool.textColor}`}>{tool.name}</h3>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                          tool.status === 'connected' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {tool.status === 'connected' ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-3 gap-2">
                      {tool.metrics.map((metric, index) => (
                        <div key={index} className="text-center">
                          <p className="text-xs text-gray-500 mb-1">{metric.name}</p>
                          <p className="text-lg font-semibold text-gray-200 flex items-center justify-center">
                            {metric.value} {getTrendIcon(metric.trend)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 flex justify-end">
                    <button className={`px-3 py-1 text-xs rounded-md ${
                      tool.status === 'connected' 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : `${tool.color} ${tool.textColor} ${tool.hoverColor}`
                    }`}>
                      {tool.status === 'connected' ? 'View Details' : 'Connect'}
                    </button>
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