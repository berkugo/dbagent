import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AIChat from '../components/dashboard/AIChat';
import Query from '../components/dashboard/Query';
import ConnectionModal from '../components/dashboard/ConnectionModal';
import DatabaseExplorer from '../components/dashboard/DatabaseExplorer';
import TopToolbar from '../components/layout/TopToolbar';
import { useResizablePanel } from '../utils/hooks/useResizablePanel';
import { useTheme } from '../contexts/ThemeContext';
import invoker from '../utils/tauri/invoker';
import startListeningForConnectionEvents from '../utils/events/connection';
import Sidebar from '../components/layout/Sidebar';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [activePanel, setActivePanel] = useState('ai'); // 'ai' or 'query'
  const [connectionStatus, setConnectionStatus] = useState({
    isLoading: false,
    message: '',
    type: 'idle' // 'idle' | 'loading' | 'success' | 'error'
  });
  const { isDark, toggleTheme } = useTheme();
  const { 
    panelHeight, 
    resizeHandleProps, 
    panelProps 
  } = useResizablePanel();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cleanup = startListeningForConnectionEvents(setConnectionStatus);
    return cleanup;
  }, []);

  const handleConnect = async (connectionDetails) => {
    const dbConfig = {
      config: {
        host: connectionDetails.host,
        port: connectionDetails.port, // This is already parsed as integer in modal
        user: connectionDetails.username,
        password: connectionDetails.password,
        database: connectionDetails.database,
        db_type: connectionDetails.type
      }
    };


    
    try {
      setConnectionStatus({
        isLoading: true,
        message: 'Connecting to database...',
        type: 'loading'
      });
      await invoker('connect_database', dbConfig);

      // Add the new connection to the connections list
      const newConnection = {
        id: Date.now().toString(), // temporary ID
        name: connectionDetails.name,
        host: connectionDetails.host,
        port: connectionDetails.port,
        database: connectionDetails.database,
        type: connectionDetails.type
      };
      
      setConnections(prev => [...prev, newConnection]);
      setActiveConnection(newConnection.id);
      
      setIsConnectionModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus({
        isLoading: false,
        message: `Connection failed: ${error.toString()}`,
        type: 'error'
      });
    }
  };

  const handleCloseConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    if (activeConnection === connectionId) {
      setActiveConnection(connections[0]?.id || null);
    }
  };

  // Redirect if not logged in
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="ml-16">
        {/* App Bar */}
        <header className={`h-14 border-b ${
          isDark 
            ? 'bg-[#242424] border-gray-700' 
            : 'bg-white border-gray-200 shadow-sm'
          } flex items-center px-4 transition-colors duration-200`}>
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-1 font-bold text-lg">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-purple-500"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div>
              </div>
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-transparent bg-clip-text">
                DBMind
              </span>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-1.5 text-gray-400 hover:bg-gray-700 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1.5 text-gray-400 hover:bg-gray-700 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto">
              {connections.map((conn) => (
                <div key={conn.id} className="flex items-center">
                  <button
                    onClick={() => setActiveConnection(conn.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg flex items-center space-x-2 transition-all ${
                      activeConnection === conn.id
                        ? isDark 
                            ? 'text-white bg-blue-500/20 text-blue-400'
                            : 'bg-blue-50 text-blue-600'
                        : isDark
                            ? 'text-gray-400 hover:bg-gray-800'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{conn.type === 'PostgreSQL' ? '🐘' : conn.type === 'MongoDB' ? '🍃' : '💾'}</span>
                    <span>{conn.name}</span>
                    {/* Close button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseConnection(conn.id);
                      }}
                      className="ml-2 p-0.5 hover:bg-gray-600 rounded"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </button>
                </div>
              ))}
              
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="ml-auto flex items-center space-x-3">
            <button 
              onClick={() => setIsConnectionModalOpen(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isDark
                ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20'
                : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <span>Create Connection</span>
            </button>
          </div>
        </header>

        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
          <div className="flex flex-1 min-h-0">
            {/* Sidebar */}
            <aside className={`w-64 transition-all duration-300 ${
              isDark
              ? 'bg-[#242424] border-gray-700'
              : 'bg-white border-gray-200 shadow-sm'
            } border-r ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-gray-200 font-medium">Database Explorer</h2>
                    <button className="p-1 text-gray-400 hover:bg-gray-700 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search database objects..."
                      className="w-full bg-[#242424] text-gray-200 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <DatabaseExplorer 
                    connection={connections.find(c => c.id === activeConnection)}
                  />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 overflow-auto ${
              isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'
            }`}>
              {/* Breadcrumb & Actions */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-400">solarsystem.bd</span>
                  <span className="text-gray-600">/</span>
                  <span className="text-gray-400">JIRA-3 List countries</span>
                  <span className="text-gray-600">/</span>
                  <span className="text-gray-200">Planets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1.5 text-gray-400 hover:bg-gray-700 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  </button>
                  <button className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Export
                  </button>
                </div>
              </div>

              {/* Document View */}

            </main>
          </div>

          {/* Panel Toggle */}
          <div className={`border-t flex items-center px-4 ${
            isDark
            ? 'bg-[#242424] border-gray-700'
            : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <button
              onClick={() => setActivePanel('ai')}
              className={`px-4 py-2.5 text-sm font-medium relative ${
                activePanel === 'ai'
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI Assistant</span>
              </div>
              {activePanel === 'ai' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActivePanel('query')}
              className={`px-4 py-2.5 text-sm font-medium relative ${
                activePanel === 'query'
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                </svg>
                <span>Query Editor</span>
              </div>
              {activePanel === 'query' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
          </div>

          {/* Resizable Handle */}
          <div {...resizeHandleProps}>
            <div className="w-20 h-1 rounded-full bg-gray-600 group-hover:bg-blue-500/50" />
          </div>

          {/* Panels */}
          <div {...panelProps}>
            {activePanel === 'ai' ? (
              <AIChat activeConnection={connections.find(c => c.id === activeConnection)} />
            ) : (
              <Query activeConnection={connections.find(c => c.id === activeConnection)} />
            )}
          </div>

          {/* Footer */}
          <footer className={`text-sm px-4 py-2 border-t ${
            isDark
            ? 'bg-[#242424] text-gray-400 border-gray-700'
            : 'bg-white text-gray-600 border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {activeConnection && connections.find(c => c.id === activeConnection) && (
                  <>
                    <span className="text-sm font-medium">
                      Connected to: {connections.find(c => c.id === activeConnection).host}:{connections.find(c => c.id === activeConnection).port}
                    </span>
                    <span className="text-sm font-medium">
                      Database: {connections.find(c => c.id === activeConnection).database}
                    </span>
                  </>
                )}
                {connectionStatus.message && (
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
        </div>
      </div>

      <ConnectionModal 
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        onConnect={handleConnect}
      />
    </div>
  );
} 