import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, LayoutDashboard, Users, List, Moon, Sun, Settings } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Leads', href: '/leads', icon: List },
  { name: 'Management', href: '/management', icon: Users },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="w-full mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">LeadFlow Pro</span>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href === '/leads' && location.pathname === '/');
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {/* User Profile */}
              <Link 
                to="/profile"
                className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 block">{user.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{user.role}</span>
                </div>
                <Settings className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto py-6 px-2 sm:px-4 lg:px-6">
        <div className="text-gray-900 dark:text-gray-100">
          {children}
        </div>
      </main>
    </div>
  );
}