/* ----------------------------------------------------
   Megra Inspired Website JavaScript
   Logic for carousel, stats counters, portfolio filtering,
   lightbox, office tabs, sticky nav, and interactive forms.
---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. STICKY HEADER & MOBILE NAVIGATION
  // ==========================================
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky nav on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }


  // ==========================================
  // 2. HERO CAROUSEL / SLIDER
  // ==========================================
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');
  const prevBtn = document.querySelector('.hero-arrow-btn.prev');
  const nextBtn = document.querySelector('.hero-arrow-btn.next');
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 6000; // 6 seconds

  function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    
    // Wrap around index
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Set active
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }

  function startSlideShow() {
    stopSlideShow();
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideDuration);
  }

  function stopSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    // Initial start
    showSlide(0);
    startSlideShow();

    // Arrows
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startSlideShow(); // Reset interval
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startSlideShow(); // Reset interval
      });
    }

    // Indicators click
    indicators.forEach((indicator, idx) => {
      indicator.addEventListener('click', () => {
        showSlide(idx);
        startSlideShow();
      });
    });
  }


  // ==========================================
  // 3. SCROLL ANIMATED COUNTERS (STATS)
  // ==========================================
  const counters = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.about-stats');

  const runCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const countTo = target;
      let currentVal = 0;
      
      // Determine speed based on value
      const duration = 2000; // 2 seconds total animation
      const steps = 50;
      const stepVal = Math.ceil(countTo / steps);
      const stepTime = duration / steps;

      const counterTimer = setInterval(() => {
        currentVal += stepVal;
        if (currentVal >= countTo) {
          counter.textContent = countTo.toLocaleString() + suffix;
          clearInterval(counterTimer);
        } else {
          counter.textContent = currentVal.toLocaleString() + suffix;
        }
      }, stepTime);
    });
  };

  if (statsSection && counters.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.15
    };

    let animated = false;
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          runCounters();
          animated = true;
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    statsObserver.observe(statsSection);
  }


  // ==========================================
  // 4. PORTFOLIO FILTERING
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (filterButtons.length > 0 && portfolioCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active class on buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }


  // ==========================================
  // 5. PROJECT DETAILS LIGHTBOX
  // ==========================================
  const lightbox = document.getElementById('project-lightbox');
  const lightboxClose = document.querySelector('.lightbox-close');
  const portfolioGrid = document.querySelector('.portfolio-grid');

  // Project details data mapping
  const projectDetails = {
    'mbr-library': {
      title: 'Mohammed Bin Rashid Library',
      tag: 'Culture & Education',
      desc: 'An architectural masterpiece shaped like an open book, the Mohammed Bin Rashid Library stands as a beacon of culture and knowledge in Dubai. Built by Megra, this iconic structural landmark spans over 54,000 square meters, featuring modern sustainable systems, high-capacity climate control for rare manuscript storage, and state-of-the-art digital reading spaces.',
      image: 'images/project_1.jpg',
      sector: 'Cultural Infrastructure',
      client: 'Dubai Municipality',
      year: '2022',
      location: 'Creek, Dubai, UAE'
    },
    'cola-arena': {
      title: 'Coca-Cola Arena',
      tag: 'Hospitality & Leisure',
      desc: 'A state-of-the-art multipurpose indoor arena located in the heart of City Walk, Dubai. Capable of hosting international music concerts, sporting events, and corporate banquets, this mega-structure features a dynamic, fully custom LED facade, modular seating layouts, and a massive structural steel roof span, all successfully completed by Megra on a turnkey basis.',
      image: 'images/project_2.jpg',
      sector: 'Leisure & Entertainment',
      client: 'Meraas Development',
      year: '2019',
      location: 'City Walk, Dubai, UAE'
    },
    'expo-pavilion': {
      title: 'Expo 2020 Sustainability Pavilion',
      tag: 'Sustainability / Commercial',
      desc: 'Completed as part of the historic Dubai Expo 2020, the Sustainability Pavilion (Terra) is a pioneering net-zero energy and water building. Featuring a massive 130-meter-wide canopy covered in solar panels and surrounded by energy-generating "Water Trees", this landmark highlights Megra\'s top-tier sustainable construction capabilities.',
      image: 'images/project_3.jpg',
      sector: 'Sustainable Architecture',
      client: 'Expo 2020 Dubai',
      year: '2020',
      location: 'Expo City Dubai, UAE'
    },
    'bluewaters': {
      title: 'Bluewaters Residences',
      tag: 'Commercial & Residential',
      desc: 'Megra completed the construction of multiple high-end residential towers, townhouse complexes, and supporting community infrastructure on the man-made Bluewaters Island. These luxury residences combine high-performance structural glazing, bespoke fit-out works, and integrated smart home automation systems for an elite waterfront lifestyle.',
      image: 'images/project_4.jpg',
      sector: 'Residential Real Estate',
      client: 'Meraas Holding',
      year: '2018',
      location: 'Bluewaters Island, Dubai, UAE'
    },
    'metro-expansion': {
      title: 'Dubai Metro Expansion',
      tag: 'Infrastructure & Transport',
      desc: 'Megra played an instrumental role in executing structural expansions, bridge link ways, and transit facilities for key stations of the Dubai Metro system. Operating under stringent safety protocols and without interrupting daily commuter transit routes, this project stands as a testament to our heavy infrastructure excellence.',
      image: 'images/project_5.jpg',
      sector: 'Public Infrastructure',
      client: 'Roads & Transport Authority (RTA)',
      year: '2021',
      location: 'Various Locations, Dubai, UAE'
    },
    'etihad-museum': {
      title: 'Etihad Museum',
      tag: 'Culture & Education',
      desc: 'Located at the historic site where the union of the United Arab Emirates was signed in 1971, the Etihad Museum features a striking architectural design resembling a manuscript scroll. Megra executed this complex underground and curved structure, installing high-fidelity fit-out and interactive museum exhibition designs.',
      image: 'images/project_6.jpg',
      sector: 'Heritage & Culture',
      client: 'Dubai Culture & Arts Authority',
      year: '2017',
      location: 'Jumeirah, Dubai, UAE'
    }
  };

  if (portfolioGrid && lightbox && lightboxClose) {
    portfolioGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.portfolio-card');
      if (!card) return;

      const projectId = card.getAttribute('data-id');
      const data = projectDetails[projectId];
      
      if (data) {
        // Populate lightbox content
        document.getElementById('lightbox-img').style.backgroundImage = `url('${data.image}')`;
        document.getElementById('lightbox-tag').textContent = data.tag;
        document.getElementById('lightbox-title').textContent = data.title;
        document.getElementById('lightbox-desc').textContent = data.desc;
        document.getElementById('lightbox-sector').textContent = data.sector;
        document.getElementById('lightbox-client').textContent = data.client;
        document.getElementById('lightbox-year').textContent = data.year;
        document.getElementById('lightbox-location').textContent = data.location;
        
        // Open lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      }
    });

    // Close Lightbox
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }


  // ==========================================
  // 6. GLOBAL PRESENCE TABS (OFFICES)
  // ==========================================
  const officeTabs = document.querySelectorAll('.office-tab');
  const officePanels = document.querySelectorAll('.office-panel');

  if (officeTabs.length > 0 && officePanels.length > 0) {
    officeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active
        officeTabs.forEach(t => t.classList.remove('active'));
        officePanels.forEach(p => p.classList.remove('active'));

        // Add active
        tab.classList.add('active');
        const targetOffice = tab.getAttribute('data-office');
        const activePanel = document.getElementById(`office-${targetOffice}`);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  }


  // ==========================================
  // 7. CAREERS / CONTACT FORM INTERACTION
  // ==========================================
  const contactForm = document.getElementById('careers-contact-form');
  const fileInput = document.getElementById('resume-upload');
  const fileLabel = document.querySelector('.form-file-label span');

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        fileLabel.textContent = `File selected: ${e.target.files[0].name}`;
        fileLabel.parentElement.style.borderColor = 'var(--color-primary)';
        fileLabel.parentElement.style.color = 'var(--color-primary)';
      } else {
        fileLabel.textContent = 'Upload CV / Resume (PDF, Word)';
        fileLabel.parentElement.style.borderColor = 'var(--color-border)';
        fileLabel.parentElement.style.color = 'var(--color-text-muted)';
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Simulate loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Inquiry <i class="fas fa-spinner fa-spin btn-icon"></i>';
      
      setTimeout(() => {
        // Successful message animation
        contactForm.innerHTML = `
          <div class="form-success-message" style="text-align: center; padding: 2rem 0; animation: fadeIn 0.5s ease;">
            <div class="success-icon-box" style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--color-primary-ultra-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; font-size: 2.5rem; box-shadow: 0 0 20px rgba(33, 101, 54, 0.15);">
              <i class="fas fa-check"></i>
            </div>
            <h3 style="color: var(--color-primary-dark); margin-bottom: 0.75rem; font-family: var(--font-title); font-weight: 700; font-size: 1.5rem;">Inquiry Submitted</h3>
            <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; max-width: 350px; margin: 0 auto 2rem auto;">
              Thank you for submitting your inquiry. MEGRA Engineering Solutions team will review your request and get back to you shortly.
            </p>
            <button class="btn btn-outline" onclick="window.location.reload();">Submit Another Inquiry</button>
          </div>
        `;
      }, 1800);
    });
  }
});
