import clsx from 'clsx';

interface StatusBadgeProps {
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'converted' | 'not-interested';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
  
  const statusClasses = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    qualified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    negotiating: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    converted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    'not-interested': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2 py-1'
  };
  
  const statusLabels = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    negotiating: 'Negotiating',
    converted: 'Converted',
    'not-interested': 'Not Interested'
  };
  
  return (
    <span className={clsx(
      baseClasses,
      statusClasses[status],
      sizeClasses[size]
    )}>
      {statusLabels[status]}
    </span>
  );
}