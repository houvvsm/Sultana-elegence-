/* ============================================
   SULTANA ÉLÉGANCE — Admin Dashboard
   Full caftan CRUD + client delete
   ============================================ */

const ADMIN_BASE_URL = 'http://localhost/projet%20web/backend/admin/';

async function initAdmin() {
  try {
    const session = await API.adminSession();
    if (!session.success) throw new Error('not admin');
  } catch {
    window.location.href = 'auth.html';
    return;
  }

  await Promise.all([
    loadStats(),
    loadAdminCaftans(),
    loadReservations(),
    loadClients(),
    loadPartners()
  ]);
}

// ─────────────────────────────────────────────
// STATS + REVENUE CHART
// ─────────────────────────────────────────────
async function loadStats() {
  try {
    const s = await API.getStats();
    document.getElementById('statCaftans').textContent      = s.caftans             ?? 0;
    document.getElementById('statReservations').textContent = s.reservations_active ?? 0;
    document.getElementById('statClients').textContent      = s.clients             ?? 0;
    document.getElementById('statPartners').textContent     = s.partners_pending    ?? 0;

  } catch (e) { console.error('Stats:', e); }
}


// ─────────────────────────────────────────────
// CAFTANS TABLE
// ─────────────────────────────────────────────
async function loadAdminCaftans() {
  const tbody = document.getElementById('caftansTableBody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">Chargement…</td></tr>`;

  try {
    const caftans = await API.getAdminCaftans();

    if (!caftans.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">Aucun caftan enregistré.</td></tr>`;
      return;
    }

    const statusStyle = {
      available:   'background:rgba(46,125,50,0.15);color:#4caf50;',
      reserved:    'background:rgba(200,162,74,0.15);color:var(--accent-gold);',
      maintenance: 'background:rgba(117,117,117,0.15);color:#9e9e9e;',
      hidden:      'background:rgba(139,31,53,0.15);color:var(--accent-rose);'
    };
    const statusLabel = { available:'Disponible', reserved:'Réservé', maintenance:'Maintenance', hidden:'Masqué' };
    const catLabel    = { caftan:'Caftan', pack_mariee:'Pack Mariée', accessoire:'Accessoire' };

    tbody.innerHTML = caftans.map(c => `
      <tr>
        <td>
          <img src="${c.image_main || 'assets/images/placeholder.jpg'}"
               style="width:58px;height:58px;border-radius:12px;object-fit:cover;border:1px solid var(--border-gold);"
               onerror="this.src='assets/images/placeholder.jpg'">
        </td>
        <td>
          <div style="font-weight:700;">${escHtml(c.name)}</div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${catLabel[c.category] || c.category}</div>
        </td>
        <td style="font-family:'Cinzel',serif;color:var(--accent-gold);font-weight:700;">
          ${parseFloat(c.price_per_day).toFixed(0)} MAD
        </td>
        <td>
          <span class="badge" style="${statusStyle[c.status] || ''}">
            ${statusLabel[c.status] || c.status}
          </span>
        </td>
        <td>
          <button class="action-btn" title="Modifier" onclick="editCaftan(${c.id})">✏️</button>
          <button class="action-btn danger" title="Supprimer" onclick="deleteCaftan(${c.id}, '${escHtml(c.name)}')">🗑️</button>
        </td>
      </tr>
    `).join('');

  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--accent-rose);">Erreur de chargement.</td></tr>`;
  }
}

// ─────────────────────────────────────────────
// CAFTAN CRUD helpers (called from admin.html)
// ─────────────────────────────────────────────
async function editCaftan(id) {
  try {
    // Fetch single caftan data from admin list (already loaded) or re-fetch
    const caftans = await API.getAdminCaftans();
    const caftan  = caftans.find(c => c.id === id);
    if (!caftan) { showToast('Caftan introuvable', 'error'); return; }
    openCaftanModal(caftan);
  } catch {
    showToast('Erreur de chargement', 'error');
  }
}

async function deleteCaftan(id, name) {
  if (!confirm(`Supprimer définitivement "${name}" ?\n\nCette action est irréversible.`)) return;
  try {
    const r = await API.deleteCaftan(id);
    if (r.success) { showToast('Caftan supprimé', 'success'); loadAdminCaftans(); loadStats(); }
    else showToast(r.error || 'Erreur', 'error');
  } catch { showToast('Erreur réseau', 'error'); }
}

// ─────────────────────────────────────────────
// RESERVATIONS
// ─────────────────────────────────────────────
function btnStyle(color) {
  return `padding:7px 13px;border-radius:8px;border:0;background:${color};color:#fff;font:inherit;font-size:0.8rem;font-weight:700;cursor:pointer;`;
}

async function loadReservations() {
  const dashEl = document.getElementById('reservationsList');
  const fullEl = document.getElementById('reservationsListFull');

  try {
    const reservations = await API.getAllReservations();

    // Guard: if API returned error object instead of array
    if (!Array.isArray(reservations)) {
      throw new Error('Invalid response: ' + JSON.stringify(reservations));
    }

    const renderHTML = (list) => {
      if (!list.length) return '<p style="text-align:center;padding:40px;color:var(--text-muted);">Aucune réservation.</p>';

      const statusInfo = {
        pending:   { text:'En attente',  color:'var(--accent-gold)' },
        confirmed: { text:'Confirmée',   color:'#4caf50' },
        delivered: { text:'Livrée',      color:'#2196f3' },
        returned:  { text:'Retournée',   color:'#9e9e9e' },
        cancelled: { text:'Annulée',     color:'var(--accent-rose)' }
      };

      return list.map(r => {
        const s = statusInfo[r.status] || statusInfo.pending;
        return `
          <div style="display:grid;grid-template-columns:70px 1fr auto;gap:16px;align-items:center;padding:16px;border-radius:16px;background:var(--bg-card);border:1px solid var(--border-color);margin-bottom:10px;">
            <img src="${r.caftan_image || 'assets/images/placeholder.jpg'}"
                 style="width:70px;height:70px;border-radius:12px;object-fit:cover;border:1px solid var(--border-gold);"
                 onerror="this.src='assets/images/placeholder.jpg'">
            <div>
              <div style="font-weight:700;font-size:0.98rem;">${escHtml(r.caftan_name)}</div>
              <div style="color:var(--text-muted);font-size:0.85rem;margin-top:3px;">${escHtml(r.client_name)} · ${r.city || 'N/A'} · ${r.duration_days}j · ${payLabel(r.payment_method)}</div>
              <div style="color:var(--accent-gold);font-weight:800;font-family:'Cinzel',serif;font-size:0.95rem;margin-top:3px;">${parseFloat(r.total_price).toFixed(0)} MAD</div>
            </div>
            <div style="text-align:right;">
              <span class="badge" style="background:${s.color}18;color:${s.color};border:1px solid ${s.color}30;">${s.text}</span>
              <div style="margin-top:8px;display:flex;gap:5px;justify-content:flex-end;flex-wrap:wrap;">
                ${r.status === 'pending'   ? `<button onclick="updateReservation(${r.id},'confirmed')" style="${btnStyle('#4caf50')}">Confirmer</button>` : ''}
                ${r.status === 'confirmed' ? `<button onclick="updateReservation(${r.id},'delivered')" style="${btnStyle('#2196f3')}">Livrer</button>` : ''}
                ${r.status === 'delivered' ? `<button onclick="updateReservation(${r.id},'returned')"  style="${btnStyle('#9e9e9e')}">Retourné</button>` : ''}
                ${!['cancelled','returned'].includes(r.status) ? `<button onclick="updateReservation(${r.id},'cancelled')" style="${btnStyle('var(--accent-rose)')}">Annuler</button>` : ''}
              </div>
            </div>
          </div>`;
      }).join('');
    };

    if (dashEl) dashEl.innerHTML = renderHTML(reservations.slice(0, 5));
    if (fullEl)  fullEl.innerHTML = renderHTML(reservations);

  } catch (e) {
    console.error('loadReservations error:', e);
    const err = '<p style="text-align:center;padding:40px;color:var(--accent-rose);">Erreur: ' + e.message + '</p>';
    if (dashEl) dashEl.innerHTML = err;
    if (fullEl) fullEl.innerHTML = err;
  }
}

async function updateReservation(id, status) {
  try {
    await API.updateReservation(id, status);
    showToast('Statut mis à jour', 'success');
    loadReservations();
    loadStats();
  } catch { showToast('Erreur', 'error'); }
}

// ─────────────────────────────────────────────
// CLIENTS — with delete
// ─────────────────────────────────────────────
async function loadClients() {
  const container = document.getElementById('clientsList');
  if (!container) return;

  try {
    const clients = await API.getClients();

    if (!clients.length) {
      container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-muted);">Aucun client.</p>';
      return;
    }

    container.innerHTML = `
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Ville</th>
              <th>Taille</th>
              <th>Réservations</th>
              <th>Inscrit le</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${clients.map(c => `
              <tr>
                <td style="font-weight:700;">${escHtml(c.name)}</td>
                <td style="color:var(--text-muted);font-size:0.88rem;">${escHtml(c.email)}</td>
                <td style="color:var(--text-muted);font-size:0.88rem;">${c.city || '—'}</td>
                <td style="color:var(--text-muted);font-size:0.88rem;">${c.size_profile || '—'}</td>
                <td style="color:var(--accent-gold);font-weight:800;">${c.reservation_count}</td>
                <td style="color:var(--text-muted);font-size:0.85rem;">${formatDate(c.created_at)}</td>
                <td>
                  <button class="action-btn danger" title="Supprimer ce client" onclick="deleteClient(${c.id}, '${escHtml(c.name)}')">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;

  } catch {
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--accent-rose);">Erreur de chargement.</p>';
  }
}

async function deleteClient(id, name) {
  if (!confirm(`Supprimer définitivement le compte de "${name}" ?\n\nSes réservations et favoris seront aussi supprimés.`)) return;

  try {
    const fd = new FormData();
    fd.append('id', id);
    const result = await fetch(ADMIN_BASE_URL + 'delete_user.php', {
      method: 'POST', body: fd, credentials: 'include'
    }).then(r => r.json());

    if (result.success) {
      showToast('Client supprimé', 'success');
      loadClients();
      loadStats();
    } else {
      showToast(result.error || 'Erreur', 'error');
    }
  } catch { showToast('Erreur réseau', 'error'); }
}

// ─────────────────────────────────────────────
// PARTNERS
// ─────────────────────────────────────────────
async function loadPartners() {
  const container = document.getElementById('partnersList');
  if (!container) return;

  try {
    const partners = await API.getAdminPartners();

    if (!Array.isArray(partners)) {
      throw new Error('Invalid response: ' + JSON.stringify(partners));
    }

    if (!partners.length) {
      container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-muted);">Aucune demande.</p>';
      return;
    }

    container.innerHTML = partners.map(p => {
      const statusStyle = p.status === 'pending'
        ? 'background:rgba(200,162,74,0.15);color:var(--accent-gold);'
        : p.status === 'approved'
          ? 'background:rgba(76,175,80,0.15);color:#4caf50;'
          : 'background:rgba(139,31,53,0.15);color:var(--accent-rose);';
      const statusText = p.status === 'pending' ? 'En attente' : p.status === 'approved' ? 'Approuvé' : 'Rejeté';

      return `
        <div style="padding:22px;border-radius:16px;background:var(--bg-card);border:1px solid var(--border-color);margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:16px;">
            <div>
              <h3 style="margin:0 0 4px;font-size:1.05rem;">${escHtml(p.name)}</h3>
              <p style="margin:0;color:var(--text-muted);font-size:0.88rem;">${p.type === 'boutique' ? '🏪 Boutique' : '💄 Beauté'} · ${p.city} · ${p.phone || '—'}</p>
              ${p.message ? `<p style="margin:6px 0 0;color:var(--text-muted);font-size:0.83rem;">${escHtml(p.message)}</p>` : ''}
            </div>
            <div style="text-align:right;">
              <span class="badge" style="${statusStyle}">${statusText}</span>
              ${p.status === 'pending' ? `
                <div style="margin-top:8px;display:flex;gap:8px;">
                  <button onclick="updatePartner(${p.id},'approved')" style="${btnStyle('#4caf50')}">Approuver</button>
                  <button onclick="updatePartner(${p.id},'rejected')" style="${btnStyle('var(--accent-rose)')}">Rejeter</button>
                </div>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');

  } catch (e) {
    console.error('loadPartners error:', e);
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--accent-rose);">Erreur: ' + e.message + '</p>';
  }
}

async function updatePartner(id, status) {
  try {
    await API.updatePartner(id, status);
    showToast(status === 'approved' ? 'Partenaire approuvé ✓' : 'Partenaire rejeté', 'success');
    loadPartners(); loadStats();
  } catch { showToast('Erreur', 'error'); }
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────
function payLabel(m) {
  return m === 'card' ? '💳 Carte' : m === 'virement' ? '🏦 Virement' : '🚚 Livraison';
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' });
}

// ─────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initAdmin);