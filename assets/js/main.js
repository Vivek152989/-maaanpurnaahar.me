// main.js - Core website functionality
'use strict';

// Global variables
let currentLanguage = localStorage.getItem('preferred-language') || 'en';

// DOM Ready function
document.addEventListener('DOMContentLoaded', function() {
  initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
  setupNavigation();
  setupLanguageSupport();
  setupLazyLoading();
  setupScrollEffects();
  updateCartCount();
  initializeAnalytics();
}

// Navigation functionality
function setupNavigation() {
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(event) {
    const accountDropdown = document.getElementById('accountDropdown');
    const langDropdown = document.getElementById('langDropdown');
    
    if (!event.target.closest('.dropdown')) {
      if (accountDropdown) {
        accountDropdown.style.display = 'none';
        accountDropdown.classList.remove('show');
      }
      if (langDropdown) {
        langDropdown.style.display = 'none';
        langDropdown.classList.remove('show');
      }
    }
  });
}

// Account dropdown toggle
function toggleMyAccount() {
  const dropdown = document.getElementById('accountDropdown');
  const langDropdown = document.getElementById('langDropdown');
  
  if (dropdown) {
    const isVisible = dropdown.style.display === 'block' || dropdown.classList.contains('show');
    
    // Close language dropdown if open
    if (langDropdown) {
      langDropdown.style.display = 'none';
      langDropdown.classList.remove('show');
    }
    
    if (isVisible) {
      dropdown.style.display = 'none';
      dropdown.classList.remove('show');
    } else {
      dropdown.style.display = 'block';
      dropdown.classList.add('show');
      dropdown.style.position = 'absolute';
      dropdown.style.top = '100%';
      dropdown.style.right = '0';
      dropdown.style.zIndex = '9999';
    }
  }
}

// Language dropdown toggle
function toggleLanguageDropdown() {
  const dropdown = document.getElementById('langDropdown');
  const accountDropdown = document.getElementById('accountDropdown');
  
  if (dropdown) {
    const isVisible = dropdown.style.display === 'block' || dropdown.classList.contains('show');
    
    // Close account dropdown if open
    if (accountDropdown) {
      accountDropdown.style.display = 'none';
      accountDropdown.classList.remove('show');
    }
    
    if (isVisible) {
      dropdown.style.display = 'none';
      dropdown.classList.remove('show');
    } else {
      dropdown.style.display = 'block';
      dropdown.classList.add('show');
      dropdown.style.position = 'absolute';
      dropdown.style.top = '100%';
      dropdown.style.right = '0';
      dropdown.style.zIndex = '9999';
    }
  }
}

// Language change function
function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('preferred-language', lang);
  
  // Update UI elements
  const currentLang = document.getElementById('currentLang');
  const currentFlag = document.getElementById('currentFlag');
  
  if (lang === 'hi') {
    if (currentLang) currentLang.textContent = 'हिंदी';
    if (currentFlag) currentFlag.textContent = '🇮🇳';
  } else {
    if (currentLang) currentLang.textContent = 'English';
    if (currentFlag) currentFlag.textContent = '🇺🇸';
  }
  
  // Close dropdown
  const dropdown = document.getElementById('langDropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
    dropdown.classList.remove('show');
  }
  
  // Translate page
  translatePage(lang);
}

// Lazy loading for images
function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

// Smooth scroll effects
function setupScrollEffects() {
  const navbar = document.querySelector('nav');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

// Initialize analytics
function initializeAnalytics() {
  // Track page view
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href
    });
  }
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
  
  // Send to analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: e.error.message,
      fatal: false
    });
  }
});

// Export functions for global use
window.toggleMyAccount = toggleMyAccount;
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.changeLanguage = changeLanguage;