/* ═══════════════════════════════════════════════════════════
   CAFÉ CALMA — Interactive Scripts
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar Scroll Effect ─── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active nav highlight on scroll
  function highlightNavOnScroll() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavScroll();
    highlightNavOnScroll();
  }, { passive: true });

  handleNavScroll();

  /* ─── Mobile Menu Toggle ─── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ─── Smooth Scroll for Anchor Links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      // A03: Injection — Validate href is a safe anchor selector before using in querySelector
      if (!/^#[a-zA-Z][a-zA-Z0-9_-]*$/.test(href)) return;
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar.offsetHeight + 10;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ─── Scroll Reveal (IntersectionObserver) ─── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger effect for sibling elements
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  // Add staggered delays to grouped items
  document.querySelectorAll('.menu-card, .philosophy-card, .experience-card, .gallery-item').forEach((el, i) => {
    const parent = el.parentElement;
    const siblings = Array.from(parent.children).filter(c => c.classList.contains(el.classList[0]));
    const siblingIndex = siblings.indexOf(el);
    el.dataset.delay = siblingIndex * 80;
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ─── Hero Floating Particles ─── */
  const particlesContainer = document.getElementById('hero-particles');

  function createParticles() {
    const count = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('hero-particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (8 + Math.random() * 12) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.width = (2 + Math.random() * 4) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = 0.2 + Math.random() * 0.4;
      particlesContainer.appendChild(particle);
    }
  }

  createParticles();

  /* ─── Menu Category Filter ─── */
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuCards = document.querySelectorAll('.menu-card');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;

      menuCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─── Gallery Lightbox ─── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        // A03: Injection — Validate src is a relative path, not an external/JS URL
        const imgSrc = img.src;
        if (imgSrc && (imgSrc.startsWith(window.location.origin) || imgSrc.startsWith('assets/'))) {
          lightboxImg.src = imgSrc;
          lightboxImg.alt = img.alt || 'Imagen ampliada';
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ─── Parallax Effect on Divider ─── */
  const parallaxDivider = document.querySelector('.parallax-divider img');

  if (parallaxDivider) {
    window.addEventListener('scroll', () => {
      const rect = parallaxDivider.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const translate = (progress - 0.5) * 60;
        parallaxDivider.style.transform = `translateY(${translate}px)`;
      }
    }, { passive: true });
  }

  /* ─── Counter Animation for Stats (future use) ─── */
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(eased * target);
      element.textContent = current.toLocaleString('es-CL');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* ─── Instagram Grid Hover Effect ─── */
  const INSTAGRAM_URL = 'https://www.instagram.com/cafecalma_cl/?hl=es';
  const instaCells = document.querySelectorAll('.insta-cell');
  instaCells.forEach(cell => {
    cell.addEventListener('click', () => {
      // A09: Use noopener,noreferrer to prevent tab-nabbing (reverse tabnabbing)
      window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
    });
    cell.style.cursor = 'pointer';
  });

  /* ─── Smooth page load ─── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

});
