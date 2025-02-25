import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AIChat from '../components/dashboard/AIChat';
import Query from '../components/dashboard/Query';
import ConnectionModal from '../components/dashboard/ConnectionModal';
import DatabaseExplorer from '../components/dashboard/DatabaseExplorer';
import { useResizablePanel } from '../utils/hooks/useResizablePanel';
import { useTheme } from '../contexts/ThemeContext';
import invoker from '../utils/tauri/invoker';
import { getAllConnections, startListeningForConnectionEvents, getConnection } from '../utils/events/connection';
import Sidebar from '../components/layout/Sidebar';

// Dummy data oluştur
const generateDummyData = () => {
  const data = [];
  for (let i = 1; i <= 20; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      status: ['active', 'pending', 'archived'][Math.floor(Math.random() * 3)],
      type: ['user', 'admin', 'guest'][Math.floor(Math.random() * 3)],
      count: Math.floor(Math.random() * 1000)
    });
  }
  return data;
};

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [activeConnectionId, setActiveConnectionId] = useState(null);
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
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  // getAllConnections ile tüm bağlantıları al
  const connections = getAllConnections();
  console.log(connections)

  useEffect(() => {
    const cleanup = startListeningForConnectionEvents(setConnectionStatus, setActiveConnectionId);
    return cleanup;
  }, []);

  // Aktif bağlantıyı al
  const activeConnection = getConnection(activeConnectionId);

  const handleConnect = async (connectionDetails) => {
    const dbConfig = {
      config: {
        host: connectionDetails.host,
        port: connectionDetails.port,
        user: connectionDetails.username,
        password: connectionDetails.password,
        database: connectionDetails.database,
        db_type: connectionDetails.type,
        connection_name: connectionDetails.name
      }
    };

    try {
      setConnectionStatus({
        isLoading: true,
        message: 'Connecting to database...',
        type: 'loading'
      });
      
      await invoker('connect_database', dbConfig);
      // connectionStatus callback'i içinde connectionId set edilecek
      
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus({
        isLoading: false,
        message: `Connection failed: ${error.toString()}`,
        type: 'error'
      });
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
            

            {/* Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto">
              {connections.map((connection) => (
                <div key={connection.connectionInfo.name} className="flex items-center">
                  <button
                    onClick={() => setActiveConnectionId(connection.connectionId)}
                    className={`px-3 py-1.5 text-sm rounded-lg flex items-center space-x-2 transition-all ${
                      activeConnectionId === connection.connectionId
                        ? isDark 
                            ? 'text-white bg-blue-500/20 text-blue-400'
                            : 'bg-blue-50 text-blue-600'
                        : isDark
                            ? 'text-gray-400 hover:bg-gray-800'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{connection.connectionInfo.name}</span>
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
                    {/* Navigation Buttons */}
                    <button className="p-1.5 text-gray-400 hover:bg-gray-700 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
                    connectionId={activeConnectionId}
                    onSchemaSelect={setSelectedSchema}
                    onTableSelect={setSelectedTable}
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
                  {activeConnection ? (
                    <>
                      {/* Database Name */}
                      <span className="text-gray-400">
                        {activeConnection.connectionInfo.database}
                      </span>
                      
                      {selectedSchema && (
                        <>
                          <span className="text-gray-600">/</span>
                          {/* Schema Name */}
                          <span className="text-gray-400">
                            {selectedSchema}
                          </span>
                        </>
                      )}
                      
                      {selectedTable && (
                        <>
                          <span className="text-gray-600">/</span>
                          {/* Table Name */}
                          <span className="text-gray-200">
                            {selectedTable}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">No database selected</span>
                  )}
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
              <div className="p-4">
                <div className={`rounded-lg shadow-sm ${
                  isDark ? 'bg-[#242424]' : 'bg-white'
                }`}>
                  <div className={`p-4 border-b ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-medium ${
                      isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {selectedTable || 'No table selected'}
                    </h3>
                  </div>

                  {selectedTable && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={`text-sm ${isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'}`}>
                          <tr>
                            <th className={`sticky top-0 px-6 py-3.5 text-left font-medium ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>ID</th>
                            <th className={`sticky top-0 px-6 py-3.5 text-left font-medium ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Name</th>
                            <th className={`sticky top-0 px-6 py-3.5 text-left font-medium ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Created At</th>
                            <th className={`sticky top-0 px-6 py-3.5 text-left font-medium ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Status</th>
                            <th className={`sticky top-0 px-6 py-3.5 text-left font-medium ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Type</th>
                            <th className={`sticky top-0 px-6 py-3.5 text-left font-medium ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Count</th>
                            <th className={`sticky top-0 px-6 py-3.5 text-right font-medium ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                          {generateDummyData().map((row) => (
                            <tr 
                              key={row.id}
                              className={`text-sm transition-colors ${
                                isDark 
                                  ? 'hover:bg-gray-800/50' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className={`px-6 py-4 ${
                                isDark ? 'text-gray-300' : 'text-gray-900'
                              } font-medium`}>
                                #{row.id.toString().padStart(4, '0')}
                              </td>
                              <td className={`px-6 py-4 ${
                                isDark ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                                  }`}>
                                    <span className="text-sm font-medium">
                                      {row.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <span>{row.name}</span>
                                </div>
                              </td>
                              <td className={`px-6 py-4 ${
                                isDark ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                <div className="flex flex-col">
                                  <span>{new Date(row.created_at).toLocaleDateString()}</span>
                                  <span className={`text-xs ${
                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                  }`}>
                                    {new Date(row.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                  ${row.status === 'active' 
                                    ? isDark 
                                      ? 'bg-green-500/10 text-green-400' 
                                      : 'bg-green-100 text-green-800'
                                    : row.status === 'pending'
                                    ? isDark
                                      ? 'bg-yellow-500/10 text-yellow-400'
                                      : 'bg-yellow-100 text-yellow-800'
                                    : isDark
                                      ? 'bg-gray-500/10 text-gray-400'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5
                                    ${row.status === 'active' 
                                      ? 'bg-green-400' 
                                      : row.status === 'pending'
                                      ? 'bg-yellow-400'
                                      : 'bg-gray-400'
                                    }`}
                                  />
                                  {row.status}
                                </span>
                              </td>
                              <td className={`px-6 py-4 ${
                                isDark ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize
                                  ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                  {row.type}
                                </span>
                              </td>
                              <td className={`px-6 py-4 ${
                                isDark ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">{row.count}</span>
                                  <span className={`text-xs ${
                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                  }`}>items</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button className={`p-1.5 rounded-lg transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                  }`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                  <button className={`p-1.5 rounded-lg transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                  }`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button className={`p-1.5 rounded-lg transition-colors ${
                                    isDark 
                                      ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300' 
                                      : 'hover:bg-red-50 text-red-500 hover:text-red-700'
                                  }`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
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
              <AIChat activeConnection={connections.find(c => c.connectionId === activeConnectionId)} />
            ) : (
              <Query activeConnection={connections.find(c => c.connectionId === activeConnectionId)} />
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
                {activeConnectionId && connections.find(c => c.connectionId === activeConnectionId) && (
                  <>
                    <span className="text-sm font-medium">
                      Connected to: {connections.find(c => c.connectionId === activeConnectionId).connectionInfo.host}:{connections.find(c => c.connectionId === activeConnectionId).connectionInfo.port}
                    </span>
                    <span className="text-sm font-medium">
                      Database: {connections.find(c => c.connectionId === activeConnectionId).connectionInfo.database}
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