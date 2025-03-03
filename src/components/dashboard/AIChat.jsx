import { useState, useRef, useEffect } from 'react';

export default function AIChat({ activeConnection }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState('deepseek');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: userMessage,
      llm: selectedLLM 
    }]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response with selected LLM
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: `Using ${selectedLLM}: SELECT * FROM planets WHERE name = '${userMessage}';`,
        llm: selectedLLM
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="border-t border-gray-700 bg-[#1C1C1C] relative h-full flex flex-col z-10">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pt-14 px-4 pb-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end pr-2' : 'justify-start pl-2'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.type === 'user'
                    ? 'bg-blue-500/90 text-white shadow-sm'
                    : 'bg-[#242424] text-gray-200 shadow-sm border border-gray-700/50'
                }`}
              >
                {msg.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-1 pb-1 border-b border-gray-700/50">
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-xs text-blue-400">
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
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  {msg.content}
                </pre>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#242424] rounded-lg px-4 py-2 border border-gray-700/50 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="border-t border-gray-700 bg-[#242424]">
          <div className="container mx-auto px-4 py-3">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to help with your query..."
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