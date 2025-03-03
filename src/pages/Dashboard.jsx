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
import { getAllConnections, startListeningForConnectionEvents, getConnection } from '../services/connection';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

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
  const [isPanelFolded, setIsPanelFolded] = useState(false); // Panel katlanma durumu
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
  const [tableData, setTableData] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(false);

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

  const handleTableSelect = async (tableName) => {
    setSelectedTable(tableName);
    
    if (activeConnectionId && selectedSchema) {
      setIsTableLoading(true);
      try {
        const data = await invoker('get_table_data', { 
          client: activeConnectionId,
          connectionId: getConnection(activeConnectionId).connectionInfo.host + ":" + getConnection(activeConnectionId).connectionInfo.database,
          schema: selectedSchema,
          table: tableName,
          limit: 20,
          offset: 0
        });
        setTableData(data);
      } catch (error) {
        console.error('Failed to fetch table data:', error);
        // Hata durumunda tableData'yı null olarak ayarla
        setTableData(null);
      } finally {
        // Her durumda loading'i false yap
        setIsTableLoading(false);
      }
    }
  };

  // Redirect if not logged in
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-16 overflow-hidden">
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

           
          </header>

          <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Sidebar */}
              <aside className={`w-64 transition-all duration-300 flex flex-col ${
                isDark
                ? 'bg-[#242424] border-gray-700'
                : 'bg-white border-gray-200 shadow-sm'
              } border-r ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
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
                
                <div className="flex-1 overflow-auto">
                  <DatabaseExplorer 
                    connectionId={activeConnectionId}
                    onSchemaSelect={setSelectedSchema}
                    onTableSelect={handleTableSelect}
                  />
                </div>
              </aside>

              {/* Main Content */}
              <main className={`flex-1 flex flex-col overflow-hidden ${
                isDark ? 'bg-[#1C1C1C]' : 'bg-gray-50'
              }`}>
                {/* Content Header */}
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-200">
                      {activeConnectionId ? (
                        <>
                          {connections.find(c => c.connectionId === activeConnectionId)?.connectionInfo.name || 'Database'}
                        </>
                      ) : (
                        'Database Dashboard'
                      )}
                    </h1>
                    
                    {selectedTable && (
                      <div className="flex items-center ml-4">
                        <span className="text-gray-400 mx-2">/</span>
                        <span className="text-blue-400">{selectedTable}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {activeConnectionId ? (
                      <>
                        <button
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            !selectedTable 
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                          disabled={!selectedTable}
                          onClick={() => {
                            if (selectedTable) {
                              // Tablo ile ilgili işlem
                              console.log(`Performing action on ${selectedTable}`);
                            }
                          }}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3 3-3" />
                            </svg>
                            Export Data
                          </span>
                        </button>
                        
                        <button
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            !selectedTable 
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                          }`}
                          disabled={!selectedTable}
                          onClick={() => {
                            if (selectedTable) {
                              // Tablo ile ilgili işlem
                              console.log(`Refreshing ${selectedTable}`);
                            }
                          }}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                          </span>
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                        onClick={() => setIsConnectionModalOpen(true)}
                      >
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Connect Database
                        </span>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Content Body */}
                <div className="flex-1 overflow-hidden">
                  {activeConnectionId ? (
                    // Veritabanı bağlantısı varsa içerik
                    <div className="h-full overflow-auto p-4">
                      {selectedTable ? (
                        // Tablo seçiliyse tablo verilerini göster
                        <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col">
                          {isTableLoading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                              {/* Gelişmiş Yükleme Animasyonu */}
                              <div className="relative w-16 h-16">
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 border-opacity-20 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-l-blue-300 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                              </div>
                              <p className="mt-4 text-blue-400 text-sm font-medium">Loading table data...</p>
                              <p className="text-gray-500 text-xs mt-2">This may take a moment</p>
                            </div>
                          ) : tableData ? (
                            <div className="flex flex-col h-full">
                              <div className="flex-1 overflow-auto">
                                <table className="w-full divide-y divide-gray-700">
                                  <thead className="bg-gray-800 sticky top-0 z-10">
                                    <tr>
                                      {tableData.columns.map((column, index) => (
                                        <th 
                                          key={index}
                                          scope="col" 
                                          className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider whitespace-nowrap border-b border-gray-700"
                                        >
                                          <div className="flex items-center space-x-1">
                                            <span>{column.name}</span>
                                          </div>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {tableData.rows.map((row, rowIndex) => (
                                      <tr 
                                        key={rowIndex} 
                                        className={`hover:bg-indigo-900/20 transition-colors duration-150 ${rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}`}
                                      >
                                        {tableData.columns.map((column, colIndex) => {
                                          // Değerin türüne göre farklı stil uygula
                                          const value = row[column.name];
                                          let displayValue = JSON.stringify(value);
                                          let cellClass = "px-6 py-4 whitespace-nowrap text-sm text-gray-300";
                                          
                                          // Sayısal değerler için
                                          if (typeof value === 'number') {
                                            cellClass = "px-6 py-4 whitespace-nowrap text-sm text-emerald-300";
                                            displayValue = value;
                                          } 
                                          // Null değerler için
                                          else if (value === null) {
                                            cellClass = "px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic";
                                            displayValue = "null";
                                          }
                                          // Boolean değerler için
                                          else if (typeof value === 'boolean') {
                                            cellClass = "px-6 py-4 whitespace-nowrap text-sm";
                                            displayValue = value ? 
                                              <span className="text-emerald-300">true</span> : 
                                              <span className="text-rose-300">false</span>;
                                          }
                                          // String değerler için
                                          else if (typeof value === 'string') {
                                            // Tarih formatında ise
                                            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
                                              cellClass = "px-6 py-4 whitespace-nowrap text-sm text-amber-200";
                                              displayValue = value;
                                            } else {
                                              displayValue = value;
                                            }
                                          }
                                          
                                          return (
                                            <td key={colIndex} className={cellClass}>
                                              {displayValue}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="px-4 py-3 bg-gray-800 text-gray-300 text-sm border-t border-gray-700 flex justify-between items-center">
                                <div>
                                  Showing <span className="text-blue-300">{tableData.rows.length}</span> of <span className="text-blue-300">{tableData.total_rows}</span> rows
                                </div>
                                <div className="flex space-x-2">
                                  <button className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors">
                                    Previous
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors">
                                    Next
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 text-gray-400">No data available</div>
                          )}
                        </div>
                      ) : (
                        // Tablo seçili değilse bilgi mesajı göster
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                          <h3 className="text-xl font-medium text-gray-300 mb-2">Select a table to view data</h3>
                          <p className="text-gray-500 max-w-md">
                            Choose a table from the database explorer on the left to view and interact with your data.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Veritabanı bağlantısı yoksa bağlantı mesajı
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <svg className="w-20 h-20 text-gray-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      <h2 className="text-2xl font-bold text-gray-300 mb-2">Connect to a Database</h2>
                      <p className="text-gray-500 max-w-md mb-6">
                        Start by connecting to a database to explore tables, run queries, and analyze your data with AI assistance.
                      </p>
                      <button
                        onClick={() => setIsConnectionModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Connect Now
                      </button>
                    </div>
                  )}
                </div>
              </main>
            </div>

            {/* Panel Toggle */}
            <div className={`border-t flex items-center justify-between px-4 ${
              isDark
              ? 'bg-[#242424] border-gray-700'
              : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className="flex">
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
              
              {/* Fold/Unfold Button */}
              <button 
                onClick={() => setIsPanelFolded(!isPanelFolded)}
                className="text-gray-400 hover:text-gray-300 p-1 rounded-md hover:bg-gray-700/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isPanelFolded ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} 
                  />
                </svg>
              </button>
            </div>

            {/* Resizable Handle - sadece panel açıkken göster */}
            {!isPanelFolded && (
              <div {...resizeHandleProps}>
                <div className="w-20 h-1 rounded-full bg-gray-600 group-hover:bg-blue-500/50" />
              </div>
            )}

            {/* Panels - sadece panel açıkken göster */}
            {!isPanelFolded && (
              <div {...panelProps}>
                {activePanel === 'ai' ? (
                  <AIChat activeConnection={connections.find(c => c.connectionId === activeConnectionId)} />
                ) : (
                  <Query activeConnection={connections.find(c => c.connectionId === activeConnectionId)} />
                )}
              </div>
            )}

            {/* Footer */}
            <Footer 
              activeConnectionId={activeConnectionId}
              connections={connections}
              connectionStatus={connectionStatus}
            />
          </div>
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