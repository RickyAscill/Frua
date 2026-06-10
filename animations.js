// ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = entry.target.dataset.animation || 'fadeIn 0.8s ease-out';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// ===== NAVBAR SCROLL EFFECT =====

let lastScrollTop = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling DOWN
    navbar.style.transform = 'translateY(-100%)';
    navbar.style.transition = 'transform 0.3s ease';
  } else {
    // Scrolling UP
    navbar.style.transform = 'translateY(0)';
    navbar.style.transition = 'transform 0.3s ease';
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

  // Add shadow on scroll
  if (scrollTop > 50) {
    navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  } else {
    navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
  }
});

// ===== ACTIVE NAV LINK =====

const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section && section.offsetTop <= window.pageYOffset + 100) {
      current = link.getAttribute('href');
    }
  });

  navLinks.forEach((link) => {
    link.style.color = '';
    link.style.fontWeight = '';
    if (link.getAttribute('href') === current) {
      link.style.color = '#8b5a2b';
      link.style.fontWeight = 'bold';
    }
  });
});

// ===== PARALLAX EFFECT ON HERO =====

const heroSection = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  const scrollPosition = window.pageYOffset;
  if (heroSection) {
    heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
  }
});

// ===== SMOOTH PRODUCT TRANSITIONS =====

function addProductAnimations() {
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach((card, index) => {
    card.style.animation = `staggerIn 0.6s ease-out ${index * 0.1}s forwards`;
    card.style.opacity = '0';
  });
}

// Reinitialize animations after products render
const originalRenderProducts = window.renderProducts;
window.renderProducts = function (list = products) {
  originalRenderProducts(list);
  setTimeout(addProductAnimations, 10);
};

// ===== ENHANCED CART ANIMATIONS =====

const originalToggleCart = window.toggleCart;
window.toggleCart = function () {
  const modal = document.getElementById('cart-modal');
  const wasHidden = modal.classList.contains('hidden');

  originalToggleCart();

  if (!wasHidden) {
    // Modal is being hidden
    const cartContent = modal.querySelector('> div');
    cartContent.style.animation = 'slideOutRightModal 0.3s ease-out';
  }
};

// ===== ENHANCED TOAST ANIMATIONS =====

const originalShowToast = window.showToast;
window.showToast = function (name, qty = 1) {
  const toast = document.createElement('div');
  toast.className =
    'fixed bottom-6 right-6 bg-[#8b5a2b] text-white px-6 py-4 rounded-2xl shadow-xl z-50';
  toast.textContent = `${name} (${qty} шт.) додано в кошик`;
  toast.style.animation = 'slideInToast 0.4s ease-out';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutToast 0.4s ease-out forwards';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 2000);
};

// ===== QUANTITY CHANGE ANIMATIONS =====

const originalIncrementQty = window.incrementQty;
const originalDecrementQty = window.decrementQty;

window.incrementQty = function (id) {
  originalIncrementQty(id);
  animateQuantityChange(id);
};

window.decrementQty = function (id) {
  originalDecrementQty(id);
  animateQuantityChange(id);
};

function animateQuantityChange(id) {
  const qtyElement = document.getElementById(`qty-${id}`);
  if (qtyElement) {
    qtyElement.style.animation = 'none';
    setTimeout(() => {
      qtyElement.style.animation = 'scaleUp 0.3s ease';
    }, 10);
  }
}

// ===== RIPPLE EFFECT ON BUTTONS =====

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
    const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.left = `${e.clientX - rect.left - 10}px`;
    ripple.style.top = `${e.clientY - rect.top - 10}px`;

    const keyframes = `
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;

    if (!document.querySelector('style[data-ripple]')) {
      const style = document.createElement('style');
      style.setAttribute('data-ripple', 'true');
      style.textContent = keyframes;
      document.head.appendChild(style);
    }

    ripple.style.animation = 'ripple 0.6s ease-out';
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
});

// ===== ON PAGE LOAD ANIMATIONS =====

window.addEventListener('load', () => {
  document.body.style.animation = 'fadeIn 0.5s ease-out';
  addProductAnimations();
});

// ===== INTERSECTION OBSERVER FOR LAZY ANIMATIONS =====

const lazyAnimationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
      lazyAnimationObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe cards for lazy animations
document.querySelectorAll('.adv-card, .review-card, .faq-item').forEach((element) => {
  element.style.opacity = '0';
  lazyAnimationObserver.observe(element);
});

// ===== CART COUNT BADGE ANIMATION =====

const cartCountBadge = document.getElementById('cart-count');
const originalUpdateCartCount = window.updateCartCount;

window.updateCartCount = function () {
  originalUpdateCartCount();
  // Add pulse animation
  cartCountBadge.style.animation = 'pulse 0.3s ease-out';
  setTimeout(() => {
    cartCountBadge.style.animation = 'none';
  }, 300);
};

// ===== SMOOTH PAGE TRANSITIONS =====

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

console.log('✅ All animations loaded successfully!');
