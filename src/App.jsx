import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitoring" element={<Monitoring />} />
          </Routes>
          <ToastContainer 
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="!font-sans"
            toastClassName={({ type }) => 
              `relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer shadow-lg mb-3 ${
                type === 'success' ? 'bg-emerald-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'info' ? 'bg-blue-500' :
                'bg-yellow-500'
              }`
            }
            bodyClassName={() => 
              "text-sm font-medium text-white flex items-center"
            }
            closeButton={false}
            icon={({ type }) => {
              const icons = {
                success: "✓",
                error: "✕",
                info: "ℹ",
                warning: "⚠",
              };
              return (
                <div className="w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-white/20">
                  <span className="text-sm">{icons[type]}</span>
                </div>
              );
            }}
          />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
} 