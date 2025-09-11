# Firebase Production Setup Guide

## 🔧 Issue Fixed
Firebase authentication was failing in production because environment variables were only available at runtime, not during the build process. This has been resolved.

## ✅ What Was Fixed
1. **Dockerfile**: Added build arguments for Firebase environment variables
2. **docker-compose.yml**: Pass Firebase config as build arguments  
3. **Build Process**: Firebase config now embedded in production bundle

## 🚀 Production Deployment Steps

### Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your FitBite project
3. Go to Project Settings → General
4. In "Your apps" section, find your web app
5. Copy the following values:
   - `apiKey`
   - `projectId` 
   - `appId`

### Step 2: Configure Firebase for Production Domain

1. In Firebase Console → Authentication → Settings
2. Add your production domain to "Authorized domains":
   ```
   yourdomain.com
   www.yourdomain.com
   ```

3. In Firebase Console → Authentication → Sign-in method
4. Ensure Google sign-in is enabled
5. Add your production domain to "Authorized domains" for Google OAuth

### Step 3: Create Production .env File

On your VPS, create `.env` file with your real Firebase values:

```bash
cd /home/fitbite/DietBiteAI
cp .env.example .env
nano .env
```

Add your actual Firebase configuration:
```env
# Firebase Configuration (REQUIRED for authentication)
VITE_FIREBASE_API_KEY=AIzaSyABC123...your-actual-api-key
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...your-actual-app-id

# Other required variables
NODE_ENV=production
PORT=5000
DB_NAME=fitbite
DB_USER=fitbite_user
DB_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://fitbite_user:your_secure_password_here@postgres:5432/fitbite

# API Keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Deploy with Firebase Configuration

```bash
# Deploy with the new Firebase configuration
./deploy.sh deploy

# Check that Firebase config is properly embedded
docker logs fitbite-app
```

### Step 5: Verify Firebase Authentication

1. Visit your production domain
2. Click "Sign in with Google"
3. Should redirect to Google OAuth (not Firebase error)
4. After successful login, should redirect back to your app

## 🔍 Troubleshooting

### If authentication still fails:

1. **Check Firebase Console Logs**:
   - Go to Firebase Console → Authentication → Users
   - Check if sign-in attempts are showing up

2. **Verify Environment Variables**:
   ```bash
   # Check that env vars are loaded
   docker exec fitbite-app env | grep VITE_FIREBASE
   ```

3. **Check Browser Console**:
   - Open Developer Tools → Console
   - Look for Firebase-related errors
   - Common errors:
     - "Invalid API key" → Check VITE_FIREBASE_API_KEY
     - "Firebase project not found" → Check VITE_FIREBASE_PROJECT_ID
     - "Unauthorized domain" → Add domain to Firebase Console

4. **Test with curl**:
   ```bash
   # Test if the app is serving the correct Firebase config
   curl -s http://your-domain.com | grep -o 'apiKey":"[^"]*"'
   ```

## 🎯 Expected Result

After completing these steps:
- ✅ Google sign-in works in production
- ✅ Users can authenticate and access dashboard
- ✅ No "Firebase authentication error" messages
- ✅ Firebase config properly embedded in production build

## 🔐 Security Notes

- Never commit actual API keys to git
- Use `.env` file only on production server
- Firebase API keys for web apps are safe to expose in client-side code
- Restrict Firebase rules to prevent unauthorized access

## 📞 Support

If you still encounter issues after following these steps:
1. Check Firebase Console for authentication logs
2. Verify domain is properly configured in Firebase settings
3. Ensure .env file has correct values without quotes or spaces