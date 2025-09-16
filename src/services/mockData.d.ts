// Type definitions for mockData.js

export interface VehicleInterest {
  type: string;
  budget: {
    min: number;
    max: number;
  };
  financing: boolean;
  tradeIn?: string;
  timeline: string;
}

export interface Interaction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  date: Date;
  duration?: number;
  outcome?: string;
  notes: string;
  createdBy: string;
}

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
  vehicleInterest?: VehicleInterest;
  createdAt: Date;
  lastActivity: Date;
  nextFollowUp?: Date;
  notes: string;
  tags: string[];
  interactions: Interaction[];
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
  responseTime: number;
  trends: {
    totalLeads: number;
    conversionRate: number;
    revenue: number;
    responseTime: number;
  };
}

// Exported data
export const mockLeads: Lead[];
export const mockTeamMembers: TeamMember[];
export const mockKPIData: KPIData;

// Utility functions
export function calculateLeadScore(lead: Lead): number;
export function getLeadsByStatus(status: string): Lead[];
export function getLeadById(id: string): Lead | undefined;
export function getTeamMemberById(id: string): TeamMember | undefined;