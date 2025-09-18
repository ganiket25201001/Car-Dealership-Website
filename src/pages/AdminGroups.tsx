import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function AdminGroups() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Group Management</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage user groups
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Groups</h2>
            <Button>Add Group</Button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Group management functionality</p>
          </div>
        </div>
      </Card>
    </div>
  );
}