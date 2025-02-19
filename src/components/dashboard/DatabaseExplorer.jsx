import { useState } from 'react';

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

const TreeItem = ({ label, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div 
        className="flex items-center space-x-1.5 px-2 py-1.5 text-gray-400 hover:bg-gray-800 rounded cursor-pointer text-[13px] group"
        onClick={() => setIsOpen(!isOpen)}
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

export default function DatabaseExplorer({ connection }) {
  if (!connection) {
    return (
      <div className="text-gray-500 text-sm p-4 text-center">
        No database connected
      </div>
    );
  }

  const getDBIcon = (type) => {
    switch (type) {
      case 'PostgreSQL': return '🐘';
      case 'MongoDB': return '🍃';
      case 'MySQL': return '🐬';
      case 'MariaDB': return '🐋';
      default: return '📁';
    }
  };

  return (
    <div className="p-4 space-y-2">
      <TreeItem 
        label={connection.name} 
        icon={getDBIcon(connection.type)}
      >
        <TreeItem label="Tables" icon="📋">
          <TreeItem label="users" icon="🗃️" />
          <TreeItem label="products" icon="🗃️" />
          <TreeItem label="orders" icon="🗃️" />
        </TreeItem>
        
        <TreeItem label="Views" icon="👁️">
          <TreeItem label="active_users" icon="📊" />
          <TreeItem label="monthly_sales" icon="📊" />
        </TreeItem>
        
        <TreeItem label="Functions" icon="⚡">
          <TreeItem label="calculate_total" icon="λ" />
          <TreeItem label="update_timestamp" icon="λ" />
        </TreeItem>
        
        <TreeItem label="Triggers" icon="🔄">
          <TreeItem label="before_insert_users" icon="⚡" />
          <TreeItem label="after_update_orders" icon="⚡" />
        </TreeItem>
        
        <TreeItem label="Indexes" icon="🔍">
          <TreeItem label="idx_users_email" icon="📇" />
          <TreeItem label="idx_orders_date" icon="📇" />
        </TreeItem>

        {connection.type === 'PostgreSQL' && (
          <>
            <TreeItem label="Schemas" icon="📚">
              <TreeItem label="public" icon="📂" />
              <TreeItem label="auth" icon="📂" />
            </TreeItem>
            
            <TreeItem label="Extensions" icon="🧩">
              <TreeItem label="uuid-ossp" icon="📦" />
              <TreeItem label="pgcrypto" icon="📦" />
            </TreeItem>
          </>
        )}

        {connection.type === 'MongoDB' && (
          <>
            <TreeItem label="Collections" icon="📚">
              <TreeItem label="users" icon="📂" />
              <TreeItem label="products" icon="📂" />
            </TreeItem>
            
            <TreeItem label="Indexes" icon="🔍">
              <TreeItem label="users_email_1" icon="📇" />
              <TreeItem label="products_sku_1" icon="📇" />
            </TreeItem>
          </>
        )}
      </TreeItem>
    </div>
  );
} 