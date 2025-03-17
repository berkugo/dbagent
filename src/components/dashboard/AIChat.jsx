import { useState, useRef, useEffect } from 'react';
import { getAllConnections } from '../../services/connection';
import { FaDatabase, FaTable, FaColumns } from 'react-icons/fa';
import { generateGeminiResponse } from '../../services/gemini';

export default function AIChat({ activeConnection }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState('deepseek');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'schema', 'table', 'column'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const contextMenuRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Context menu dışına tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Input alanına tıklandığında menüyü kapatma
      if (inputRef.current && inputRef.current.contains(event.target)) {
        return;
      }
      
      // Context menu dışına tıklandığında menüyü kapat
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Input değiştiğinde @ işaretini kontrol et
  useEffect(() => {
    if (!inputRef.current) return;
    
    const checkForMention = () => {
      const lastAtIndex = input.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        // @ işareti bulundu
        const cursorPosition = inputRef.current.selectionStart;
        
        // @ işaretinden sonraki metni kontrol et
        const textAfterAt = input.substring(lastAtIndex + 1, cursorPosition);
        
        // Eğer @ işaretinden sonra boşluk varsa veya cursor @ işaretinden önce ise context menu'yü kapat
        if (textAfterAt.includes(' ') || cursorPosition <= lastAtIndex) {
          setShowContextMenu(false);
          return;
        }
        
        // @ işareti ya başta ya da boşluktan sonra olmalı
        if (lastAtIndex === 0 || input[lastAtIndex - 1] === ' ') {
          // Cursor @ işaretinden sonra
          const rect = inputRef.current.getBoundingClientRect();
          
          // @ işaretinden sonraki metni arama terimi olarak kullan
          const searchText = textAfterAt;
          setSearchTerm(searchText);
          
          // Context menu'yü göster
          setShowContextMenu(true);
          
          // Context menu pozisyonunu ayarla
          setContextMenuPosition({
            x: rect.left + 10,
            y: rect.top - 10
          });
        } else {
          setShowContextMenu(false);
        }
      } else {
        setShowContextMenu(false);
      }
    };
    
    checkForMention();
  }, [input]);

  // Context menu'nün konumlandırılması için useEffect
  useEffect(() => {
    if (!inputRef.current || !showContextMenu || !contextMenuRef.current) return;
    
    const updateContextMenuPosition = () => {
      const inputRect = inputRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      
      // Context menu'nün gerçek boyutlarını al
      const contextMenuRect = contextMenuRef.current.getBoundingClientRect();
      const contextMenuHeight = contextMenuRect.height || 300; // Fallback olarak 300px
      const contextMenuWidth = contextMenuRect.width || 320; // Fallback olarak 320px
      
      // Yatay konumlandırma
      let xPos = inputRect.left + 10;
      // Sağ tarafta taşma kontrolü
      if (xPos + contextMenuWidth > windowWidth) {
        xPos = windowWidth - contextMenuWidth - 10;
      }
      
      // Dikey konumlandırma
      let yPos;
      const spaceBelow = windowHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;
      
      // Aşağıda yeterli alan var mı?
      if (spaceBelow >= contextMenuHeight + 10) {
        // Aşağıda göster
        yPos = inputRect.bottom + 10;
      } else if (spaceAbove >= contextMenuHeight + 10) {
        // Yukarıda göster
        yPos = inputRect.top - contextMenuHeight - 10;
      } else {
        // Ne aşağıda ne yukarıda yeterli alan yok, en iyi konumu seç
        if (spaceBelow >= spaceAbove) {
          // Aşağıda daha fazla alan var, aşağıda göster ama sınırla
          yPos = inputRect.bottom + 10;
          // Context menu'yü pencere sınırlarına sığdır
          contextMenuRef.current.style.maxHeight = `${spaceBelow - 20}px`;
        } else {
          // Yukarıda daha fazla alan var, yukarıda göster ama sınırla
          yPos = Math.max(10, windowHeight - spaceAbove + 10);
          // Context menu'yü pencere sınırlarına sığdır
          contextMenuRef.current.style.maxHeight = `${spaceAbove - 20}px`;
        }
      }
      
      setContextMenuPosition({
        x: xPos,
        y: yPos
      });
    };
    
    // İlk render'da ve her gösterildiğinde pozisyonu güncelle
    setTimeout(updateContextMenuPosition, 0);
    
    // Pencere boyutu değiştiğinde pozisyonu güncelle
    window.addEventListener('resize', updateContextMenuPosition);
    return () => {
      window.removeEventListener('resize', updateContextMenuPosition);
    };
  }, [showContextMenu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Kullanıcı mesajını ekle
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Input alanını temizle
    setInput('');
    
    // Yükleme durumunu başlat
    setIsLoading(true);
    
    try {
      let response;
      
      // Seçilen LLM'e göre farklı API'leri çağır
      if (selectedLLM === 'gemini') {
        // Gemini API'sini kullan
        response = await generateGeminiResponse(userMessage.content);
      } else {
        // Diğer LLM'ler için mevcut API çağrılarını kullan
        // Örnek: response = await generateDeepseekResponse(userMessage.content);
        response = `Using ${selectedLLM}: This is a placeholder response. Implement the actual API call for ${selectedLLM}.`;
      }
      
      // AI yanıtını ekle
      setMessages(prev => [...prev, { type: 'ai', content: response }]);
    } catch (error) {
      console.error('Error generating response:', error);
      // Hata mesajını ekle
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: `Error: ${error.message || 'Failed to generate response'}` 
      }]);
    } finally {
      // Yükleme durumunu sonlandır
      setIsLoading(false);
    }
  };

  // Veritabanı öğelerini al
  const getDatabaseItems = () => {
    const connections = getAllConnections();
    const items = [];
    
    connections.forEach(connection => {
      // Şemalar
      connection.getSchemas().forEach(schema => {
        items.push({
          type: 'schema',
          name: schema.name,
          fullPath: schema.name,
          connection: connection.connectionInfo.name
        });
        
        // Tablolar
        connection.getTablesBySchema(schema.name).forEach(table => {
          items.push({
            type: 'table',
            name: table.name,
            fullPath: `${schema.name}.${table.name}`,
            connection: connection.connectionInfo.name
          });
          
          // Sütunlar
          connection.getColumnsByTable(schema.name, table.name).forEach(column => {
            items.push({
              type: 'column',
              name: column.name,
              dataType: column.data_type,
              fullPath: `${schema.name}.${table.name}.${column.name}`,
              connection: connection.connectionInfo.name,
              isPrimaryKey: column.is_primary_key,
              isForeignKey: column.is_foreign_key
            });
          });
        });
      });
    });
    
    return items;
  };

  // Arama sonuçlarını filtrele
  const getFilteredItems = () => {
    const items = getDatabaseItems();
    
    return items.filter(item => {
      // Kategori filtreleme
      if (selectedCategory !== 'all' && item.type !== selectedCategory) {
        return false;
      }
      
      // Arama terimi filtreleme
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    }).slice(0, 20); // Maksimum 20 sonuç göster
  };

  // Öğe ikonlarını getiren fonksiyon
  const getItemIcon = (item) => {
    switch (item.type) {
      case 'schema':
        return <FaDatabase className="text-blue-400" />;
      case 'table':
        return <FaTable className="text-green-400" />;
      case 'column':
        return <FaColumns className="text-purple-400" />;
      default:
        return <FaDatabase className="text-gray-400" />;
    }
  };

  // Öğe tıklandığında input alanına ekleyen fonksiyon
  const handleItemClick = (item) => {
    const lastAtIndex = input.lastIndexOf('@');
    if (lastAtIndex === -1) return;
    
    const textBeforeAt = input.substring(0, lastAtIndex);
    const textAfterCursor = input.substring(inputRef.current.selectionStart);
    
    // Seçilen öğeyi input alanına ekle
    setInput(`${textBeforeAt}@${item.fullPath} ${textAfterCursor}`);
    
    // Context menu'yü açık tut - kapanmasını engelledik
    
    // Input alanına odaklan
    setTimeout(() => {
      inputRef.current.focus();
      // Cursor'ı eklenen öğenin sonuna getir
      const newCursorPosition = textBeforeAt.length + item.fullPath.length + 2; // +1 for @ and +1 for space
      inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-3 shadow-md ${
                msg.type === 'user' 
                  ? 'bg-blue-600/30 border border-blue-500/40 text-blue-50' 
                  : 'bg-gray-800 border border-gray-700 text-gray-200'
              }`}>
                {msg.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-700/50">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-blue-400">
                        AI Response
                      </span>
                      {activeConnection?.name && (
                        <span className="text-[10px] text-gray-400">
                          Current Database: {activeConnection.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {msg.type === 'user' && (
                  <div className="flex items-center justify-end space-x-2 mb-2 pb-2 border-b border-blue-500/30">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-blue-300">
                        You
                      </span>
                      <span className="text-[10px] text-blue-200/70">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                {msg.type === 'ai' ? (
                  <div className="font-mono text-sm whitespace-pre-wrap bg-gray-900/50 p-3 rounded border border-gray-700/50 overflow-x-auto">
                    <pre className="text-blue-300">
                      {msg.content.split('\n').map((line, i) => {
                        // Yorum satırlarını farklı renkte ve stilize edilmiş şekilde göster
                        if (line.trim().startsWith('--')) {
                          return (
                            <div key={i} className="text-gray-300 font-sans mb-2 pb-1 border-b border-gray-700/30">
                              {line.replace(/^--\s*/, '')} {/* -- işaretini kaldır */}
                            </div>
                          );
                        }
                        // SQL anahtar kelimelerini vurgula
                        const highlightedLine = line
                          .replace(/\b(SELECT|FROM|WHERE|JOIN|ON|AND|OR|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|AS|IN|BETWEEN|LIKE|IS|NULL|NOT|DISTINCT|CASE|WHEN|THEN|ELSE|END|COUNT|SUM|AVG|MIN|MAX|UNION|ALL|ANY|EXISTS)\b/gi, 
                            match => `<span class="text-purple-400 font-semibold">${match}</span>`);
                        
                        return <div key={i} dangerouslySetInnerHTML={{ __html: highlightedLine }} />;
                      })}
                    </pre>
                  </div>
                ) : (
                  <div className="text-sm whitespace-pre-wrap">
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 shadow-md">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="border-t border-gray-700 bg-[#242424] relative">
          {/* Context Menu */}
          {showContextMenu && (
            <div 
              ref={contextMenuRef}
              className="fixed z-50 w-80 overflow-y-auto bg-[#1C1C1C] rounded-lg border border-gray-700 shadow-lg"
              style={{
                left: `${contextMenuPosition.x}px`,
                top: `${contextMenuPosition.y}px`,
                maxHeight: '300px',
                // Ekranın dışına taşmasını engelle
                maxWidth: 'calc(100vw - 20px)'
              }}
            >
              <div className="p-2 border-b border-gray-700 sticky top-0 bg-[#1C1C1C] z-10">
                <div className="flex space-x-1 mb-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCategory('all');
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`px-2 py-1 text-xs rounded ${selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCategory('schema');
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`px-2 py-1 text-xs rounded ${selectedCategory === 'schema' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    Schemas
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCategory('table');
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`px-2 py-1 text-xs rounded ${selectedCategory === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    Tables
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCategory('column');
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`px-2 py-1 text-xs rounded ${selectedCategory === 'column' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    Columns
                  </button>
                </div>
              </div>
              
              <div className="py-1">
                {getFilteredItems().length > 0 ? (
                  getFilteredItems().map((item, index) => (
                    <div 
                      key={index}
                      className="px-3 py-1.5 hover:bg-gray-800 cursor-pointer flex items-center space-x-2"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        {getItemIcon(item)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-200 truncate">{item.name}</span>
                          {item.isPrimaryKey && <span className="ml-1 text-[10px] text-yellow-400">PK</span>}
                          {item.isForeignKey && <span className="ml-1 text-[10px] text-blue-400">FK</span>}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {item.type === 'column' ? `${item.dataType} • ` : ''}
                          {item.fullPath}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{item.connection}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    No matching items found
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="container mx-auto px-4 py-3">
            <div className="flex space-x-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to help with your query... (Use @ to reference database objects)"
                className="flex-1 bg-[#1C1C1C] text-gray-200 rounded-lg px-4 py-2 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500/90 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm flex items-center space-x-2 min-w-[100px]"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Send</span>
              </button>
              <div className="relative">
                <select
                  value={selectedLLM}
                  onChange={(e) => setSelectedLLM(e.target.value)}
                  className="bg-[#1C1C1C] text-gray-200 rounded-lg pl-8 pr-10 py-2 text-sm border border-gray-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    appearance-none cursor-pointer hover:bg-[#242424]"
                >
                  <option value="deepseek">🤖 DeepSeek</option>
                  <option value="llama">🦙 Llama 3.2</option>
                  <option value="gemini">✨ Gemini</option>
                </select>
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 