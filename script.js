// Subtle Particle Effect
const initParticles = () => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
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
    color: Math.random() > 0.5 ? "155, 92, 255" : "76, 201, 240",
  });

  const init = () => {
    resize();
    particles = [];
    // Subtle - only 40 particles
    const particleCount = Math.min(
      40,
      Math.floor((canvas.width * canvas.height) / 25000)
    );
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
    canvas.classList.add("ready");
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
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
      particles.slice(i + 1).forEach((p2) => {
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

  window.addEventListener("resize", () => {
    resize();
    // Reinitialize particles on resize
    particles = [];
    const particleCount = Math.min(
      40,
      Math.floor((canvas.width * canvas.height) / 25000)
    );
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
  const timeElement = document.getElementById("local-time");
  if (!timeElement) return;

  const now = new Date();
  // Bangladesh is UTC+6
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  };
  timeElement.textContent = now.toLocaleTimeString("en-US", options);
};

// Update time every second
setInterval(updateLocalTime, 1000);
updateLocalTime(); // Initial call

// Scroll progress indicator
const scrollProgress = document.getElementById("scroll-progress");
const updateScrollProgress = () => {
  if (!scrollProgress) return;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPercent = Math.min(
    scrollTop / (documentHeight - windowHeight),
    1
  );
  scrollProgress.style.transform = `scaleX(${scrollPercent})`;
};

// Active nav link highlighting
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const header = document.getElementById("site-header");
const scrollToTopBtn = document.getElementById("scroll-to-top");

let ticking = false;

const updateActiveNav = () => {
  if (!header) return;

  const scrollY = window.pageYOffset;
  const headerHeight = header.offsetHeight;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - headerHeight - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("data-section") === sectionId) {
          link.classList.add("active");
        }
      });
    }
  });

  // Update header background on scroll
  if (scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Show/hide scroll to top button
  if (scrollToTopBtn) {
    if (scrollY > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  }

  updateScrollProgress();
};

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true }
);

// Scroll to top functionality
if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener("click", () => {
    // Use Lenis if available, otherwise native
    if (window.lenis) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

// Hamburger Menu Toggle
const initHamburgerMenu = () => {
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("main-nav");
  const menuNavLinks = document.querySelectorAll(".nav-link");

  if (!hamburger || !mainNav) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mainNav.classList.toggle("active");
    document.body.style.overflow = mainNav.classList.contains("active")
      ? "hidden"
      : "";
  });

  menuNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mainNav.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  document.addEventListener("click", (e) => {
    if (
      mainNav.classList.contains("active") &&
      !mainNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove("active");
      mainNav.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
};

// Contact form with Formspree
const form = document.querySelector(".contact-form");
const formStatus = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Sending...";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formStatus.textContent = "Message sent successfully! ✓";
        formStatus.className = "form-status success";
        form.reset();
        button.textContent = originalText;
        button.disabled = false;
      } else {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }
    } catch (error) {
      formStatus.textContent = `Error: ${error.message}. Please try again or email directly.`;
      formStatus.className = "form-status error";
      button.textContent = originalText;
      button.disabled = false;
    }
  });
}

// Theme Toggle
const initTheme = () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "dark";

  document.documentElement.setAttribute("data-theme", savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
};

// Project Filtering
const initProjectFilters = () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectNodes = document.querySelectorAll(".project-node");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectNodes.forEach((node) => {
        const category = node.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          node.classList.remove("hidden");
        } else {
          node.classList.add("hidden");
        }
      });
    });
  });
};

// Dynamic Copyright Year
const copyrightYear = document.getElementById("copyright-year");
if (copyrightYear) {
  const currentYear = new Date().getFullYear();
  copyrightYear.textContent = `2020-${currentYear}`;
}

// Tech chip click feedback (simple, no animation)
const initTechChips = () => {
  const techChips = document.querySelectorAll(".tech-chip");
  techChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.add("active");
      setTimeout(() => chip.classList.remove("active"), 300);
    });
  });
};

// Experience Tabs with Sliding Indicator
const initExperienceTabs = () => {
  const tabs = document.querySelectorAll(".exp-tab");
  const panels = document.querySelectorAll(".exp-panel");
  const indicator = document.querySelector(".tab-indicator");
  let currentIndex = 0;

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      if (index === currentIndex) return; // Already on this tab

      // Remove active from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add active to clicked tab
      tab.classList.add("active");

      // Slide indicator
      if (indicator) {
        if (index === 0) {
          indicator.classList.remove("slide-right");
        } else {
          indicator.classList.add("slide-right");
        }
      }

      // Hide current panel, show new panel with direction-based animation
      panels.forEach((p) => {
        p.classList.remove("active", "slide-left", "slide-right");
      });

      const targetPanel = document.getElementById(`${tab.dataset.tab}-panel`);
      if (targetPanel) {
        // Slide from left if going to Work (index 0), slide from right if going to Studies (index 1)
        if (index < currentIndex) {
          targetPanel.classList.add("slide-left");
        } else {
          targetPanel.classList.add("slide-right");
        }
        targetPanel.classList.add("active");
      }

      currentIndex = index;
    });
  });
};

// Smooth Scroll with Motion Blur for Nav Links
const initSmoothNav = () => {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#" || !targetId) return;

      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      e.preventDefault();

      // Add motion blur effect
      document.body.classList.add("is-navigating");

      // Use Lenis for smooth scroll
      if (window.lenis) {
        window.lenis.scrollTo(targetSection, {
          offset: -80, // Adjust for header height
          duration: 0.5, // Even faster duration
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease out
        });
      } else {
        // Fallback
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: "smooth",
        });
      }

      // Remove blur after animation
      setTimeout(() => {
        document.body.classList.remove("is-navigating");
      }, 400); // Remove blur quickly before stop
    });
  });
};

const initSpotlightEffect = () => {
  const cards = document.querySelectorAll(
    ".skill-card, .project-card-full, .testimonial-card"
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
};

const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Handle staggered children if this is a container
        if (entry.target.hasAttribute("data-stagger-children")) {
          const children = entry.target.querySelectorAll(".reveal-child");
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("visible");
            }, index * 100);
          });
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal-element").forEach((el) => {
    observer.observe(el);
  });
};

const initTiltEffect = () => {
  const cards = document.querySelectorAll(".skill-card, .project-card-full");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transition = "none"; // Instant response
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8; // Slightly increased angle
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.5s ease"; // Smooth reset
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });
  });
};

const initTextScramble = () => {
  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  const elements = document.querySelectorAll(".highlight-name"); // Only Z1NX

  elements.forEach((element) => {
    element.addEventListener("mouseover", (event) => {
      let iteration = 0;
      const originalText = event.target.dataset.value || event.target.innerText;

      // Store original text if not already stored
      if (!event.target.dataset.value) {
        event.target.dataset.value = event.target.innerText;
      }

      clearInterval(event.target.interval);

      event.target.interval = setInterval(() => {
        event.target.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return event.target.dataset.value[index];
            }

            // Return random character or space if original is space
            if (letter === " ") return " ";
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("");

        if (iteration >= event.target.dataset.value.length) {
          clearInterval(event.target.interval);
        }

        iteration += 1 / 3;
      }, 30);
    });
  });
};

const initMagneticButtons = () => {
  const magnets = document.querySelectorAll(
    ".primary, .ghost, .hero-cta-btn, .footer-social-icons a, .nav-link, .contact-email"
  );

  magnets.forEach((magnet) => {
    magnet.addEventListener("mousemove", (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic strength (0.4 = moves 40% of distance)
      magnet.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
    });

    magnet.addEventListener("mouseleave", () => {
      magnet.style.transform = "translate(0px, 0px)";
    });
  });
};

// ===== NEW VISUAL ENHANCEMENTS =====

// Hero Parallax Effect
const initHeroParallax = () => {
  // Check for reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const heroVisual = document.querySelector(".hero-visual");
  const heroContent = document.querySelector(".hero-content");
  const hero = document.querySelector(".hero");

  if (!heroVisual || !heroContent || !hero) return;

  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.pageYOffset;
    const heroRect = hero.getBoundingClientRect();

    // Only apply parallax when hero is in view
    if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
      const parallaxAmount = scrollY * 0.15;
      const fadeAmount = Math.max(0, 1 - scrollY / (window.innerHeight * 0.5));

      // Subtle movement in opposite directions
      heroVisual.style.transform = `translateY(${parallaxAmount * 0.3}px)`;
      heroContent.style.transform = `translateY(${parallaxAmount * 0.15}px)`;

      // Fade out as you scroll
      heroVisual.style.opacity = fadeAmount;
      heroContent.style.opacity = fadeAmount;
    }

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
};

// Enhanced Spotlight Effect for Cards
const initEnhancedSpotlight = () => {
  const cards = document.querySelectorAll(
    ".skill-card, .tree-content, .timeline-content"
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
};

// Initialize everything when DOM is ready
const initializeAll = () => {
  document.body.classList.add("loaded");

  // Initialize all features
  initHamburgerMenu();
  initTheme();
  initProjectFilters();
  initTechChips();
  initExperienceTabs();
  initSmoothNav();
  initSpotlightEffect();
  initScrollAnimations();
  initEnhancedSpotlight();

  // Only init advanced effects on desktop (hover capable)
  if (window.matchMedia("(hover: hover)").matches) {
    initTiltEffect();
    initTextScramble();
    initMagneticButtons();
    initHeroParallax();
  }

  updateActiveNav();
  updateScrollProgress();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAll);
} else {
  initializeAll();
}
