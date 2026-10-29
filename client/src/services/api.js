/**
 * RockCity Explorer - API Client Service
 */

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('rockcity_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Public Places (SRS Section 24: Support category, openNow, sort, search)
  async getPlaces(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.categories && params.categories.length > 0) {
      query.append('categories', params.categories.join(','));
    }
    if (params.openNow) query.append('openNow', 'true');
    if (params.sort) query.append('sort', params.sort);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/places${queryString}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Unable to connect to RockCity Explorer API');
    }
    return await res.json();
  },

  async getPlaceById(id) {
    const res = await fetch(`${API_BASE}/places/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Place not found');
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to load place details');
    }
    return await res.json();
  },

  // Admin Places API (Section 17, 18, 19, 20, 23)
  async getAdminSummary() {
    const res = await fetch(`${API_BASE}/admin/places/summary`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load admin summary');
    return await res.json();
  },

  async getAdminPlaces(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/admin/places${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load admin places');
    return await res.json();
  },

  async createAdminPlace(data) {
    const res = await fetch(`${API_BASE}/admin/places`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create place');
    return result;
  },

  async updateAdminPlace(id, data) {
    const res = await fetch(`${API_BASE}/admin/places/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update place');
    return result;
  },

  async archiveAdminPlace(id) {
    const res = await fetch(`${API_BASE}/admin/places/${id}/archive`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to archive place');
    return result;
  },

  async deleteAdminPlace(id) {
    const res = await fetch(`${API_BASE}/admin/places/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to delete place');
    return result;
  },

  async restoreAdminPlace(id) {
    const res = await fetch(`${API_BASE}/admin/places/${id}/restore`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to restore place');
    return result;
  },

  // Public Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to load categories');
    return await res.json();
  },

  async createCategory(data) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create category');
    return result;
  },

  async updateCategory(id, data) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update category');
    return result;
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to delete category');
    return result;
  },

  // Plan Calculations & Management
  async calculatePlan(placeIds, includeReturn = false) {
    const res = await fetch(`${API_BASE}/plans/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeIds, includeReturn })
    });
    if (!res.ok) throw new Error('Failed to calculate itinerary metrics');
    return await res.json();
  },

  async savePlan(planData) {
    const res = await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to save itinerary');
    return result;
  },

  async getPlanByCode(planCode) {
    const res = await fetch(`${API_BASE}/plans/${planCode}`);
    if (!res.ok) throw new Error('Plan not found');
    return await res.json();
  },

  // Authentication
  async loginAdmin(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: identifier, email: identifier, password })
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Invalid username or password.');
    }
    return result;
  },

  async logoutAdmin() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (e) {
      // ignore
    }
  },

  async getAdminProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Session invalid');
    return await res.json();
  }
};
