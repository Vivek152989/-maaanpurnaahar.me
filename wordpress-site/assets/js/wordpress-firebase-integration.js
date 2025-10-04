/**
 * Firebase Integration for WordPress + Astra Theme
 * Maa Anpurna Aahar - Firebase Authentication Bridge
 */

class WordPressFirebaseIntegration {
    constructor() {
        this.firebaseManager = null;
        this.init();
    }

    async init() {
        // Initialize Firebase Manager from your existing config
        this.firebaseManager = new FirebaseManager();
        
        // Firebase configuration (same as your current setup)
        const firebaseConfig = {
            apiKey: "AIzaSyB79RNz2_bcjalb2vnPtGx5TKyxvclLM_0",
            authDomain: "maa-anpurna-aahar.firebaseapp.com",
            projectId: "maa-anpurna-aahar",
            storageBucket: "maa-anpurna-aahar.firebasestorage.app",
            messagingSenderId: "539880099771",
            appId: "1:539880099771:web:0753dfd9cc8f050a5d7e9e",
            measurementId: "G-GH7YLSBMPT"
        };

        await this.firebaseManager.initialize(firebaseConfig);
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        // WordPress login integration
        const loginForm = document.getElementById('wp-login-form');
        if (loginForm) {
            this.enhanceLoginForm(loginForm);
        }

        // Registration form integration
        const registerForm = document.getElementById('wp-register-form');
        if (registerForm) {
            this.enhanceRegisterForm(registerForm);
        }

        // My Account page integration
        if (document.body.classList.contains('woocommerce-account')) {
            this.enhanceMyAccountPage();
        }

        // Add Firebase authentication buttons to existing forms
        this.addFirebaseButtons();
    }

    enhanceLoginForm(form) {
        // Add Firebase login options
        const firebaseSection = this.createFirebaseLoginSection();
        form.appendChild(firebaseSection);

        // Handle Firebase Google login
        const googleBtn = form.querySelector('.firebase-google-login');
        if (googleBtn) {
            googleBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.handleGoogleLogin();
            });
        }

        // Handle Firebase phone login
        const phoneBtn = form.querySelector('.firebase-phone-login');
        if (phoneBtn) {
            phoneBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPhoneLoginModal();
            });
        }
    }

    enhanceRegisterForm(form) {
        // Add Firebase registration options
        const firebaseSection = this.createFirebaseRegisterSection();
        form.appendChild(firebaseSection);

        // Handle Firebase Google registration
        const googleBtn = form.querySelector('.firebase-google-register');
        if (googleBtn) {
            googleBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.handleGoogleRegister();
            });
        }
    }

    createFirebaseLoginSection() {
        const section = document.createElement('div');
        section.className = 'firebase-auth-section';
        section.innerHTML = `
            <div class="firebase-login-options">
                <h3>Quick Sign In</h3>
                <button type="button" class="firebase-google-login btn-google">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>
                <button type="button" class="firebase-phone-login btn-phone">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff9800">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    Sign in with Phone
                </button>
                <div class="auth-divider">
                    <span>or use your account</span>
                </div>
            </div>
        `;
        return section;
    }

    createFirebaseRegisterSection() {
        const section = document.createElement('div');
        section.className = 'firebase-auth-section';
        section.innerHTML = `
            <div class="firebase-register-options">
                <h3>Quick Registration</h3>
                <button type="button" class="firebase-google-register btn-google">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Register with Google
                </button>
                <div class="auth-divider">
                    <span>or create new account</span>
                </div>
            </div>
        `;
        return section;
    }

    async handleGoogleLogin() {
        try {
            const result = await this.firebaseManager.signInWithGoogle();
            
            if (result.success) {
                const user = result.user;
                
                // Send user data to WordPress for sync
                await this.syncWithWordPress({
                    action: 'firebase_login',
                    firebase_uid: user.uid,
                    email: user.email,
                    display_name: user.displayName,
                    photo_url: user.photoURL
                });
                
                this.showSuccess('Login successful! Redirecting...');
                
                // Redirect to My Account or intended page
                setTimeout(() => {
                    window.location.href = '/my-account';
                }, 1500);
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            console.error('Google login error:', error);
            this.showError('Login failed. Please try again.');
        }
    }

    async handleGoogleRegister() {
        try {
            const result = await this.firebaseManager.signInWithGoogle();
            
            if (result.success) {
                const user = result.user;
                
                // Send user data to WordPress for registration
                await this.syncWithWordPress({
                    action: 'firebase_register',
                    firebase_uid: user.uid,
                    email: user.email,
                    display_name: user.displayName,
                    photo_url: user.photoURL,
                    phone: user.phoneNumber || ''
                });
                
                this.showSuccess('Registration successful! Redirecting...');
                
                // Redirect to My Account
                setTimeout(() => {
                    window.location.href = '/my-account';
                }, 1500);
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            console.error('Google registration error:', error);
            this.showError('Registration failed. Please try again.');
        }
    }

    showPhoneLoginModal() {
        // Create phone login modal
        const modal = this.createPhoneLoginModal();
        document.body.appendChild(modal);
        
        // Show modal
        modal.style.display = 'flex';
        
        // Handle phone login
        const phoneForm = modal.querySelector('.phone-login-form');
        phoneForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handlePhoneLogin(modal);
        });
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    createPhoneLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'firebase-phone-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Sign in with Phone</h3>
                <form class="phone-login-form">
                    <div class="phone-input-group">
                        <select id="country-code">
                            <option value="+91">+91 (India)</option>
                            <option value="+1">+1 (USA)</option>
                            <option value="+44">+44 (UK)</option>
                        </select>
                        <input type="tel" id="phone-number" placeholder="Enter phone number" required>
                    </div>
                    <div id="recaptcha-container"></div>
                    <button type="submit" class="send-otp-btn">Send OTP</button>
                </form>
                <div class="otp-verification" style="display: none;">
                    <input type="text" id="otp-input" placeholder="Enter OTP" maxlength="6">
                    <button type="button" class="verify-otp-btn">Verify OTP</button>
                </div>
                <div class="auth-messages"></div>
            </div>
        `;
        return modal;
    }

    async handlePhoneLogin(modal) {
        const countryCode = modal.querySelector('#country-code').value;
        const phoneNumber = modal.querySelector('#phone-number').value;
        const fullPhone = countryCode + phoneNumber;
        
        try {
            const result = await this.firebaseManager.sendOTP(fullPhone, 'recaptcha-container');
            
            if (result.success) {
                // Show OTP verification form
                modal.querySelector('.phone-login-form').style.display = 'none';
                modal.querySelector('.otp-verification').style.display = 'block';
                
                // Handle OTP verification
                const verifyBtn = modal.querySelector('.verify-otp-btn');
                verifyBtn.addEventListener('click', async () => {
                    const otp = modal.querySelector('#otp-input').value;
                    const verifyResult = await this.firebaseManager.verifyOTP(otp);
                    
                    if (verifyResult.success) {
                        const user = verifyResult.user;
                        
                        // Sync with WordPress
                        await this.syncWithWordPress({
                            action: 'firebase_login',
                            firebase_uid: user.uid,
                            email: user.email || '',
                            display_name: user.displayName || 'User',
                            phone: user.phoneNumber
                        });
                        
                        this.showSuccess('Login successful! Redirecting...');
                        document.body.removeChild(modal);
                        
                        setTimeout(() => {
                            window.location.href = '/my-account';
                        }, 1500);
                    } else {
                        this.showError('Invalid OTP. Please try again.');
                    }
                });
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            console.error('Phone login error:', error);
            this.showError('Phone login failed. Please try again.');
        }
    }

    async syncWithWordPress(userData) {
        try {
            const response = await fetch(maa_anpurna_ajax.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: userData.action,
                    nonce: maa_anpurna_ajax.nonce,
                    ...userData
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('WordPress sync successful:', result.data);
                return result.data;
            } else {
                throw new Error(result.data);
            }
        } catch (error) {
            console.error('WordPress sync error:', error);
            throw error;
        }
    }

    checkAuthState() {
        // Monitor Firebase auth state changes
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('User is signed in:', user);
                this.updateUIForSignedInUser(user);
            } else {
                console.log('User is signed out');
                this.updateUIForSignedOutUser();
            }
        });
    }

    updateUIForSignedInUser(user) {
        // Update UI elements for signed-in user
        const userElements = document.querySelectorAll('.user-display-name');
        userElements.forEach(el => {
            el.textContent = user.displayName || user.email;
        });
        
        const loginBtns = document.querySelectorAll('.login-button');
        loginBtns.forEach(btn => {
            btn.textContent = 'My Account';
            btn.href = '/my-account';
        });
    }

    updateUIForSignedOutUser() {
        // Update UI elements for signed-out user
        const loginBtns = document.querySelectorAll('.login-button');
        loginBtns.forEach(btn => {
            btn.textContent = 'Login';
            btn.href = '/login';
        });
    }

    addFirebaseButtons() {
        // Add Firebase authentication buttons to WooCommerce forms
        const wooLoginForm = document.querySelector('.woocommerce-form-login');
        if (wooLoginForm) {
            const firebaseSection = this.createFirebaseLoginSection();
            wooLoginForm.insertBefore(firebaseSection, wooLoginForm.firstChild);
        }
        
        const wooRegisterForm = document.querySelector('.woocommerce-form-register');
        if (wooRegisterForm) {
            const firebaseSection = this.createFirebaseRegisterSection();
            wooRegisterForm.insertBefore(firebaseSection, wooRegisterForm.firstChild);
        }
    }

    enhanceMyAccountPage() {
        // Add Firebase-specific features to My Account page
        const accountNav = document.querySelector('.woocommerce-MyAccount-navigation');
        if (accountNav) {
            const firebaseSettings = document.createElement('li');
            firebaseSettings.innerHTML = '<a href="#firebase-settings">Firebase Settings</a>';
            accountNav.appendChild(firebaseSettings);
        }
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Create or update message display
        let messageEl = document.querySelector('.firebase-auth-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'firebase-auth-message';
            document.body.appendChild(messageEl);
        }
        
        messageEl.className = `firebase-auth-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
}

// CSS Styles for Firebase Integration
const firebaseStyles = `
    <style>
    .firebase-auth-section {
        margin: 20px 0;
        padding: 20px;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        background: #f9f9f9;
    }
    
    .firebase-login-options h3,
    .firebase-register-options h3 {
        color: #333;
        margin-bottom: 15px;
        text-align: center;
    }
    
    .btn-google,
    .btn-phone {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        border: 2px solid #e5e5e5;
        border-radius: 8px;
        background: white;
        color: #333;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s ease;
    }
    
    .btn-google:hover {
        border-color: #4285f4;
        box-shadow: 0 2px 10px rgba(66, 133, 244, 0.2);
    }
    
    .btn-phone:hover {
        border-color: #ff9800;
        box-shadow: 0 2px 10px rgba(255, 152, 0, 0.2);
    }
    
    .auth-divider {
        text-align: center;
        margin: 20px 0;
        position: relative;
    }
    
    .auth-divider:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: #e5e5e5;
    }
    
    .auth-divider span {
        background: #f9f9f9;
        padding: 0 15px;
        color: #666;
        font-size: 14px;
    }
    
    .firebase-phone-modal {
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        justify-content: center;
        align-items: center;
    }
    
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        width: 90%;
        max-width: 400px;
        position: relative;
    }
    
    .close-modal {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        color: #999;
    }
    
    .close-modal:hover {
        color: #333;
    }
    
    .phone-input-group {
        display: flex;
        gap: 10px;
        margin: 15px 0;
    }
    
    .phone-input-group select {
        flex: 1;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    
    .phone-input-group input {
        flex: 2;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    
    .send-otp-btn,
    .verify-otp-btn {
        width: 100%;
        padding: 12px;
        background: #ff9800;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        margin-top: 10px;
    }
    
    .send-otp-btn:hover,
    .verify-otp-btn:hover {
        background: #f57c00;
    }
    
    #otp-input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        text-align: center;
        font-size: 18px;
        letter-spacing: 2px;
        margin-bottom: 10px;
    }
    
    .firebase-auth-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: none;
    }
    
    .firebase-auth-message.success {
        background: #4caf50;
    }
    
    .firebase-auth-message.error {
        background: #f44336;
    }
    
    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            padding: 20px;
        }
        
        .firebase-auth-section {
            margin: 10px 0;
            padding: 15px;
        }
    }
    </style>
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', firebaseStyles);

// Initialize Firebase WordPress integration when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new WordPressFirebaseIntegration();
});

// Export for global access
window.WordPressFirebaseIntegration = WordPressFirebaseIntegration;