// Single canonical firebase-config.js
// Centralized FirebaseManager singleton for auth + Firestore operations.
// Expects Firebase compat SDKs to be loaded on the page before this script.

(function (window) {
  'use strict';

  class FirebaseManager {
    constructor() {
      this.app = null;
      this.db = null;
      this.auth = null;
      this.initialized = false;
      this.recaptchaVerifier = null;
      this._currentConfirmationResult = null;
    }

    async initialize(config = {}) {
      try {
        if (!window.firebase) throw new Error('Firebase SDK not loaded. Include Firebase scripts before this file.');
        if (!firebase.apps || !firebase.apps.length) this.app = firebase.initializeApp(config);
        else this.app = firebase.app();
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.initialized = true;
        return { success: true };
      } catch (err) {
        console.error('FirebaseManager.initialize error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    isInitialized() { return this.initialized === true; }

    async signInWithGoogle() {
      if (!this.isInitialized()) throw new Error('Firebase not initialized');
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await this.auth.signInWithPopup(provider);
        const user = result.user;
        const userDoc = { uid: user.uid, email: user.email || '', fullName: user.displayName || '', profilePicture: user.photoURL || null, authProvider: 'google', isVerified: user.emailVerified || false, lastLoginDate: firebase.firestore.FieldValue.serverTimestamp() };
        await this.db.collection('users').doc(user.uid).set(userDoc, { merge: true });
        return { success: true, user: userDoc };
      } catch (err) {
        console.error('signInWithGoogle error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    preparePhoneAuth(containerId = 'recaptcha-container') {
      if (!this.isInitialized()) throw new Error('Firebase not initialized');
      if (this.recaptchaVerifier) return this.recaptchaVerifier;
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, { size: 'invisible' });
      return this.recaptchaVerifier;
    }

    async sendPhoneOTP(phoneNumber, containerId = 'recaptcha-container') {
      try {
        if (!this.isInitialized()) throw new Error('Firebase not initialized');
        this.preparePhoneAuth(containerId);
        const confirmationResult = await this.auth.signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier);
        this._currentConfirmationResult = confirmationResult;
        return { success: true, verificationId: confirmationResult.verificationId };
      } catch (err) {
        console.error('sendPhoneOTP error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async verifyPhoneOTP(code) {
      try {
        if (!this.isInitialized()) throw new Error('Firebase not initialized');
        if (!this._currentConfirmationResult) return { success: false, message: 'No pending verification. Call sendPhoneOTP first.' };
        const result = await this._currentConfirmationResult.confirm(code);
        const user = result.user;
        const userDoc = { uid: user.uid, phone: user.phoneNumber || '', authProvider: 'phone', lastLoginDate: firebase.firestore.FieldValue.serverTimestamp() };
        await this.db.collection('users').doc(user.uid).set(userDoc, { merge: true });
        return { success: true, user: userDoc };
      } catch (err) {
        console.error('verifyPhoneOTP error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async registerUser(userData = {}) {
      if (!this.isInitialized()) throw new Error('Firebase not initialized');
      try {
        const id = userData.uid || userData.id || this.db.collection('users').doc().id;
        const payload = { id, uid: userData.uid || id, firstName: userData.firstName || '', lastName: userData.lastName || '', fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(), email: userData.email || '', phone: userData.phone || '', dateOfBirth: userData.dateOfBirth || null, address: userData.address || '', profilePicture: userData.profilePicture || null, authProvider: userData.authProvider || 'otp', isVerified: userData.isVerified === undefined ? true : !!userData.isVerified, isActive: true, registrationDate: firebase.firestore.FieldValue.serverTimestamp(), lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(), updatedDate: firebase.firestore.FieldValue.serverTimestamp() };
        await this.db.collection('users').doc(id).set(payload, { merge: true });
        return { success: true, user: payload };
      } catch (err) {
        console.error('registerUser error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async loginUser(identifier) {
      if (!this.isInitialized()) throw new Error('Firebase not initialized');
      try {
        if (!identifier) return { success: false, message: 'identifier required' };
        let snap;
        if (identifier.includes && identifier.includes('@')) snap = await this.db.collection('users').where('email', '==', identifier).limit(1).get();
        else snap = await this.db.collection('users').where('phone', '==', identifier).limit(1).get();
        if (snap.empty) return { success: false, message: 'No account found' };
        const doc = snap.docs[0];
        await this.db.collection('users').doc(doc.id).update({ lastLoginDate: firebase.firestore.FieldValue.serverTimestamp(), updatedDate: firebase.firestore.FieldValue.serverTimestamp() });
        return { success: true, user: { id: doc.id, ...doc.data() } };
      } catch (err) {
        console.error('loginUser error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async updateUser(userId, updateData = {}) {
      if (!this.isInitialized()) throw new Error('Firebase not initialized');
      try {
        await this.db.collection('users').doc(userId).set({ ...updateData, updatedDate: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        return { success: true };
      } catch (err) {
        console.error('updateUser error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async getUser(userId) {
      if (!this.isInitialized()) throw new Error('Firebase not initialized');
      try {
        const doc = await this.db.collection('users').doc(userId).get();
        if (!doc.exists) return { success: false, message: 'User not found' };
        return { success: true, user: { id: doc.id, ...doc.data() } };
      } catch (err) {
        console.error('getUser error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async signOut() {
      if (!this.isInitialized()) throw new Error('Firebase not initialized');
      try {
        await this.auth.signOut();
        return { success: true };
      } catch (err) {
        console.error('signOut error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    getCurrentAuthUser() { if (!this.isInitialized()) return null; return this.auth.currentUser || null; }

    onAuthStateChanged(callback) { if (!this.isInitialized()) throw new Error('Firebase not initialized'); return this.auth.onAuthStateChanged(callback); }

    async storeOTP({ otp, email = null, phone = null, type = 'login', expiry = Date.now() + 5 * 60 * 1000 }) {
      try {
        if (!this.isInitialized()) throw new Error('Firebase not initialized');
        const payload = { otp, email, phone, type, expiryTime: expiry, attempts: 0, isUsed: false, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
        const ref = await this.db.collection('otpVerifications').add(payload);
        return { success: true, otpId: ref.id };
      } catch (err) {
        console.error('storeOTP error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async verifyOTP(identifier, inputOTP, type = 'login') {
      try {
        if (!this.isInitialized()) throw new Error('Firebase not initialized');
        let query = this.db.collection('otpVerifications').where('type', '==', type).where('isUsed', '==', false).orderBy('createdAt', 'desc').limit(1);
        if (identifier && identifier.includes('@')) query = query.where('email', '==', identifier);
        else query = query.where('phone', '==', identifier);
        const snap = await query.get();
        if (snap.empty) return { success: false, message: 'No OTP found. Please request a new OTP.' };
        const doc = snap.docs[0];
        const data = doc.data();
        const now = Date.now();
        if (now > data.expiryTime) { await doc.ref.update({ isUsed: true }); return { success: false, message: 'OTP has expired. Please request a new OTP.' }; }
        if (data.attempts >= 3) { await doc.ref.update({ isUsed: true }); return { success: false, message: 'Too many attempts. Please request a new OTP.' }; }
        if (data.otp !== inputOTP) { await doc.ref.update({ attempts: (data.attempts || 0) + 1 }); return { success: false, message: `Invalid OTP. ${3 - ((data.attempts || 0) + 1)} attempts remaining.` }; }
        await doc.ref.update({ isUsed: true, verifiedAt: firebase.firestore.FieldValue.serverTimestamp() });
        return { success: true, message: 'OTP verified successfully', userData: { email: data.email, phone: data.phone, type: data.type } };
      } catch (err) {
        console.error('verifyOTP error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async storeContactMessage(messageData = {}) {
      try {
        if (!this.isInitialized()) throw new Error('Firebase not initialized');
        const payload = { name: messageData.name, email: messageData.email, phone: messageData.phone || null, subject: messageData.subject, message: messageData.message, timestamp: firebase.firestore.FieldValue.serverTimestamp(), isRead: false, status: 'new' };
        const ref = await this.db.collection('contactMessages').add(payload);
        return { success: true, messageId: ref.id, message: 'Message sent successfully' };
      } catch (err) {
        console.error('storeContactMessage error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async getContactMessages(limit = 50) {
      try {
        if (!this.isInitialized()) throw new Error('Firebase not initialized');
        const snap = await this.db.collection('contactMessages').orderBy('timestamp', 'desc').limit(limit).get();
        const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, messages };
      } catch (err) {
        console.error('getContactMessages error', err);
        return { success: false, message: err.message || String(err) };
      }
    }

    async trackUserActivity(userId, activityData = {}) {
      if (!this.isInitialized()) throw new Error('Firebase not initialized');
      try {
        const payload = {
          userId,
          ...activityData,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        await this.db.collection('userActivity').add(payload);
        return { success: true };
      } catch (err) {
        console.error('trackUserActivity error', err);
        return { success: false, message: err.message || String(err) };
      }
    }
  }

  window.firebaseManager = window.firebaseManager || new FirebaseManager();

})(window);
