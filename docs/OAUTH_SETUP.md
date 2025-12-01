# OAuth Provider Setup Guide

This guide walks you through configuring Google and GitHub OAuth providers in your Supabase project.

## Prerequisites

- Access to your Supabase project dashboard
- Google Cloud Console account (for Google OAuth)
- GitHub account (for GitHub OAuth)

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: RoundsRobin
   - User support email: Your email
   - Developer contact: Your email
6. Select **Application type**: Web application
7. Add **Authorized redirect URIs**:
   - `https://ejqorsjvkfaafyprqivn.supabase.co/auth/v1/callback`
   - For local development: `http://localhost:54321/auth/v1/callback` (if using local Supabase)
   
   > **Note**: The project ref is the subdomain in your Supabase URL. For this project, it's `ejqorsjvkfaafyprqivn` from `https://ejqorsjvkfaafyprqivn.supabase.co`
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

### 2. Configure in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the provider list
5. Toggle **Enable Sign in with Google**
6. Paste your **Client ID** and **Client Secret**
7. Click **Save**

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the application details:
   - Application name: RoundsRobin
   - Homepage URL: `https://your-domain.com` (or `http://localhost:3000` for development)
   - Authorization callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy the **Client Secret**

### 2. Configure in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **GitHub** in the provider list
5. Toggle **Enable Sign in with GitHub**
6. Paste your **Client ID** and **Client Secret**
7. Click **Save**

## Required Redirect URLs

Make sure to add these redirect URLs to your OAuth providers for all environments:

### Development
- `http://localhost:3000/auth/callback`
- `https://<your-project-ref>.supabase.co/auth/v1/callback`

### Staging (if applicable)
- `https://staging.your-domain.com/auth/callback`
- `https://<your-project-ref>.supabase.co/auth/v1/callback`

### Production
- `https://your-domain.com/auth/callback`
- `https://<your-project-ref>.supabase.co/auth/v1/callback`

## Testing OAuth Flow

After configuration:

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/sign-in`
3. Click on a provider button (Google or GitHub)
4. Complete the OAuth flow
5. You should be redirected back to your application as an authenticated user

## Troubleshooting

### "Redirect URI mismatch" error
- Verify the redirect URI in your OAuth provider matches exactly what's configured in Supabase
- Check for trailing slashes or http vs https mismatches

### "Invalid client" error
- Double-check your Client ID and Client Secret are correct
- Ensure the OAuth app is not suspended or deleted

### User not created in database
- Check Supabase logs in Dashboard > Logs
- Verify your database foreign key constraints allow auth.users references

## Security Notes

- Never commit OAuth credentials to version control
- Use environment variables for all sensitive configuration
- Rotate OAuth secrets periodically
- Monitor authentication logs for suspicious activity
