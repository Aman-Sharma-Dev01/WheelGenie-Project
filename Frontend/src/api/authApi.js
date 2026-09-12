import api from './axios';

/**
 * Log in with email and password
 * @param {Object} credentials - { email, password }
 */
export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Register a new user
 * @param {Object} userData - { name, email, password, phone, role? }
 */
export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Log in / sign up with a Google ID token (credential from Google Identity Services)
 * @param {string} credential - Google ID token JWT
 */
export const googleLoginApi = async (credential) => {
  const response = await api.post('/auth/google-login', { token: credential });
  return response.data;
};

/**
 * Get current authenticated user profile
 */
export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Logout user on the backend
 */
export const logoutApi = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch {
    // Ignore backend logout errors if token is already expired
    return { success: true };
  }
};

/**
 * Helper to extract user-friendly error message from API error
 */
export const getApiErrorMessage = (error) => {
  if (error.response && error.response.data) {
    if (error.response.data.message) {
      return error.response.data.message;
    }
    if (Array.isArray(error.response.data.errors)) {
      return error.response.data.errors.map((e) => e.message || e).join(', ');
    }
  }
  return error.message || 'Something went wrong. Please check your connection and try again.';
};
