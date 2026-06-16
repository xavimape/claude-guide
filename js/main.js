/**
 * main.js — Claude AI Guide
 * Section deck SPA · Acordeones · Stagger · History API · Mobile · Progress bar
 * Vanilla JS, sin dependencias externas.
 */

/* ══════════════════════════════════════
   TAB SWITCHER
══════════════════════════════════════ */
function switchTab(btn, id) {
  var container = btn.closest('.tabs');
  container.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  container.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
}

/* ══════════════════════════════════════
   PROGRESS BAR
══════════════════════════════════════ */
function updateProgress() {
  var bar = document.getElementById('readProgress');
  if (!bar) return;
  var scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
  var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  var pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  bar.style.width = pct + '%';
  bar.setAttribute('aria-valuenow', pct);
}

/* ══════════════════════════════════════
   STAGGER REVEAL
══════════════════════════════════════ */
function staggerReveal(container, startDelay) {
  startDelay = startDelay || 60;
  var els = container.querySelectorAll(
    '.card, .scenario, .tip-box, .prompt-block, .cmd-row, .integration-card, .vuln-row'
  );
  els.forEach(function(el, i) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(12px)';
    el.style.transition = 'none';
    setTimeout(function() {
      el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, startDelay + i * 55);
  });
}

/* ══════════════════════════════════════
   SECTION DECK + HISTORY API
══════════════════════════════════════ */
var _allSections  = [];
var _currentId    = null;
var _skipPopstate = false;

function activateSection(id, pushHistory) {
  if (_currentId === id) {
    closeMobileMenu();
    return;
  }

  // Ocultar todas
  _allSections.forEach(function(s) {
    s.classList.remove('section-active');
    s.classList.add('section-hidden');
  });

  var target = document.getElementById(id);
  if (!target || target.tagName !== 'SECTION') return;

  target.classList.remove('section-hidden');
  target.classList.add('section-active');
  window.scrollTo(0, 0);
  _currentId = id;

  // History API
  if (pushHistory !== false) {
    var hash = id === 'hero' ? '' : '#' + id;
    history.pushState({ sectionId: id }, '', hash || window.location.pathname);
  }

  // Sidebar active
  document.querySelectorAll('.sidebar-group').forEach(function(g) { g.classList.remove('has-active'); });
  document.querySelectorAll('.sidebar-link, .sidebar-sub').forEach(function(link) {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    if (link.getAttribute('href') === '#' + id) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      var group = link.closest('.sidebar-group');
      if (group) group.classList.add('has-active');
    }
  });

  // Cerrar menú móvil
  closeMobileMenu();

  // Stagger reveal
  setTimeout(function() { staggerReveal(target, 80); }, 120);
}

/* ── popstate (botón Atrás/Adelante) ── */
window.addEventListener('popstate', function(e) {
  if (e.state && e.state.sectionId) {
    activateSection(e.state.sectionId, false);
  } else {
    activateSection('hero', false);
  }
});

/* ══════════════════════════════════════
   ACCORDION
══════════════════════════════════════ */
function initAccordions() {
  document.querySelectorAll('.subsection').forEach(function(sub) {
    var title = sub.querySelector('.subsection-title');
    if (!title) return;

    var innerEls = Array.prototype.filter.call(sub.children, function(el) {
      return !el.classList.contains('subsection-label') &&
             !el.classList.contains('subsection-title');
    });
    if (!innerEls.length) return;

    var body = document.createElement('div');
    var bodyId = 'acc-body-' + Math.random().toString(36).slice(2, 7);
    body.className  = 'accordion-body';
    body.id         = bodyId;
    innerEls.forEach(function(el) { body.appendChild(el); });
    sub.appendChild(body);

    var icon = document.createElement('span');
    icon.className   = 'accordion-icon';
    icon.textContent = '▶';
    icon.setAttribute('aria-hidden', 'true');
    title.classList.add('accordion-trigger');
    title.setAttribute('aria-expanded', 'false');
    title.setAttribute('aria-controls', bodyId);
    title.appendChild(icon);

    body._open = false;

    title.addEventListener('click', function() {
      toggleAccordion(body, icon, title);
    });

    // Keyboard: Space / Enter ya funciona en click para elementos con role button
    // Agregamos role para que sea anunciado correctamente
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(body, icon, title);
      }
    });
  });
}

function toggleAccordion(body, icon, title) {
  if (body._open) {
    body.style.maxHeight = body.scrollHeight + 'px';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        body.style.maxHeight = '0';
        icon.classList.remove('rotated');
        body._open = false;
        title.setAttribute('aria-expanded', 'false');
      });
    });
  } else {
    body.style.maxHeight = body.scrollHeight + 'px';
    icon.classList.add('rotated');
    body._open = true;
    title.setAttribute('aria-expanded', 'true');
    setTimeout(function() {
      if (body._open) body.style.maxHeight = 'none';
    }, 520);
    staggerReveal(body, 100);
  }
}

/* ══════════════════════════════════════
   ABRIR SUBSECCIÓN POR ID
══════════════════════════════════════ */
function openSubsection(id) {
  var target = document.getElementById(id);
  if (!target) return;

  var parentSection = target.closest('section[id]');
  if (parentSection) activateSection(parentSection.id);

  var sub = target.classList.contains('subsection')
    ? target
    : target.closest('.subsection');
  if (!sub) return;

  var body  = sub.querySelector('.accordion-body');
  var icon  = sub.querySelector('.accordion-icon');
  var title = sub.querySelector('.accordion-trigger');

  if (body && !body._open) {
    body.style.maxHeight = body.scrollHeight + 'px';
    if (icon)  icon.classList.add('rotated');
    if (title) title.setAttribute('aria-expanded', 'true');
    body._open = true;
    setTimeout(function() {
      if (body._open) body.style.maxHeight = 'none';
    }, 520);
    staggerReveal(body, 100);
  }

  setTimeout(function() {
    sub.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 250);

  document.querySelectorAll('.sidebar-group').forEach(function(g) { g.classList.remove('has-active'); });
  document.querySelectorAll('.sidebar-link, .sidebar-sub').forEach(function(link) {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    if (link.getAttribute('href') === '#' + id) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      var group = link.closest('.sidebar-group');
      if (group) group.classList.add('has-active');
    }
  });
}

/* ══════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════ */
function openMobileMenu() {
  var sidebar   = document.getElementById('mainSidebar');
  var overlay   = document.getElementById('sidebarOverlay');
  var hamburger = document.getElementById('navHamburger');
  if (!sidebar) return;
  sidebar.classList.add('sidebar-open');
  if (overlay)   { overlay.classList.add('active'); overlay.removeAttribute('aria-hidden'); }
  if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  var sidebar   = document.getElementById('mainSidebar');
  var overlay   = document.getElementById('sidebarOverlay');
  var hamburger = document.getElementById('navHamburger');
  if (!sidebar) return;
  sidebar.classList.remove('sidebar-open');
  if (overlay)   { overlay.classList.remove('active'); overlay.setAttribute('aria-hidden', 'true'); }
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════
   BOOTSTRAP
══════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', function() {

  // 1. Recopilar secciones
  _allSections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));

  // 2. Leer hash inicial para deep-linking
  var initialId = 'hero';
  if (window.location.hash) {
    var hashId = window.location.hash.slice(1);
    if (document.getElementById(hashId)) initialId = hashId;
  }

  // 3. Ocultar todas
  _allSections.forEach(function(s) {
    s.classList.add('section-hidden');
  });

  // 4. Activar sección inicial sin pushState
  activateSection(initialId, false);
  history.replaceState({ sectionId: initialId }, '', window.location.hash || window.location.pathname);

  // 5. Sidebar: animación escalonada de entrada
  document.querySelectorAll('.sidebar-link, .sidebar-sub').forEach(function(el, i) {
    el.classList.add('sb-animate');
    el.style.animationDelay = (80 + i * 32) + 'ms';
  });

  // 6. Init acordeones
  initAccordions();

  // 7. Wire links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var id = anchor.getAttribute('href').slice(1);
      if (!id) { activateSection('hero'); return; }
      var el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === 'SECTION') {
        activateSection(id);
      } else {
        openSubsection(id);
      }
    });
  });

  // 8. Hamburger
  var hamburger = document.getElementById('navHamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      var isOpen = document.getElementById('mainSidebar').classList.contains('sidebar-open');
      if (isOpen) closeMobileMenu(); else openMobileMenu();
    });
  }

  // 9. Overlay click
  var overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  // 10. Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // 11. Progress bar
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
});
