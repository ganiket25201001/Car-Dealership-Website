export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  source: 'facebook' | 'google' | 'website' | 'twitter' | 'offline';
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'converted' | 'not-interested';
  score: number;
  assignedTo?: string;
  vehicleInterest?: {
    type: string;
    budget: {
      min: number;
      max: number;
    };
    financing: boolean;
    tradeIn?: string;
    timeline: string;
  };
  createdAt: Date;
  lastActivity: Date;
  nextFollowUp?: Date;
  notes: string;
  tags: string[];
  interactions: Interaction[];
}

export interface Interaction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  date: Date;
  duration?: number; // in minutes
  outcome?: string;
  notes: string;
  createdBy: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'sales' | 'manager';
  avatar?: string;
  status: 'available' | 'busy' | 'offline';
  leadsAssigned: number;
  conversionRate: number;
}

export interface KPIData {
  totalLeads: number;
  conversionRate: number;
  revenue: number;
  responseTime: number; // in hours
  trends: {
    totalLeads: number; // percentage change
    conversionRate: number;
    revenue: number;
    responseTime: number;
  };
}