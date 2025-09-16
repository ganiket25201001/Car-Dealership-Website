import { apiClient, handleApiResponse, handleApiError } from './apiClient';

// Authentication Service
export class AuthService {
  // Login user
  static async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      
      const data = handleApiResponse(response);
      
      // Store token
      if (data.token) {
        apiClient.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Register new user
  static async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const data = handleApiResponse(response);
      
      // Store token
      if (data.token) {
        apiClient.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Logout user
  static async logout() {
    try {
      await apiClient.get('/auth/logout');
      apiClient.setToken(null);
      return true;
    } catch (error) {
      // Even if logout fails on server, clear local token
      apiClient.setToken(null);
      throw new Error(handleApiError(error));
    }
  }

  // Get current user profile
  static async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update user profile
  static async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/auth/me', profileData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update password
  static async updatePassword(passwordData) {
    try {
      const response = await apiClient.put('/auth/updatepassword', passwordData);
      const data = handleApiResponse(response);
      
      // Update token if returned
      if (data.token) {
        apiClient.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Forgot password
  static async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgotpassword', { email });
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Reset password
  static async resetPassword(token, password, confirmPassword) {
    try {
      const response = await apiClient.put(`/auth/resetpassword/${token}`, {
        password,
        confirmPassword
      });
      
      const data = handleApiResponse(response);
      
      // Store new token
      if (data.token) {
        apiClient.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Check authentication status
  static async checkAuth() {
    try {
      const response = await apiClient.get('/auth/check');
      const data = handleApiResponse(response);
      return data.isAuthenticated;
    } catch (error) {
      return false;
    }
  }

  // Get stored token
  static getToken() {
    return apiClient.getToken();
  }

  // Check if user is logged in
  static isLoggedIn() {
    const token = this.getToken();
    return !!token;
  }
}

export default AuthService;