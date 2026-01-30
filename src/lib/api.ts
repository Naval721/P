// API service for AyurSutra frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
    clinicName?: string;
  }) {
    return this.request<{ message: string; practitioner: any; token: string }>('/practitioner/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<{ message: string; practitioner: any; token: string }>('/practitioner/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request<{ user: any }>('/auth/profile');
  }

  async updateProfile(profileData: any) {
    return this.request<{ message: string; user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async verifyToken() {
    return this.request<{ valid: boolean; user: any }>('/auth/verify');
  }

  // Patient endpoints
  async getPatients(practitionerId: string) {
    return this.request<any[]>(`/patients/${practitionerId}`);
  }

  async getPatient(id: string) {
    return this.request<{ patient: any }>(`/patients/${id}`);
  }

  async createPatient(patientData: {
    practitionerId: string;
    name: string;
    email?: string;
    phone?: string;
    primaryDosha?: string;
    healthNotes?: string;
  }) {
    return this.request<{ message: string; patient: any }>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id: string, patientData: {
    name: string;
    email?: string;
    phone?: string;
    primaryDosha?: string;
    healthNotes?: string;
  }) {
    return this.request<{ message: string; updatedCount: number }>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id: string) {
    return this.request<{ message: string; deletedCount: number }>(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  async getPatientStats() {
    return this.request<any>('/patients/stats/overview');
  }

  // Therapy Schedule endpoints
  async createTherapySchedule(scheduleData: {
    patientId: string;
    practitionerId: string;
    therapyName: string;
    scheduledDate: string;
    scheduledTime?: string;
    status?: string;
    precautions?: string[];
  }) {
    return this.request<{ message: string; schedule: any }>('/therapy', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  async getPractitionerSchedules(practitionerId: string) {
    return this.request<any[]>(`/therapy/practitioner/${practitionerId}`);
  }

  async getPatientSchedules(patientId: string) {
    return this.request<any[]>(`/therapy/patient/${patientId}`);
  }

  async updateTherapySchedule(id: string, scheduleData: {
    therapyName?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    status?: string;
    precautions?: string[];
  }) {
    return this.request<{ message: string; updatedCount: number }>(`/therapy/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  }

  async addTherapyFeedback(id: string, feedback: string) {
    return this.request<{ message: string; updatedCount: number }>(`/therapy/feedback/${id}`, {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    });
  }

  // Appointment endpoints
  async getAppointments(params?: {
    page?: number;
    limit?: number;
    date?: string;
    status?: string;
    patientId?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      appointments: any[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/appointments?${queryParams.toString()}`);
  }

  async getAppointment(id: string) {
    return this.request<{ appointment: any }>(`/appointments/${id}`);
  }

  async createAppointment(appointmentData: any) {
    return this.request<{ message: string; appointment: any }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id: string, appointmentData: any) {
    return this.request<{ message: string; appointment: any }>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async cancelAppointment(id: string, reason: string, refundAmount?: number) {
    return this.request<{ message: string; appointment: any }>(`/appointments/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason, refundAmount }),
    });
  }

  async completeAppointment(id: string, data?: { notes?: string; patientFeedback?: any }) {
    return this.request<{ message: string; appointment: any }>(`/appointments/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify(data || {}),
    });
  }

  async getTodayAppointments() {
    return this.request<{ appointments: any[] }>('/appointments/today');
  }

  async getUpcomingAppointments(days?: number) {
    const queryParams = days ? `?days=${days}` : '';
    return this.request<{ appointments: any[] }>(`/appointments/upcoming${queryParams}`);
  }

  async getAppointmentStats() {
    return this.request<any>('/appointments/stats/overview');
  }

  // Treatment endpoints
  async getTreatmentTypes() {
    return this.request<{ treatmentTypes: any[] }>('/treatments/types');
  }

  async getTreatmentCategories() {
    return this.request<{ categories: any[] }>('/treatments/categories');
  }

  async getTreatmentProtocols() {
    return this.request<{ protocols: any }>('/treatments/protocols');
  }

  async getTreatmentRecommendations(dosha: string) {
    return this.request<{ recommendations: any }>(`/treatments/recommendations/${dosha}`);
  }

  // Inventory endpoints
  async getInventory(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    lowStock?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      items: any[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/inventory?${queryParams.toString()}`);
  }

  async getInventoryCategories() {
    return this.request<{ categories: any[] }>('/inventory/categories');
  }

  async getLowStockItems() {
    return this.request<{ lowStockItems: any[] }>('/inventory/low-stock');
  }

  async getExpiringItems(days?: number) {
    const queryParams = days ? `?days=${days}` : '';
    return this.request<{ expiringItems: any[] }>(`/inventory/expiring${queryParams}`);
  }

  async getInventoryStats() {
    return this.request<{ stats: any }>('/inventory/stats/overview');
  }

  async createInventoryItem(itemData: any) {
    return this.request<{ message: string; item: any }>('/inventory', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateInventoryItem(id: string, itemData: any) {
    return this.request<{ message: string; item: any }>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
