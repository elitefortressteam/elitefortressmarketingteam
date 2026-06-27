// ============================================
// ELITE FORTRESS MARKETING TEAM
// script.js — Interactions & Animations
// ============================================

/* --- LOADER --- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 800);
    }
    // Trigger hero animations
    document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 1800);
});

/* --- NAVBAR SCROLL --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Back to top
  const btn = document.getElementById('backToTop');
  if (btn) {
    btn.classList.toggle('visible', window.scrollY > 400);
  }
});

/* --- MOBILE MENU --- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

function closeMobile() {
  if (mobileMenu) mobileMenu.classList.remove('open');
}

/* --- SCROLL ANIMATIONS (IntersectionObserver) --- */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger cards in grids
      const parent = entry.target.parentElement;
      const siblings = parent ? [...parent.querySelectorAll('.fade-up, .fade-left, .fade-right')] : [];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
  // Don't re-observe hero elements (animated by loader)
  if (!el.closest('.hero')) {
    observer.observe(el);
  }
});

/* --- COUNTER ANIMATION --- */
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => {
  countObserver.observe(el);
});

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

/* --- GOLD PARTICLES (Hero) --- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: #D4AF37;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.4 + 0.1};
      animation: floatParticle ${Math.random() * 8 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(p);
  }
}

// Add particle keyframe
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes floatParticle {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.1; }
    33% { transform: translateY(-30px) translateX(15px); opacity: 0.4; }
    66% { transform: translateY(-15px) translateX(-20px); opacity: 0.2; }
  }
`;
document.head.appendChild(particleStyle);
createParticles();

/* --- FAQ ACCORDION --- */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  });
});

/* --- PORTFOLIO FILTER --- */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.portfolio-item').forEach(item => {
      const cat = item.getAttribute('data-cat');
      if (filter === 'all' || cat === filter) {
        item.style.display = '';
        item.style.opacity = '1';
      } else {
        item.style.opacity = '0';
        setTimeout(() => {
          if (item.style.opacity === '0') item.style.display = 'none';
        }, 300);
      }
    });
  });
});

/* --- TESTIMONIAL SLIDER --- */
let testiIndex = 0;

function slideTesti(dir) {
  const track = document.getElementById('testiTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testi-card');
  const total = cards.length;
  const visible = window.innerWidth <= 768 ? 1 : 2;
  const maxIndex = total - visible;
  testiIndex = Math.max(0, Math.min(testiIndex + dir, maxIndex));
  const cardWidth = cards[0].offsetWidth + 24; // gap
  track.style.transform = `translateX(-${testiIndex * cardWidth}px)`;
}

// Auto-slide testimonials
setInterval(() => {
  const track = document.getElementById('testiTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testi-card');
  const visible = window.innerWidth <= 768 ? 1 : 2;
  if (testiIndex >= cards.length - visible) {
    testiIndex = 0;
    track.style.transform = 'translateX(0)';
  } else {
    slideTesti(1);
  }
}, 5000);

/* --- CONTACT FORM (EmailJS / mailto fallback) --- */
function submitForm() {
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const country = document.getElementById('fcountry').value.trim();
  const book = document.getElementById('fbook').value.trim();
  const genre = document.getElementById('fgenre').value.trim();
  const status = document.getElementById('fstatus').value;
  const service = document.getElementById('fservice').value;
  const budget = document.getElementById('fbudget').value;
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email) {
    alert('Please fill in your name and email address.');
    return;
  }

  // Build mailto string
  const subject = encodeURIComponent(`New Project Inquiry from ${name} — Elite Fortress`);
  const body = encodeURIComponent(
    `Full Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCountry: ${country}\n\nBook Title: ${book}\nGenre / Project Type: ${genre}\nPublishing Status: ${status}\nServices Needed: ${service}\nBudget: ${budget}\n\nMessage:\n${message}`
  );

  // Open mailto
  window.location.href = `mailto:elitefortress2@gmail.com?subject=${subject}&body=${body}`;

  // Show success
  const successEl = document.getElementById('formSuccess');
  if (successEl) {
    successEl.style.display = 'block';
    setTimeout(() => successEl.style.display = 'none', 5000);
  }
}

/* --- SMOOTH SCROLL for nav links --- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* --- ACTIVE NAV LINK on scroll --- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = '#D4AF37';
    }
  });
});
