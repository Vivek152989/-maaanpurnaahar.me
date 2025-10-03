// Contact Form Integration with Firebase
// Add this to your contact.html or create a new contact form

class ContactManager {
  static async submitContactForm(formData) {
    try {
      if (!window.firebaseManager || !window.firebaseManager.isInitialized()) {
        // Fallback to localStorage for demo
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        const newMessage = {
          id: Date.now().toString(),
          ...formData,
          timestamp: new Date().toISOString(),
          isRead: false,
          status: 'new'
        };
        
        messages.push(newMessage);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        return {
          success: true,
          message: 'Message sent successfully! We will get back to you soon.',
          messageId: newMessage.id
        };
      }

      // Use Firebase to store contact message
      const result = await window.firebaseManager.storeContactMessage(formData);
      return result;
    } catch (error) {
      console.error('Contact form error:', error);
      return {
        success: false,
        message: 'Failed to send message. Please try again.'
      };
    }
  }

  static async getContactMessages() {
    try {
      if (!window.firebaseManager || !window.firebaseManager.isInitialized()) {
        // Fallback to localStorage
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        return {
          success: true,
          messages: messages
        };
      }

      // Get messages from Firebase
      const result = await window.firebaseManager.getContactMessages();
      return result;
    } catch (error) {
      console.error('Get contact messages error:', error);
      return {
        success: false,
        message: 'Failed to load messages'
      };
    }
  }
}

// Example usage for contact form
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone')?.value.trim() || '',
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
      };
      
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showError('Please fill in all required fields');
        return;
      }
      
      if (!isValidEmail(formData.email)) {
        showError('Please enter a valid email address');
        return;
      }
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        // Submit form
        const result = await ContactManager.submitContactForm(formData);
        
        if (result.success) {
          showSuccess(result.message);
          contactForm.reset();
        } else {
          showError(result.message);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showError('An error occurred. Please try again.');
      } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

function showError(message) {
  const errorDiv = document.getElementById('errorMessage') || createMessageDiv('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

function showSuccess(message) {
  const successDiv = document.getElementById('successMessage') || createMessageDiv('success');
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  
  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 5000);
}

function createMessageDiv(type) {
  const div = document.createElement('div');
  div.id = type + 'Message';
  div.className = 'message ' + type;
  div.style.display = 'none';
  
  const form = document.getElementById('contactForm');
  form.parentNode.insertBefore(div, form);
  
  return div;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}