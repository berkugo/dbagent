import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Welcome back
      </h2>
      <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Enter your credentials to access your account
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="group">
          <div className="relative overflow-hidden rounded-lg border border-gray-700 transition-all duration-300 group-hover:border-transparent group-hover:ring-2 group-hover:ring-blue-500/50">
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative z-10 w-full px-4 py-3 bg-[#1C1C1C] text-gray-200 text-sm focus:outline-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </div>
        
        <div className="group">
          <div className="relative overflow-hidden rounded-lg border border-gray-700 transition-all duration-300 group-hover:border-transparent group-hover:ring-2 group-hover:ring-blue-500/50">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative z-10 w-full px-4 py-3 bg-[#1C1C1C] text-gray-200 text-sm focus:outline-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Remember me
            </span>
          </label>
          <a href="#" className="text-sm text-blue-500 hover:text-blue-400">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
        </span>
        <a href="#" className="text-sm text-blue-500 hover:text-blue-400">
          Create one
        </a>
      </div>
    </div>
  );
}