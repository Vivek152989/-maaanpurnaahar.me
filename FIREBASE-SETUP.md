# Firebase Setup Guide for Maa Anpurna Aahar

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project (e.g., "maa-anpurna-aahar")
4. Enable Google Analytics (optional but recommended)
5. Choose your Analytics account or create new one
6. Click "Create project"

## Step 2: Setup Firestore Database

1. In your Firebase project dashboard, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for now (we'll secure it later)
4. Select your preferred location (choose closest to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your project dashboard, click the gear icon ⚙️ and select "Project settings"
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>)
4. Register your app with a nickname (e.g., "maa-anpurna-web")
5. Copy the Firebase configuration object

## Step 4: Update Your Website

### 4.1 Replace Firebase Config

Open `firebase-config.js` and replace the placeholder config with your actual Firebase config:

```javascript
// Replace this in firebase-config.js
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### 4.2 Update HTML Files

Replace the placeholder config in these files with your actual Firebase config:
- `index.html`
- `login.html` 
- `register.html`
- `otp-verification.html`

Look for this section and replace the values:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",           // Replace with your actual API key
  authDomain: "your-project.firebaseapp.com",  // Replace with your domain
  projectId: "your-project-id",     // Replace with your project ID
  storageBucket: "your-project.appspot.com",   // Replace with your storage bucket
  messagingSenderId: "123456789",   // Replace with your sender ID
  appId: "your-app-id"             // Replace with your app ID
};
```

## Step 5: Setup Firestore Security Rules

1. Go to Firestore Database → Rules
2. Replace the default rules with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // OTP verifications - allow read/write for verification process
    match /otpVerifications/{docId} {
      allow create: if true; // Allow creating OTP records
      allow read, update: if true; // Allow reading and updating for verification
    }
    
    // Contact messages - allow anyone to create, only authenticated users to read
    match /contactMessages/{messageId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
    
    // User activity - only allow creating activity records
    match /userActivity/{activityId} {
      allow create: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Step 6: Setup Firestore Collections

The following collections will be automatically created when users interact with your site:

### Collections Structure:

1. **users** - User profiles and data
   - `id` (auto-generated)
   - `firstName`, `lastName`
   - `email`, `phone`
   - `registrationDate`, `lastLoginDate`
   - `isVerified`, `isActive`
   - `profilePicture`

2. **otpVerifications** - OTP codes for authentication
   - `otp` (6-digit code)
   - `email`, `phone`
   - `type` (login/register)
   - `expiryTime`, `attempts`
   - `isUsed`, `createdAt`

3. **contactMessages** - Contact form submissions
   - `name`, `email`, `phone`
   - `subject`, `message`
   - `timestamp`, `isRead`, `status`

4. **userActivity** - User activity tracking
   - `userId`, `activity`, `details`
   - `timestamp`, `userAgent`, `ip`

## Step 7: Test the Integration

1. Open your website in a browser
2. Try registering a new user
3. Check your Firestore console to see if data is being saved
4. Test the OTP functionality
5. Check the browser console for any errors

## Step 8: Production Setup (Optional but Recommended)

### 8.1 Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable "Email/Password" and "Phone" providers
3. Configure settings as needed

### 8.2 Setup Custom Domain
1. Go to Hosting in Firebase
2. Add your custom domain
3. Follow the DNS configuration steps

### 8.3 Analytics Setup
1. Go to Analytics
2. Configure events and conversions
3. Set up custom dimensions if needed

## Troubleshooting

### Common Issues:

1. **"Permission denied" errors**: Check Firestore security rules
2. **"Firebase not initialized" errors**: Ensure config is correct and Firebase scripts are loaded
3. **CORS errors**: Make sure your domain is added to Firebase Auth settings
4. **Data not saving**: Check browser console for detailed error messages

### Debug Steps:

1. Open browser Developer Tools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed Firebase requests  
4. Verify Firebase config values are correct
5. Test with simple operations first

## Additional Features You Can Add

1. **Email/SMS Services**: Integrate with SendGrid, Twilio for real OTP sending
2. **Google Sign-In**: Add Google OAuth for easier registration
3. **Push Notifications**: Use Firebase Cloud Messaging
4. **Analytics**: Track user behavior and conversions
5. **Crash Reporting**: Monitor and fix issues automatically

## Security Best Practices

1. Never expose sensitive API keys in client-side code
2. Use environment variables for different environments
3. Regularly review and update security rules
4. Enable App Check for additional security
5. Monitor usage and set up alerts for suspicious activity

## Support

If you need help with the setup:
1. Check Firebase documentation: https://firebase.google.com/docs
2. Visit Firebase Community: https://firebase.google.com/community
3. Check Stack Overflow for specific issues

---

**Note**: This setup provides a complete backend solution for your food startup website with user management, OTP authentication, contact forms, and activity tracking - all powered by Google's Firebase platform.