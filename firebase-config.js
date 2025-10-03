// Firebase Configuration and Setup
// Add this file to handle all Firebase operations

class FirebaseManager {
  constructor() {
    this.db = null;
    this.auth = null;
    this.initialized = false;
  }

  // Initialize Firebase with your config
  async initialize(config) {
    try {
      // Firebase config should be added here
      // You'll get this from your Firebase Console
      const firebaseConfig = config || {
        apiKey: "your-api-key",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "your-app-id"
      };

      // Initialize Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      this.db = firebase.firestore();
      this.auth = firebase.auth();
      
      // Configure auth settings
      this.auth.languageCode = 'en';
      this.auth.settings.appVerificationDisabledForTesting = false;
      
      this.initialized = true;

      console.log('Firebase initialized successfully');
      return { success: true, message: 'Firebase initialized' };
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return { success: false, message: error.message };
    }
  }

  // Check if Firebase is initialized
  isInitialized() {
    return this.initialized;
  }

  // User Registration
  async registerUser(userData) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      // Create user document in Firestore
      const userDoc = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || null,
        profilePicture: userData.profilePicture || null,
        isVerified: true,
        registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
        lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(),
        isActive: true,
        authProvider: userData.authProvider || 'email'
      };

      // Add user to Firestore
      const docRef = await this.db.collection('users').add(userDoc);
      
      // Update user data with the generated ID
      await this.db.collection('users').doc(docRef.id).update({
        id: docRef.id
      });

      const completeUserData = {
        id: docRef.id,
        ...userDoc,
        registrationDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString()
      };

      return {
        success: true,
        message: 'User registered successfully',
        user: completeUserData
      };
    } catch (error) {
      console.error('User registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  // User Login
  async loginUser(identifier) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      // Find user by email or phone
      let querySnapshot;
      if (identifier.includes('@')) {
        querySnapshot = await this.db.collection('users')
          .where('email', '==', identifier)
          .limit(1)
          .get();
      } else {
        querySnapshot = await this.db.collection('users')
          .where('phone', '==', identifier)
          .limit(1)
          .get();
      }

      if (querySnapshot.empty) {
        return {
          success: false,
          message: 'No account found with this email/phone number'
        };
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Update last login date
      await this.db.collection('users').doc(userDoc.id).update({
        lastLoginDate: firebase.firestore.FieldValue.serverTimestamp()
      });

      const completeUserData = {
        id: userDoc.id,
        ...userData,
        lastLoginDate: new Date().toISOString(),
        isLoggedIn: true
      };

      return {
        success: true,
        message: 'Login successful',
        user: completeUserData
      };
    } catch (error) {
      console.error('User login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  // Get user by ID
  async getUser(userId) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      const userDoc = await this.db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        user: { id: userDoc.id, ...userDoc.data() }
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get user'
      };
    }
  }

  // Update user data
  async updateUser(userId, updateData) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      const updateObj = {
        ...updateData,
        updatedDate: firebase.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('users').doc(userId).update(updateObj);

      return {
        success: true,
        message: 'User updated successfully'
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update user'
      };
    }
  }

  // Store OTP data
  async storeOTP(otpData) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      const otpDoc = {
        otp: otpData.otp,
        email: otpData.email || null,
        phone: otpData.phone || null,
        type: otpData.type,
        expiryTime: otpData.expiry,
        attempts: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        isUsed: false
      };

      const docRef = await this.db.collection('otpVerifications').add(otpDoc);

      return {
        success: true,
        otpId: docRef.id
      };
    } catch (error) {
      console.error('Store OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to store OTP'
      };
    }
  }

  // Verify OTP
  async verifyOTP(identifier, inputOTP, type) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      // Find OTP record
      let querySnapshot;
      if (identifier.includes('@')) {
        querySnapshot = await this.db.collection('otpVerifications')
          .where('email', '==', identifier)
          .where('type', '==', type)
          .where('isUsed', '==', false)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();
      } else {
        querySnapshot = await this.db.collection('otpVerifications')
          .where('phone', '==', identifier)
          .where('type', '==', type)
          .where('isUsed', '==', false)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();
      }

      if (querySnapshot.empty) {
        return {
          success: false,
          message: 'No OTP found. Please request a new OTP.'
        };
      }

      const otpDoc = querySnapshot.docs[0];
      const otpData = otpDoc.data();

      // Check expiry
      const now = Date.now();
      const expiry = otpData.expiryTime;
      
      if (now > expiry) {
        // Mark as used
        await this.db.collection('otpVerifications').doc(otpDoc.id).update({
          isUsed: true
        });
        
        return {
          success: false,
          message: 'OTP has expired. Please request a new OTP.'
        };
      }

      // Check attempts
      if (otpData.attempts >= 3) {
        await this.db.collection('otpVerifications').doc(otpDoc.id).update({
          isUsed: true
        });
        
        return {
          success: false,
          message: 'Too many attempts. Please request a new OTP.'
        };
      }

      // Check OTP
      if (otpData.otp !== inputOTP) {
        await this.db.collection('otpVerifications').doc(otpDoc.id).update({
          attempts: otpData.attempts + 1
        });
        
        return {
          success: false,
          message: `Invalid OTP. ${3 - (otpData.attempts + 1)} attempts remaining.`
        };
      }

      // OTP is correct - mark as used
      await this.db.collection('otpVerifications').doc(otpDoc.id).update({
        isUsed: true,
        verifiedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      return {
        success: true,
        message: 'OTP verified successfully',
        userData: {
          email: otpData.email,
          phone: otpData.phone,
          type: otpData.type
        }
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: error.message || 'OTP verification failed'
      };
    }
  }

  // Store contact messages
  async storeContactMessage(messageData) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      const messageDoc = {
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone || null,
        subject: messageData.subject,
        message: messageData.message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        isRead: false,
        status: 'new'
      };

      const docRef = await this.db.collection('contactMessages').add(messageDoc);

      return {
        success: true,
        messageId: docRef.id,
        message: 'Message sent successfully'
      };
    } catch (error) {
      console.error('Store message error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send message'
      };
    }
  }

  // Get contact messages (for admin)
  async getContactMessages(limit = 50) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      const querySnapshot = await this.db.collection('contactMessages')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const messages = [];
      querySnapshot.forEach(doc => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        messages: messages
      };
    } catch (error) {
      console.error('Get messages error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get messages'
      };
    }
  }

  // User activity tracking
  async trackUserActivity(userId, activity) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      const activityDoc = {
        userId: userId,
        activity: activity.type,
        details: activity.details || {},
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        ip: activity.ip || null
      };

      await this.db.collection('userActivity').add(activityDoc);

      return {
        success: true
      };
    } catch (error) {
      console.error('Track activity error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Google Sign-In Authentication
  async signInWithGoogle() {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      const result = await this.auth.signInWithPopup(provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await this.db.collection('users').doc(user.uid).get();
      
      let userData;
      if (userDoc.exists) {
        // Update existing user
        userData = userDoc.data();
        await this.db.collection('users').doc(user.uid).update({
          lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL
        });
      } else {
        // Create new user
        userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          phone: user.phoneNumber || '',
          address: '',
          registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
          lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(),
          authProvider: 'google'
        };
        await this.db.collection('users').doc(user.uid).set(userData);
      }

      return {
        success: true,
        message: 'Google sign-in successful',
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          ...userData,
          isLoggedIn: true
        }
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign in with Google'
      };
    }
  }

  // Phone/OTP Authentication
  async sendOTP(phoneNumber) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      // Configure reCAPTCHA
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
          callback: function(response) {
            console.log('reCAPTCHA solved');
          }
        });
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await this.auth.signInWithPhoneNumber(phoneNumber, appVerifier);
      
      // Store confirmation result for OTP verification
      window.confirmationResult = confirmationResult;

      return {
        success: true,
        message: 'OTP sent successfully',
        verificationId: confirmationResult.verificationId
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
      };
    }
  }

  // Verify OTP
  async verifyOTP(otp) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      if (!window.confirmationResult) {
        throw new Error('No confirmation result found. Please request OTP first.');
      }

      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await this.db.collection('users').doc(user.uid).get();
      
      let userData;
      if (userDoc.exists) {
        // Update existing user
        userData = userDoc.data();
        await this.db.collection('users').doc(user.uid).update({
          lastLoginDate: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        // Create new user
        userData = {
          uid: user.uid,
          phone: user.phoneNumber,
          email: '',
          name: '',
          address: '',
          registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
          lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(),
          authProvider: 'phone'
        };
        await this.db.collection('users').doc(user.uid).set(userData);
      }

      // Clear the confirmation result
      window.confirmationResult = null;
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      return {
        success: true,
        message: 'OTP verification successful',
        user: {
          uid: user.uid,
          phone: user.phoneNumber,
          ...userData,
          isLoggedIn: true
        }
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify OTP'
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      if (!this.isInitialized()) {
        throw new Error('Firebase not initialized');
      }

      await this.auth.signOut();
      
      // Clear any stored verification results
      if (window.confirmationResult) {
        window.confirmationResult = null;
      }
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign out'
      };
    }
  }

  // Get current authenticated user
  getCurrentAuthUser() {
    if (!this.isInitialized()) {
      return null;
    }
    return this.auth.currentUser;
  }

  // Listen for authentication state changes
  onAuthStateChanged(callback) {
    if (!this.isInitialized()) {
      throw new Error('Firebase not initialized');
    }
    return this.auth.onAuthStateChanged(callback);
  }
}

// Create global Firebase manager instance
window.firebaseManager = new FirebaseManager();