import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUser } from '../contexts/UserContext';

interface FormData {
  email: string;
  password: string;
  name?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  submit?: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [debugUsers, setDebugUsers] = useState<any[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  
  const { user, login } = useUser();

  // Check server connection on component mount
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const response = await fetch('/api/v1/health');
        if (response.ok) {
          setServerStatus('connected');
        } else {
          setServerStatus('disconnected');
        }
      } catch (error) {
        console.error('Server connection check failed:', error);
        setServerStatus('disconnected');
      }
    };

    checkServerConnection();
  }, []);

  const checkExistingUsers = async () => {
    try {
      const response = await fetch('/api/v1/auth/debug-users');
      if (response.ok) {
        const data = await response.json();
        setDebugUsers(data.data.users);
        setShowDebug(true);
        console.log('Existing users:', data.data.users);
      }
    } catch (error) {
      console.error('Failed to check users:', error);
    }
  };

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Additional validation for setup mode
    if (showSetup) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (showSetup) {
        // Initial setup
        const response = await fetch('/api/v1/auth/setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          await login(formData.email, formData.password);
        } else {
          setErrors({ submit: data.message || 'Setup failed' });
        }
      } else {
        // Regular login
        const success = await login(formData.email, formData.password);
        if (!success) {
          setErrors({ submit: 'Invalid email or password. If no admin exists yet, click "Setup Admin" below.' });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ submit: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const errorClasses = "mt-1 text-sm text-red-600 dark:text-red-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            HSR Motors
          </h1>
          <h2 className="mt-2 text-xl text-gray-600 dark:text-gray-400">
            Lead Management System
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            {showSetup ? 'Initial Setup - Create Administrator Account' : 'Sign in to your account'}
          </p>
          
          {/* Server Status Indicator */}
          <div className="mt-2">
            {serverStatus === 'checking' && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                🔄 Checking server connection...
              </p>
            )}
            {serverStatus === 'connected' && (
              <p className="text-xs text-green-600 dark:text-green-400">
                ✅ Server connected
              </p>
            )}
            {serverStatus === 'disconnected' && (
              <p className="text-xs text-red-600 dark:text-red-400">
                ❌ Server disconnected - Please check if the backend is running
              </p>
            )}
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {showSetup && (
              <div>
                <label htmlFor="name" className={labelClasses}>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className={errorClasses}>{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className={labelClasses}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Enter your email"
              />
              {errors.email && <p className={errorClasses}>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Enter your password"
              />
              {errors.password && <p className={errorClasses}>{errors.password}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {showSetup ? 'Creating Account...' : 'Signing in...'}
                </div>
              ) : (
                showSetup ? 'Create Administrator Account' : 'Sign In'
              )}
            </Button>

            {showSetup && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowSetup(false);
                    setFormData({ email: '', password: '' });
                    setErrors({});
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Back to Login
                </button>
              </div>
            )}

            {!showSetup && (
              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSetup(true);
                    setFormData({ email: 'admin@leadflow.com', password: 'admin123', name: '' });
                    setErrors({});
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Need to setup admin? Click here
                </button>
                <br />
                <button
                  type="button"
                  onClick={checkExistingUsers}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Debug: Check existing users
                </button>
              </div>
            )}
          </form>

        {showDebug && debugUsers.length > 0 && (
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Existing Users in Database:
              </h3>
              {debugUsers.map((user, index) => (
                <div key={index} className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                  <p className="text-sm"><strong>Name:</strong> {user.name}</p>
                  <p className="text-sm"><strong>Role:</strong> {user.role}</p>
                </div>
              ))}
              <button
                onClick={() => setShowDebug(false)}
                className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Hide Debug Info
              </button>
            </div>
          </Card>
        )}
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 HSR Motors. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;