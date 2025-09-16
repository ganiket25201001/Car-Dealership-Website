// Temporary mock data service for development
// This will be replaced with actual API calls to the MongoDB backend

import { Lead, TeamMember, KPIData } from '../types';

// Mock leads data
export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'john.anderson@gmail.com',
    phone: '+1 (555) 0101',
    address: '123 Main St, City, State 12345',
    source: 'website',
    status: 'new',
    score: 85,
    assignedTo: '1',
    vehicleInterest: {
      type: 'Sedan',
      budget: { min: 25000, max: 35000 },
      financing: true,
      timeline: 'Within 1 month'
    },
    createdAt: new Date('2024-01-15'),
    lastActivity: new Date('2024-01-15'),
    nextFollowUp: new Date('2024-01-17'),
    notes: 'Interested in fuel-efficient sedan. Prefers hybrid options.',
    tags: ['hot-lead', 'hybrid'],
    interactions: [
      {
        id: '1',
        type: 'call',
        date: new Date('2024-01-15'),
        duration: 15,
        outcome: 'Positive',
        notes: 'Initial contact. Very interested in hybrid models.',
        createdBy: 'Sarah Johnson'
      }
    ]
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@gmail.com',
    phone: '+1 (555) 0102',
    address: '456 Oak Ave, City, State 12345',
    source: 'facebook',
    status: 'contacted',
    score: 72,
    assignedTo: '2',
    vehicleInterest: {
      type: 'SUV',
      budget: { min: 40000, max: 55000 },
      financing: false,
      timeline: 'Within 3 months'
    },
    createdAt: new Date('2024-01-14'),
    lastActivity: new Date('2024-01-16'),
    notes: 'Family of 5, needs spacious vehicle. Cash buyer.',
    tags: ['family', 'cash-buyer'],
    interactions: [
      {
        id: '2',
        type: 'email',
        date: new Date('2024-01-16'),
        outcome: 'Neutral',
        notes: 'Sent brochure for family SUVs. Waiting for response.',
        createdBy: 'Mike Wilson'
      }
    ]
  },
  {
    id: '3',
    name: 'David Kim',
    email: 'david.kim@gmail.com',
    phone: '+1 (555) 0103',
    source: 'google',
    status: 'qualified',
    score: 90,
    assignedTo: '1',
    vehicleInterest: {
      type: 'Truck',
      budget: { min: 45000, max: 65000 },
      financing: true,
      tradeIn: '2018 Ford F-150',
      timeline: 'Within 2 weeks'
    },
    createdAt: new Date('2024-01-13'),
    lastActivity: new Date('2024-01-16'),
    nextFollowUp: new Date('2024-01-18'),
    notes: 'Ready to buy. Has trade-in. Excellent credit score.',
    tags: ['ready-to-buy', 'trade-in', 'excellent-credit'],
    interactions: [
      {
        id: '3',
        type: 'meeting',
        date: new Date('2024-01-16'),
        duration: 60,
        outcome: 'Positive',
        notes: 'Test drove 2024 Ram 1500. Very interested. Discussed financing options.',
        createdBy: 'Sarah Johnson'
      }
    ]
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@gmail.com',
    phone: '+1 (555) 0104',
    source: 'website',
    status: 'negotiating',
    score: 95,
    assignedTo: '3',
    vehicleInterest: {
      type: 'Luxury',
      budget: { min: 80000, max: 120000 },
      financing: false,
      timeline: 'Immediate'
    },
    createdAt: new Date('2024-01-10'),
    lastActivity: new Date('2024-01-16'),
    notes: 'High-value customer. Looking for luxury sedan. Price negotiations ongoing.',
    tags: ['luxury', 'high-value', 'negotiating'],
    interactions: [
      {
        id: '4',
        type: 'call',
        date: new Date('2024-01-16'),
        duration: 30,
        outcome: 'Positive',
        notes: 'Price negotiation. Customer willing to pay 95k for BMW 5 Series.',
        createdBy: 'Emily Davis'
      }
    ]
  },
  {
    id: '5',
    name: 'Robert Taylor',
    email: 'robert.taylor@gmail.com',
    phone: '+1 (555) 0105',
    source: 'twitter',
    status: 'converted',
    score: 100,
    assignedTo: '2',
    vehicleInterest: {
      type: 'Sedan',
      budget: { min: 30000, max: 40000 },
      financing: true,
      timeline: 'Purchased'
    },
    createdAt: new Date('2024-01-05'),
    lastActivity: new Date('2024-01-15'),
    notes: 'Successfully converted. Purchased Honda Accord 2024.',
    tags: ['converted', 'honda', 'satisfied-customer'],
    interactions: [
      {
        id: '5',
        type: 'meeting',
        date: new Date('2024-01-15'),
        duration: 120,
        outcome: 'Positive',
        notes: 'Completed purchase. Very satisfied with service and vehicle.',
        createdBy: 'Mike Wilson'
      }
    ]
  },
  {
    id: '6',
    name: 'Amanda Foster',
    email: 'amanda.foster@gmail.com',
    phone: '+1 (555) 0106',
    source: 'offline',
    status: 'not-interested',
    score: 25,
    assignedTo: '3',
    vehicleInterest: {
      type: 'Compact',
      budget: { min: 15000, max: 25000 },
      financing: true,
      timeline: 'Undecided'
    },
    createdAt: new Date('2024-01-12'),
    lastActivity: new Date('2024-01-14'),
    notes: 'Not ready to purchase. May reconsider in 6 months.',
    tags: ['not-interested', 'future-prospect'],
    interactions: [
      {
        id: '6',
        type: 'call',
        date: new Date('2024-01-14'),
        duration: 10,
        outcome: 'Negative',
        notes: 'Customer not ready to buy. Will follow up in 6 months.',
        createdBy: 'Emily Davis'
      }
    ]
  }
];

// Mock team members data
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e8?w=100&h=100&fit=crop&crop=face',
    status: 'available',
    leadsAssigned: 15,
    conversionRate: 32
  },
  {
    id: '2',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'sales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'busy',
    leadsAssigned: 12,
    conversionRate: 28
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'sales',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    status: 'available',
    leadsAssigned: 10,
    conversionRate: 35
  }
];

// Mock KPI data
export const mockKPIData: KPIData = {
  totalLeads: 156,
  conversionRate: 24.5,
  revenue: 890000,
  responseTime: 2.3,
  trends: {
    totalLeads: 12.5,
    conversionRate: -2.1,
    revenue: 18.7,
    responseTime: -15.2
  }
};

// Utility functions for lead scoring and management
/**
 * Calculate lead score based on various factors
 */
export const calculateLeadScore = (lead: Lead): number => {
  let score = 0;
  
  // Budget score (0-30 points)
  if (lead.vehicleInterest?.budget) {
    const budget = lead.vehicleInterest.budget.max;
    if (budget > 80000) score += 30;
    else if (budget > 50000) score += 25;
    else if (budget > 30000) score += 20;
    else if (budget > 20000) score += 15;
    else score += 10;
  }
  
  // Timeline score (0-25 points)
  if (lead.vehicleInterest?.timeline) {
    const timeline = lead.vehicleInterest.timeline.toLowerCase();
    if (timeline.includes('immediate') || timeline.includes('week')) score += 25;
    else if (timeline.includes('month')) score += 20;
    else if (timeline.includes('3 months')) score += 15;
    else score += 10;
  }
  
  // Interaction score (0-25 points)
  score += Math.min(lead.interactions.length * 5, 25);
  
  // Source score (0-10 points)
  const sourceScores: Record<Lead['source'], number> = { 
    'website': 10, 'google': 9, 'facebook': 7, 'twitter': 6, 'offline': 5 
  };
  score += sourceScores[lead.source] || 5;
  
  // Status score (0-10 points)
  const statusScores: Record<Lead['status'], number> = { 
    'new': 5, 'contacted': 6, 'qualified': 8, 'negotiating': 10, 'converted': 0, 'not-interested': 0 
  };
  score += statusScores[lead.status] || 5;
  
  return Math.min(score, 100);
};

/**
 * Get leads by status
 */
export const getLeadsByStatus = (status: Lead['status']): Lead[] => {
  return mockLeads.filter(lead => lead.status === status);
};

/**
 * Get lead by ID
 */
export const getLeadById = (id: string): Lead | undefined => {
  return mockLeads.find(lead => lead.id === id);
};

/**
 * Get team member by ID
 */
export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return mockTeamMembers.find(member => member.id === id);
};