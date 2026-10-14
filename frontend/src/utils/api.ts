/**
 * Backend API Client for Student Study Planner
 * Connects frontend to the Express + MongoDB Atlas backend
 */

// Use VITE_API_URL from environment or fallback to relative /api (proxied in Vite dev server)
export const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('ssp_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async checkHealth(): Promise<{ status: string; database?: string } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async login(email: string, password: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      if (data.token) {
        localStorage.setItem('ssp_jwt_token', data.token);
      }
      return { success: true, user: data.user, token: data.token };
    } catch (err: any) {
      return { success: false, error: err.message || 'Cannot reach backend server' };
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      if (data.token) {
        localStorage.setItem('ssp_jwt_token', data.token);
      }
      return { success: true, user: data.user, token: data.token };
    } catch (err: any) {
      return { success: false, error: err.message || 'Cannot reach backend server' };
    }
  },

  async forgotPassword(email: string, newPassword: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to reset password' };
      }
      if (data.token) {
        localStorage.setItem('ssp_jwt_token', data.token);
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Cannot reach backend server' };
    }
  },

  async getUserData(userId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/data/${encodeURIComponent(userId)}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  async saveUserData(userId: string, data: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/data/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async resetUserData(userId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/data/${encodeURIComponent(userId)}/reset`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
        },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('ssp_jwt_token');
  }
};
