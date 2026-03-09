# ⚡ Quick GitHub Actions Deployment Workflow

## TL;DR (Too Long; Didn't Read)

**One-time setup:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
# GitHub Actions automatically starts deploying!
```

**Every time you make changes:**
```bash
git add .
git commit -m "Your changes"
git push origin main
# GitHub Actions automatically deploys!
```

**Watch deployment:**
Go to: https://github.com/nboitout/arikana/actions

---

## Complete Workflow

### 1️⃣ Initial Setup (One-Time)

```bash
cd arikana-app

# Make sure everything is committed
git status

# If files are modified:
git add .
git commit -m "Initial commit: Arikana app"

# Push to GitHub
git push origin main
```

### 2️⃣ GitHub Actions Triggers Automatically

Once you push:
1. GitHub detects the push to `main` branch
2. GitHub Actions workflow starts
3. Workflow automatically:
   - ✅ Installs dependencies
   - ✅ Builds the app
   - ✅ Deploys to `gh-pages` branch
   - ✅ GitHub Pages updates your site

### 3️⃣ Your App Goes Live

Visit: https://nboitout.github.io/arikana

---

## Daily Development Workflow

### Make Changes

Edit any file in `src/`:
```
src/App.jsx  ← Edit here
src/App.css  ← Or here
```

### Push to GitHub

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### Auto-Deployment

GitHub Actions automatically:
- Detects your push
- Builds your app
- Deploys to GitHub Pages
- Your changes go live! 🎉

### Monitor (Optional)

Want to watch the deployment?

1. Go to: https://github.com/nboitout/arikana/actions
2. See your workflow running
3. Wait for green checkmark ✅
4. Your app is updated!

---

## Visual Timeline

```
You: git push origin main
     ↓
GitHub: Push detected on main branch
     ↓
GitHub Actions: Workflow starts
     ├─ 📦 Install dependencies (10 sec)
     ├─ 🔨 Build app (15 sec)
     ├─ 🚀 Deploy to gh-pages (10 sec)
     └─ ✅ Complete (35 sec total)
     ↓
GitHub Pages: Updates your site
     ↓
https://nboitout.github.io/arikana: Live! 🎉
```

---

## What Files Get Deployed

**Source:** `src/` folder (your code)  
**Built:** `dist/` folder (created during build)  
**Deployed:** `gh-pages` branch (GitHub Pages serves this)  

You **never manually touch** the `dist/` or `gh-pages` folders - GitHub Actions handles it!

---

## Common Changes & Deployment

### Change 1: Update Class Data

File: `src/App.jsx`
```javascript
const upcomingClasses = [
  { id: 1, name: 'Your Class', ... }
];
```

Deploy:
```bash
git add src/App.jsx
git commit -m "Update class schedule"
git push origin main
# ✨ Changes live in ~1 minute!
```

### Change 2: Update Colors

File: `src/App.jsx`
```javascript
const ARIKANA_COLOR = '#B69B4D'; // Change this
```

Deploy:
```bash
git add src/App.jsx
git commit -m "Update brand color"
git push origin main
# ✨ Changes live in ~1 minute!
```

### Change 3: Update User Name

File: `src/App.jsx`
```javascript
const [userName] = useState('Your Name'); // Change this
```

Deploy:
```bash
git add src/App.jsx
git commit -m "Update user name"
git push origin main
# ✨ Changes live in ~1 minute!
```

---

## Checking Deployment Status

### On GitHub Website

1. Go to: https://github.com/nboitout/arikana
2. Click **Actions** tab
3. See your workflows:
   - 🟡 **Yellow** = Running (in progress)
   - 🟢 **Green** = Success (deployed!)
   - 🔴 **Red** = Failed (something went wrong)

### Click on a Workflow to See Details

Shows:
- When it started
- Step-by-step progress
- Build logs
- Deployment status

### Check Your Live Site

Once you see ✅ in Actions:
1. Visit: https://nboitout.github.io/arikana
2. Refresh the page (Ctrl+Shift+R for hard refresh)
3. Your changes should appear!

---

## If Something Goes Wrong

### Deployment Failed ❌

1. Go to Actions tab
2. Click the failed workflow
3. Expand the failed step
4. Read the error message
5. Common fixes:

**"npm ERR! ERESOLVE"**
- Update dependencies: `npm update`

**"Build failed"**
- Check `vite.config.js` has `base: '/arikana/'`
- Check React code for syntax errors

**"Deploy failed"**
- Check GitHub Pages settings
- Verify `gh-pages` branch is selected

### Workflow Not Running

- Did you push to `main` branch? (not `master`)
- Does `.github/workflows/deploy.yml` exist in your repo?
- Wait 1-2 minutes - GitHub takes time to trigger

### App Shows Old Version

- Refresh browser (Ctrl+Shift+Delete for full cache clear)
- Check that Actions workflow finished with ✅
- Sometimes GitHub caches - wait a minute and refresh

---

## Useful Commands

```bash
# Check git status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your message here"

# Push to GitHub (triggers workflow)
git push origin main

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## Reference: The Workflow File

Location: `.github/workflows/deploy.yml`

What it does:
1. **On push to main** → Workflow triggers
2. **Checkout code** → Gets your latest files
3. **Setup Node.js 18** → Installs runtime
4. **Install dependencies** → `npm ci`
5. **Build app** → `npm run build`
6. **Deploy** → Push `dist/` to `gh-pages` branch
7. **Done** → GitHub Pages updates your site

---

## Summary

**Initial Setup:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Every Update:**
```bash
git add .
git commit -m "Your changes"
git push origin main
# 🤖 GitHub Actions deploys automatically!
```

**Monitor:**
Visit: https://github.com/nboitout/arikana/actions

**View Live Site:**
Visit: https://nboitout.github.io/arikana

---

## You're Done! 🎉

Your GitHub Actions deployment is set up and ready to use!

From now on:
- **Code → Commit → Push** = **Automatic Deployment** ✨

No more manual `npm run deploy` needed!

Happy coding! 🚀
