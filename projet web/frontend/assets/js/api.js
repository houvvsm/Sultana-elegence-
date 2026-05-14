/* ============================================
   SULTANA ÉLÉGANCE — API Service Layer
   ============================================ */

const API_BASE = 'http://localhost/projet%20web/backend/api/';
const ADMIN_BASE = 'http://localhost/projet%20web/backend/admin/';

const API = {
  // Auth
  async session() {
    return fetch(API_BASE + 'session.php', { credentials: 'include' }).then(r => r.json());
  },
  
  async login(email, password) {
    const form = new FormData();
    form.append('email', email);
    form.append('password', password);
    return fetch(API_BASE + 'login.php', {
      method: 'POST',
      body: form,
      credentials: 'include'
    }).then(r => r.json());
  },
  
  async logout() {
    return fetch(API_BASE + 'logout.php', { credentials: 'include' }).then(r => r.json());
  },
  
  async register(data) {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) form.append(k, v); });
    return fetch(API_BASE + 'register.php', {
      method: 'POST',
      body: form,
      credentials: 'include'
    }).then(r => r.json());
  },
  
  // Caftans
  async getCaftans(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return fetch(API_BASE + 'get_caftans.php?' + params, { credentials: 'include' }).then(r => r.json());
  },
  
  async getCaftan(id) {
    return fetch(API_BASE + 'get_caftan.php?id=' + id, { credentials: 'include' }).then(r => r.json());
  },
  
  async getCategories() {
    return fetch(API_BASE + 'get_categories.php', { credentials: 'include' }).then(r => r.json());
  },
  
  // Favorites
  async toggleFavorite(caftanId) {
    const form = new FormData();
    form.append('caftan_id', caftanId);
    return fetch(API_BASE + 'add_favorite.php', {
      method: 'POST',
      body: form,
      credentials: 'include'
    }).then(r => r.json());
  },
  
  async getFavorites() {
    return fetch(API_BASE + 'get_favorites.php', { credentials: 'include' }).then(r => r.json());
  },
  
  // Reservations
  async createReservation(data) {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) form.append(k, v); });
    return fetch(API_BASE + 'create_reservation.php', {
      method: 'POST',
      body: form,
      credentials: 'include'
    }).then(r => r.json());
  },
  
  async getReservations() {
    return fetch(API_BASE + 'get_reservations.php', { credentials: 'include' }).then(r => r.json());
  },
  
  // Partners
  async getPartners(type = null) {
    const url = type ? API_BASE + 'get_partners.php?type=' + type : API_BASE + 'get_partners.php';
    return fetch(url, { credentials: 'include' }).then(r => r.json());
  },
  
  async submitPartner(data) {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) form.append(k, v); });
    return fetch(API_BASE + 'submit_partner.php', {
      method: 'POST',
      body: form,
      credentials: 'include'
    }).then(r => r.json());
  },
  
  // Admin
  async adminSession() {
    return fetch(ADMIN_BASE + 'get_admin_session.php', { credentials: 'include' }).then(r => r.json());
  },
  
  async getStats() {
    return fetch(ADMIN_BASE + 'get_stats.php', { credentials: 'include' }).then(r => r.json());
  },
  
  async getAllReservations() {
    return fetch(ADMIN_BASE + 'get_all_reservations.php', { credentials: 'include' }).then(r => r.json());
  },
  
  async updateReservation(id, status) {
    const form = new FormData();
    form.append('id', id);
    form.append('status', status);
    return fetch(ADMIN_BASE + 'update_reservation.php', {
      method: 'POST',
      body: form,
      credentials: 'include'
    }).then(r => r.json());
  },
  
  async getClients() {
    return fetch(ADMIN_BASE + 'get_clients.php', { credentials: 'include' }).then(r => r.json());
  },
  
  async getAdminPartners(status = null) {
    const url = status ? ADMIN_BASE + 'get_partners.php?status=' + status : ADMIN_BASE + 'get_partners.php';
    return fetch(url, { credentials: 'include' }).then(r => r.json());
  },
  
  async updatePartner(id, status) {
    const form = new FormData();
    form.append('id', id);
    form.append('status', status);
    return fetch(ADMIN_BASE + 'update_partner.php', {
      method: 'POST',
      body: form,
      credentials: 'include'
    }).then(r => r.json());
  },
  
  async getAdminCaftans() {
    return fetch(ADMIN_BASE + 'get_caftans_admin.php', { credentials: 'include' }).then(r => r.json());
  },
  
  async addCaftan(formData) {
    return fetch(ADMIN_BASE + 'add_caftan.php', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then(r => r.json());
  },
  
  async editCaftan(formData) {
    return fetch(ADMIN_BASE + 'edit_caftan.php', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then(r => r.json());
  },
  
  async deleteCaftan(id) {
    const form = new FormData();
    form.append('id', id);
    return fetch(ADMIN_BASE + 'delete_caftan.php', {
      method: 'POST',
      body: form,
      credentials: 'include'
    }).then(r => r.json());
  }
};