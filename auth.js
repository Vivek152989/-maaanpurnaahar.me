// Authentication utility functions
// This file should be included in all pages for consistent auth behavior

// Authentication state management
class AuthManager {
  static getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
      console.error('Error parsing current user:', error);
      return null;
    }
  }

  static isLoggedIn() {
    const user = this.getCurrentUser();
    return user && user.isLoggedIn === true;
  }

  static requireAuth(redirectUrl = 'login.html') {
    if (!this.isLoggedIn()) {
      alert('Please login to access this page');
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  static logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('currentUser');
      alert('You have been logged out successfully');
      window.location.href = 'index.html';
    }
  }

  static updateUserData(userData) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  }

  // OTP Authentication Methods
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(email, phone, type = 'login') {
    try {
      if (!window.firebaseManager || !window.firebaseManager.isInitialized()) {
        throw new Error('Firebase not initialized. Please check your connection.');
      }

      const otp = this.generateOTP();
      const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Store OTP in Firebase
      const otpData = {
        otp: otp,
        email: email,
        phone: phone,
        type: type,
        expiry: expiryTime.getTime(),
        attempts: 0
      };
      
      const result = await window.firebaseManager.storeOTP(otpData);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Store temporary data in localStorage for the verification process
      localStorage.setItem('otpData', JSON.stringify(otpData));
      
      // Simulate sending OTP (in production, integrate with SMS/Email service)
      console.log(`OTP for ${email || phone}: ${otp}`);
      
      // For demo purposes, show OTP in alert (remove in production)
      alert(`OTP sent! For demo purposes, your OTP is: ${otp}`);
      
      return {
        success: true,
        message: `OTP sent successfully to ${email ? 'email' : 'phone'}`,
        expiryTime: expiryTime,
        otpId: result.otpId
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
      };
    }
  }

  static async verifyOTP(identifier, inputOTP, type) {
    try {
      if (!window.firebaseManager || !window.firebaseManager.isInitialized()) {
        // Fallback to localStorage for demo
        const otpData = JSON.parse(localStorage.getItem('otpData') || '{}');
        
        if (!otpData.otp) {
          return { success: false, message: 'No OTP found. Please request a new OTP.' };
        }
        
        if (Date.now() > otpData.expiry) {
          localStorage.removeItem('otpData');
          return { success: false, message: 'OTP has expired. Please request a new OTP.' };
        }
        
        if (otpData.attempts >= 3) {
          localStorage.removeItem('otpData');
          return { success: false, message: 'Too many attempts. Please request a new OTP.' };
        }
        
        if (otpData.otp !== inputOTP) {
          otpData.attempts++;
          localStorage.setItem('otpData', JSON.stringify(otpData));
          return { 
            success: false, 
            message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.` 
          };
        }
        
        localStorage.removeItem('otpData');
        return { 
          success: true, 
          message: 'OTP verified successfully', 
          userData: { email: otpData.email, phone: otpData.phone, type: otpData.type }
        };
      }

      // Use Firebase for OTP verification
      const result = await window.firebaseManager.verifyOTP(identifier, inputOTP, type);
      
      if (result.success) {
        // Clean up localStorage
        localStorage.removeItem('otpData');
      }
      
      return result;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: error.message || 'OTP verification failed'
      };
    }
  }

  static async registerWithOTP(userData, otp) {
    try {
      const identifier = userData.email || userData.phone;
      const verification = await this.verifyOTP(identifier, otp, 'register');
      
      if (!verification.success) {
        return verification;
      }
      
      if (!window.firebaseManager || !window.firebaseManager.isInitialized()) {
        // Fallback to localStorage
        const newUser = {
          id: Date.now().toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          isLoggedIn: true,
          isVerified: true,
          registrationDate: new Date().toISOString(),
          profilePicture: userData.profilePicture || null
        };
        
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        return { 
          success: true, 
          message: 'Registration successful!', 
          user: newUser 
        };
      }

      // Use Firebase for user registration
      const result = await window.firebaseManager.registerUser(userData);
      
      if (result.success) {
        // Store current user in localStorage for session management
        const currentUser = { ...result.user, isLoggedIn: true };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Track registration activity
        await window.firebaseManager.trackUserActivity(result.user.id, {
          type: 'registration',
          details: { method: 'otp', email: userData.email, phone: userData.phone }
        });
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  static async loginWithOTP(identifier, otp) {
    try {
      const verification = await this.verifyOTP(identifier, otp, 'login');
      
      if (!verification.success) {
        return verification;
      }
      
      if (!window.firebaseManager || !window.firebaseManager.isInitialized()) {
        // Fallback to localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => 
          u.email === identifier || u.phone === identifier
        );
        
        if (!user) {
          return { 
            success: false, 
            message: 'User not found. Please register first.' 
          };
        }
        
        user.isLoggedIn = true;
        user.lastLoginDate = new Date().toISOString();
        
        const userIndex = registeredUsers.findIndex(u => u.id === user.id);
        registeredUsers[userIndex] = user;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return { 
          success: true, 
          message: 'Login successful!', 
          user: user 
        };
      }

      // Use Firebase for user login
      const result = await window.firebaseManager.loginUser(identifier);
      
      if (result.success) {
        // Store current user in localStorage for session management
        const currentUser = { ...result.user, isLoggedIn: true };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Track login activity
        await window.firebaseManager.trackUserActivity(result.user.id, {
          type: 'login',
          details: { method: 'otp', identifier: identifier }
        });
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }
}

// Navigation menu management
function initializeAuthMenu() {
  const authMenu = document.getElementById('authMenu');
  if (!authMenu) return;

  const currentUser = AuthManager.getCurrentUser();
  
  if (AuthManager.isLoggedIn()) {
    // User is logged in - show user menu
    const userInitial = currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U';
    authMenu.innerHTML = `
      <div class="user-menu">
        <div class="user-avatar" onclick="toggleDropdown()">${userInitial}</div>
        <div class="dropdown-menu" id="dropdownMenu">
          <a href="profile.html" class="dropdown-item">My Profile</a>
          <a href="cart.html" class="dropdown-item">My Cart</a>
          <a href="#" class="dropdown-item" onclick="viewOrderHistory()">Order History</a>
          <a href="#" class="dropdown-item logout-btn" onclick="AuthManager.logout()">Logout</a>
        </div>
      </div>
    `;
  } else {
    // User is not logged in - show login/register links
    authMenu.innerHTML = `
      <a href="login.html" class="auth-link">Login</a>
      <a href="register.html" class="auth-link register-link">Register</a>
    `;
  }
}

// Dropdown functionality
function toggleDropdown() {
  const dropdown = document.getElementById('dropdownMenu');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.getElementById('dropdownMenu');
  
  if (dropdown && userMenu && !userMenu.contains(event.target)) {
    dropdown.classList.remove('show');
  }
});

// Order history functionality
function viewOrderHistory() {
  if (AuthManager.isLoggedIn()) {
    window.location.href = 'profile.html#orders';
  } else {
    alert('Please login to view order history');
    window.location.href = 'login.html';
  }
}

// Session management
function checkSessionTimeout() {
  const currentUser = AuthManager.getCurrentUser();
  if (currentUser && currentUser.loginTime) {
    const loginTime = new Date(currentUser.loginTime);
    const now = new Date();
    const hoursDifference = (now - loginTime) / (1000 * 60 * 60);
    
    // Auto logout after 24 hours if "remember me" is not checked
    if (!currentUser.rememberMe && hoursDifference > 24) {
      alert('Your session has expired. Please login again.');
      AuthManager.logout();
    }
  }
}

// Initialize auth menu when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeAuthMenu();
  
  // Check session timeout every 5 minutes (only if user is logged in)
  if (AuthManager.isLoggedIn()) {
    setInterval(checkSessionTimeout, 5 * 60 * 1000);
  }
});

// Profile page protection
function protectProfilePage() {
  // This should be called on profile page load
  return AuthManager.requireAuth('login.html');
}

// Shopping cart integration
function requireAuthForCart() {
  if (!AuthManager.isLoggedIn()) {
    const shouldRedirect = confirm('Please login to manage your cart. Would you like to login now?');
    if (shouldRedirect) {
      window.location.href = 'login.html';
    }
    return false;
  }
  return true;
}

// Enhanced add to cart with auth check
function addToCartWithAuth(productId, price, productName, productImage) {
  // For guest users, allow adding to cart but remind about login benefits
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: price,
      quantity: 1,
      image: productImage
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  if (!AuthManager.isLoggedIn()) {
    const message = 'Product added to cart! Login to save your cart and access more features.';
    if (confirm(message + ' Would you like to login now?')) {
      window.location.href = 'login.html';
      return;
    }
  }
  
  alert('Product added to cart!');
  updateCartCount();
}

// Update cart count in navigation
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Update cart count if element exists
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
  }
}

// Form auto-fill for logged in users
function autoFillUserForms() {
  const currentUser = AuthManager.getCurrentUser();
  if (currentUser && AuthManager.isLoggedIn()) {
    // Auto-fill contact form
    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    
    if (firstNameField && currentUser.firstName) firstNameField.value = currentUser.firstName;
    if (lastNameField && currentUser.lastName) lastNameField.value = currentUser.lastName;
    if (emailField && currentUser.email) emailField.value = currentUser.email;
    if (phoneField && currentUser.phone) phoneField.value = currentUser.phone;
  }
}