/* ==========================================================================
   PREMIUM LAMBORGHINI AUTOMOTIVE WEBSITE - MAIN CONTROLLER
   Preloader | Header Nav | Custom Cursor | Page Transitions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeaderNav();
  initCustomCursor();
  initPageTransitions();
  setActiveNavLink();
});

/* ==========================================================================
   1. PRELOADER CONTROLLER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressFill = document.querySelector('.preloader-progress-fill');
  const counterText = document.querySelector('.preloader-counter');

  if (!preloader) return;

  let currentProgress = 0;
  const targetProgress = 100;
  const duration = 1200; // ms
  const intervalTime = 20;
  const increment = targetProgress / (duration / intervalTime);

  const counterInterval = setInterval(() => {
    currentProgress += increment;
    if (currentProgress >= targetProgress) {
      currentProgress = 100;
      clearInterval(counterInterval);

      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.add('page-loaded');
      }, 300);
    }

    if (progressFill) progressFill.style.width = `${Math.floor(currentProgress)}%`;
    if (counterText) counterText.textContent = `${Math.floor(currentProgress).toString().padStart(2, '0')}%`;
  }, intervalTime);
}

/* ==========================================================================
   2. HEADER NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initHeaderNav() {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  // Sticky backdrop blur header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile drawer toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isActive = mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close on esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. CUSTOM LUXURY CURSOR
   ========================================================================== */
function initCustomCursor() {
  // Check if touch device or screen width <= 768px
  if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) {
    return;
  }

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';

  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateFollower);
  }
  requestAnimationFrame(animateFollower);

  // Hover triggers
  const interactiveSelectors = 'a, button, .model-card, .btn-primary, .btn-secondary, .filter-btn';
  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.querySelectorAll('.gallery-card, .model-card-img-wrapper').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-view'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-view'));
  });
}

/* ==========================================================================
   4. ELEGANT PAGE TRANSITIONS
   ========================================================================== */
function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('http')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 450);
    });
  });
}
