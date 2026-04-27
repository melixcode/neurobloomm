/* =============================================
   NEUROBLOOM – script.js
   Interactions, animations & scroll effects
   ============================================= */

// ---------- NAV SCROLL ----------
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ---------- HAMBURGER MENU ----------
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);

  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(7.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7.5px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ---------- REVEAL ON SCROLL ----------
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const parent = entry.target.parentElement;
      const siblings = Array.from(parent.children).filter(el => el.classList.contains('reveal'));
      const index = siblings.indexOf(entry.target);
      const delay = index * 100;

      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ---------- SMOOTH SCROLL FOR ANCHORS ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---------- HERO PARALLAX (subtle) ----------
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orbs = document.querySelectorAll('.orb');
  orbs.forEach((orb, i) => {
    const speed = 0.04 + i * 0.015;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });

// ---------- PHONE NEUROBOT EYE TRACK (fun easter egg) ----------
const botFace = document.querySelector('.bot-face');

if (botFace) {
  document.addEventListener('mousemove', (e) => {
    const rect = botFace.getBoundingClientRect();
    const faceCenterX = rect.left + rect.width / 2;
    const faceCenterY = rect.top + rect.height / 2;

    const dx = (e.clientX - faceCenterX) / window.innerWidth;
    const dy = (e.clientY - faceCenterY) / window.innerHeight;

    const maxMove = 3;
    const eyes = botFace.querySelectorAll('.bot-eye');
    eyes.forEach(eye => {
      eye.style.transform = `translate(${dx * maxMove}px, ${dy * maxMove}px)`;
    });
  });
}

// ---------- ANIMATED COUNTER (stats) ----------
function animateCounter(el, end, duration = 1800) {
  let startTime = null;
  const isPercent = el.textContent.includes('%');
  const isPlus = el.textContent.includes('+');
  const numEnd = parseInt(end);

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = Math.round(eased * numEnd);

    if (isPercent) el.textContent = `%${current}`;
    else if (isPlus) el.textContent = `${current}+`;
    else el.textContent = current;

    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(num => {
        const text = num.textContent.trim();
        if (text === '13+') animateCounter(num, 13);
        else if (text === '%94') animateCounter(num, 94);
        // AI stays as-is
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ---------- PROGRESS BAR RE-ANIMATE ON VIEW ----------
const progressFill = document.querySelector('.progress-fill');
if (progressFill) {
  const pbObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressFill.style.animation = 'none';
        progressFill.offsetHeight; // reflow
        progressFill.style.animation = 'fill-progress 2s ease-out 0.2s both';
        pbObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });
  pbObserver.observe(progressFill.parentElement);
}

// ---------- FEATURE CARDS HOVER TILT ----------
document.querySelectorAll('.feature-card, .vision-card, .team-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'box-shadow 0.35s, border-color 0.35s';
  });
});

// ---------- ACTIVE NAV LINK ON SCROLL ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--purple)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(s => activeSectionObserver.observe(s));

// ---------- INITIAL LOAD ANIMATION ----------
document.addEventListener('DOMContentLoaded', () => {
  // Hero content stagger
  const heroChildren = document.querySelectorAll('.hero-content > *');
  heroChildren.forEach((child, i) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(24px)';
    child.style.transition = `opacity 0.7s ease ${i * 0.1 + 0.2}s, transform 0.7s ease ${i * 0.1 + 0.2}s`;
    setTimeout(() => {
      child.style.opacity = '1';
      child.style.transform = 'translateY(0)';
    }, 100);
  });

  // Hero visual
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateX(40px)';
    heroVisual.style.transition = 'opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s';
    setTimeout(() => {
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'translateX(0)';
    }, 100);
  }
});

// ---------- SCROLL PROGRESS INDICATOR ----------
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #4A90E2, #8B5CF6, #EC4899);
  z-index: 9999;
  transition: width 0.1s;
  border-radius: 0 2px 2px 0;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / total) * 100;
  progressBar.style.width = `${progress}%`;
}, { passive: true });

// ---------- NEUROBOT WAVE GREETING ----------
const botAvatar = document.querySelector('.neurobot-avatar');
if (botAvatar) {
  botAvatar.addEventListener('click', () => {
    botAvatar.style.animation = 'none';
    botAvatar.style.transform = 'scale(1.2) rotate(-5deg)';
    setTimeout(() => {
      botAvatar.style.transform = 'scale(1) rotate(5deg)';
      setTimeout(() => {
        botAvatar.style.transform = '';
        botAvatar.style.transition = 'transform 0.4s ease';
      }, 200);
    }, 200);
  });
}

console.log('%c🌸 NeuroBloom', 'font-size:24px; font-weight:bold; background: linear-gradient(90deg,#4A90E2,#8B5CF6,#EC4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent;');
console.log('%cKonuşmak Her Çocuğun Hakkı 💜', 'font-size:14px; color:#8B5CF6;');
