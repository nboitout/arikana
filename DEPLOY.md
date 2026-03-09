# Deployment Guide for Arikana App

## Step-by-Step Deployment to GitHub

### Step 1: Initialize Git (if not already done)
```bash
cd arikana
git init
git add .
git commit -m "Initial commit: Arikana mobile app"
```

### Step 2: Add Remote Repository
```bash
git remote add origin https://github.com/nboitout/arikana.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to https://github.com/nboitout/arikana
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Select **Deploy from a branch**
   - Select branch: `gh-pages`
   - Click **Save**

### Step 4: Install Dependencies (first time only)
```bash
npm install
```

### Step 5: Deploy to GitHub Pages
```bash
npm run deploy
```

This command will:
- Build the production version
- Create a `gh-pages` branch automatically
- Push the built files to GitHub

### Step 6: Verify Deployment
1. Wait 1-2 minutes for GitHub to process
2. Visit: `https://nboitout.github.io/arikana`
3. Your app should be live!

## Updating the App

After making changes to the code:

```bash
# Commit your changes
git add .
git commit -m "Update: description of changes"
git push origin main

# Deploy to GitHub Pages
npm run deploy
```

## Troubleshooting

### "gh-pages" not installed
```bash
npm install --save-dev gh-pages
npm run deploy
```

### Page shows 404
- Check that GitHub Pages is enabled
- Verify `gh-pages` branch exists on GitHub
- Check that base URL in `vite.config.js` is `/arikana/`

### Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Want to deploy to custom domain?
1. Go to Settings → Pages
2. Add custom domain under "Custom domain"
3. Follow GitHub's DNS instructions
4. Update `vite.config.js` base to `/`

## Development vs Production

**Development (local testing):**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Production (GitHub Pages):**
```bash
npm run build     # Creates optimized dist/
npm run deploy    # Pushes to GitHub Pages
```

## Rollback to Previous Version

If you need to revert to a previous version:

```bash
# See commit history
git log --oneline

# Revert to a specific commit
git revert [commit-hash]
git push origin main
npm run deploy
```

---

**Questions?** Check GitHub Actions tab for build logs or deployment status.
