import { useState, useEffect } from 'react';
import { getConnection } from '../../utils/events/connection';
import { useTheme } from '../../contexts/ThemeContext';
import invoker from '../../utils/tauri/invoker';
import { 
  FaDatabase, 
  FaTable, 
  FaProjectDiagram,
  FaSearch 
} from 'react-icons/fa';
import { 
  BiCodeBlock, 
  BiCube 
} from 'react-icons/bi';
import { 
  VscSymbolClass, 
  VscPreview 
} from 'react-icons/vsc';
import { 
  TbBrandMongodb, 
  TbSql 
} from 'react-icons/tb';

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

  console.log("connectionid", connectionId)
  const connection = getConnection(connectionId);

  if (!connection) {
    console.log(connection)
    return (
      <div className="text-gray-500 text-sm p-4 text-center">
        No database connected
      </div>
    );
  }

  const getDBIcon = (type) => {
    switch (type) {
      case 'PostgreSQL':
        return <TbBrandMongodb className="w-4 h-4 text-blue-400" />;
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

  return (
    <div className="h-full">
      {connection.getSchemas().map(schema => (
        <TreeItem 
          key={schema.name} 
          label={schema.name} 
          icon={getDBIcon(connection.connectionInfo.type)}
          onClick={() => onSchemaSelect(schema.name)}
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
                onClick={() => onTableSelect(table.name)}
              />
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