import { apiClient, handleApiResponse, handleApiError } from './apiClient';

// Lead Service
export class LeadService {
  // Get all leads with filters, pagination, and search
  static async getLeads(params = {}) {
    try {
      const response = await apiClient.get('/leads', params);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get single lead by ID
  static async getLead(id) {
    try {
      const response = await apiClient.get(`/leads/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create new lead
  static async createLead(leadData) {
    try {
      const response = await apiClient.post('/leads', leadData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update lead
  static async updateLead(id, leadData) {
    try {
      const response = await apiClient.put(`/leads/${id}`, leadData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete lead (soft delete)
  static async deleteLead(id) {
    try {
      const response = await apiClient.delete(`/leads/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Add interaction to lead
  static async addInteraction(leadId, interactionData) {
    try {
      const response = await apiClient.post(`/leads/${leadId}/interactions`, interactionData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update lead status
  static async updateLeadStatus(id, status, additionalData = {}) {
    try {
      const response = await apiClient.patch(`/leads/${id}/status`, {
        status,
        ...additionalData
      });
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get leads by status (for Kanban board)
  static async getLeadsByStatus(status) {
    try {
      const response = await apiClient.get(`/leads/status/${status}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Bulk update leads
  static async bulkUpdateLeads(leadIds, updates) {
    try {
      const response = await apiClient.patch('/leads/bulk', {
        leadIds,
        updates
      });
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get lead analytics
  static async getLeadAnalytics() {
    try {
      const response = await apiClient.get('/leads/analytics/summary');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Utility methods for lead management
  static getStatusColor(status) {
    const statusColors = {
      new: '#10B981',        // Green
      contacted: '#3B82F6',  // Blue
      qualified: '#F59E0B',  // Amber
      negotiating: '#EF4444', // Red
      converted: '#059669',   // Emerald
      lost: '#6B7280'        // Gray
    };
    return statusColors[status] || '#6B7280';
  }

  static getStatusIcon(status) {
    const statusIcons = {
      new: '🆕',
      contacted: '📞',
      qualified: '✅',
      negotiating: '💬',
      converted: '🎉',
      lost: '❌'
    };
    return statusIcons[status] || '📋';
  }

  static getPriorityColor(priority) {
    const priorityColors = {
      low: '#10B981',      // Green
      medium: '#F59E0B',   // Amber
      high: '#EF4444'      // Red
    };
    return priorityColors[priority] || '#6B7280';
  }

  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  static formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static formatDateTime(date) {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static getTimeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }

  static getScoreColor(score) {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Amber
    if (score >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  }

  static getScoreLabel(score) {
    if (score >= 80) return 'Hot';
    if (score >= 60) return 'Warm';
    if (score >= 40) return 'Cold';
    return 'New';
  }
}

export default LeadService;