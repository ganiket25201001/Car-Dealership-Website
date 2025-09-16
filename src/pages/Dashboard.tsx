import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Users, DollarSign, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import { mockKPIData, mockTeamMembers } from '../services/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const kpiData = mockKPIData;
  
  // KPI Card Component
  const KPICard = ({ title, value, change, target, icon: Icon, format = 'number' }: {
    title: string;
    value: number;
    change: number;
    target?: number;
    icon: any;
    format?: 'number' | 'percentage' | 'currency' | 'time';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'percentage':
          return `${val}%`;
        case 'currency':
          return `$${(val / 1000).toFixed(0)}K`;
        case 'time':
          return `${val}h`;
        default:
          return val.toLocaleString();
      }
    };

    const isPositive = change > 0;
    const progress = target ? (value / target) * 100 : 0;
    
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatValue(value)}</p>
          </div>
          <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change}% vs last month
            </span>
          </div>
        </div>
        
        {target && (
          <>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Target: {formatValue(target)} • Progress: {Math.round(progress)}%
            </p>
          </>
        )}
      </Card>
    );
  };

  // Lead Source Trend Data
  const leadSourceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Facebook',
        data: [45, 52, 48, 61, 55, 67],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Google',
        data: [28, 35, 32, 38, 42, 45],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Website',
        data: [15, 18, 22, 25, 28, 32],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Status Distribution Data
  const statusDistData = {
    labels: ['New', 'Contacted', 'Qualified', 'Negotiating', 'Converted'],
    datasets: [
      {
        data: [437, 349, 274, 125, 62],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Revenue by Vehicle Type
  const revenueData = {
    labels: ['Sedan', 'SUV', 'Hatchback', 'Luxury'],
    datasets: [
      {
        label: 'Revenue ($K)',
        data: [185, 156, 89, 55],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Intelligence Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Today</option>
            <option>Week</option>
            <option>Month</option>
            <option>Quarter</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Total Leads"
          value={kpiData.totalLeads}
          change={kpiData.trends.totalLeads}
          target={1500}
          icon={Users}
        />
        <KPICard
          title="Conversion Rate"
          value={kpiData.conversionRate}
          change={kpiData.trends.conversionRate}
          target={20}
          icon={TrendingUp}
          format="percentage"
        />
        <KPICard
          title="Revenue Generated"
          value={kpiData.revenue}
          change={kpiData.trends.revenue}
          target={500000}
          icon={DollarSign}
          format="currency"
        />
        <KPICard
          title="Avg Response Time"
          value={kpiData.responseTime}
          change={kpiData.trends.responseTime}
          target={2}
          icon={Clock}
          format="time"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Source Trends */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Source Trends (6 months)</h3>
          <div className="h-64">
            <Line
              data={leadSourceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Team Performance */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Performance Ranking</h3>
          <div className="space-y-4">
            {mockTeamMembers
              .sort((a, b) => b.conversionRate - a.conversionRate)
              .map((member, index) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}th`}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Conv: {member.conversionRate}% • Leads: {member.leadsAssigned}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{member.conversionRate}%</p>
                  </div>
                </div>
              ))
            }
          </div>
        </Card>
      </div>

      {/* Bottom Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Distribution by Status</h3>
          <div className="h-64">
            <Pie
              data={statusDistData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Revenue by Type */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Vehicle Type</h3>
          <div className="h-64">
            <Bar
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Response Time Analysis */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Time Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">&lt;1h</span>
              <div className="flex-1 mx-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">1-4h</span>
              <div className="flex-1 mx-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">4-24h</span>
              <div className="flex-1 mx-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">&gt;24h</span>
              <div className="flex-1 mx-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">10%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights Panel */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🤖 AI-Powered Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Smart Insights</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Facebook leads converting 23% higher than average</li>
              <li>• Response times deteriorating on weekends</li>
              <li>• High-value leads preferring evening contacts</li>
              <li>• Seasonal trend: SUV interest up 34%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">🎯 Recommendations</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Increase Facebook ad budget by 15%</li>
              <li>• Add weekend coverage team</li>
              <li>• Implement evening contact preference</li>
              <li>• Promote SUV inventory in campaigns</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}