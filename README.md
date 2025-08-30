# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/18b3ac3e-8a37-490b-9d6f-2f54b058b979

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/18b3ac3e-8a37-490b-9d6f-2f54b058b979) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Social Media Meta Tags System

This project includes a robust system for generating correct Open Graph and Twitter Card meta tags for all pages.

### Meta Tag Verification

To manually verify meta tags are correct:

```sh
# Build the project first
npm run build

# Run verification script
npm run verify:meta
```

The verification script checks for:
- Missing required tags (og:title, og:image, og:url, og:description)
- Forbidden domains (old domains that should not appear)
- Relative URLs (all image/url tags must be absolute)
- Provides a summary report of all routes and their og:image URLs

### Recipe-Only Builds

To regenerate only recipe-related routes without touching other pages:

```sh
npm run build:recipes
```

### Testing Social Media Previews

Quick test commands to verify Open Graph images:

```sh
# Check homepage
curl -s https://bread-baking-hub.vercel.app/ | grep -i "og:image"

# Check blog page
curl -s https://bread-baking-hub.vercel.app/blog/ | grep -i "og:image"

# Check recipes page
curl -s https://bread-baking-hub.vercel.app/recipes/ | grep -i "og:image"
```

### Rollback Instructions

If a deployment has incorrect meta tags:

1. **In Vercel Dashboard:**
   - Go to your project dashboard
   - Click on "Deployments" tab
   - Find the last working deployment
   - Click the "..." menu and select "Promote to Production"

2. **Via Vercel CLI:**
   ```sh
   # Install Vercel CLI if needed
   npm i -g vercel

   # Login and select project
   vercel login
   vercel

   # Rollback to specific deployment
   vercel rollback [deployment-url]
   ```

3. **Quick verification after rollback:**
   - Test URLs in [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - Test URLs in [X Card Validator](https://cards-dev.twitter.com/validator)
   - Run `npm run verify:meta` locally to ensure the fix

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/18b3ac3e-8a37-490b-9d6f-2f54b058b979) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
