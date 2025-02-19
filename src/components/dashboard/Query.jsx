import { useState } from 'react';

export default function Query({ activeConnection }) {
  const [query, setQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!query.trim() || isExecuting) return;

    setIsExecuting(true);
    // TODO: Implement actual query execution
    console.log('Executing query:', query);
    setTimeout(() => {
      setIsExecuting(false);
    }, 1000);
  };

  return (
    <div className="border-t border-gray-700 bg-[#1C1C1C] relative h-full flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#242424] border-b border-gray-700 flex items-center justify-between px-4">

        {activeConnection && (
          <span className="text-xs text-gray-500">
            Connected to: {activeConnection.name}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col h-full">
        <form onSubmit={handleExecute} className="flex-1 flex flex-col pt-12 p-4">
          <div className="flex-1">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Write your SQL query here..."
              className="w-full h-full bg-[#242424] text-gray-200 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex justify-end mt-4 space-x-3">
            <button
              type="button"
              onClick={() => setQuery('')}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 text-sm"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isExecuting || !query.trim()}
              className="bg-blue-500/90 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm flex items-center space-x-2"
            >
              {isExecuting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Execute</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 