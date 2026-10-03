/* ==========================================================================
   PREMIUM LAMBORGHINI AUTOMOTIVE WEBSITE - GALLERY & LIGHTBOX ENGINE
   Editorial Masonry Grid | Dynamic Category Filtering | Fullscreen Lightbox
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryEngine();
});

function initGalleryEngine() {
  const galleryGrid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox-modal');
  if (!galleryGrid) return;

  // Gallery Items Master Dataset using available gallery-images/
  const galleryData = [
    {
      id: 1,
      title: "REVUELTO • ARANCIO APODIS",
      category: "hybrid",
      colSpan: "col-8",
      imgSrc: "gallery-images/car-image.png",
      description: "1,001 CV First V12 High Performance Electrified Vehicle (HPEV)."
    },
    {
      id: 2,
      title: "HURACÁN TECNICA • ROSSO MARS",
      category: "sports-cars",
      colSpan: "col-4",
      imgSrc: "gallery-images/red-car-image.png",
      description: "640 CV Naturally Aspirated V10 Rear-Wheel Drive Masterpiece."
    },
    {
      id: 3,
      title: "TEMERARIO • VERDE SELFIE",
      category: "sports-cars",
      colSpan: "col-4",
      imgSrc: "gallery-images/Gemini_Generated_Image_3qn7uz3qn7uz3qn7.png",
      description: "920 CV Twin-Turbo V8 Engine revving up to 10,000 RPM."
    },
    {
      id: 4,
      title: "URUS SE • GIALLO INTI",
      category: "hybrid",
      colSpan: "col-8",
      imgSrc: "gallery-images/Gemini_Generated_Image_5wcw6t5wcw6t5wcw.png",
      description: "800 CV Plug-In Hybrid Super SUV with Dynamic Torque Vectoring."
    },
    {
      id: 5,
      title: "COUNTACH LPI 800-4 • BIANCO SIDERALE",
      category: "limited",
      colSpan: "col-6",
      imgSrc: "gallery-images/Gemini_Generated_Image_6ahc0t6ahc0t6ahc.png",
      description: "Futuristic Icon reborn with V12 814 CV Hybrid Supercapacitor."
    },
    {
      id: 6,
      title: "SIÁN FKP 37 • VERDE GEA",
      category: "limited",
      colSpan: "col-6",
      imgSrc: "gallery-images/Gemini_Generated_Image_6sg25u6sg25u6sg2.png",
      description: "World's First Supercapacitor Hybrid Powertrain Hypercar."
    },
    {
      id: 7,
      title: "AD PERSONAM ATELIER COCKPIT",
      category: "lifestyle",
      colSpan: "col-4",
      imgSrc: "gallery-images/Gemini_Generated_Image_dci7e0dci7e0dci7.png",
      description: "Bespoke Italian Craftsmanship & Aviation-Grade Forged Carbon."
    },
    {
      id: 8,
      title: "HURACÁN STERRATO • ALL-TERRAIN",
      category: "sports-cars",
      colSpan: "col-4",
      imgSrc: "gallery-images/Gemini_Generated_Image_pvvhkvpvvhkvpvvh.png",
      description: "Beyond Concrete: V10 All-Terrain Super Sports Car."
    },
    {
      id: 9,
      title: "SQUADRA CORSE GT3 EVO2",
      category: "limited",
      colSpan: "col-4",
      imgSrc: "gallery-images/Gemini_Generated_Image_vh4tf5vh4tf5vh4t.png",
      description: "Pure Motorsport DNA engineered for International Endurance Circuits."
    }
  ];

  let currentFilteredList = [...galleryData];
  let currentLightboxIndex = 0;

  // Render Grid Cards
  function renderGallery(items) {
    galleryGrid.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `gallery-card ${item.colSpan} reveal reveal-scale`;
      card.setAttribute('data-category', item.category);
      card.setAttribute('data-index', index);

      card.innerHTML = `
        <img src="${item.imgSrc}" alt="${item.title}" class="gallery-card-img" loading="lazy" decoding="async">
        <div class="gallery-card-overlay">
          <span class="gallery-card-category">${item.category.replace('-', ' ')}</span>
          <h3 class="gallery-card-title">${item.title}</h3>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox(index);
      });

      galleryGrid.appendChild(card);
    });

    // Re-trigger reveal observer for newly created elements
    if (window.initScrollRevealSystem) {
      window.initScrollRevealSystem();
    }
  }

  // Filter Buttons Handler
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      if (filterVal === 'all') {
        currentFilteredList = [...galleryData];
      } else {
        currentFilteredList = galleryData.filter(item => item.category === filterVal);
      }
      renderGallery(currentFilteredList);
    });
  });

  // Initial Render
  renderGallery(galleryData);

  // Lightbox Modal System
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  function openLightbox(index) {
    if (!lightbox || !currentFilteredList[index]) return;
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = currentFilteredList[currentLightboxIndex];
    if (!item || !lightboxImg) return;

    lightboxImg.src = item.imgSrc;
    lightboxImg.alt = item.title;
    if (lightboxCaption) {
      lightboxCaption.innerHTML = `
        <h3 style="font-size: 1.4rem; margin-bottom: 6px;">${item.title}</h3>
        <p style="color: var(--metallic-400); font-size: 0.9rem;">${item.description}</p>
      `;
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex - 1 + currentFilteredList.length) % currentFilteredList.length;
      updateLightboxContent();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex + 1) % currentFilteredList.length;
      updateLightboxContent();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev?.click();
    if (e.key === 'ArrowRight') lightboxNext?.click();
  });
}
