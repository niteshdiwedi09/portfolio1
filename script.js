/**
 * ============================================================================
 * NITESH DIWEDI - PORTFOLIO INTERACTIVITY SCRIPT (Vanilla JS)
 * Features:
 * 1. Animated Typing Effect in Hero
 * 2. Interactive Background Particle Canvas
 * 3. Mobile Menu Toggle & Outside Click Detection
 * 4. Sticky Glassmorphism Navbar & Scroll-to-Top Button
 * 5. Scroll Reveal Animations (Intersection Observer)
 * 6. Active Navigation Link Highlighting on Scroll
 * 7. Client-Side Contact Form Validation & User Feedback
 * 8. Dynamic Copyright Year
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. DYNAMIC COPYRIGHT YEAR
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. ANIMATED TYPING EFFECT IN HERO SECTION
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('typing-text');
  const phrases = [
    'Aspiring Developer',
    'Creative Problem Solver',
    'Technology Enthusiast'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typingElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45; // Faster deletion
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110; // Natural typing speed
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at the end of phrase
      isDeleting = true;
      typingSpeed = 1600;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Start typing animation
  typeEffect();

  // --------------------------------------------------------------------------
  // 3. BACKGROUND PARTICLES CANVAS
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('particles-canvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = Math.min(window.innerWidth > 768 ? 45 : 22, 60);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        // Soft glowing violet & cyan particle colors
        const colors = ['rgba(139, 92, 246, 0.45)', 'rgba(56, 189, 248, 0.45)', 'rgba(147, 51, 234, 0.35)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION TOGGLE
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.classList.remove('open');
          navMenu.classList.remove('open');
        }
      });
    });

    // Close menu when clicking outside navbar
    document.addEventListener('click', (event) => {
      const isClickInside = event.target.closest('#navbar');
      if (!isClickInside && navMenu.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. STICKY NAVBAR & SCROLL-TO-TOP BUTTON
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  const onScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Apply frosted-glass style on scroll
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Toggle scroll-to-top button
    if (scrollTopBtn) {
      if (scrollY > 450) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run immediately on load

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal only once for performance
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --------------------------------------------------------------------------
  // 7. ACTIVE NAVIGATION LINK HIGHLIGHTING ON SCROLL
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(sec => navObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM VALIDATION & CLIENT-SIDE FEEDBACK
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formAlert = document.getElementById('form-alert');
  const submitBtn = document.getElementById('form-submit-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
  };

  const setFieldError = (input, errorElement, isError) => {
    if (isError) {
      input.classList.add('has-error');
      errorElement.classList.add('visible');
    } else {
      input.classList.remove('has-error');
      errorElement.classList.remove('visible');
    }
  };

  // Real-time error removal as user types
  if (nameInput && nameError) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length > 0) {
        setFieldError(nameInput, nameError, false);
      }
    });
  }

  if (emailInput && emailError) {
    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value)) {
        setFieldError(emailInput, emailError, false);
      }
    });
  }

  if (messageInput && messageError) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        setFieldError(messageInput, messageError, false);
      }
    });
  }

  // Handle Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasErrors = false;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal) {
        setFieldError(nameInput, nameError, true);
        hasErrors = true;
      } else {
        setFieldError(nameInput, nameError, false);
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!isValidEmail(emailVal)) {
        setFieldError(emailInput, emailError, true);
        hasErrors = true;
      } else {
        setFieldError(emailInput, emailError, false);
      }

      // Validate Message (at least 10 chars)
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (messageVal.length < 10) {
        setFieldError(messageInput, messageError, true);
        hasErrors = true;
      } else {
        setFieldError(messageInput, messageError, false);
      }

      if (hasErrors) {
        if (formAlert) {
          formAlert.className = 'form-alert error';
          formAlert.textContent = 'Please correct the highlighted fields before sending.';
        }
        return;
      }

      // Button loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Sending Note...</span>
          <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"></circle>
          </svg>
        `;
      }

      // Simulated network delay (600ms)
      setTimeout(() => {
        if (formAlert) {
          formAlert.className = 'form-alert success';
          formAlert.innerHTML = `
            <strong>Thank you, ${escapeHtml(nameVal)}!</strong> Your message preview has been captured successfully.<br>
            <small>Note: To deliver actual emails to your inbox, connect a service like Formspree or EmailJS.</small>
          `;
        }

        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Send Message</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          `;
        }
      }, 600);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --------------------------------------------------------------------------
  // 9. SMOOTH SCROLLING FOR IN-PAGE ANCHORS
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});