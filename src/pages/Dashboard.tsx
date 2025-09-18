import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, Award, ArrowUpRight, ArrowDownRight, 
  BarChart3, Activity, Target, Zap, Filter, Download, RefreshCcw,
  Eye, Star, Briefcase, PieChart
} from 'lucide-react';
import {
  Line, AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie,
  ComposedChart, ReferenceLine
} from 'recharts';
import '../styles/dashboard.css';

const Dashboard: React.FC = (): JSX.Element => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Professional color palette
  const colors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    warning: '#F59E0B',
    error: '#EF4444',
    success: '#22C55E',
    neutral: '#6B7280'
  };

  // Enhanced KPI data with more professional structure
  const kpiData = [
    {
      id: 1,
      title: 'Total Leads',
      value: '1,247',
      previousValue: '996',
      change: '+25.2%',
      changeValue: '+251',
      trend: 'up',
      target: '1,200',
      progress: 103.9,
      icon: Users,
      color: colors.primary,
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      description: 'New leads generated this month',
      period: 'vs last month'
    },
    {
      id: 2,
      title: 'Conversion Rate',
      value: '18.5%',
      previousValue: '16.4%',
      change: '+2.1%',
      changeValue: '+12.8%',
      trend: 'up',
      target: '20%',
      progress: 92.5,
      icon: Target,
      color: colors.success,
      bgColor: 'bg-green-50 dark:bg-green-900/10',
      description: 'Leads converted to customers',
      period: 'vs last month'
    },
    {
      id: 3,
      title: 'Revenue Generated',
      value: '$485K',
      previousValue: '$422K',
      change: '+14.9%',
      changeValue: '+$63K',
      trend: 'up',
      target: '$500K',
      progress: 97.0,
      icon: DollarSign,
      color: colors.accent,
      bgColor: 'bg-purple-50 dark:bg-purple-900/10',
      description: 'Total revenue from closed deals',
      period: 'vs last month'
    },
    {
      id: 4,
      title: 'Response Time',
      value: '2.3h',
      previousValue: '3.1h',
      change: '-25.8%',
      changeValue: '-0.8h',
      trend: 'down',
      target: '< 2h',
      progress: 115,
      icon: Zap,
      color: colors.warning,
      bgColor: 'bg-amber-50 dark:bg-amber-900/10',
      description: 'Average response time to leads',
      period: 'vs last month'
    }
  ];

  // Professional chart data
  const monthlyData = [
    { month: 'Apr', facebook: 70, google: 40, website: 30, total: 140, revenue: 420000 },
    { month: 'May', facebook: 65, google: 45, website: 35, total: 145, revenue: 435000 },
    { month: 'Jun', facebook: 72, google: 50, website: 38, total: 160, revenue: 450000 },
    { month: 'Jul', facebook: 68, google: 48, website: 42, total: 158, revenue: 465000 },
    { month: 'Aug', facebook: 75, google: 52, website: 40, total: 167, revenue: 470000 },
    { month: 'Sep', facebook: 68, google: 55, website: 42, total: 165, revenue: 485000 }
  ];

  const sourceDistribution = [
    { name: 'Facebook', value: 42, color: colors.primary },
    { name: 'Google Ads', value: 33, color: colors.success },
    { name: 'Website', value: 25, color: colors.accent }
  ];

  // Enhanced team performance data
  const teamPerformance = [
    { 
      rank: 1, 
      name: 'Sarah Chen', 
      avatar: '👩‍💼',
      convRate: '24.8%', 
      leads: 156, 
      closed: 39,
      revenue: 125000,
      trend: 'up',
      badge: '🥇'
    },
    { 
      rank: 2, 
      name: 'Mike Rodriguez', 
      avatar: '👨‍💼',
      convRate: '22.1%', 
      leads: 142, 
      closed: 31,
      revenue: 98000,
      trend: 'up',
      badge: '🥈'
    },
    { 
      rank: 3, 
      name: 'Emily Watson', 
      avatar: '👩‍🦰',
      convRate: '19.7%', 
      leads: 128, 
      closed: 25,
      revenue: 87000,
      trend: 'same',
      badge: '�'
    },
    { 
      rank: 4, 
      name: 'Alex Johnson', 
      avatar: '👨‍🦱',
      convRate: '18.5%', 
      leads: 115, 
      closed: 21,
      revenue: 72000,
      trend: 'down',
      badge: '⭐'
    }
  ];

  // AI-powered insights
  const aiInsights = [
    { 
      id: 1,
      icon: '🎯', 
      title: 'Peak Performance Window',
      description: 'Tuesday 2-4 PM shows 34% higher conversion rates. Consider scheduling more calls during this time.',
      impact: 'High Impact',
      priority: 'high',
      actionItems: ['Schedule team calls', 'Adjust availability', 'Optimize resources'],
      estimatedGain: '+15% conversions'
    },
    { 
      id: 2,
      icon: '📈', 
      title: 'Lead Quality Improvement',
      description: 'Facebook lead quality improved by 28% this month with refined targeting.',
      impact: 'Medium Impact',
      priority: 'medium',
      actionItems: ['Increase Facebook spend', 'Replicate targeting', 'A/B test creatives'],
      estimatedGain: '+$25K revenue'
    },
    { 
      id: 3,
      icon: '⚡', 
      title: 'Response Time Optimization',
      description: 'Sub-1 hour responses have 45% higher close rates than slower responses.',
      impact: 'High Impact',
      priority: 'high',
      actionItems: ['Setup auto-responders', 'Mobile notifications', 'Streamline process'],
      estimatedGain: '+20% close rate'
    }
  ];

  // Refresh data function
  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300">{entry.dataKey}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-8 dashboard-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Business Intelligence Dashboard
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mt-1">
                  Real-time insights and performance analytics for HSR Motors dealership
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm w-full sm:w-auto"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
              
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed professional-button flex-1 sm:flex-none"
                >
                  <RefreshCcw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{isLoading ? 'Updating...' : 'Refresh'}</span>
                  <span className="sm:hidden">{isLoading ? '...' : '↻'}</span>
                </button>
                
                <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl professional-button flex-1 sm:flex-none">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden">↓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {kpiData.map((kpi) => {
          const IconComponent = kpi.icon;
          const isPositive = kpi.trend === 'up';
          
          return (
            <div 
              key={kpi.id} 
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer metric-card dashboard-card"
            >
              {/* Header with icon and trend */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-4 rounded-xl ${kpi.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent 
                    className="h-5 w-5 sm:h-8 sm:w-8 transition-colors duration-300" 
                    style={{ color: kpi.color }}
                  />
                </div>
                <div className={`flex items-center text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full ${
                  isPositive 
                    ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/20' 
                    : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/20'
                }`}>
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  )}
                  {kpi.change}
                </div>
              </div>
              
              {/* Main value */}
              <div className="mb-2 sm:mb-3">
                <h3 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {kpi.value}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {kpi.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                  {kpi.description}
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span className="hidden sm:inline">Progress to target</span>
                  <span className="sm:hidden">Target</span>
                  <span>{kpi.progress.toFixed(1)}%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${Math.min(kpi.progress, 100)}%`,
                        backgroundColor: kpi.color 
                      }}
                    />
                  </div>
                  {kpi.progress > 100 && (
                    <div className="absolute -top-1 -right-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                    </div>
                  )}
                </div>
                
                {/* Additional metrics */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
                  <span>Target: {kpi.target}</span>
                  <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.changeValue} <span className="hidden sm:inline">{kpi.period}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Performance Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 dashboard-card chart-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                Lead Source Performance
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monthly lead generation trends across all channels
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-medium text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-medium text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                <Bar dataKey="facebook" name="Facebook" fill={colors.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="google" name="Google Ads" fill={colors.success} radius={[4, 4, 0, 0]} />
                <Bar dataKey="website" name="Website" fill={colors.accent} radius={[4, 4, 0, 0]} />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="Total Leads"
                  stroke={colors.warning} 
                  strokeWidth={3}
                  dot={{ fill: colors.warning, strokeWidth: 2, r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              Source Distribution
            </h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip />
                <Pie
                  dataKey="value"
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="space-y-3 mt-6">
            {sourceDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              Revenue Trend
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monthly revenue growth and projections
            </p>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.success} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.success} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={colors.success}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
              <ReferenceLine y={500000} stroke="#ef4444" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section - Team Performance & AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Enhanced Team Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                Team Performance
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Top performers this month
              </p>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All →
            </button>
          </div>
          
          <div className="space-y-4">
            {teamPerformance.map((member) => {
              const getTrendIcon = () => {
                if (member.trend === 'up') return <ArrowUpRight className="h-4 w-4 text-green-500" />;
                if (member.trend === 'down') return <ArrowDownRight className="h-4 w-4 text-red-500" />;
                return <div className="h-4 w-4" />; // placeholder for 'same'
              };

              return (
                <div 
                  key={member.rank} 
                  className="group p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-700/50 dark:to-gray-700/20 rounded-xl hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600/50 dark:hover:to-gray-600/20 transition-all duration-300 cursor-pointer team-member dashboard-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank Badge */}
                      <div className="relative">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white text-lg font-bold shadow-lg">
                          {member.rank}
                        </div>
                        <div className="absolute -top-1 -right-1 text-lg">
                          {member.badge}
                        </div>
                      </div>
                      
                      {/* Avatar and Info */}
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{member.avatar}</div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {member.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{member.leads} leads</span>
                            <span>•</span>
                            <span>{member.closed} closed</span>
                            <span>•</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              ${(member.revenue / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Performance Stats */}
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {member.convRate}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Conversion Rate
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getTrendIcon()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${(member.closed / member.leads) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced AI Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                AI Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Actionable recommendations
              </p>
            </div>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              View All →
            </button>
          </div>
          
          <div className="space-y-6">
            {aiInsights.map((insight) => (
              <div 
                key={insight.id}
                className="group p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-purple-200 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300 ai-insight dashboard-card"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{insight.icon}</div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {insight.title}
                      </h4>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        insight.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {insight.impact}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {insight.description}
                    </p>
                    
                    {/* Action Items */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Recommended Actions:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {insight.actionItems.map((action, actionIndex) => (
                          <span 
                            key={actionIndex}
                            className="px-3 py-1 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer"
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Estimated Impact */}
                    <div className="flex items-center justify-between pt-3 border-t border-purple-200 dark:border-purple-700/30">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {insight.estimatedGain}
                      </span>
                      <button className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                        <Briefcase className="h-4 w-4" />
                        Take Action
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;