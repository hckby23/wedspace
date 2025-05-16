# Deploying Wedspace to Vercel

This document provides instructions for deploying the Wedspace wedding planning platform to Vercel.

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the application**:
   ```bash
   vercel
   ```

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to a Git provider (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Configure the project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

## Environment Variables

If your application uses environment variables (e.g., for Supabase), make sure to add them in the Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" tab
3. Add your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Any other required variables

## Custom Domain

To add a custom domain to your Vercel deployment:

1. Go to your project in the Vercel dashboard
2. Navigate to the "Domains" tab
3. Add your domain and follow the verification steps

## Optimizations

This project has been optimized for Vercel deployment with:

1. **Vercel Configuration**: `vercel.json` with optimized settings
2. **Build Optimization**: Configured in `vite.config.ts` for optimal chunk splitting
3. **Performance Monitoring**: Integrated Vercel Analytics and Speed Insights
4. **Cache Headers**: Configured for static assets
5. **SPA Routing**: Configured to handle client-side routing

## Troubleshooting

If you encounter issues with the deployment:

1. Check the build logs in the Vercel dashboard
2. Ensure all environment variables are correctly set
3. Verify that the build command and output directory are correctly configured
4. Try a local build with `npm run build` to identify any issues

## Local Development

To run the project locally:

```bash
npm install
npm run dev
```

The development server will start at http://localhost:8080 (or another port if 8080 is in use).
