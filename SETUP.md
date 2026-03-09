# Arikana App - Quick Setup Guide

## 📦 Project Ready for GitHub Deployment

This project is fully configured and ready to deploy to your GitHub repository.

## 🚀 Quick Start

### 1. Copy to Your Local Machine
```bash
# If you downloaded/received the arikana-app folder
cd arikana-app
```

### 2. Set Up GitHub Repository
```bash
# Remove existing git if needed
rm -rf .git

# Initialize with your GitHub repo
git init
git remote add origin https://github.com/nboitout/arikana.git
git add .
git commit -m "Initial commit: Arikana mobile app"
git branch -M main
git push -u origin main
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Test Locally (Optional)
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to GitHub Pages
```bash
npm run deploy
```

✅ Your app will be live at: **https://nboitout.github.io/arikana**

## 📁 What's Included

```
arikana-app/
├── src/
│   ├── App.jsx              # Main React component
│   ├── App.css              # Tailwind + custom styles
│   └── main.jsx             # Entry point
├── index.html               # HTML template
├── vite.config.js           # Build config
├── tailwind.config.js       # Tailwind config
├── package.json             # Dependencies
├── README.md                # Full documentation
├── DEPLOY.md                # Detailed deployment guide
├── .gitignore               # Git ignore rules
└── .npmrc                   # NPM config
```

## ⚙️ Configuration Already Done

✅ Vite (fast build tool) configured  
✅ Tailwind CSS set up  
✅ React components optimized  
✅ GitHub Pages deployment script included  
✅ Production build optimized  

## 🎨 Customization

### Change Brand Color
In `src/App.jsx`, line ~11:
```javascript
const ARIKANA_COLOR = '#B69B4D'; // Change this
```

### Update Classes/Data
Edit the data objects in `src/App.jsx`:
- `upcomingClasses` - Booking classes
- `achievements` - Member achievements
- Package pricing in `BuyTab()`

### Change User Name
In `src/App.jsx`, line ~12:
```javascript
const [userName] = useState('Nicolas'); // Change to your name
```

## 📊 Development Workflow

### Make Changes
```bash
# Edit files in src/
npm run dev        # Test locally
git add .
git commit -m "Your message"
git push origin main
```

### Deploy Changes
```bash
npm run deploy     # Build and push to GitHub Pages
```

## 🔗 First-Time Setup Checklist

- [ ] Copy arikana-app folder
- [ ] Run `npm install`
- [ ] Run `npm run deploy` 
- [ ] Go to GitHub repo Settings → Pages
- [ ] Verify `gh-pages` branch is selected as source
- [ ] Visit https://nboitout.github.io/arikana
- [ ] Test on mobile (or use browser dev tools)

## 📱 Mobile Testing

### Option 1: Browser DevTools
- Open Chrome/Firefox
- Press F12
- Click device icon (top-left of DevTools)
- Select "iPhone" or any device

### Option 2: Physical Device
- Get your computer's IP: `ipconfig getifaddr en0` (Mac) or `hostname -I` (Linux)
- Run: `npm run dev`
- On phone, visit: `http://YOUR-IP:3000`

## 🆘 Troubleshooting

**Node not installed?**
```bash
# Install from https://nodejs.org/
# Then verify:
node --version
npm --version
```

**npm install fails?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Deploy doesn't work?**
1. Check that `gh-pages` is installed: `npm install --save-dev gh-pages`
2. Verify GitHub Pages is enabled in repo settings
3. Check vite.config.js has `base: '/arikana/'`

## 📞 Support

See `README.md` and `DEPLOY.md` for detailed documentation.

---

**You're all set!** 🎉  
Push to GitHub and deploy with one command: `npm run deploy`
