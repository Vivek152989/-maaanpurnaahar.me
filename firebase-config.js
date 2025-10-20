// Centralized Firebase management utility// Firebase Configuration and Setup

// Handles initialization, user profiles, OTP storage, and auth providers// Add this file to handle all Firebase operations



class FirebaseManager {class FirebaseManager {

  constructor() {  constructor() {

    this.app = null;    this.db = null;

    this.db = null;    this.auth = null;

    this.auth = null;    this.initialized = false;

    this.initialized = false;  }

  }  // Initialize Firebase with your config

  async initialize(config) {

  async initialize(customConfig) {    try {

    try {      // Firebase config from your Firebase Console

      const firebaseConfig = customConfig || {      // Updated with your latest project credentials

        apiKey: "AIzaSyB79RNz2_bcjalb2vnPtGx5TKyxvclLM_0",      const firebaseConfig = config || {

        authDomain: "maa-anpurna-aahar.firebaseapp.com",        apiKey: "AIzaSyB79RNz2_bcjalb2vnPtGx5TKyxvclLM_0",

        projectId: "maa-anpurna-aahar",        authDomain: "maa-anpurna-aahar.firebaseapp.com",

        storageBucket: "maa-anpurna-aahar.firebasestorage.app",        projectId: "maa-anpurna-aahar",

        messagingSenderId: "539880099771",        storageBucket: "maa-anpurna-aahar.firebasestorage.app",

        appId: "1:539880099771:web:0753dfd9cc8f050a5d7e9e",        messagingSenderId: "539880099771",

        measurementId: "G-GH7YLSBMPT"        appId: "1:539880099771:web:0753dfd9cc8f050a5d7e9e",

      };        measurementId: "G-GH7YLSBMPT"

      };

      if (!firebase.apps.length) {

        this.app = firebase.initializeApp(firebaseConfig);      // Initialize Firebase

      } else {      if (!firebase.apps.length) {

        this.app = firebase.app();        firebase.initializeApp(firebaseConfig);

      }      }



      this.db = firebase.firestore();      this.db = firebase.firestore();

      this.auth = firebase.auth();      this.auth = firebase.auth();

      

      if (this.auth.languageCode) {      // Configure auth settings

        this.auth.languageCode = "en";      this.auth.languageCode = 'en';

      }      this.auth.settings.appVerificationDisabledForTesting = false;

      

      if (this.auth.settings && typeof this.auth.settings.appVerificationDisabledForTesting !== "undefined") {      this.initialized = true;

        this.auth.settings.appVerificationDisabledForTesting = false;

      }      console.log('Firebase initialized successfully');

      return { success: true, message: 'Firebase initialized' };

      this.initialized = true;    } catch (error) {

      console.log("Firebase initialized successfully");      console.error('Firebase initialization error:', error);

      return { success: true, message: "Firebase initialized" };      return { success: false, message: error.message };

    } catch (error) {    }

      console.error("Firebase initialization error:", error);  }

      return { success: false, message: error.message };

    }  // Check if Firebase is initialized

  }  isInitialized() {

    return this.initialized;

  isInitialized() {  }

    return this.initialized;

  }  // User Registration

  async registerUser(userData) {

  formatTimestamp(value) {    try {

    if (!value) {      if (!this.isInitialized()) {

      return null;        throw new Error('Firebase not initialized');

    }      }



    if (typeof value.toDate === "function") {      // Create user document in Firestore

      return value.toDate().toISOString();      const userDoc = {

    }        firstName: userData.firstName,

        lastName: userData.lastName,

    if (value instanceof Date) {        email: userData.email,

      return value.toISOString();        phone: userData.phone || null,

    }        profilePicture: userData.profilePicture || null,

        isVerified: true,

    return value;        registrationDate: firebase.firestore.FieldValue.serverTimestamp(),

  }        lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(),

        isActive: true,

  async findUserByField(field, value) {        authProvider: userData.authProvider || 'email'

    if (!value) {      };

      return null;

    }      // Add user to Firestore

      const docRef = await this.db.collection('users').add(userDoc);

    const snapshot = await this.db      

      .collection("users")      // Update user data with the generated ID

      .where(field, "==", value)      await this.db.collection('users').doc(docRef.id).update({

      .limit(1)        id: docRef.id

      .get();      });



    if (snapshot.empty) {      const completeUserData = {

      return null;        id: docRef.id,

    }        ...userDoc,

        registrationDate: new Date().toISOString(),

    return snapshot.docs[0];        lastLoginDate: new Date().toISOString()

  }      };



  normalizeUserDoc(docSnapshot, overrides = {}) {      return {

    if (!docSnapshot) {        success: true,

      return null;        message: 'User registered successfully',

    }        user: completeUserData

      };

    const data = docSnapshot.data ? docSnapshot.data() : docSnapshot;    } catch (error) {

    const normalized = {      console.error('User registration error:', error);

      id: docSnapshot.id || data.id,      return {

      ...data,        success: false,

      ...overrides        message: error.message || 'Registration failed'

    };      };

    }

    normalized.registrationDate = this.formatTimestamp(normalized.registrationDate) || null;  }

    normalized.lastLoginDate = this.formatTimestamp(normalized.lastLoginDate) || null;

    normalized.updatedDate = this.formatTimestamp(normalized.updatedDate) || null;  // User Login

  async loginUser(identifier) {

    return normalized;    try {

  }      if (!this.isInitialized()) {

        throw new Error('Firebase not initialized');

  async checkUserExists({ email, phone }) {      }

    if (!this.isInitialized()) {

      throw new Error("Firebase not initialized");      // Find user by email or phone

    }      let querySnapshot;

      if (identifier.includes('@')) {

    const checks = [];        querySnapshot = await this.db.collection('users')

          .where('email', '==', identifier)

    if (email) {          .limit(1)

      checks.push(this.findUserByField("email", email));          .get();

    }      } else {

        querySnapshot = await this.db.collection('users')

    if (phone) {          .where('phone', '==', identifier)

      checks.push(this.findUserByField("phone", phone));          .limit(1)

    }          .get();

      }

    const results = await Promise.all(checks);

    return results.some(result => Boolean(result));      if (querySnapshot.empty) {

  }        return {

          success: false,

  async registerUser(userData) {          message: 'No account found with this email/phone number'

    try {        };

      if (!this.isInitialized()) {      }

        throw new Error("Firebase not initialized");

      }      const userDoc = querySnapshot.docs[0];

      const userData = userDoc.data();

      const { email, phone } = userData;

      // Update last login date

      if (email || phone) {      await this.db.collection('users').doc(userDoc.id).update({

        const duplicate = await this.checkUserExists({ email, phone });        lastLoginDate: firebase.firestore.FieldValue.serverTimestamp()

        if (duplicate) {      });

          return {

            success: false,      const completeUserData = {

            message: "An account with this email or phone already exists"        id: userDoc.id,

          };        ...userData,

        }        lastLoginDate: new Date().toISOString(),

      }        isLoggedIn: true

      };

      const docId = userData.uid || userData.id || this.db.collection("users").doc().id;

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();      return {

        success: true,

      const profile = {        message: 'Login successful',

        id: docId,        user: completeUserData

        firstName: userData.firstName || "",      };

        lastName: userData.lastName || "",    } catch (error) {

        fullName: userData.fullName || `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),      console.error('User login error:', error);

        email: email || "",      return {

        phone: phone || "",        success: false,

        dateOfBirth: userData.dateOfBirth || null,        message: error.message || 'Login failed'

        address: userData.address || "",      };

        profilePicture: userData.profilePicture || null,    }

        authProvider: userData.authProvider || "otp",  }

        isVerified: true,

        isActive: true,  // Get user by ID

        registrationDate: timestamp,  async getUser(userId) {

        lastLoginDate: timestamp,    try {

        updatedDate: timestamp,      if (!this.isInitialized()) {

        createdAt: timestamp        throw new Error('Firebase not initialized');

      };      }



      await this.db.collection("users").doc(docId).set(profile, { merge: true });      const userDoc = await this.db.collection('users').doc(userId).get();

      

      const responseUser = {      if (!userDoc.exists) {

        ...profile,        return {

        registrationDate: new Date().toISOString(),          success: false,

        lastLoginDate: new Date().toISOString(),          message: 'User not found'

        isLoggedIn: true        };

      };      }



      return {      return {

        success: true,        success: true,

        message: "User registered successfully",        user: { id: userDoc.id, ...userDoc.data() }

        user: responseUser      };

      };    } catch (error) {

    } catch (error) {      console.error('Get user error:', error);

      console.error("User registration error:", error);      return {

      return {        success: false,

        success: false,        message: error.message || 'Failed to get user'

        message: error.message || "Registration failed"      };

      };    }

    }  }

  }

  // Update user data

  async loginUser(identifier) {  async updateUser(userId, updateData) {

    try {    try {

      if (!this.isInitialized()) {      if (!this.isInitialized()) {

        throw new Error("Firebase not initialized");        throw new Error('Firebase not initialized');

      }      }



      let querySnapshot;      const updateObj = {

      if (identifier && identifier.includes("@")) {        ...updateData,

        querySnapshot = await this.db        updatedDate: firebase.firestore.FieldValue.serverTimestamp()

          .collection("users")      };

          .where("email", "==", identifier)

          .limit(1)      await this.db.collection('users').doc(userId).update(updateObj);

          .get();

      } else {      return {

        querySnapshot = await this.db        success: true,

          .collection("users")        message: 'User updated successfully'

          .where("phone", "==", identifier)      };

          .limit(1)    } catch (error) {

          .get();      console.error('Update user error:', error);

      }      return {

        success: false,

      if (querySnapshot.empty) {        message: error.message || 'Failed to update user'

        return {      };

          success: false,    }

          message: "No account found with this email/phone number"  }

        };

      }  // Store OTP data

  async storeOTP(otpData) {

      const userDoc = querySnapshot.docs[0];    try {

      if (!this.isInitialized()) {

      await this.db.collection("users").doc(userDoc.id).update({        throw new Error('Firebase not initialized');

        lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(),      }

        updatedDate: firebase.firestore.FieldValue.serverTimestamp()

      });      const otpDoc = {

        otp: otpData.otp,

      const normalizedUser = this.normalizeUserDoc(userDoc, {        email: otpData.email || null,

        id: userDoc.id,        phone: otpData.phone || null,

        isLoggedIn: true,        type: otpData.type,

        lastLoginDate: new Date().toISOString()        expiryTime: otpData.expiry,

      });        attempts: 0,

        createdAt: firebase.firestore.FieldValue.serverTimestamp(),

      return {        isUsed: false

        success: true,      };

        message: "Login successful",

        user: normalizedUser      const docRef = await this.db.collection('otpVerifications').add(otpDoc);

      };

    } catch (error) {      return {

      console.error("User login error:", error);        success: true,

      return {        otpId: docRef.id

        success: false,      };

        message: error.message || "Login failed"    } catch (error) {

      };      console.error('Store OTP error:', error);

    }      return {

  }        success: false,

        message: error.message || 'Failed to store OTP'

  async getUser(userId) {      };

    try {    }

      if (!this.isInitialized()) {  }

        throw new Error("Firebase not initialized");

      }  // Verify OTP

  async verifyOTP(identifier, inputOTP, type) {

      const doc = await this.db.collection("users").doc(userId).get();    try {

      if (!this.isInitialized()) {

      if (!doc.exists) {        throw new Error('Firebase not initialized');

        return {      }

          success: false,

          message: "User not found"      // Find OTP record

        };      let querySnapshot;

      }      if (identifier.includes('@')) {

        querySnapshot = await this.db.collection('otpVerifications')

      return {          .where('email', '==', identifier)

        success: true,          .where('type', '==', type)

        user: this.normalizeUserDoc(doc)          .where('isUsed', '==', false)

      };          .orderBy('createdAt', 'desc')

    } catch (error) {          .limit(1)

      console.error("Get user error:", error);          .get();

      return {      } else {

        success: false,        querySnapshot = await this.db.collection('otpVerifications')

        message: error.message || "Failed to get user"          .where('phone', '==', identifier)

      };          .where('type', '==', type)

    }          .where('isUsed', '==', false)

  }          .orderBy('createdAt', 'desc')

          .limit(1)

  async updateUser(userId, updateData) {          .get();

    try {      }

      if (!this.isInitialized()) {

        throw new Error("Firebase not initialized");      if (querySnapshot.empty) {

      }        return {

          success: false,

      const updateObj = {          message: 'No OTP found. Please request a new OTP.'

        ...updateData,        };

        updatedDate: firebase.firestore.FieldValue.serverTimestamp()      }

      };

      const otpDoc = querySnapshot.docs[0];

      await this.db.collection("users").doc(userId).update(updateObj);      const otpData = otpDoc.data();



      return {      // Check expiry

        success: true,      const now = Date.now();

        message: "User updated successfully"      const expiry = otpData.expiryTime;

      };      

    } catch (error) {      if (now > expiry) {

      console.error("Update user error:", error);        // Mark as used

      return {        await this.db.collection('otpVerifications').doc(otpDoc.id).update({

        success: false,          isUsed: true

        message: error.message || "Failed to update user"        });

      };        

    }        return {

  }          success: false,

          message: 'OTP has expired. Please request a new OTP.'

  async storeOTP(otpData) {        };

    try {      }

      if (!this.isInitialized()) {

        throw new Error("Firebase not initialized");      // Check attempts

      }      if (otpData.attempts >= 3) {

        await this.db.collection('otpVerifications').doc(otpDoc.id).update({

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();          isUsed: true

        });

      const payload = {        

        otp: otpData.otp,        return {

        email: otpData.email || null,          success: false,

        phone: otpData.phone || null,          message: 'Too many attempts. Please request a new OTP.'

        type: otpData.type,        };

        expiryTime: otpData.expiry,      }

        attempts: 0,

        isUsed: false,      // Check OTP

        createdAt: timestamp      if (otpData.otp !== inputOTP) {

      };        await this.db.collection('otpVerifications').doc(otpDoc.id).update({

          attempts: otpData.attempts + 1

      const docRef = await this.db.collection("otpVerifications").add(payload);        });

        

      return {        return {

        success: true,          success: false,

        otpId: docRef.id          message: `Invalid OTP. ${3 - (otpData.attempts + 1)} attempts remaining.`

      };        };

    } catch (error) {      }

      console.error("Store OTP error:", error);

      return {      // OTP is correct - mark as used

        success: false,      await this.db.collection('otpVerifications').doc(otpDoc.id).update({

        message: error.message || "Failed to store OTP"        isUsed: true,

      };        verifiedAt: firebase.firestore.FieldValue.serverTimestamp()

    }      });

  }

      return {

  async verifyOTP(identifier, inputOTP, type) {        success: true,

    try {        message: 'OTP verified successfully',

      if (!this.isInitialized()) {        userData: {

        throw new Error("Firebase not initialized");          email: otpData.email,

      }          phone: otpData.phone,

          type: otpData.type

      let query = this.db        }

        .collection("otpVerifications")      };

        .where("type", "==", type)    } catch (error) {

        .where("isUsed", "==", false)      console.error('Verify OTP error:', error);

        .orderBy("createdAt", "desc")      return {

        .limit(1);        success: false,

        message: error.message || 'OTP verification failed'

      if (identifier && identifier.includes("@")) {      };

        query = query.where("email", "==", identifier);    }

      } else {  }

        query = query.where("phone", "==", identifier);

      }  // Store contact messages

  async storeContactMessage(messageData) {

      const snapshot = await query.get();    try {

      if (!this.isInitialized()) {

      if (snapshot.empty) {        throw new Error('Firebase not initialized');

        return {      }

          success: false,

          message: "No OTP found. Please request a new OTP."      const messageDoc = {

        };        name: messageData.name,

      }        email: messageData.email,

        phone: messageData.phone || null,

      const otpDoc = snapshot.docs[0];        subject: messageData.subject,

      const data = otpDoc.data();        message: messageData.message,

        timestamp: firebase.firestore.FieldValue.serverTimestamp(),

      if (Date.now() > data.expiryTime) {        isRead: false,

        await otpDoc.ref.update({ isUsed: true });        status: 'new'

        return {      };

          success: false,

          message: "OTP has expired. Please request a new OTP."      const docRef = await this.db.collection('contactMessages').add(messageDoc);

        };

      }      return {

        success: true,

      if (data.attempts >= 3) {        messageId: docRef.id,

        await otpDoc.ref.update({ isUsed: true });        message: 'Message sent successfully'

        return {      };

          success: false,    } catch (error) {

          message: "Too many attempts. Please request a new OTP."      console.error('Store message error:', error);

        };      return {

      }        success: false,

        message: error.message || 'Failed to send message'

      if (data.otp !== inputOTP) {      };

        await otpDoc.ref.update({ attempts: data.attempts + 1 });    }

        return {  }

          success: false,

          message: `Invalid OTP. ${3 - (data.attempts + 1)} attempts remaining.`  // Get contact messages (for admin)

        };  async getContactMessages(limit = 50) {

      }    try {

      if (!this.isInitialized()) {

      await otpDoc.ref.update({        throw new Error('Firebase not initialized');

        isUsed: true,      }

        verifiedAt: firebase.firestore.FieldValue.serverTimestamp()

      });      const querySnapshot = await this.db.collection('contactMessages')

        .orderBy('timestamp', 'desc')

      return {        .limit(limit)

        success: true,        .get();

        message: "OTP verified successfully",

        userData: {      const messages = [];

          email: data.email,      querySnapshot.forEach(doc => {

          phone: data.phone,        messages.push({

          type: data.type          id: doc.id,

        }          ...doc.data()

      };        });

    } catch (error) {      });

      console.error("Verify OTP error:", error);

      return {      return {

        success: false,        success: true,

        message: error.message || "OTP verification failed"        messages: messages

      };      };

    }    } catch (error) {

  }      console.error('Get messages error:', error);

      return {

  async storeContactMessage(messageData) {        success: false,

    try {        message: error.message || 'Failed to get messages'

      if (!this.isInitialized()) {      };

        throw new Error("Firebase not initialized");    }

      }  }



      const payload = {  // User activity tracking

        name: messageData.name,  async trackUserActivity(userId, activity) {

        email: messageData.email,    try {

        phone: messageData.phone || null,      if (!this.isInitialized()) {

        subject: messageData.subject,        throw new Error('Firebase not initialized');

        message: messageData.message,      }

        timestamp: firebase.firestore.FieldValue.serverTimestamp(),

        isRead: false,      const activityDoc = {

        status: "new"        userId: userId,

      };        activity: activity.type,

        details: activity.details || {},

      const docRef = await this.db.collection("contactMessages").add(payload);        timestamp: firebase.firestore.FieldValue.serverTimestamp(),

        userAgent: navigator.userAgent,

      return {        ip: activity.ip || null

        success: true,      };

        messageId: docRef.id,

        message: "Message sent successfully"      await this.db.collection('userActivity').add(activityDoc);

      };

    } catch (error) {      return {

      console.error("Store message error:", error);        success: true

      return {      };

        success: false,    } catch (error) {

        message: error.message || "Failed to send message"      console.error('Track activity error:', error);

      };      return {

    }        success: false,

  }        message: error.message

      };

  async getContactMessages(limit = 50) {    }

    try {  }

      if (!this.isInitialized()) {

        throw new Error("Firebase not initialized");  // Google Sign-In Authentication

      }  async signInWithGoogle() {

    try {

      const snapshot = await this.db      if (!this.isInitialized()) {

        .collection("contactMessages")        throw new Error('Firebase not initialized');

        .orderBy("timestamp", "desc")      }

        .limit(limit)

        .get();      const provider = new firebase.auth.GoogleAuthProvider();

      provider.addScope('email');

      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));      provider.addScope('profile');



      return {      const result = await this.auth.signInWithPopup(provider);

        success: true,      const user = result.user;

        messages

      };      // Check if user already exists in Firestore

    } catch (error) {      const userDoc = await this.db.collection('users').doc(user.uid).get();

      console.error("Get messages error:", error);      

      return {      let userData;

        success: false,      if (userDoc.exists) {

        message: error.message || "Failed to get messages"        // Update existing user

      };        userData = userDoc.data();

    }        await this.db.collection('users').doc(user.uid).update({

  }          lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(),

          photoURL: user.photoURL

  async trackUserActivity(userId, activity) {        });

    try {      } else {

      if (!this.isInitialized()) {        // Create new user

        throw new Error("Firebase not initialized");        userData = {

      }          uid: user.uid,

          email: user.email,

      const payload = {          name: user.displayName,

        userId,          photoURL: user.photoURL,

        activity: activity.type,          phone: user.phoneNumber || '',

        details: activity.details || {},          address: '',

        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,          registrationDate: firebase.firestore.FieldValue.serverTimestamp(),

        ip: activity.ip || null,          lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(),

        timestamp: firebase.firestore.FieldValue.serverTimestamp()          authProvider: 'google'

      };        };

        await this.db.collection('users').doc(user.uid).set(userData);

      await this.db.collection("userActivity").add(payload);      }



      return { success: true };      return {

    } catch (error) {        success: true,

      console.error("Track activity error:", error);        message: 'Google sign-in successful',

      return {        user: {

        success: false,          uid: user.uid,

        message: error.message || "Failed to track activity"          email: user.email,

      };          name: user.displayName,

    }          photoURL: user.photoURL,

  }          ...userData,

          isLoggedIn: true

  async signInWithGoogle() {        }

    try {      };

      if (!this.isInitialized()) {    } catch (error) {

        throw new Error("Firebase not initialized");      console.error('Google sign-in error:', error);

      }      return {

        success: false,

      const provider = new firebase.auth.GoogleAuthProvider();        message: error.message || 'Failed to sign in with Google'

      provider.addScope("email");      };

      provider.addScope("profile");    }

  }

      const result = await this.auth.signInWithPopup(provider);

      const user = result.user;  // Phone/OTP Authentication

  async sendOTP(phoneNumber) {

      const userRef = this.db.collection("users").doc(user.uid);    try {

      const userDoc = await userRef.get();      if (!this.isInitialized()) {

        throw new Error('Firebase not initialized');

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();      }



      if (userDoc.exists) {      // Configure reCAPTCHA

        await userRef.update({      if (!window.recaptchaVerifier) {

          lastLoginDate: timestamp,        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {

          updatedDate: timestamp,          size: 'invisible',

          profilePicture: user.photoURL || userDoc.data().profilePicture || null          callback: function(response) {

        });            console.log('reCAPTCHA solved');

      } else {          }

        await userRef.set({        });

          id: user.uid,      }

          email: user.email || "",

          phone: user.phoneNumber || "",      const appVerifier = window.recaptchaVerifier;

          fullName: user.displayName || "",      const confirmationResult = await this.auth.signInWithPhoneNumber(phoneNumber, appVerifier);

          firstName: user.displayName ? user.displayName.split(" ")[0] : "",      

          lastName: user.displayName ? user.displayName.split(" ").slice(1).join(" ") : "",      // Store confirmation result for OTP verification

          authProvider: "google",      window.confirmationResult = confirmationResult;

          profilePicture: user.photoURL || null,

          isVerified: true,      return {

          isActive: true,        success: true,

          registrationDate: timestamp,        message: 'OTP sent successfully',

          lastLoginDate: timestamp,        verificationId: confirmationResult.verificationId

          updatedDate: timestamp      };

        });    } catch (error) {

      }      console.error('Send OTP error:', error);

      return {

      const refreshedDoc = await userRef.get();        success: false,

      const normalized = this.normalizeUserDoc(refreshedDoc, {        message: error.message || 'Failed to send OTP'

        uid: user.uid,      };

        email: user.email,    }

        name: user.displayName,  }

        photoURL: user.photoURL,

        isLoggedIn: true  // Verify OTP

      });  async verifyOTP(otp) {

    try {

      return {      if (!this.isInitialized()) {

        success: true,        throw new Error('Firebase not initialized');

        message: "Google sign-in successful",      }

        user: normalized

      };      if (!window.confirmationResult) {

    } catch (error) {        throw new Error('No confirmation result found. Please request OTP first.');

      console.error("Google sign-in error:", error);      }

      return {

        success: false,      const result = await window.confirmationResult.confirm(otp);

        message: error.message || "Failed to sign in with Google"      const user = result.user;

      };

    }      // Check if user already exists in Firestore

  }      const userDoc = await this.db.collection('users').doc(user.uid).get();

      

  ensureRecaptcha(containerId) {      let userData;

    if (!window.recaptchaVerifier) {      if (userDoc.exists) {

      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {        // Update existing user

        size: "invisible",        userData = userDoc.data();

        callback: () => {        await this.db.collection('users').doc(user.uid).update({

          console.log("reCAPTCHA solved");          lastLoginDate: firebase.firestore.FieldValue.serverTimestamp()

        }        });

      });      } else {

    }        // Create new user

        userData = {

    return window.recaptchaVerifier;          uid: user.uid,

  }          phone: user.phoneNumber,

          email: '',

  async sendPhoneOTP(phoneNumber, containerId = "recaptcha-container") {          name: '',

    try {          address: '',

      if (!this.isInitialized()) {          registrationDate: firebase.firestore.FieldValue.serverTimestamp(),

        throw new Error("Firebase not initialized");          lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(),

      }          authProvider: 'phone'

        };

      const verifier = this.ensureRecaptcha(containerId);        await this.db.collection('users').doc(user.uid).set(userData);

      const confirmationResult = await this.auth.signInWithPhoneNumber(phoneNumber, verifier);      }

      window.confirmationResult = confirmationResult;

      // Clear the confirmation result

      return {      window.confirmationResult = null;

        success: true,      if (window.recaptchaVerifier) {

        message: "OTP sent successfully",        window.recaptchaVerifier.clear();

        verificationId: confirmationResult.verificationId        window.recaptchaVerifier = null;

      };      }

    } catch (error) {

      console.error("Send phone OTP error:", error);      return {

      return {        success: true,

        success: false,        message: 'OTP verification successful',

        message: error.message || "Failed to send OTP"        user: {

      };          uid: user.uid,

    }          phone: user.phoneNumber,

  }          ...userData,

          isLoggedIn: true

  async verifyPhoneOTP(otp) {        }

    try {      };

      if (!this.isInitialized()) {    } catch (error) {

        throw new Error("Firebase not initialized");      console.error('Verify OTP error:', error);

      }      return {

        success: false,

      if (!window.confirmationResult) {        message: error.message || 'Failed to verify OTP'

        throw new Error("No confirmation result found. Please request OTP first.");      };

      }    }

  }

      const result = await window.confirmationResult.confirm(otp);

      const user = result.user;  // Sign out

  async signOut() {

      const userRef = this.db.collection("users").doc(user.uid);    try {

      const userDoc = await userRef.get();      if (!this.isInitialized()) {

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();        throw new Error('Firebase not initialized');

      }

      if (userDoc.exists) {

        await userRef.update({      await this.auth.signOut();

          lastLoginDate: timestamp,      

          updatedDate: timestamp      // Clear any stored verification results

        });      if (window.confirmationResult) {

      } else {        window.confirmationResult = null;

        await userRef.set({      }

          id: user.uid,      if (window.recaptchaVerifier) {

          phone: user.phoneNumber || "",        window.recaptchaVerifier.clear();

          email: user.email || "",        window.recaptchaVerifier = null;

          fullName: "",      }

          authProvider: "phone",

          isVerified: true,      return {

          isActive: true,        success: true,

          registrationDate: timestamp,        message: 'Signed out successfully'

          lastLoginDate: timestamp,      };

          updatedDate: timestamp    } catch (error) {

        });      console.error('Sign out error:', error);

      }      return {

        success: false,

      const refreshedDoc = await userRef.get();        message: error.message || 'Failed to sign out'

      const normalized = this.normalizeUserDoc(refreshedDoc, {      };

        uid: user.uid,    }

        phone: user.phoneNumber,  }

        isLoggedIn: true

      });  // Get current authenticated user

  getCurrentAuthUser() {

      window.confirmationResult = null;    if (!this.isInitialized()) {

      if (window.recaptchaVerifier && typeof window.recaptchaVerifier.clear === "function") {      return null;

        window.recaptchaVerifier.clear();    }

        window.recaptchaVerifier = null;    return this.auth.currentUser;

      }  }



      return {  // Listen for authentication state changes

        success: true,  onAuthStateChanged(callback) {

        message: "OTP verification successful",    if (!this.isInitialized()) {

        user: normalized      throw new Error('Firebase not initialized');

      };    }

    } catch (error) {    return this.auth.onAuthStateChanged(callback);

      console.error("Verify phone OTP error:", error);  }

      return {}

        success: false,

        message: error.message || "Failed to verify OTP"// Create global Firebase manager instance

      };window.firebaseManager = new FirebaseManager();
    }
  }

  async signOut() {
    try {
      if (!this.isInitialized()) {
        throw new Error("Firebase not initialized");
      }

      await this.auth.signOut();

      if (window.confirmationResult) {
        window.confirmationResult = null;
      }

      if (window.recaptchaVerifier && typeof window.recaptchaVerifier.clear === "function") {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      return { success: true, message: "Signed out successfully" };
    } catch (error) {
      console.error("Sign out error:", error);
      return {
        success: false,
        message: error.message || "Failed to sign out"
      };
    }
  }

  getCurrentAuthUser() {
    if (!this.isInitialized()) {
      return null;
    }

    return this.auth.currentUser;
  }

  onAuthStateChanged(callback) {
    if (!this.isInitialized()) {
      throw new Error("Firebase not initialized");
    }

    return this.auth.onAuthStateChanged(callback);
  }
}

window.firebaseManager = window.firebaseManager || new FirebaseManager();
