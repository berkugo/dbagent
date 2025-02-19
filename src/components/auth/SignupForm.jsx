import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signup } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Create an account
      </h2>
      <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Join us and start managing your databases with AI
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg text-sm transition-colors
              ${isDark 
                ? 'bg-[#1C1C1C] border-gray-700 text-gray-200 focus:border-blue-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg text-sm transition-colors
              ${isDark 
                ? 'bg-[#1C1C1C] border-gray-700 text-gray-200 focus:border-blue-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="name@company.com"
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg text-sm transition-colors
              ${isDark 
                ? 'bg-[#1C1C1C] border-gray-700 text-gray-200 focus:border-blue-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            I agree to the{' '}
            <a href="#" className="text-blue-500 hover:text-blue-400">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-500 hover:text-blue-400">Privacy Policy</a>
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-blue-500 text-white rounded-lg text-sm font-medium
            hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
        >
          Create account
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
        </span>
        <a href="#" className="text-sm text-blue-500 hover:text-blue-400">
          Sign in
        </a>
      </div>
    </div>
  );
}