import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function UserProfile() {
  const userStats = {
    totalLeads: 24,
    activeLeads: 8,
    convertedLeads: 12,
    totalRevenue: '$45,000'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your profile information and view your performance
          </p>
        </div>
        <Link to="/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>

      {/* Personal Information Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              JD
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">John Doe</h2>
              <p className="text-gray-600 dark:text-gray-400">Sales Manager</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Member since March 2024</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">john.doe@hsrmotors.com</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">+1 (555) 123-4567</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">Sales & Marketing</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Employee ID</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">EMP-2024-001</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">New York, NY</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Zone</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">EST (UTC-5)</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Statistics */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Performance Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.totalLeads}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Leads</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{userStats.activeLeads}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Leads</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.convertedLeads}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Converted</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.totalRevenue}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Converted lead: Sarah Johnson - BMW X5</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Updated lead status: Mike Brown - Mercedes C-Class</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Added new lead: Emma Davis - Audi A4</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/leads">
              <Button className="w-full">View All Leads</Button>
            </Link>
            <Link to="/management">
              <Button className="w-full">Lead Management</Button>
            </Link>
            <Link to="/profile/edit">
              <Button className="w-full">Edit Profile</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="w-full">Dashboard</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}