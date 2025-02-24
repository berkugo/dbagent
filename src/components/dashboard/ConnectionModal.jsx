import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { validateField } from '../../utils/general/validation';

const DATABASE_TYPES = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: '🐘',
    color: 'bg-blue-500',
    description: 'Advanced open-source database'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: '🍃',
    color: 'bg-green-500',
    description: 'NoSQL document database'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: '🐬',
    color: 'bg-orange-500',
    description: 'Popular open-source SQL database'
  }
];

export default function ConnectionModal({ isOpen, onClose, onConnect }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { isDark } = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field on change using imported validateField
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const isFormValid = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isFormValid()) {
      onConnect({
        ...formData,
        type: selectedType,
        port: parseInt(formData.port)
      });
      
      // Reset form and close modal
      setStep(1);
      setSelectedType(null);
      setFormData({
        name: '',
        host: '',
        port: '',
        database: '',
        username: '',
        password: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedType(null);
    onClose();
  };

  if (!isOpen) return null;

  const inputClassName = (fieldName) => `
    w-full px-4 py-2 rounded-lg text-sm transition-colors
    ${isDark 
      ? 'bg-[#242424] border-gray-700 text-gray-200 focus:border-blue-500' 
      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
    } border focus:outline-none focus:ring-2 focus:ring-blue-500/20
    ${errors[fieldName] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
  `;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={`w-full max-w-2xl ${isDark ? 'bg-[#1C1C1C]' : 'bg-white'} rounded-2xl shadow-2xl`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create New Connection
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {step === 1 ? 'Select your database type' : 'Configure connection details'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="grid grid-cols-3 gap-4">
              {DATABASE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                    isDark
                      ? 'bg-[#242424] border-gray-700 hover:border-blue-500/50'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-500/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg ${type.color}/10 flex items-center justify-center mb-3`}>
                    <span className="text-2xl">{type.icon}</span>
                  </div>
                  <h3 className={`text-lg font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {type.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Connection Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputClassName('name')}
                    placeholder="My Database"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Host
                  </label>
                  <input
                    type="text"
                    name="host"
                    value={formData.host}
                    onChange={handleInputChange}
                    className={inputClassName('host')}
                    placeholder="localhost"
                  />
                  {errors.host && (
                    <p className="mt-1 text-sm text-red-500">{errors.host}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Port
                  </label>
                  <input
                    type="text"
                    name="port"
                    value={formData.port}
                    onChange={handleInputChange}
                    className={inputClassName('port')}
                    placeholder="5432"
                  />
                  {errors.port && (
                    <p className="mt-1 text-sm text-red-500">{errors.port}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Database
                  </label>
                  <input
                    type="text"
                    name="database"
                    value={formData.database}
                    onChange={handleInputChange}
                    className={inputClassName('database')}
                    placeholder="postgres"
                  />
                  {errors.database && (
                    <p className="mt-1 text-sm text-red-500">{errors.database}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={inputClassName('username')}
                    placeholder="postgres"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={inputClassName('password')}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* SSL and Advanced Options (collapsed by default) */}
              <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-[#242424]' : 'bg-gray-50'}`}>
                <button
                  type="button"
                  className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Advanced Options</span>
                </button>
              </div>

              {/* Footer */}
              <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between`}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Back
                </button>
                <div className="ml-auto space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      !isFormValid()
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                    onClick={handleSubmit}
                  >
                    Create Connection
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 