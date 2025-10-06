// translations.js - Multi-language support
'use strict';

const translations = {
  hi: {
    // Navigation
    'site-title': 'मां अन्नपूर्णा आहार',
    'nav-home': 'होम',
    'nav-products': 'उत्पाद',
    'nav-cart': 'कार्ट',
    'nav-contact': 'संपर्क',
    'my-account': 'मेरा खाता',
    'nav-login': 'लॉग इन',
    'nav-register': 'रजिस्टर करें',
    
    // Hero Section
    'hero-title': 'स्वादिष्ट घर का बना खाना',
    'hero-subtitle': 'ताजा, स्वस्थ और प्राकृतिक सामग्री के साथ बनाया गया',
    'btn-shop-now': 'अभी खरीदारी करें',
    'btn-learn-more': 'और जानें',
    
    // Products
    'products-title': 'हमारे उत्पाद',
    'add-to-cart': 'कार्ट में डालें',
    'view-details': 'विवरण देखें',
    
    // About
    'about-title': 'हमारे बारे में',
    'about-text': 'हम एक passionate startup हैं जो घर की रसोई से ताजा और स्वादिष्ट भोजन आप तक पहुंचाते हैं।',
    
    // Contact
    'contact-title': 'संपर्क करें',
    'contact-subtitle': 'हम यहाँ हैं आपकी सहायता के लिए',
    
    // Footer
    'footer-about': 'प्रेम और देखभाल के साथ बने हस्तनिर्मित खाद्य उत्पाद',
    'quick-links': 'त्वरित लिंक',
    'support': 'सहायता',
    
    // Common
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'success': 'सफल',
    'close': 'बंद करें',
    'submit': 'सबमिट करें'
  },
  
  en: {
    // Navigation
    'site-title': 'Maa Anpurna Aahar',
    'nav-home': 'Home',
    'nav-products': 'Products',
    'nav-cart': 'Cart',
    'nav-contact': 'Contact',
    'my-account': 'My Account',
    'nav-login': 'Login',
    'nav-register': 'Register',
    
    // Hero Section
    'hero-title': 'Delicious Homemade Food',
    'hero-subtitle': 'Made with fresh, healthy and natural ingredients',
    'btn-shop-now': 'Shop Now',
    'btn-learn-more': 'Learn More',
    
    // Products
    'products-title': 'Our Products',
    'add-to-cart': 'Add to Cart',
    'view-details': 'View Details',
    
    // About
    'about-title': 'About Us',
    'about-text': 'We are a passionate startup bringing fresh and delicious food from home kitchen to your doorstep.',
    
    // Contact
    'contact-title': 'Contact Us',
    'contact-subtitle': 'We\'re here to help and answer any questions',
    
    // Footer
    'footer-about': 'Handmade food products with love and care',
    'quick-links': 'Quick Links',
    'support': 'Support',
    
    // Common
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'close': 'Close',
    'submit': 'Submit'
  }
};

// Translation function
function translatePage(lang = 'en') {
  const elements = document.querySelectorAll('[data-lang-key]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-lang-key');
    if (translations[lang] && translations[lang][key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
  
  // Update page title if needed
  if (translations[lang]['site-title']) {
    document.title = translations[lang]['site-title'] + ' - ' + document.title.split(' - ').slice(1).join(' - ');
  }
}

// Initialize translation on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedLang = localStorage.getItem('preferred-language') || 'en';
  translatePage(savedLang);
});

// Export for global use
window.translatePage = translatePage;
window.translations = translations;