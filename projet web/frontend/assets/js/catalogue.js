/* ============================================
   SULTANA ÉLÉGANCE — Dynamic Catalogue
   ============================================ */

let allCaftans = [];
let currentFilter = 'all';
let currentSearch = '';

async function initCatalogue() {
  await loadCaftans();
  initFilters();
  initSearch();
}

async function loadCaftans() {
  const grid = document.getElementById('catalogueGrid');
  if (!grid) return;
  
  // Show skeleton loaders while fetching
  grid.innerHTML = Array(4).fill(`
    <article class="product-card skeleton-shimmer" style="height:420px;border-radius:var(--radius);">
      <div style="height:280px;background:var(--bg-secondary);border-radius:var(--radius) var(--radius) 0 0;"></div>
      <div style="padding:24px;">
        <div style="height:24px;width:60%;background:var(--bg-secondary);border-radius:8px;margin-bottom:12px;"></div>
        <div style="height:18px;width:40%;background:var(--bg-secondary);border-radius:8px;"></div>
      </div>
    </article>
  `).join('');
  
  try {
    const data = await API.getCaftans();
    allCaftans = data;
    renderCaftans();
  } catch (err) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:60px;">Erreur de chargement. Veuillez réessayer.</p>';
    console.error(err);
  }
}

function renderCaftans() {
  const grid = document.getElementById('catalogueGrid');
  if (!grid) return;
  
  let filtered = allCaftans.filter(c => {
    const matchesSearch = !currentSearch || 
      c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(currentSearch) ||
      (c.description && c.description.toLowerCase().includes(currentSearch));
    
    let matchesTag = true;
    if (currentFilter === 'pack') matchesTag = c.category === 'pack_mariee';
    else if (currentFilter === 'under1000') matchesTag = parseFloat(c.price_per_day) < 1000;
    else if (currentFilter === 'premium') matchesTag = parseFloat(c.price_per_day) >= 1000;
    
    return matchesSearch && matchesTag;
  });
  
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:60px;">Aucun caftan trouvé.</p>';
    return;
  }
  
  grid.innerHTML = filtered.map(caftan => {
    const isPack = caftan.category === 'pack_mariee';
    const price = parseFloat(caftan.price_per_day).toFixed(0);
    const image = caftan.image_main || 'assets/images/placeholder.jpg';
    
    return `
      <article class="product-card ${isPack ? 'product-card-featured' : ''}" data-price="${price}" data-category="${caftan.category}" data-id="${caftan.id}">
        <button class="favorite-btn" data-id="${caftan.id}" aria-label="Ajouter aux favoris" onclick="event.preventDefault(); toggleFavorite(${caftan.id}, this)">♥</button>
        <img src="${image}" alt="${caftan.name}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
        <div>
          <h2>${caftan.name}</h2>
          <p>${price} MAD / jour</p>
          <a class="button button-card" href="details.html?id=${caftan.id}">Voir détails</a>
        </div>
      </article>
    `;
  }).join('');
  
  // Re-init favorites state
  initFavoriteButtons();
}

function initFilters() {
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      currentFilter = tag.dataset.filter || 'all';
      renderCaftans();
    });
  });
}

function initSearch() {
  const searchInput = document.querySelector('.search-box input');
  if (!searchInput) return;
  
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentSearch = e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      renderCaftans();
    }, 300);
  });
}

async function toggleFavorite(caftanId, btn) {
  if (!currentUser) {
    showToast('Connectez-vous pour ajouter aux favoris', 'error');
    setTimeout(() => window.location.href = 'auth.html', 1000);
    return;
  }
  
  try {
    const result = await API.toggleFavorite(caftanId);
    if (result.favorited) {
      btn.classList.add('active');
      showToast('Ajouté aux favoris ❤', 'success');
    } else {
      btn.classList.remove('active');
      showToast('Retiré des favoris', 'success');
    }
  } catch (err) {
    showToast('Erreur', 'error');
  }
}

function initFavoriteButtons() {
  // If user is logged in, check which caftans are favorited
  if (!currentUser) return;
  
  API.getFavorites().then(favs => {
    const favIds = favs.map(f => f.id);
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      if (favIds.includes(parseInt(btn.dataset.id))) {
        btn.classList.add('active');
      }
    });
  }).catch(() => {});
}

// Init
document.addEventListener('DOMContentLoaded', initCatalogue);