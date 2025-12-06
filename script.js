// Subtle Particle Effect
const initParticles = () => {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  const createParticle = () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? '155, 92, 255' : '76, 201, 240'
  });
  
  const init = () => {
    resize();
    particles = [];
    // Subtle - only 40 particles
    const particleCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 25000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
    canvas.classList.add('ready');
  };
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      ctx.fill();
    });
    
    // Draw subtle connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(155, 92, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    animationId = requestAnimationFrame(animate);
  };
  
  window.addEventListener('resize', () => {
    resize();
    // Reinitialize particles on resize
    particles = [];
    const particleCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 25000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  });
  
  init();
  animate();
};

// Initialize particles after a short delay for performance
setTimeout(initParticles, 500);

// Optimized Portfolio Script - Removed scroll animations for better performance

// Local Time Display (Bangladesh Time - UTC+6)
const updateLocalTime = () => {
  const timeElement = document.getElementById('local-time');
  if (!timeElement) return;
  
  const now = new Date();
  // Bangladesh is UTC+6
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Dhaka'
  };
  timeElement.textContent = now.toLocaleTimeString('en-US', options);
};

// Update time every second
setInterval(updateLocalTime, 1000);
updateLocalTime(); // Initial call

// Scroll progress indicator
const scrollProgress = document.getElementById('scroll-progress');
const updateScrollProgress = () => {
  if (!scrollProgress) return;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPercent = Math.min(scrollTop / (documentHeight - windowHeight), 1);
  scrollProgress.style.transform = `scaleX(${scrollPercent})`;
};

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('site-header');
const scrollToTopBtn = document.getElementById('scroll-to-top');

let ticking = false;

const updateActiveNav = () => {
  if (!header) return;
  
  const scrollY = window.pageYOffset;
  const headerHeight = header.offsetHeight;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - headerHeight - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
          link.classList.add('active');
        }
      });
    }
  });

  // Update header background on scroll
  if (scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Show/hide scroll to top button
  if (scrollToTopBtn) {
    if (scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }

  updateScrollProgress();
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Scroll to top functionality
if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', () => {
    // Use Lenis if available, otherwise native
    if (window.lenis) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// Hamburger Menu Toggle
const initHamburgerMenu = () => {
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  const menuNavLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !mainNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
  });

  menuNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('active') && 
        !mainNav.contains(e.target) && 
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
};

// Contact form with Formspree
const form = document.querySelector('.contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    const formData = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent successfully! ✓';
        formStatus.className = 'form-status success';
        form.reset();
        button.textContent = originalText;
        button.disabled = false;
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      formStatus.textContent = `Error: ${error.message}. Please try again or email directly.`;
      formStatus.className = 'form-status error';
      button.textContent = originalText;
      button.disabled = false;
    }
  });
}

// Theme Toggle
const initTheme = () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
};

// Project Filtering
const initProjectFilters = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectNodes = document.querySelectorAll('.project-node');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectNodes.forEach(node => {
        const category = node.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          node.classList.remove('hidden');
        } else {
          node.classList.add('hidden');
        }
      });
    });
  });
};

// Dynamic Copyright Year
const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) {
  const currentYear = new Date().getFullYear();
  copyrightYear.textContent = `2020-${currentYear}`;
}

// Tech chip click feedback (simple, no animation)
const initTechChips = () => {
  const techChips = document.querySelectorAll('.tech-chip');
  techChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.add('active');
      setTimeout(() => chip.classList.remove('active'), 300);
    });
  });
};

// Experience Tabs with Sliding Indicator
const initExperienceTabs = () => {
  const tabs = document.querySelectorAll('.exp-tab');
  const panels = document.querySelectorAll('.exp-panel');
  const indicator = document.querySelector('.tab-indicator');
  let currentIndex = 0;

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (index === currentIndex) return; // Already on this tab

      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));

      // Add active to clicked tab
      tab.classList.add('active');

      // Slide indicator
      if (indicator) {
        if (index === 0) {
          indicator.classList.remove('slide-right');
        } else {
          indicator.classList.add('slide-right');
        }
      }

      // Hide current panel, show new panel with direction-based animation
      panels.forEach(p => {
        p.classList.remove('active', 'slide-left', 'slide-right');
      });

      const targetPanel = document.getElementById(`${tab.dataset.tab}-panel`);
      if (targetPanel) {
        // Slide from left if going to Work (index 0), slide from right if going to Studies (index 1)
        if (index < currentIndex) {
          targetPanel.classList.add('slide-left');
        } else {
          targetPanel.classList.add('slide-right');
        }
        targetPanel.classList.add('active');
      }

      currentIndex = index;
    });
  });
};

// Initialize everything when DOM is ready
const initializeAll = () => {
  document.body.classList.add('loaded');
  
  // Make all scroll elements visible immediately (no animations)
  document.querySelectorAll('[data-scroll]').forEach(el => {
    el.classList.add('visible');
  });
  document.querySelectorAll('.tech-panel').forEach(el => {
    el.classList.add('visible');
  });
  
  initHamburgerMenu();
  initTheme();
  initProjectFilters();
  initTechChips();
  initExperienceTabs();
  updateActiveNav();
  updateScrollProgress();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAll);
} else {
  initializeAll();
}
