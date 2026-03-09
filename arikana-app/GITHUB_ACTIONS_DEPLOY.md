# 🚀 GitHub Actions Automatic Deployment Guide

## What is GitHub Actions?

GitHub Actions automatically builds and deploys your app every time you push code to the `main` branch. **No manual deploy command needed!**

---

## How It Works

```
You push code to GitHub
         ↓
GitHub Actions triggers automatically
         ↓
Installs dependencies
         ↓
Builds the app
         ↓
Deploys to GitHub Pages
         ↓
Your app is LIVE! 🎉
```

---

## One-Time Setup

### Step 1: Push Your Code to GitHub

Make sure all files are in your GitHub repository:

```bash
# From arikana-app folder
git add .
git commit -m "Initial commit: Arikana mobile app"
git push origin main
```

This pushes your code to GitHub.

### Step 2: Verify Workflow File Exists

The workflow file is already included at:
```
.github/workflows/deploy.yml
```

It automatically triggers on every push to `main` branch.

### Step 3: Enable GitHub Pages

Go to: **https://github.com/nboitout/arikana/settings/pages**

1. Under "Build and deployment":
   - Source: **"Deploy from a branch"**
   - Branch: **gh-pages** (GitHub Actions creates this)
   - Click **Save**

### Step 4: Done! ✅

Your automation is ready!

---

## How to Deploy (Going Forward)

**After setup, deployment is AUTOMATIC:**

```bash
# Edit your files
# Then commit and push:

git add .
git commit -m "Your changes"
git push origin main
```

**That's it!** GitHub Actions automatically:
- ✅ Builds your app
- ✅ Deploys to `gh-pages` branch
- ✅ Updates your live site

No more manual `npm run deploy` needed! 🎉

---

## Monitor Deployment

### Watch GitHub Actions Run

1. Go to: **https://github.com/nboitout/arikana/actions**
2. You'll see your workflow running:
   - 🟡 **Yellow** = Running
   - 🟢 **Green** = Success
   - 🔴 **Red** = Failed

Click on any workflow to see detailed logs.

---

## Deployment Flow

### Visual Timeline

```
You run: git push origin main
         ↓
    [GitHub detects push]
         ↓
    [GitHub Actions starts]
    ├─ Checkout code
    ├─ Setup Node.js
    ├─ Install dependencies (npm ci)
    ├─ Build app (npm run build)
    ├─ Deploy to gh-pages branch
    └─ Done! 🎉
         ↓
    [1-2 minutes later]
         ↓
    App updates at: https://nboitout.github.io/arikana
```

---

## What The Workflow Does

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]    # Triggers on push to main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - Checkout code
      - Setup Node.js 18
      - Install dependencies (npm ci)
      - Build app (npm run build)
      - Deploy to gh-pages branch
      - Show success message
```

---

## Example Deployment Workflow

### Step 1: Make Changes

Edit `src/App.jsx`:
```javascript
const ARIKANA_COLOR = '#FF0000'; // Changed color
```

### Step 2: Commit and Push

```bash
git add src/App.jsx
git commit -m "Change color to red"
git push origin main
```

### Step 3: Watch It Deploy

1. Go to: https://github.com/nboitout/arikana/actions
2. See the workflow running
3. Wait for green checkmark ✅
4. Visit: https://nboitout.github.io/arikana
5. Your changes are live! 🎉

---

## Troubleshooting

### Workflow Shows Red ❌

Check the error:
1. Go to: https://github.com/nboitout/arikana/actions
2. Click the failed workflow
3. Expand steps to see error messages
4. Common fixes:

**Error: "npm ERR!"**
- Check `package.json` syntax
- Make sure dependencies are correct

**Error: "Build failed"**
- Check `vite.config.js` has correct base: `/arikana/`
- Verify React components have no syntax errors

**Error: "Deploy failed"**
- Check GitHub Pages settings
- Verify `gh-pages` branch is selected

### Workflow Doesn't Run

- Verify workflow file at `.github/workflows/deploy.yml`
- Check you pushed to `main` branch (not `master`)
- Wait 1-2 minutes - GitHub Actions takes time to trigger

### App Shows Old Version

- GitHub Actions might still be running (check Actions tab)
- Clear your browser cache (Ctrl+Shift+Delete)
- Check that `gh-pages` branch was updated

---

## Advanced: Disable Auto-Deploy

If you want to go back to manual deployment:

**Option 1: Use Manual Trigger**

Edit `.github/workflows/deploy.yml`:
```yaml
on:
  workflow_dispatch:  # Only manual trigger
```

Then deploy from GitHub Actions tab.

**Option 2: Disable Workflow**

1. Go to: https://github.com/nboitout/arikana/actions
2. Click "Deploy to GitHub Pages"
3. Click "..." → "Disable workflow"

---

## Quick Reference

| Task | Command |
|------|---------|
| Make changes | Edit files in `src/` |
| Commit changes | `git add . && git commit -m "message"` |
| Push to GitHub | `git push origin main` |
| Watch deploy | Go to `/actions` tab on GitHub |
| View live app | Visit https://nboitout.github.io/arikana |
| Manual build locally | `npm run build` |
| Manual deploy locally | `npm run deploy` |

---

## Benefits of GitHub Actions

✅ **Automatic** - Deploys on every push  
✅ **No local deploy needed** - No `npm run deploy`  
✅ **Visible** - See all deployments in Actions tab  
✅ **Reliable** - GitHub-hosted runners  
✅ **Fast** - Usually completes in 1-2 minutes  
✅ **Free** - Included with GitHub account  

---

## Summary

1. **Setup** (one-time):
   - Code already pushed to GitHub
   - Workflow file at `.github/workflows/deploy.yml`
   - GitHub Pages enabled with `gh-pages` branch

2. **Deploy** (every time):
   - `git add .`
   - `git commit -m "message"`
   - `git push origin main`
   - Watch in Actions tab
   - App automatically deploys! 🎉

3. **Monitor**:
   - Go to: https://github.com/nboitout/arikana/actions
   - See workflow status
   - Check logs if anything fails

---

## You're All Set! 🚀

Your GitHub Actions automation is ready. From now on:
- **Push code** → GitHub detects change → **App deploys automatically** ✨

No more manual deploy commands needed!

Happy deploying! 🎉
