/* ============================================
   SULTANA ÉLÉGANCE — CINEMATIC EDITION
   ============================================ */
// Mark that JS is running — enables reveal animations
document.documentElement.classList.add('js-enabled');
// ===== PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      initAllAnimations();
    }, 2200);
  } else {
    initAllAnimations();
  }
});

function initAllAnimations() {
  initTheme();
  initCustomCursor();
  initCursorSpotlight();
  initScrollProgress();
  initParallax();
  initReveal();
  initSplitText();
  initMagneticElements();
  init3DTilt();
  initImageReveal();
  initModals();
  initGallery();
  initCalendar();
  initFavorites();
  initCatalogueFilters();
  initPriceCalculator();
  initLazyLoad();
  initParticles();
  initSmoothAnchor();
  initMobileMenu();
}

// ===== THEME TOGGLE =====
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  
  const saved = localStorage.getItem('sultana_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (saved === 'black-gold' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'black-gold');
  }
  
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'black-gold' ? 'white-gold' : 'black-gold';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sultana_theme', next);
    
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:var(--accent-gold);opacity:0.1;z-index:9999;pointer-events:none;transition:opacity 0.6s';
    document.body.appendChild(flash);
    requestAnimationFrame(() => flash.style.opacity = '0');
    setTimeout(() => flash.remove(), 600);
  });
}

// ===== CUSTOM CURSOR WITH TRAIL =====
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  document.body.appendChild(dot);
  
  const trails = [];
  for (let i = 0; i < 5; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.opacity = (0.3 - i * 0.05).toString();
    document.body.appendChild(trail);
    trails.push({ el: trail, x: 0, y: 0 });
  }
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Hover detection
  document.querySelectorAll('a, button, .product-card, .favorite-btn, .filter-tag').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
  
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    
    trails.forEach((trail, i) => {
      const delay = (i + 1) * 0.08;
      trail.x += (mouseX - trail.x) * (0.1 - i * 0.015);
      trail.y += (mouseY - trail.y) * (0.1 - i * 0.015);
      trail.el.style.left = trail.x + 'px';
      trail.el.style.top = trail.y + 'px';
    });
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ===== CURSOR SPOTLIGHT =====
function initCursorSpotlight() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  const spotlight = document.createElement('div');
  spotlight.className = 'cursor-spotlight';
  document.body.appendChild(spotlight);
  
  let mx = 0, my = 0, cx = 0, cy = 0;
  
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  
  function animate() {
    cx += (mx - cx) * 0.06;
    cy += (my - cy) * 0.06;
    spotlight.style.left = cx + 'px';
    spotlight.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}

// ===== PARALLAX =====
function initParallax() {
  const heroMedia = document.querySelector('.hero-media');
  const heroContent = document.querySelector('.hero-content');
  
  if (!heroMedia || window.matchMedia('(pointer: coarse)').matches) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled > window.innerHeight) return; // Stop calculating when hero is gone
    
    const rate = scrolled * 0.2;
    
    if (heroMedia) {
      heroMedia.style.transform = `translateY(${rate}px)`;
    }
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  }, { passive: true });
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  
  // Hero elements are already handled by CSS animation
  // Just mark them visible so they don't get stuck
  document.querySelectorAll('.hero .reveal').forEach(el => {
    el.classList.add('is-visible');
  });
  
  if (!('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('is-visible'));
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });
  
  items.forEach(item => {
    if (!item.closest('.hero')) {
      observer.observe(item);
    }
  });
}

// ===== SPLIT TEXT REVEAL =====
function initSplitText() {
  document.querySelectorAll('.split-text').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    el.classList.add('split-reveal');
    
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = `${i * 0.03}s`;
      el.appendChild(span);
    });
    
    // Observe for visibility
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    obs.observe(el);
  });
}

// ===== MAGNETIC ELEMENTS =====
function initMagneticElements() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  document.querySelectorAll('.magnetic-link, .main-nav a, .button').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ===== 3D CARD TILT =====
function init3DTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  document.querySelectorAll('.product-card, .feature-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== IMAGE REVEAL =====
function initImageReveal() {
  document.querySelectorAll('.img-reveal').forEach(img => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    obs.observe(img);
  });
}

// ===== GOLD PARTICLES =====
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const particleCount = 30;
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.gold = Math.random() > 0.5;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.gold 
        ? `rgba(200, 162, 74, ${this.opacity})`
        : `rgba(139, 31, 53, ${this.opacity * 0.5})`;
      ctx.fill();
      
      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(200, 162, 74, ${this.opacity * 0.1})`
        : `rgba(139, 31, 53, ${this.opacity * 0.05})`;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== TOAST =====
function showToast(message, type = 'success') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  requestAnimationFrame(() => toast.classList.add('show'));
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ===== MODAL =====
function initModals() {
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const overlay = document.getElementById(trigger.dataset.modal);
      if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

// ===== GALLERY =====
function initGallery() {
  const main = document.querySelector('.gallery-main img');
  const thumbs = document.querySelectorAll('.gallery-thumbs img');
  if (!main || !thumbs.length) return;
  
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      main.style.opacity = '0.5';
      main.style.transform = 'scale(1.05)';
      setTimeout(() => {
        main.src = thumb.dataset.src || thumb.src;
        main.style.opacity = '1';
        main.style.transform = 'scale(1)';
      }, 250);
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

// ===== CALENDAR =====
function initCalendar() {
  const container = document.querySelector('.calendar-grid');
  if (!container) return;
  
  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin",
                      "Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  let currentDate = new Date();
  const bookedDates = ['2026-05-15','2026-05-16','2026-05-20','2026-05-21','2026-05-25','2026-05-28'];
  
  function renderCalendar(date) {
    const year = date.getFullYear(), month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const header = container.closest('.calendar-widget')?.querySelector('.calendar-month');
    if (header) header.textContent = `${monthNames[month]} ${year}`;
    
    container.innerHTML = '';
    
    ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'calendar-day-header';
      el.textContent = d;
      container.appendChild(el);
    });
    
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'calendar-day empty';
      container.appendChild(el);
    }
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const el = document.createElement('div');
      el.className = 'calendar-day';
      el.textContent = day;
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      
      if (bookedDates.includes(dateStr)) el.classList.add('booked');
      if (dateStr === todayStr) el.classList.add('today');
      
      el.addEventListener('click', () => {
        if (el.classList.contains('booked')) {
          showToast('Date déjà réservée', 'error');
          return;
        }
        container.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
        const input = document.getElementById('date');
        if (input) input.value = dateStr;
      });
      
      container.appendChild(el);
    }
  }
  
  renderCalendar(currentDate);
  
  const widget = container.closest('.calendar-widget');
  widget?.querySelector('.calendar-prev')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });
  widget?.querySelector('.calendar-next')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });
}

// ===== FAVORITES =====
function initFavorites() {
  const favorites = JSON.parse(localStorage.getItem('sultana_favorites') || '[]');
  
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (favorites.includes(id)) btn.classList.add('active');
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const idx = favorites.indexOf(id);
      if (idx > -1) {
        favorites.splice(idx, 1);
        btn.classList.remove('active');
        showToast('Retiré des favoris', 'success');
      } else {
        favorites.push(id);
        btn.classList.add('active');
        showToast('Ajouté aux favoris ❤', 'success');
      }
      localStorage.setItem('sultana_favorites', JSON.stringify(favorites));
    });
  });
}

// ===== CATALOGUE FILTERS =====
function initCatalogueFilters() {
  const searchInput = document.querySelector('.search-box input');
  const filterTags = document.querySelectorAll('.filter-tag');
  const cards = document.querySelectorAll('.product-card');
  
  if (!cards.length) return;
  
  function filter() {
    const query = searchInput?.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
    const activeTag = document.querySelector('.filter-tag.active')?.dataset.filter || 'all';
    
    cards.forEach(card => {
      const name = card.querySelector('h2')?.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
      const price = parseInt(card.dataset.price || 0);
      const category = card.dataset.category || '';
      
      const matchesSearch = name.includes(query);
      let matchesTag = true;
      if (activeTag === 'pack') matchesTag = category === 'pack';
      else if (activeTag === 'under1000') matchesTag = price < 1000;
      else if (activeTag === 'premium') matchesTag = price >= 1000;
      
      card.style.display = matchesSearch && matchesTag ? 'block' : 'none';
    });
  }
  
  searchInput?.addEventListener('input', filter);
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      filter();
    });
  });
}

// ===== PRICE CALCULATOR =====
function initPriceCalculator() {
  const caftanSelect = document.getElementById('caftan');
  const durationSelect = document.getElementById('duration');
  const serviceSelect = document.getElementById('service');
  
  if (!caftanSelect || !durationSelect) return;
  
  const prices = {
    'zellige-royal': 950, 'mauve-joaillerie': 1100, 'perle-azur': 1250,
    'rouge-imperial': 1300, 'champagne-nacre': 900, 'rose-velours': 850,
    'pack-mariee-royal': 1800
  };
  const serviceFees = { 'none': 0, 'hair': 300, 'makeup': 400, 'full': 600 };
  
  function updateTotal() {
    const price = prices[caftanSelect.value] || 0;
    const days = parseInt(durationSelect.value) || 0;
    const service = serviceFees[serviceSelect?.value || 'none'] || 0;
    const subtotal = price * days;
    const total = subtotal + service;
    
    const set = (sel, txt) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = txt;
    };
    
    set('.calc-caftan', price > 0 ? `${price} MAD × ${days}j` : '--');
    set('.calc-days', days > 0 ? `${days} jour(s)` : '--');
    set('.calc-subtotal', subtotal > 0 ? `${subtotal} MAD` : '--');
    set('.calc-service', service > 0 ? `+${service} MAD` : '--');
    set('.calc-total', total > 0 ? `${total} MAD` : '--');
  }
  
  caftanSelect.addEventListener('change', updateTotal);
  durationSelect.addEventListener('change', updateTotal);
  serviceSelect?.addEventListener('change', updateTotal);
}

// ===== LAZY LOAD =====
function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });
  
  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

// ===== FORM HANDLING =====
function initFormHandling() {
  document.querySelectorAll(".lux-form").forEach((form) => {
    // Skip forms that have their own JS submit handler (identified by an id)
    if (form.id) return;
    const message = form.querySelector(".form-message");
    
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = [...form.querySelectorAll("input, select, textarea")];
      let isValid = true;
      
      fields.forEach((field) => {
        field.classList.remove("invalid");
        if (field.required && !field.value.trim()) {
          field.classList.add("invalid");
          isValid = false;
        }
        if (field.type === 'email' && field.value) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            field.classList.add("invalid");
            isValid = false;
          }
        }
        if (field.type === 'tel' && field.value) {
          if (!/^[+0-9\s]{8,}$/.test(field.value.replace(/\s/g,''))) {
            field.classList.add("invalid");
            isValid = false;
          }
        }
      });
      
      if (isValid) {
        showToast(form.dataset.success || "Merci, votre demande a bien été enregistrée.", "success");
        if (message) { message.textContent = ""; message.classList.remove("error"); }
        form.reset();
      } else {
        showToast("Veuillez vérifier les champs en rouge.", "error");
        if (message) {
          message.textContent = "Veuillez compléter correctement tous les champs.";
          message.classList.add("error");
        }
      }
    });
  });
}

// ===== SMOOTH ANCHOR =====
function initSmoothAnchor() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }
}

// Run form handling immediately
initFormHandling();