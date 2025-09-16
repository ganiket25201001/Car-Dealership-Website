import { Lead, TeamMember, KPIData } from '../types';

// Mock data for demonstration
export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '(555) 123-4567',
    address: '123 Oak St, Springfield',
    source: 'facebook',
    status: 'new',
    score: 95,
    assignedTo: 'Rajesh Kumar',
    vehicleInterest: {
      type: 'Sedan',
      budget: { min: 22000, max: 28000 },
      financing: true,
      tradeIn: '2018 Toyota Camry',
      timeline: 'Within 2 months'
    },
    createdAt: new Date('2024-01-15'),
    lastActivity: new Date('2024-01-15T14:30:00'),
    nextFollowUp: new Date('2024-01-16T10:00:00'),
    notes: 'Interested in Honda Accord with safety features. Has pre-approval from bank.',
    tags: ['First-time buyer', 'Financing needed'],
    interactions: [
      {
        id: '1',
        type: 'call',
        date: new Date('2024-01-15T14:30:00'),
        duration: 15,
        outcome: 'Discussed financing options',
        notes: 'Customer interested in 3-year financing plan',
        createdBy: 'Rajesh Kumar'
      }
    ]
  },
  {
    id: '2',
    name: 'Arjun Patel',
    email: 'arjun.patel@company.com',
    phone: '(555) 234-5678',
    source: 'google',
    status: 'contacted',
    score: 78,
    assignedTo: 'Vikram Singh',
    vehicleInterest: {
      type: 'SUV',
      budget: { min: 40000, max: 50000 },
      financing: false,
      timeline: 'Within 1 month'
    },
    createdAt: new Date('2024-01-14'),
    lastActivity: new Date('2024-01-14T16:00:00'),
    notes: 'Looking for family SUV, has cash payment ready',
    tags: ['Cash buyer', 'Family'],
    interactions: []
  },
  {
    id: '3',
    name: 'Kavya Reddy',
    email: 'kavya.reddy@gmail.com',
    phone: '(555) 345-6789',
    source: 'website',
    status: 'qualified',
    score: 88,
    assignedTo: 'Anita Gupta',
    vehicleInterest: {
      type: 'Luxury',
      budget: { min: 60000, max: 70000 },
      financing: true,
      timeline: 'Within 3 months'
    },
    createdAt: new Date('2024-01-13'),
    lastActivity: new Date('2024-01-14T09:00:00'),
    notes: 'Interested in luxury sedan, wants test drive',
    tags: ['High-value', 'Luxury'],
    interactions: []
  },
  {
    id: '4',
    name: 'Rohit Mehta',
    email: 'rohit.mehta@email.com',
    phone: '(555) 456-7890',
    source: 'twitter',
    status: 'negotiating',
    score: 92,
    assignedTo: 'Deepak Joshi',
    vehicleInterest: {
      type: 'Electric',
      budget: { min: 45000, max: 55000 },
      financing: true,
      timeline: 'Within 2 weeks'
    },
    createdAt: new Date('2024-01-12'),
    lastActivity: new Date('2024-01-14T11:30:00'),
    notes: 'Interested in Tesla Model 3, price negotiation in progress',
    tags: ['Electric vehicle', 'Urgent'],
    interactions: []
  },
  {
    id: '5',
    name: 'Neha Agarwal',
    email: 'neha.agarwal@email.com',
    phone: '(555) 567-8901',
    source: 'facebook',
    status: 'converted',
    score: 100,
    assignedTo: 'Rajesh Kumar',
    vehicleInterest: {
      type: 'Sedan',
      budget: { min: 25000, max: 30000 },
      financing: true,
      timeline: 'Immediate'
    },
    createdAt: new Date('2024-01-10'),
    lastActivity: new Date('2024-01-14T15:00:00'),
    notes: 'Purchased Honda Civic, excellent customer experience',
    tags: ['Converted', 'Referral potential'],
    interactions: []
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@hsrmotors.com',
    role: 'sales',
    status: 'available',
    leadsAssigned: 8,
    conversionRate: 24
  },
  {
    id: '2',
    name: 'Vikram Singh',
    email: 'vikram.singh@hsrmotors.com',
    role: 'sales',
    status: 'busy',
    leadsAssigned: 12,
    conversionRate: 21
  },
  {
    id: '3',
    name: 'Anita Gupta',
    email: 'anita.gupta@hsrmotors.com',
    role: 'sales',
    status: 'available',
    leadsAssigned: 6,
    conversionRate: 19
  },
  {
    id: '4',
    name: 'Deepak Joshi',
    email: 'deepak.joshi@hsrmotors.com',
    role: 'sales',
    status: 'busy',
    leadsAssigned: 15,
    conversionRate: 16
  }
];

export const mockKPIData: KPIData = {
  totalLeads: 1247,
  conversionRate: 18.5,
  revenue: 485000,
  responseTime: 2.3,
  trends: {
    totalLeads: 23,    // +23%
    conversionRate: 2.1,  // +2.1%
    revenue: 15,       // +15%
    responseTime: -0.8    // -0.8h (improvement)
  }
};

// Lead scoring algorithm
export function calculateLeadScore(lead: Lead): number {
  let score = 0;
  
  // Engagement factors (40 points max)
  if (lead.interactions.length > 0) score += 15;
  if (lead.email) score += 10;
  if (lead.phone) score += 10;
  if (lead.vehicleInterest) score += 5;
  
  // Demographic factors (25 points max)
  if (lead.vehicleInterest?.budget) {
    const avgBudget = (lead.vehicleInterest.budget.min + lead.vehicleInterest.budget.max) / 2;
    if (avgBudget > 50000) score += 10;
    else if (avgBudget > 30000) score += 8;
    else if (avgBudget > 20000) score += 6;
    else score += 3;
  }
  
  // Source quality (15 points max)
  const sourceScores = {
    facebook: 12,
    google: 10,
    website: 15,
    twitter: 8,
    offline: 10
  };
  score += sourceScores[lead.source] || 5;
  
  // Timeline urgency (20 points max)
  if (lead.vehicleInterest?.timeline) {
    if (lead.vehicleInterest.timeline.includes('week')) score += 20;
    else if (lead.vehicleInterest.timeline.includes('month')) score += 15;
    else if (lead.vehicleInterest.timeline.includes('months')) score += 10;
    else score += 5;
  }
  
  return Math.min(score, 100);
}

// Auto-assignment logic
export function assignLead(_lead: Lead, teamMembers: TeamMember[]): string {
  const availableMembers = teamMembers.filter(m => m.status === 'available');
  
  if (availableMembers.length === 0) {
    // Assign to least busy member
    return teamMembers.reduce((prev, current) => 
      prev.leadsAssigned < current.leadsAssigned ? prev : current
    ).id;
  }
  
  // Assign to available member with best performance and lowest workload
  return availableMembers.reduce((best, current) => {
    const bestScore = best.conversionRate - (best.leadsAssigned * 2);
    const currentScore = current.conversionRate - (current.leadsAssigned * 2);
    return currentScore > bestScore ? current : best;
  }).id;
}