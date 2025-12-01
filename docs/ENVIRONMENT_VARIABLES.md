# Environment Variables

This document describes all environment variables required for RoundsRobin.

## Required Variables

### Supabase Authentication & Database

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Example**: `https://your-project-ref.supabase.co`
- **Where to find**: Supabase Dashboard > Project Settings > API > Project URL
- **Required**: Yes
- **Client-side**: Yes (NEXT_PUBLIC prefix makes it available in browser)

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description**: Supabase anonymous/public key for client-side operations
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**: Supabase Dashboard > Project Settings > API > Project API keys > anon/public
- **Required**: Yes
- **Client-side**: Yes
- **Security**: Safe to expose - respects Row Level Security (RLS) policies

### OpenAI

#### `OPENAI_API_KEY`
- **Description**: OpenAI API key for realtime voice interview features
- **Example**: `sk-proj-...`
- **Where to find**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Required**: Yes
- **Client-side**: No
- **Security**: Keep secret - never expose to client

### Judge0

#### `JUDGE0_API_KEY`
- **Description**: Judge0 API key for code execution and testing
- **Example**: `your_rapidapi_key`
- **Where to find**: [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
- **Required**: Yes
- **Client-side**: No
- **Security**: Keep secret

## Optional Variables

#### `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: Supabase service role key for admin operations (bypasses RLS)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**: Supabase Dashboard > Project Settings > API > Project API keys > service_role
- **Required**: No (only needed for admin operations)
- **Client-side**: No
- **Security**: **CRITICAL** - Never expose to client, never commit to git
- **Use cases**: 
  - Database migrations
  - Admin scripts
  - Bypassing RLS for system operations

## Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in all required values in `.env`

3. Verify your `.env` file is in `.gitignore` (it should be by default)

4. Restart your development server after changing environment variables:
   ```bash
   npm run dev
   ```

## Environment-Specific Configuration

### Development
- Use your development Supabase project
- Can use the same OpenAI and Judge0 keys as production (with appropriate rate limits)

### Staging
- Use a separate Supabase project for staging
- Consider using separate API keys with lower rate limits

### Production
- Use production Supabase project
- Use production API keys
- Enable all security features
- Set up monitoring and alerts

## Security Best Practices

1. **Never commit `.env` files** - Always use `.env.example` as a template
2. **Rotate keys regularly** - Especially after team member changes
3. **Use different keys per environment** - Don't share production keys with development
4. **Monitor API usage** - Set up alerts for unusual activity
5. **Limit service role key usage** - Only use when absolutely necessary
6. **Use environment-specific keys** - Different keys for dev/staging/production

## Troubleshooting

### "Invalid API key" errors
- Verify the key is copied correctly (no extra spaces or line breaks)
- Check the key hasn't expired or been revoked
- Ensure you're using the correct key for the environment

### "NEXT_PUBLIC_ variables not available in browser"
- Restart your development server after adding new variables
- Verify the variable name starts with `NEXT_PUBLIC_`
- Check the variable is defined before the Next.js build process

### Supabase connection errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` matches your project URL exactly
- Check your project isn't paused (free tier projects pause after inactivity)
- Ensure your IP isn't blocked in Supabase project settings
