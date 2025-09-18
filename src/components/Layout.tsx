import { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Car, LayoutDashboard, Users, List, Moon, Sun, Settings, ChevronDown, 
  Bell, Search, Plus, User, LogOut, HelpCircle, Keyboard, 
  ChevronRight, Home 
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard
  },
  { 
    name: 'Leads', 
    href: '/leads', 
    icon: List
  },
  { 
    name: 'Management', 
    href: '/management', 
    icon: Users
  },
];

// Mock notifications data
const mockNotifications = [
  { id: 1, message: 'New lead: John Smith - BMW X5', time: '2 min ago', unread: true, type: 'lead' },
  { id: 2, message: 'Lead Sarah Johnson converted', time: '15 min ago', unread: true, type: 'success' },
  { id: 3, message: 'Follow-up reminder: Mike Brown', time: '1 hour ago', unread: false, type: 'reminder' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [unreadCount] = useState(2);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Home', href: '/dashboard' }];
    
    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      if (segment === 'profile' && pathSegments[index + 1] === 'edit') {
        breadcrumbs.push({ name: 'Profile', href: '/profile' });
      } else if (segment !== 'edit' || pathSegments[index - 1] !== 'profile') {
        breadcrumbs.push({ name, href });
      }
    });

    return breadcrumbs;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/leads?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.type === 'lead' || notification.type === 'success') {
      navigate('/leads');
    }
    setNotificationsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="w-full mx-auto px-1 sm:px-2 lg:px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">HSR Motors</span>
                  <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400">Lead Management Pro</span>
                </div>
              </div>

              {/* Main Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || 
                    (item.href === '/dashboard' && location.pathname === '/');
                  
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
            </div>

            {/* Search, Notifications, and User Menu */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </form>

              {/* Quick Actions */}
              <Link
                to="/leads/new"
                className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Link>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={clsx(
                            'w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                            notification.unread && 'bg-blue-50 dark:bg-blue-900/20'
                          )}
                        >
                          <div className="flex items-start">
                            <div className={clsx(
                              'w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0',
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'reminder' ? 'bg-yellow-500' : 'bg-blue-500'
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

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

              {/* User Profile Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    JD
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 block">John Doe</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Sales Manager</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>

                {/* Enhanced User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          JD
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">John Doe</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@hsrmotors.com</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Sales Manager</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">24</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total Leads</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">8</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">12</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Converted</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        View Profile
                      </Link>
                      <Link
                        to="/profile/edit"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Profile Settings
                      </Link>
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setUserMenuOpen(false);
                          alert('Keyboard Shortcuts:\n\n- Ctrl/Cmd + K: Quick search\n- Ctrl/Cmd + N: New lead\n- Ctrl/Cmd + D: Dashboard\n- Ctrl/Cmd + L: Leads\n- Ctrl/Cmd + M: Management');
                        }}
                      >
                        <Keyboard className="w-4 h-4 mr-3" />
                        Keyboard Shortcuts
                      </button>
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setUserMenuOpen(false);
                          alert('Help & Support:\n\nFor technical support, contact:\nsupport@hsrmotors.com\n\nOr call: 1-800-HSR-HELP');
                        }}
                      >
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help & Support
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1">
                        <button
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('/');
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="w-full mx-auto px-1 sm:px-2 lg:px-4 pb-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {generateBreadcrumbs().map((item, index, array) => (
                <li key={item.href} className="flex items-center">
                  {index === 0 ? (
                    <Home className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  )}
                  {index < array.length - 1 ? (
                    <Link
                      to={item.href}
                      className="ml-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="ml-2 text-sm text-gray-900 dark:text-white font-medium">
                      {item.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-1 sm:px-2 lg:px-4">
          {children}
        </div>
      </main>
    </div>
  );
}