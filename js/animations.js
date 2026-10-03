/* ==========================================================================
   PREMIUM LAMBORGHINI AUTOMOTIVE WEBSITE - ANIMATIONS & HERO CANVAS ENGINE
   Progress-Based Hero Scroll Lock | Wheel & Touch Pinning | Instant Responsiveness
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvasEngine();
  initInnerHeroCanvasEngine();
  initScrollRevealSystem();
  initAnimatedStatCounters();
  initMouseParallax();
});

/* ==========================================================================
   1. HOME PAGE HERO CANVAS FRAME SCRUBBING ENGINE (200 FRAMES)
   ========================================================================== */
function initHeroCanvasEngine() {
  const wrapper = document.querySelector('.hero-scroll-wrapper');
  const canvas = document.getElementById('hero-canvas');
  if (!wrapper || !canvas) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 200;
  const frames = [];
  let loadedFramesCount = 0;

  // Controlled Hero Progress (0.0 = Start / Banner 01, 1.0 = End / Final Banner)
  let heroProgress = 0.0;
  let targetFrameIndex = 0;
  let currentFrameIndex = 0;
  let isHeroCompleted = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(Math.round(currentFrameIndex));
  }
  window.addEventListener('resize', resizeCanvas);

  // Preload all 200 frame images dynamically from banner-images/
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `banner-images/ezgif-frame-${frameNum}.jpg`;

    img.onload = () => {
      loadedFramesCount++;
      if (loadedFramesCount === 1) {
        resizeCanvas();
        updateHeroState();
      }
    };
    frames.push(img);
  }

  function renderFrame(index) {
    if (!frames[index] || !frames[index].complete) return;
    const img = frames[index];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  }

  const scenes = document.querySelectorAll('.hero-scene');
  const counterCurrent = document.querySelector('.hero-counter .current-num');
  const progressFill = document.querySelector('.hero-progress-fill');

  function updateHeroState() {
    targetFrameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(heroProgress * TOTAL_FRAMES)));

    if (progressFill) {
      progressFill.style.width = `${(heroProgress * 100).toFixed(1)}%`;
    }

    const sceneIndex = Math.min(4, Math.floor(heroProgress * 5));
    scenes.forEach((scene, idx) => {
      if (idx === sceneIndex) {
        scene.classList.add('active');
      } else {
        scene.classList.remove('active');
      }
    });

    if (counterCurrent) {
      counterCurrent.textContent = String(sceneIndex + 1).padStart(2, '0');
    }
  }

  // Mouse Wheel Event Controller
  window.addEventListener('wheel', (e) => {
    // Only lock scroll when user is at top of page or within hero section
    if (window.scrollY <= 15) {
      if (e.deltaY > 0) {
        // Scrolling DOWN: Advance hero animation progress
        if (heroProgress < 1.0) {
          e.preventDefault();
          const step = Math.max(0.015, (Math.abs(e.deltaY) / 1200));
          heroProgress = Math.min(1.0, heroProgress + step);
          updateHeroState();
          if (heroProgress >= 1.0) {
            isHeroCompleted = true;
          }
        }
      } else if (e.deltaY < 0) {
        // Scrolling UP: Rewind hero animation progress
        if (heroProgress > 0.0) {
          e.preventDefault();
          const step = Math.max(0.015, (Math.abs(e.deltaY) / 1200));
          heroProgress = Math.max(0.0, heroProgress - step);
          updateHeroState();
          if (heroProgress < 1.0) {
            isHeroCompleted = false;
          }
        }
      }
    } else if (window.scrollY <= window.innerHeight + 50 && e.deltaY < 0 && isHeroCompleted) {
      // User scrolled up back to top of page: re-lock onto hero
      if (window.scrollY <= 20) {
        e.preventDefault();
        heroProgress = 0.99;
        isHeroCompleted = false;
        updateHeroState();
      }
    }
  }, { passive: false });

  // Touch Swipe Controller for Mobile Devices
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (window.scrollY <= 15 && e.touches.length === 1) {
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY; // Positive = swipe UP (scroll down)

      if (deltaY > 0 && heroProgress < 1.0) {
        e.preventDefault();
        heroProgress = Math.min(1.0, heroProgress + (deltaY / (window.innerHeight * 1.5)));
        touchStartY = currentY;
        updateHeroState();
      } else if (deltaY < 0 && heroProgress > 0.0) {
        e.preventDefault();
        heroProgress = Math.max(0.0, heroProgress + (deltaY / (window.innerHeight * 1.5)));
        touchStartY = currentY;
        updateHeroState();
      }
    }
  }, { passive: false });

  // 60fps Smooth Lerp Rendering Loop
  function renderLoop() {
    if (Math.abs(targetFrameIndex - currentFrameIndex) > 0.01) {
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.25;
      renderFrame(Math.round(currentFrameIndex));
    }
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  updateHeroState();
}

/* ==========================================================================
   2. INNER PAGE HERO CANVAS ENGINE (220 FRAMES)
   ========================================================================== */
function initInnerHeroCanvasEngine() {
  const wrapper = document.querySelector('.inner-hero-scroll-wrapper');
  const canvas = document.getElementById('inner-hero-canvas');
  if (!wrapper || !canvas) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 220;
  const frames = [];
  let loadedFramesCount = 0;

  let innerProgress = 0.0;
  let targetFrameIndex = 0;
  let currentFrameIndex = 0;
  let isInnerCompleted = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(Math.round(currentFrameIndex));
  }
  window.addEventListener('resize', resizeCanvas);

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const num = String(i).padStart(3, '0');
    img.src = `inner-pages-banner-images/ezgif-frame-${num}.jpg`;

    img.onload = () => {
      loadedFramesCount++;
      if (loadedFramesCount === 1) {
        resizeCanvas();
        updateInnerState();
      }
    };
    frames.push(img);
  }

  function renderFrame(index) {
    if (!frames[index] || !frames[index].complete) return;
    const img = frames[index];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.drawImage(
      img, 0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  }

  const innerContent = document.querySelector('.inner-hero-content');

  function updateInnerState() {
    targetFrameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(innerProgress * TOTAL_FRAMES)));

    if (innerContent) {
      innerContent.style.transform = `translateY(${innerProgress * -40}px)`;
      innerContent.style.opacity = `${1 - innerProgress * 0.7}`;
    }
  }

  // Mouse Wheel Controller for Inner Banners
  window.addEventListener('wheel', (e) => {
    if (window.scrollY <= 15) {
      if (e.deltaY > 0) {
        if (innerProgress < 1.0) {
          e.preventDefault();
          const step = Math.max(0.015, (Math.abs(e.deltaY) / 1200));
          innerProgress = Math.min(1.0, innerProgress + step);
          updateInnerState();
          if (innerProgress >= 1.0) {
            isInnerCompleted = true;
          }
        }
      } else if (e.deltaY < 0) {
        if (innerProgress > 0.0) {
          e.preventDefault();
          const step = Math.max(0.015, (Math.abs(e.deltaY) / 1200));
          innerProgress = Math.max(0.0, innerProgress - step);
          updateInnerState();
          if (innerProgress < 1.0) {
            isInnerCompleted = false;
          }
        }
      }
    } else if (window.scrollY <= window.innerHeight + 50 && e.deltaY < 0 && isInnerCompleted) {
      if (window.scrollY <= 20) {
        e.preventDefault();
        innerProgress = 0.99;
        isInnerCompleted = false;
        updateInnerState();
      }
    }
  }, { passive: false });

  // Touch Controller for Mobile
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (window.scrollY <= 15 && e.touches.length === 1) {
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;

      if (deltaY > 0 && innerProgress < 1.0) {
        e.preventDefault();
        innerProgress = Math.min(1.0, innerProgress + (deltaY / (window.innerHeight * 1.5)));
        touchStartY = currentY;
        updateInnerState();
      } else if (deltaY < 0 && innerProgress > 0.0) {
        e.preventDefault();
        innerProgress = Math.max(0.0, innerProgress + (deltaY / (window.innerHeight * 1.5)));
        touchStartY = currentY;
        updateInnerState();
      }
    }
  }, { passive: false });

  function renderLoop() {
    if (Math.abs(targetFrameIndex - currentFrameIndex) > 0.01) {
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.25;
      renderFrame(Math.round(currentFrameIndex));
    }
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  updateInnerState();
}

/* ==========================================================================
   3. SCROLL REVEAL SYSTEM (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollRevealSystem() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. ANIMATED STAT COUNTERS
   ========================================================================== */
function initAnimatedStatCounters() {
  const statElements = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseFloat(entry.target.getAttribute('data-count'));
        const decimals = parseInt(entry.target.getAttribute('data-decimals') || '0', 10);
        const duration = 1500; // ms
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeOut;

          entry.target.childNodes[0].nodeValue = currentVal.toFixed(decimals);

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            entry.target.childNodes[0].nodeValue = target.toFixed(decimals);
          }
        }

        requestAnimationFrame(updateCount);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. MOUSE PARALLAX TILT EFFECT
   ========================================================================== */
function initMouseParallax() {
  if (window.innerWidth <= 768) return;

  const tiltCards = document.querySelectorAll('.model-card, .feature-img-box, .stat-box');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -6;
      const tiltY = (x / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}
