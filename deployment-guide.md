# Deployment Guide to Vercel

## Step 1: Connect to GitHub (Do this in Lovable)
1. Click the GitHub button in the top right of your Lovable project
2. Authorize Lovable GitHub App
3. Create a new repository or connect to existing one

## Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Set these environment variables in Vercel:
   - `VITE_SUPABASE_URL`: `https://ojyckskucneljvuqzrsw.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NDI0MTUsImV4cCI6MjA1MjMxODQxNX0.-Bx7Y0d_aMcHakE27Z5QKriY6KPpG1m8n0uuLaamFfY`
6. Click "Deploy"

## Step 3: Configure Supabase Authentication
After deployment, update these settings in [Supabase Dashboard](https://supabase.com/dashboard/project/ojyckskucneljvuqzrsw/auth/url-configuration):

**Site URL:** `https://bread-baking-hub-git-main-henryhunterjrs-projects.vercel.app`

**Redirect URLs (add these):**
- `https://bread-baking-hub-git-main-henryhunterjrs-projects.vercel.app`
- `https://bread-baking-hub-git-main-henryhunterjrs-projects.vercel.app/dashboard`
- `https://bread-baking-hub-git-main-henryhunterjrs-projects.vercel.app/auth`

## Step 4: Test Your Deployment
1. Visit: `https://bread-baking-hub-git-main-henryhunterjrs-projects.vercel.app/dashboard`
2. Test login functionality
3. Create a test newsletter
4. Share the newsletter link on social media to verify custom thumbnails appear

## Step 5: Clear Social Media Cache (if needed)
- Facebook: Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Twitter: Wait 24 hours or contact Twitter support

Your admin dashboard will now be accessible from your custom domain with proper social media thumbnails!