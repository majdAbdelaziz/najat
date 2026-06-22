'use strict';

// ─── Nav shadow ───
const nav = document.getElementById('nav');
if (nav) window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 20 ? '0 2px 24px rgba(15,110,86,0.12)' : 'none';
});

// ─── Hamburger ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ─── Active nav ───
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(l => {
  if (l.getAttribute('href') === currentPage) l.classList.add('active');
});

// ─── Scroll reveal ───
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });

document.querySelectorAll('.step-card, .feature-card, .blog-card').forEach(el => {
  el.style.cssText += 'opacity:0; transform:translateY(20px); transition:opacity 0.45s ease, transform 0.45s ease;';
  revealObserver.observe(el);
});

// ─── Counter animation ───
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 1600;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ─── Progress bar animation ───
document.querySelectorAll('.progress-fill[data-width]').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        el.style.transition = 'width 1.2s ease';
        el.style.width = el.dataset.width + '%';
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  el.style.width = '0%';
  obs.observe(el);
});

// ─── Situation Quiz ───
const quizBtn = document.getElementById('quizBtn');
if (quizBtn) {
  quizBtn.addEventListener('click', () => {
    let score = 0;
    for (let i = 1; i <= 4; i++) {
      const sel = document.querySelector(`input[name="sq${i}"]:checked`);
      if (sel) score += parseInt(sel.value);
    }
    const result = document.getElementById('quizResult');
    result.className = 'quiz-result show';
    if (score >= 7) {
      result.className += ' result-critical';
      result.innerHTML = '🚨 <strong>وضعك حرج — اتصرف اليوم.</strong> ابدأ بـ"خطة الـ48 ساعة الأولى" في صفحة الخطة قبل أي شيء آخر.';
    } else if (score >= 4) {
      result.className += ' result-hard';
      result.innerHTML = '⚠️ <strong>وضعك صعب لكن قابل للإدارة.</strong> ابدأ بتثبيت الأساسيات الأربعة: طعام، مأوى، كهرباء، مواصلات.';
    } else {
      result.className += ' result-ok';
      result.innerHTML = '✅ <strong>لديك وقت للتخطيط.</strong> الأزمة مبكرة — استخدمها لبناء خطة قبل أن تستنفد الموارد.';
    }
  });
}

// ─── Smooth anchor links ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
