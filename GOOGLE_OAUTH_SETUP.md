# Google OAuth Setup Guide

## Overview
Google OAuth has been successfully integrated into your TODO application. Users can now sign in using their Google accounts in addition to the traditional email/password authentication.

## Setup Required

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - Add your production domain when deploying
5. Copy the Client ID and Client Secret

### 2. Environment Variables
Update your `.env` file in the backend with the Google OAuth credentials:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
SESSION_SECRET=your-session-secret-key-here-make-it-long-and-secure
```

**Important:** Replace the placeholder values with your actual Google OAuth credentials.

## Features Implemented

### Backend Changes
- ✅ **Passport.js Integration**: Google OAuth strategy configured
- ✅ **User Model Updates**: Added `googleId` field for Google users
- ✅ **Google Auth Routes**: `/api/auth/google` and `/api/auth/google/callback`
- ✅ **Session Management**: Express session middleware configured
- ✅ **Account Linking**: Existing users can link their Google accounts

### Frontend Changes
- ✅ **Google Sign-In Button**: Added to login page with Google branding
- ✅ **OAuth Redirect Handling**: AuthContext handles Google OAuth success redirects
- ✅ **Seamless Integration**: Works alongside existing email/password authentication

## How It Works

1. **User clicks "Sign in with Google"** → Redirects to Google OAuth consent screen
2. **User grants permission** → Google redirects back to your app with authorization code
3. **Backend exchanges code for user info** → Creates or links user account
4. **JWT token issued** → User is logged in and redirected to dashboard

## Security Features

- **Secure Cookie Storage**: JWT tokens stored in httpOnly cookies
- **Account Linking**: Prevents duplicate accounts for same email
- **Session Management**: Proper session handling for OAuth flow
- **CORS Configuration**: Properly configured for cross-origin requests

## Testing

1. Start your backend server: `npm run dev`
2. Start your frontend: `npm run dev`
3. Navigate to the login page
4. Click "Sign in with Google"
5. Complete the OAuth flow

## Production Deployment

When deploying to production:

1. Update the `FRONTEND_URL` in your `.env` file
2. Add your production domain to Google Cloud Console authorized redirect URIs
3. Set `secure: true` in cookie options for HTTPS
4. Update session configuration for production environment

## Troubleshooting

- **"redirect_uri_mismatch"**: Check that your callback URL matches exactly in Google Cloud Console
- **"invalid_client"**: Verify your Client ID and Client Secret are correct
- **Session issues**: Ensure SESSION_SECRET is set and sufficiently complex
- **CORS errors**: Verify CORS configuration includes your frontend domain
