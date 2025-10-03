# Firebase Authentication Setup Guide
## Enable Google Sign-In and OTP Authentication

### Step 1: Firebase Console Setup

1. **Create/Access Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your existing project or create a new one
   - Click on your project name

2. **Enable Authentication**
   - In the left sidebar, click **"Authentication"**
   - Click **"Get started"** (if first time)
   - Go to **"Sign-in method"** tab

3. **Enable Google Sign-In**
   - Click on **"Google"** provider
   - Toggle **"Enable"**
   - Set **Project public-facing name**: "Maa Anpurna Aahar"
   - Set **Project support email**: your-email@gmail.com
   - Click **"Save"**

4. **Enable Phone Authentication**
   - Click on **"Phone"** provider
   - Toggle **"Enable"**
   - Click **"Save"**

### Step 2: Get Firebase Configuration

1. **Get Config Object**
   - Click the **gear icon** ⚙️ next to "Project Overview"
   - Select **"Project settings"**
   - Scroll down to **"Your apps"** section
   - Click **"Web"** icon (`</>`)
   - Register your app: **"maa-anpurna-web"**
   - Copy the **Firebase configuration object**

2. **Update Configuration**
   - Open `firebase-config.js`
   - Replace the placeholder config:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...", // Replace with your actual API key
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456789"
   };
   ```

3. **Update Login Page**
   - Open `login.html`
   - Replace the TODO comment with your actual Firebase config

### Step 3: Configure Google Sign-In Domain

1. **Add Authorized Domains**
   - In Firebase Console → Authentication → Settings tab
   - Under **"Authorized domains"**
   - Add your domain: `your-domain.com`
   - For local testing, add: `localhost`

### Step 4: Test Authentication

1. **Test Google Sign-In**
   - Open your website
   - Go to Login page
   - Click **"📧 Google"** button
   - Complete Google sign-in flow

2. **Test Phone/OTP Authentication**
   - Click **"📱 Phone/OTP"** button
   - Enter phone number with country code (e.g., +1234567890)
   - Click **"Send OTP"**
   - Enter received OTP code
   - Click **"Verify OTP"**

### Step 5: Firebase Console Monitoring

1. **View Users**
   - Go to Authentication → Users tab
   - See all registered users
   - View sign-in methods used

2. **Monitor Sign-ins**
   - Check authentication logs
   - Track user activity
   - View error reports

### Step 6: Security Rules (Optional but Recommended)

1. **Firestore Security Rules**
   - Go to Firestore Database → Rules tab
   - Update rules for authenticated users:
   
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Public read for products, authenticated write for admin
       match /products/{document} {
         allow read: if true;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

### Step 7: Testing and Troubleshooting

1. **Common Issues**
   - **"Invalid domain"**: Add your domain to authorized domains
   - **"API key not valid"**: Check Firebase config object
   - **"reCAPTCHA error"**: Ensure reCAPTCHA is properly configured
   - **"Phone number format"**: Use international format (+1234567890)

2. **Testing Steps**
   - Test locally with `localhost`
   - Test Google sign-in flow
   - Test phone OTP flow
   - Check Firebase Console for user creation

3. **Debug Console**
   - Open browser developer tools
   - Check console for errors
   - Verify Firebase initialization

### Step 8: Production Deployment

1. **Update Domain**
   - Add production domain to Firebase authorized domains
   - Update any hardcoded URLs

2. **Security Review**
   - Review Firestore security rules
   - Test all authentication flows
   - Monitor for any errors

### Features Enabled

✅ **Google Sign-In**
- One-click Google authentication
- Automatic user profile creation
- Seamless login experience

✅ **Phone/OTP Authentication**
- SMS-based verification
- International phone number support
- Secure 6-digit OTP verification

✅ **Firebase Console Integration**
- Real-time user monitoring
- Authentication method tracking
- Comprehensive user management

✅ **Security Features**
- Secure authentication flows
- User data protection
- Firestore integration

### Next Steps

1. **Customize UI**: Update login page styling to match your brand
2. **Add Features**: Implement password reset, profile management
3. **Analytics**: Set up user analytics and tracking
4. **Notifications**: Add push notifications for user engagement

### Support

If you encounter any issues:
1. Check Firebase Console for error logs
2. Review browser console for JavaScript errors
3. Verify all configuration steps
4. Test with different browsers/devices