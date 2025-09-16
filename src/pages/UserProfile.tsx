import { Link } from 'react-router-dom';
import { Edit, MapPin, Clock, Calendar, Mail, Phone, User as UserIcon } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUser } from '../contexts/UserContext';
import { format } from 'date-fns';

export default function UserProfile() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information and preferences</p>
        </div>
        <Link to="/profile/edit">
          <Button variant="primary" className="flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{user.role}</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">{user.department}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {format(new Date(user.joinDate), 'MMMM yyyy')}
                </div>
                {user.location && (
                  <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user.location}
                  </div>
                )}
                {user.timezone && (
                  <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {user.timezone}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-900 dark:text-gray-100">{user.phone}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-gray-900 dark:text-gray-100">{user.role}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-gray-900 dark:text-gray-100">{user.department}</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Join Date
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-gray-900 dark:text-gray-100">
                    {format(new Date(user.joinDate), 'PPPP')}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Bio */}
          {user.bio && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {user.bio}
              </p>
            </Card>
          )}

          {/* Preferences */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preferences
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <span className="text-gray-900 dark:text-gray-100">Email Notifications</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.preferences.notifications 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                }`}>
                  {user.preferences.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <span className="text-gray-900 dark:text-gray-100">Email Updates</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.preferences.emailUpdates 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                }`}>
                  {user.preferences.emailUpdates ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}