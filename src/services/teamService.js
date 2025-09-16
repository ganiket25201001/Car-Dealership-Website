import { apiClient, handleApiResponse, handleApiError } from './apiClient';

// Team Service
export class TeamService {
  // Get all team members with filters and pagination
  static async getTeamMembers(params = {}) {
    try {
      const response = await apiClient.get('/team', params);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get single team member by ID
  static async getTeamMember(id) {
    try {
      const response = await apiClient.get(`/team/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create new team member (Admin/Manager only)
  static async createTeamMember(memberData) {
    try {
      const response = await apiClient.post('/team', memberData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update team member
  static async updateTeamMember(id, memberData) {
    try {
      const response = await apiClient.put(`/team/${id}`, memberData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete team member (Admin only)
  static async deleteTeamMember(id) {
    try {
      const response = await apiClient.delete(`/team/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Change password for team member
  static async changePassword(id, passwordData) {
    try {
      const response = await apiClient.put(`/team/${id}/password`, passwordData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update team member status
  static async updateMemberStatus(id, status) {
    try {
      const response = await apiClient.patch(`/team/${id}/status`, { status });
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get team member performance data
  static async getMemberPerformance(id) {
    try {
      const response = await apiClient.get(`/team/${id}/performance`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get team analytics
  static async getTeamAnalytics() {
    try {
      const response = await apiClient.get('/team/analytics/summary');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Utility methods for team management
  static getRoleColor(role) {
    const roleColors = {
      'Admin': '#EF4444',           // Red
      'Sales Manager': '#3B82F6',   // Blue
      'Sales Representative': '#10B981' // Green
    };
    return roleColors[role] || '#6B7280';
  }

  static getRoleIcon(role) {
    const roleIcons = {
      'Admin': '👑',
      'Sales Manager': '🎯',
      'Sales Representative': '💼'
    };
    return roleIcons[role] || '👤';
  }

  static getStatusColor(status) {
    const statusColors = {
      active: '#10B981',    // Green
      inactive: '#6B7280',  // Gray
      'on-leave': '#F59E0B' // Amber
    };
    return statusColors[status] || '#6B7280';
  }

  static getStatusIcon(status) {
    const statusIcons = {
      active: '✅',
      inactive: '❌',
      'on-leave': '🏖️'
    };
    return statusIcons[status] || '❓';
  }

  static getDepartmentColor(department) {
    const departmentColors = {
      Sales: '#3B82F6',      // Blue
      Marketing: '#10B981',   // Green
      Service: '#F59E0B',     // Amber
      Finance: '#8B5CF6',     // Purple
      Management: '#EF4444'   // Red
    };
    return departmentColors[department] || '#6B7280';
  }

  static formatJoinDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static formatLastLogin(date) {
    if (!date) return 'Never';
    
    const now = new Date();
    const loginDate = new Date(date);
    const diffTime = Math.abs(now - loginDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return loginDate.toLocaleDateString('en-IN');
  }

  static calculatePerformanceRating(performance) {
    const { leadsAssigned, totalSales, currentMonthSales } = performance;
    
    if (!leadsAssigned) return 'New';
    
    const conversionRate = (totalSales / leadsAssigned) * 100;
    const salesThisMonth = currentMonthSales || 0;
    
    // Simple performance calculation
    if (conversionRate >= 20 && salesThisMonth >= 3) return 'Excellent';
    if (conversionRate >= 15 && salesThisMonth >= 2) return 'Good';
    if (conversionRate >= 10 || salesThisMonth >= 1) return 'Average';
    return 'Needs Improvement';
  }

  static getPerformanceColor(rating) {
    const colors = {
      'Excellent': '#10B981',     // Green
      'Good': '#3B82F6',          // Blue
      'Average': '#F59E0B',       // Amber
      'Needs Improvement': '#EF4444', // Red
      'New': '#6B7280'            // Gray
    };
    return colors[rating] || '#6B7280';
  }

  static formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Format Indian phone numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91-${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 13 && cleaned.startsWith('91')) {
      return `+91-${cleaned.slice(2, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }
    return phone; // Return original if can't format
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone) {
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}

export default TeamService;