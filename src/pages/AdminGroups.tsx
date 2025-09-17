import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, UserPlus, UserX, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUser } from '../contexts/UserContext';

interface Group {
  _id: string;
  name: string;
  description?: string;
  leader: {
    _id: string;
    name: string;
    email: string;
    tags?: string[];
  };
  members: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    addedAt: string;
    addedBy: {
      _id: string;
      name: string;
    };
  }>;
  createdAt: string;
  memberCount: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const AdminGroups = () => {
  const { user: currentUser } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState<string | null>(null);
  const [createGroupData, setCreateGroupData] = useState({
    name: '',
    description: '',
    leaderId: ''
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/groups', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGroups(data.data.groups || []);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // This would need to be implemented in the backend
      const response = await fetch('/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(createGroupData),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setCreateGroupData({ name: '', description: '', leaderId: '' });
        fetchGroups();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? All members will be removed.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchGroups();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete group');
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group');
    }
  };

  const handleAddMembers = async () => {
    if (!showMembersModal || selectedUsers.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      
      for (const userId of selectedUsers) {
        await fetch(`/api/v1/groups/${showMembersModal}/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });
      }

      setShowMembersModal(null);
      setSelectedUsers([]);
      fetchGroups();
    } catch (error) {
      console.error('Error adding members:', error);
      alert('Failed to add members');
    }
  };

  const handleRemoveMember = async (groupId: string, userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchGroups();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.leader.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const leaders = users.filter(user => user.role === 'leader');
  const availableUsers = users.filter(user => 
    user.role === 'user' && 
    !groups.some(group => 
      group.members.some(member => member.user._id === user._id)
    )
  );

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Group Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage user groups</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </Card>

      {/* Groups List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading groups...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredGroups.map((group) => (
            <Card key={group._id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                    {group.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{group.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Leader:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{group.leader.name}</span>
                        {group.leader.tags && group.leader.tags.length > 0 && (
                          <div className="flex gap-1">
                            {group.leader.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{group.memberCount} members</span>
                      </div>
                    </div>
                    {group.members.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {group.members.slice(0, 3).map((member) => (
                            <div key={member.user._id} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                              <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                {member.user.name.charAt(0)}
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{member.user.name}</span>
                            </div>
                          ))}
                          {group.members.length > 3 && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 px-3 py-1">
                              +{group.members.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMembersModal(group._id)}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Members
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteGroup(group._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Group</h3>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Group Name</label>
                  <input
                    type="text"
                    value={createGroupData.name}
                    onChange={(e) => setCreateGroupData({...createGroupData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                  <textarea
                    value={createGroupData.description}
                    onChange={(e) => setCreateGroupData({...createGroupData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Group Leader</label>
                  <select
                    value={createGroupData.leaderId}
                    onChange={(e) => setCreateGroupData({...createGroupData, leaderId: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Select a leader...</option>
                    {leaders.map((leader) => (
                      <option key={leader._id} value={leader._id}>
                        {leader.name} ({leader.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Group</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Members Management Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Manage Group Members</h3>
              
              {/* Current Members */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Current Members</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {groups.find(g => g._id === showMembersModal)?.members.map((member) => (
                    <div key={member.user._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-900 dark:text-white">{member.user.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(showMembersModal, member.user._id)}
                      >
                        <UserX className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Members */}
              <div>
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Add Members</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto mb-4">
                  {availableUsers.map((user) => (
                    <label key={user._id} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user._id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                          }
                        }}
                        className="mr-3"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{user.name} ({user.email})</span>
                    </label>
                  ))}
                  {availableUsers.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No available users to add
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => {
                  setShowMembersModal(null);
                  setSelectedUsers([]);
                }}>
                  Close
                </Button>
                {selectedUsers.length > 0 && (
                  <Button type="button" onClick={handleAddMembers}>
                    Add Selected ({selectedUsers.length})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGroups;