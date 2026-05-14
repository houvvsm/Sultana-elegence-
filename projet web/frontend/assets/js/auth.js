/* ============================================
   SULTANA ÉLÉGANCE — Auth State & Navigation
   ============================================ */

let currentUser = null;

async function initAuth() {
  const result = await API.session();
  currentUser = result.logged_in ? result : null;
  updateNav();
  
  // If on admin page and not admin, redirect
  if (document.body.dataset.page === 'admin') {
    if (!currentUser || currentUser.role !== 'admin') {
      window.location.href = 'auth.html';
      return;
    }
    // Show admin name in header
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl && currentUser) adminNameEl.textContent = currentUser.name;
  }
  
  // If on client page and not logged in, redirect
  if (document.body.dataset.page === 'client') {
    if (!currentUser) {
      window.location.href = 'auth.html';
      return;
    }
  }
}

function updateNav() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  
  // Find or create account section
  let accountSection = nav.querySelector('.nav-account');
  if (!accountSection) {
    accountSection = document.createElement('div');
    accountSection.className = 'nav-account';
    accountSection.style.cssText = 'display:flex;align-items:center;gap:10px;margin-left:auto;';
    nav.appendChild(accountSection);
  }
  
  if (currentUser) {
    // Logged in
    const isAdmin = currentUser.role === 'admin';
    accountSection.innerHTML = `
      <div class="nav-user" style="position:relative;">
        <button class="nav-user-toggle" style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid var(--border-gold);background:var(--bg-card);cursor:pointer;color:var(--text-primary);font:inherit;font-weight:700;font-size:0.85rem;">
          <span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent-gold),var(--accent-blush));display:grid;place-items:center;color:var(--bg-primary);font-size:0.75rem;">${currentUser.name.charAt(0).toUpperCase()}</span>
          <span>${currentUser.name.split(' ')[0]}</span>
          <span style="font-size:0.6rem;opacity:0.6;">▼</span>
        </button>
        <div class="nav-user-menu" style="display:none;position:absolute;top:calc(100%+8px);right:0;background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;padding:8px;min-width:180px;box-shadow:0 16px 40px var(--shadow-color);z-index:100;">
          ${isAdmin ? '<a href="admin.html" style="display:block;padding:10px 14px;border-radius:12px;color:var(--text-primary);font-size:0.9rem;font-weight:700;transition:all 0.2s;">Tableau de bord</a>' : '<a href="client.html" style="display:block;padding:10px 14px;border-radius:12px;color:var(--text-primary);font-size:0.9rem;font-weight:700;transition:all 0.2s;">Espace client</a>'}
          <a href="catalogue.html" style="display:block;padding:10px 14px;border-radius:12px;color:var(--text-muted);font-size:0.9rem;transition:all 0.2s;">Catalogue</a>
          <hr style="border:0;border-top:1px solid var(--border-color);margin:6px 0;">
          <button onclick="handleLogout()" style="display:block;width:100%;text-align:left;padding:10px 14px;border-radius:12px;border:0;background:transparent;color:var(--accent-rose);font:inherit;font-size:0.9rem;font-weight:700;cursor:pointer;transition:all 0.2s;">Déconnexion</button>
        </div>
      </div>
    `;
    
    // Toggle dropdown
    const toggle = accountSection.querySelector('.nav-user-toggle');
    const menu = accountSection.querySelector('.nav-user-menu');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => { menu.style.display = 'none'; });
    
    // Hide login/register links
    nav.querySelectorAll('a[href="login.html"], a[href="register.html"]').forEach(a => a.style.display = 'none');
    
  } else {
    // Not logged in
    accountSection.innerHTML = `
      <a href="auth.html" style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid var(--border-gold);background:var(--bg-card);color:var(--text-primary);font-weight:700;font-size:0.85rem;transition:all 0.3s;">
        <span style="width:28px;height:28px;border-radius:50%;border:1.5px solid var(--accent-gold);display:grid;place-items:center;font-size:0.85rem;">👤</span>
        <span>Connexion</span>
      </a>
    `;
    
    // Show login/register
    nav.querySelectorAll('a[href="login.html"], a[href="register.html"]').forEach(a => a.style.display = '');
  }
}

async function handleLogout() {
  try {
    await API.logout();
  } catch (e) {
    // Ignore network errors — still log out locally
  }
  currentUser = null;
  window.location.href = 'index.html';
}

// Initialize on every page
document.addEventListener('DOMContentLoaded', initAuth);