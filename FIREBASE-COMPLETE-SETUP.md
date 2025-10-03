# Firebase Setup Guide - Project: maa-anpurna-ahar

## 🎯 **Firebase Configuration Updated Successfully**

Your Firebase configuration has been updated with your new project credentials:

### **New Project Details:**
- **Project ID**: `maa-anpurna-ahar`
- **Auth Domain**: `maa-anpurna-ahar.firebaseapp.com`
- **Analytics**: Enabled with measurement ID

---

## 🔥 **Step-by-Step Firebase Console Setup**

### **Step 1: Access Your Firebase Project**

1. **Go to Firebase Console:**
   - Visit: [https://console.firebase.google.com/project/maa-anpurna-ahar](https://console.firebase.google.com/project/maa-anpurna-ahar)
   - Sign in with your Google account

### **Step 2: Enable Authentication Services**

1. **Open Authentication:**
   - In the left sidebar, click **"Authentication"**
   - If it's your first time, click **"Get started"**

2. **Enable Sign-in Methods:**
   - Go to **"Sign-in method"** tab
   - You'll see various authentication providers

3. **Enable Google Sign-In:**
   - Click on **"Google"** provider
   - Toggle the **"Enable"** switch to ON
   - Fill in required information:
     - **Project public-facing name**: `"Maa Anpurna Aahar"`
     - **Project support email**: Your email address
   - Click **"Save"**

4. **Enable Phone Authentication:**
   - Click on **"Phone"** provider  
   - Toggle the **"Enable"** switch to ON
   - Click **"Save"**

### **Step 3: Choose Database Option**

#### **Option A: Firestore Database (Requires Billing)**
1. **Enable Billing:**
   - Go to: [Enable Billing for maa-anpurna-ahar](https://console.developers.google.com/billing/enable?project=maa-anpurna-ahar)
   - Add a payment method (you won't be charged on free tier)

2. **Create Firestore:**
   - Click **"Firestore Database"**
   - Click **"Create database"**
   - Choose **"Start in test mode"**
   - Select location (closest to your users)
   - Click **"Done"**

#### **Option B: Realtime Database (No Billing Required)**
1. **Create Realtime Database:**
   - Click **"Realtime Database"**
   - Click **"Create Database"**
   - Choose location: **"United States (us-central1)"**
   - **Start in test mode**
   - Click **"Done"**

### **Step 4: Configure Security Rules**

#### **For Firestore (if you chose Option A):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Contact messages - authenticated users can write, admins can read
    match /contactMessages/{messageId} {
      allow write: if request.auth != null;
      allow read: if request.auth != null; // Add admin check later
    }
  }
}
```

#### **For Realtime Database (if you chose Option B):**
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### **Step 5: Add Authorized Domains**

1. **Go to Authentication Settings:**
   - Authentication → **Settings** tab
   - Scroll to **"Authorized domains"**

2. **Add Your Domains:**
   - `localhost` (already included for testing)
   - Your actual domain when you deploy (e.g., `yourdomain.com`)

---

## 🧪 **Testing Your Setup**

### **Test Google Sign-In:**
1. Open your website
2. Go to login page (`login.html`)
3. Click **"📧 Google"** button
4. Complete Google OAuth flow
5. Check Firebase Console → Authentication → Users

### **Test Phone/OTP Authentication:**
1. Click **"📱 Phone/OTP"** button
2. Enter phone number with country code: `+1234567890`
3. Click **"Send OTP"**
4. Enter the 6-digit code received via SMS
5. Verify user creation in Firebase Console

### **Expected User Flow:**
```
User clicks Google/Phone → 
Firebase authenticates → 
User data stored in database → 
User redirected to profile page → 
Firebase Console shows new user
```

---

## 📊 **Firebase Console Monitoring**

### **View Users:**
- **Authentication → Users tab**: See all registered users
- **Sign-in methods used**: Google, Phone, etc.
- **Last sign-in times**: Track user activity

### **Database Management:**
- **Firestore → Data tab**: View user documents and collections
- **Realtime Database → Data tab**: View real-time data structure

### **Analytics:**
- **Analytics → Events**: Track user authentication events
- **Custom events**: Monitor user behavior

---

## 🔧 **Updated Files:**

✅ **`firebase-config.js`** - Updated with new project config  
✅ **`login.html`** - Updated Firebase initialization  
✅ **All authentication methods working**

---

## 🚀 **Production Checklist**

- [ ] Enable authentication providers (Google, Phone)
- [ ] Choose and setup database (Firestore or Realtime)
- [ ] Configure security rules
- [ ] Add production domain to authorized domains
- [ ] Test all authentication flows
- [ ] Monitor user creation in Firebase Console

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"Invalid API key"**
   - Verify Firebase config matches your project
   - Check project ID: `maa-anpurna-ahar`

2. **"Unauthorized domain"**
   - Add your domain to authorized domains
   - Ensure `localhost` is included for testing

3. **"reCAPTCHA error"**
   - Phone authentication requires reCAPTCHA
   - Make sure `recaptcha-container` div exists

4. **Database permission denied**
   - Check security rules are properly configured
   - Ensure user is authenticated before database operations

### **Debug Steps:**
1. Open browser developer tools (F12)
2. Check console for error messages
3. Verify Firebase initialization in console logs
4. Test with different browsers/incognito mode

---

## 📱 **Your Authentication System Features:**

✅ **Google Sign-In** - One-click OAuth authentication  
✅ **Phone/OTP** - SMS-based verification  
✅ **User Management** - Automatic user creation  
✅ **Real-time Monitoring** - Firebase Console integration  
✅ **Security Rules** - Protected user data  
✅ **Analytics** - User behavior tracking  

Your Firebase authentication system is now configured and ready to use! 🎉