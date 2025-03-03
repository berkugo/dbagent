import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { FaRobot, FaDatabase, FaServer, FaShieldAlt, FaChartLine, FaTools } from 'react-icons/fa';

export default function Configuration() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('agents');

  const agentOptions = [
    {
      id: 'db-admin',
      name: 'Database Administration Agent',
      description: 'Automates routine database administration tasks and provides optimization recommendations',
      icon: <FaDatabase className="w-8 h-8 text-blue-400" />,
      color: 'bg-blue-500/10 border-blue-500/20',
      hoverColor: 'hover:bg-blue-500/20',
      textColor: 'text-blue-400',
      capabilities: ['Schema optimization', 'Index management', 'Query tuning', 'Storage management']
    },
    {
      id: 'monitoring',
      name: 'Performance Monitoring Agent',
      description: 'Monitors database performance metrics and suggests improvements',
      icon: <FaChartLine className="w-8 h-8 text-green-400" />,
      color: 'bg-green-500/10 border-green-500/20',
      hoverColor: 'hover:bg-green-500/20',
      textColor: 'text-green-400',
      capabilities: ['Performance analysis', 'Bottleneck detection', 'Resource utilization', 'Trend analysis']
    },
    {
      id: 'security',
      name: 'Security & Compliance Agent',
      description: 'Ensures database security best practices and compliance requirements',
      icon: <FaShieldAlt className="w-8 h-8 text-red-400" />,
      color: 'bg-red-500/10 border-red-500/20',
      hoverColor: 'hover:bg-red-500/20',
      textColor: 'text-red-400',
      capabilities: ['Access control audit', 'Vulnerability scanning', 'Compliance checks', 'Security recommendations']
    },
    {
      id: 'ha-cluster',
      name: 'High Availability Agent',
      description: 'Manages database clustering, replication, and failover configurations',
      icon: <FaServer className="w-8 h-8 text-purple-400" />,
      color: 'bg-purple-500/10 border-purple-500/20',
      hoverColor: 'hover:bg-purple-500/20',
      textColor: 'text-purple-400',
      capabilities: ['Replication management', 'Failover configuration', 'Load balancing', 'Cluster monitoring']
    },
    {
      id: 'maintenance',
      name: 'Maintenance Agent',
      description: 'Schedules and performs routine maintenance tasks automatically',
      icon: <FaTools className="w-8 h-8 text-amber-400" />,
      color: 'bg-amber-500/10 border-amber-500/20',
      hoverColor: 'hover:bg-amber-500/20',
      textColor: 'text-amber-400',
      capabilities: ['Vacuum operations', 'Index rebuilding', 'Statistics updates', 'Backup management']
    },
    {
      id: 'custom',
      name: 'Custom AI Agent',
      description: 'Create your own specialized AI agent with custom capabilities',
      icon: <FaRobot className="w-8 h-8 text-cyan-400" />,
      color: 'bg-cyan-500/10 border-cyan-500/20',
      hoverColor: 'hover:bg-cyan-500/20',
      textColor: 'text-cyan-400',
      capabilities: ['Custom workflows', 'Specialized tasks', 'Integration with other tools']
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'}`}>
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-16">
          <div className="p-8 flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-gray-200">AI Database Agents</h1>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                onClick={() => navigate('/configuration/create-agent')}
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Agent
                </span>
              </button>
            </div>

            <p className="text-gray-400 mb-8 max-w-3xl">
              AI Database Agents automate complex database management tasks, provide intelligent recommendations, 
              and continuously optimize your database environment. Select an agent to configure or deploy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentOptions.map((agent) => (
                <div 
                  key={agent.id}
                  className={`p-6 rounded-lg border ${agent.color} ${agent.hoverColor} transition-all duration-200 cursor-pointer flex flex-col h-full ${
                    isDark ? 'bg-[#242424]' : 'bg-white'
                  }`}
                  onClick={() => navigate(`/configuration/agent/${agent.id}`)}
                >
                  <div className="flex items-start mb-4">
                    <div className="mr-4 flex-shrink-0">
                      {agent.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg font-medium ${agent.textColor}`}>{agent.name}</h3>
                      <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {agent.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-700">
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Capabilities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {agent.capabilities.map((capability, index) => (
                        <span 
                          key={index} 
                          className={`text-xs px-2 py-1 rounded-md ${agent.color} ${agent.textColor} text-center truncate`}
                        >
                          {capability}
                        </span>
                      ))}
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