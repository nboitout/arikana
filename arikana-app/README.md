# Arikana Studios - Mobile App

A modern, responsive mobile app for Arikana Studios' yoga and pilates booking system. Built with React, Vite, and Tailwind CSS.

## Features

- 📱 **Mobile-first design** - Optimized for mobile devices with responsive desktop support
- 🎯 **5-Tab Navigation** - Home, Book, Buy, Profile, More
- 📊 **Achievements Tracking** - Display member milestones and progress
- 📅 **Class Booking** - Browse and book yoga/pilates classes
- 💳 **Membership Plans** - View and purchase memberships and packages
- 👤 **User Profile** - Manage account settings and preferences
- 🎨 **Arikana Branding** - Custom color scheme (#B69B4D) matching studio identity

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/nboitout/arikana.git
cd arikana
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Development

### Project Structure
```
arikana-app/
├── src/
│   ├── App.jsx          # Main app component with all tabs
│   ├── App.css          # Tailwind + custom styles
│   └── main.jsx         # React entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
└── package.json         # Dependencies & scripts
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (creates `dist/` folder)
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages

## Deployment to GitHub Pages

### Prerequisites
You need write access to the repository and GitHub Pages enabled.

### Deploy Steps

1. **Configure your repository:**
   - Go to your GitHub repo settings
   - Enable GitHub Pages (Settings → Pages)
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch

2. **Deploy the app:**
   ```bash
   npm run deploy
   ```

   This will:
   - Build the production version
   - Create a `gh-pages` branch with the built files
   - Push to GitHub automatically

3. **View your app:**
   Visit `https://nboitout.github.io/arikana`

### Manual Deployment

If `npm run deploy` doesn't work:

```bash
# Build the app
npm run build

# Deploy using gh-pages
npx gh-pages -d dist
```

## Customization

### Update Brand Color
Change the `ARIKANA_COLOR` constant in `src/App.jsx`:
```javascript
const ARIKANA_COLOR = '#B69B4D'; // Change this hex code
```

### Customize Classes
Edit the `upcomingClasses` array in `src/App.jsx` to add/remove classes.

### Update User Name
Change the default name in the `useState` hook:
```javascript
const [userName] = useState('Nicolas'); // Change this
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **gh-pages** - GitHub Pages deployment

## License

This project is proprietary software for Arikana Studios.

## Support

For issues or feature requests, please open an issue on GitHub.

---

**Arikana Studios** - For Body, Mind & Soul  
Built with ❤️
