import { useState, useEffect } from 'react';
import { getConnection } from '../../services/connection';
import { useTheme } from '../../contexts/ThemeContext';
import invoker from '../../utils/tauri/invoker';
import { 
  FaDatabase, 
  FaTable, 
  FaProjectDiagram,
  FaSearch,
  FaColumns
} from 'react-icons/fa';
import { 
  BiCodeBlock, 
  BiCube 
} from 'react-icons/bi';
import { 
  VscSymbolClass, 
  VscPreview,
  VscTypeHierarchy
} from 'react-icons/vsc';
import { 
  TbBrandMongodb, 
  TbSql,
  TbColumnInsertRight
} from 'react-icons/tb';
import { getTableData } from '../../services/request';

const ChevronIcon = ({ isOpen }) => (
  <svg 
    className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const TreeItem = ({ label, icon, children, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div 
        className="flex items-center space-x-1.5 px-2 py-1.5 text-gray-400 hover:bg-gray-800 rounded cursor-pointer text-[13px] group"
        onClick={() => {
          setIsOpen(!isOpen);
          if (onClick) {
            onClick();
          }
        }}
      >
        {children && (
          <ChevronIcon isOpen={isOpen} className="w-3 h-3 text-gray-500 group-hover:text-gray-300" />
        )}
        <span className="w-3.5 h-3.5 flex items-center justify-center text-xs">{icon}</span>
        <span>{label}</span>
      </div>
      {isOpen && children && (
        <div className="ml-3 mt-0.5 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
};

export default function DatabaseExplorer({ 
  connectionId, 
  onSchemaSelect, 
  onTableSelect 
}) {
  const [schemas, setSchemas] = useState([]);
  const [expandedSchemas, setExpandedSchemas] = useState({});
  const [tables, setTables] = useState({});
  const [expandedTables, setExpandedTables] = useState({});
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const { isDark } = useTheme();

  const connection = getConnection(connectionId);

  useEffect(() => {
    // Reset state when connection changes
    setSelectedSchema(null);
    setSelectedTable(null);
  }, [connectionId]);

  const handleSchemaSelect = (schemaName) => {
    setSelectedSchema(schemaName);
    if (onSchemaSelect) {
      onSchemaSelect(schemaName);
    }
  };

  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    
    if (onTableSelect) {
      onTableSelect(tableName);
    }
  };

  // Sütun bilgilerini doğrudan DatabaseModel'den al
  const getColumnsForTable = (schema, table) => {
    if (!connection) return [];
    return connection.getColumnsByTable(schema, table);
  };

  if (!connection) {
    return (
      <div className="text-gray-500 text-sm p-4 text-center">
        No database connected
      </div>
    );
  }

  const getDBIcon = (type) => {
    switch (type) {
      case 'PostgreSQL':
        return <TbSql className="w-4 h-4 text-blue-400" />;
      case 'MongoDB':
        return <TbBrandMongodb className="w-4 h-4 text-green-500" />;
      case 'MySQL':
        return <TbSql className="w-4 h-4 text-orange-500" />;
      case 'MariaDB':
        return <TbSql className="w-4 h-4 text-brown-500" />;
      default:
        return <FaDatabase className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDataTypeIcon = (dataType) => {
    if (!dataType) return <span className="text-gray-400">?</span>;
    
    if (dataType.includes('int') || dataType.includes('numeric') || dataType.includes('decimal')) {
      return <span className="text-blue-400 font-mono text-[10px]">#</span>;
    } else if (dataType.includes('varchar') || dataType.includes('text') || dataType.includes('char')) {
      return <span className="text-green-400 font-mono text-[10px]">Aa</span>;
    } else if (dataType.includes('date') || dataType.includes('time')) {
      return <span className="text-purple-400 font-mono text-[10px]">T</span>;
    } else if (dataType.includes('bool')) {
      return <span className="text-yellow-400 font-mono text-[10px]">?</span>;
    } else if (dataType.includes('json') || dataType.includes('jsonb')) {
      return <span className="text-orange-400 font-mono text-[10px]">{}</span>;
    } else if (dataType.includes('uuid')) {
      return <span className="text-indigo-400 font-mono text-[10px]">ID</span>;
    } else {
      return <span className="text-gray-400 font-mono text-[10px]">?</span>;
    }
  };

  return (
    <div className="h-full">
      {connection.getSchemas().map(schema => (
        <TreeItem 
          key={schema.name} 
          label={schema.name} 
          icon={getDBIcon(connection.connectionInfo.type)}
          onClick={() => handleSchemaSelect(schema.name)}
        >
          {/* Tables */}
          <TreeItem 
            label="Tables" 
            icon={<FaTable className="w-4 h-4 text-blue-400" />}
          >
            {connection.getTablesBySchema(schema.name).map(table => (
              <TreeItem 
                key={table.name}
                label={table.name} 
                icon={<VscSymbolClass className="w-4 h-4 text-green-400" />}
                onClick={() => handleTableSelect(table.name)}
              >
                {/* Columns */}
                <TreeItem
                  label="Columns"
                  icon={<FaColumns className="w-3.5 h-3.5 text-purple-400" />}
                >
                  {getColumnsForTable(schema.name, table.name).map(column => (
                    <div 
                      key={column.name}
                      className="flex flex-col px-2 py-1 text-gray-400 hover:bg-gray-800 rounded text-[12px] group ml-3"
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-3 flex items-center justify-center text-[10px]">
                          {getDataTypeIcon(column.data_type)}
                        </span>
                        <span className="truncate max-w-[180px]">{column.name}</span>
                        
                        <div className="flex ml-auto">
                          {column.is_primary_key && (
                            <span className="text-[10px] text-yellow-400 ml-1 font-medium">PK</span>
                          )}
                          {column.is_foreign_key && (
                            <span className="text-[10px] text-blue-400 ml-1 font-medium">FK</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4 text-[10px] text-gray-500 opacity-70">
                        {column.data_type}
                      </div>
                    </div>
                  ))}
                </TreeItem>
              </TreeItem>
            ))}
          </TreeItem>

          {/* Functions */}
          <TreeItem 
            label="Functions" 
            icon={<BiCodeBlock className="w-4 h-4 text-yellow-400" />}
          >
            {connection.getFunctionsBySchema(schema.name).map(func => (
              <TreeItem 
                key={func.name}
                label={`${func.name}(${func.arguments})`} 
                icon={<BiCodeBlock className="w-4 h-4 text-yellow-400" />}
              />
            ))}
          </TreeItem>

          {/* Views */}
          {schema.views && (
            <TreeItem 
              label="Views" 
              icon={<VscPreview className="w-4 h-4 text-indigo-400" />}
            >
              {schema.views.map(view => (
                <TreeItem 
                  key={view.name}
                  label={view.name} 
                  icon={<VscPreview className="w-4 h-4 text-indigo-400" />}
                />
              ))}
            </TreeItem>
          )}

          {/* Indexes */}
          {schema.indexes && (
            <TreeItem 
              label="Indexes" 
              icon={<FaSearch className="w-4 h-4 text-pink-400" />}
            >
              {schema.indexes.map(index => (
                <TreeItem 
                  key={index.name}
                  label={index.name} 
                  icon={<FaSearch className="w-4 h-4 text-pink-400" />}
                />
              ))}
            </TreeItem>
          )}
        </TreeItem>
      ))}
    </div>
  );
} 