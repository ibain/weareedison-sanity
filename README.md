# We Are Edison - Sanity CMS

This is the content management system (CMS) for the We Are Edison website. It allows you to manage events and slides that appear on the website without needing to edit code.

## 🚀 Quick Start (For Content Managers)

### 1. Access the CMS
- **Website**: https://weareedison.sanity.studio/
- **Login**: Use your Google account
- **Project**: "weareedison.org - website"

### 2. What You Can Manage
- **Events**: Add, edit, and organize upcoming events
- **Evergreen Slides**: Create slides for the home page carousel
- **Garden**: Edit the Garden page (intro, What's Going On list, FAQ)
- **Images**: Upload and crop images to the correct size

### 3. Basic Workflow
1. Go to https://weareedison.sanity.studio/
2. Click "Events", "Evergreen Slides", or "Garden" in the left sidebar
3. Click "Create new" to add content
4. Fill in the required fields (marked with *)
5. Click "Publish" when ready

## ✅ If You're Not Technical, Start Here

### What you can do without code
- Add/update Events and Evergreen Slides in Sanity (no code needed)
- Replace images and text directly in Sanity
- Reorder slides by adjusting the Order number

### When you might touch Squarespace
- If a page is missing dynamic content (events, slider, or app page), you may need to paste a code snippet into a Code Block or Header Injection. Use the quick reference below and the instructions in `SquareSpace Code/README.md`.

### Squarespace placement quick reference
- Home page carousel → Code Block on Home page → `SquareSpace Code/slider-page-ready.js`
- Events page styles → Page Settings → Advanced → Page Header Code Injection → `SquareSpace Code/events-page-header-injection.html`
- Events page content → Code Block on Events page → `SquareSpace Code/events-page-code-block.html`
- App install page → Code Block on App page (e.g., "/app") → `SquareSpace Code/app-page-code-block.html`
- Global features → Settings → Advanced → Code Injection → Site Header → `SquareSpace Code/global-header-injection.html`
- Garden page → Three Code Blocks (Intro, What's Going On, FAQ) + optional Page Header → see `SquareSpace Code/README.md` (Garden section)

### App install page (what to expect)
- Automatically sends visitors to the correct app store
- Returns visitors to the source page if they came from inside the site
- Returns to the home page if opened directly or from outside the site
- Shows download badges if redirect is blocked or delayed
- To keep users on the app page after returning, see the note inside `SquareSpace Code/app-page-code-block.html`

## 📋 Content Types

### Events
**Purpose**: Events that appear on the `/events` page and optionally on the home slider

**Required Fields:**
- **Title**: Event name
- **Start Date**: When the event begins
- **Image**: Event photo (will be cropped to 16:9 ratio)
- **Accessibility image description**: Description for screen readers

**Optional Fields:**
- **End Date**: If event spans multiple days
- **Display Time**: Check to show time, uncheck for date-only
- **Location**: Where the event takes place
- **Location Link**: Google Maps link (shows as "(map)")
- **Excerpt**: Short description
- **Show on home slider**: Check to include in home page carousel
- **Zoom/External link**: Zoom meeting or other link
- **Link Button Title**: Custom button text (defaults to "Would you like to know more?")

**Automatic Organization:**
- **📅 Upcoming Events**: Events with future dates appear in the "Upcoming Events" section
- **⏰ Past Events**: Events with past dates appear in the "Past Events" section
- **Home Slider**: Only shows upcoming events marked as "featured"

**Sorting Options:**
- 📅 **Upcoming Events (Oldest First)** - Shows only future events, sorted by date (oldest first)
- 📅 **Upcoming Events (Newest First)** - Shows only future events, sorted by date (newest first)
- ⭐ **Featured First, Then Date** - Shows only future events, featured events first, then by date
- 📝 **Title A-Z** - Shows all events alphabetically by title
- ⏰ **Past Events (Most Recent First)** - Shows only past events, sorted by date (most recent first)
- ⏰ **Past Events (Oldest First)** - Shows only past events, sorted by date (oldest first)

### Evergreen Slides
**Purpose**: Slides that appear in the home page carousel

**Required Fields:**
- **Title**: Slide title
- **Image**: Slide photo (will be cropped to 16:9 ratio)
- **Accessibility image description**: Description for screen readers

**Optional Fields:**
- **Meta**: Additional text below title
- **Excerpt**: Description text
- **Link**: URL to link to when clicked
- **Enabled**: Check to show, uncheck to hide
- **Order**: Number to control display order (0 = first)

### Garden
**Purpose**: Single document that drives the Garden page (intro, What's Going On list, FAQ).

**Sections:**
- **Intro**: One text block for the top of the page.
- **What's Going On**: Ordered list of paragraphs (each item is one paragraph).
- **FAQ**: List of question/title and answer (content) pairs.

**Deployment on Squarespace:** Use three Code Blocks for Intro, What's Going On, and FAQ, plus optional Page Header for CSS. See `SquareSpace Code/README.md` for file names and placement.

## 🖼️ Image Guidelines

### Required Image Format
- **Aspect Ratio**: 16:9 (width should be 1.78x the height)
- **Recommended Sizes**:
  - Minimum: 1600×900 pixels
  - Preferred: 1920×1080 pixels
  - High-res: 2400×1350 pixels
  - Small: 1200×675 pixels
- **File Types**: JPG or PNG
- **File Size**: Under 2 MB

### How to Crop Images
1. Upload your image
2. Click "Edit" on the image
3. Use the crop tool to select a 16:9 area
4. Set the hotspot on the main subject
5. Save the crop

**Why 16:9?** This ensures images display properly in the carousel and events page without stretching or distortion.

## 🔗 Website Integration

### How Content Appears on the Website
- **Events Page** (`/events`): Shows all published events
- **Home Slider**: Shows events marked "Show on home slider" + evergreen slides
- **Event Links**: 
  - Zoom links show "Join hybrid via Zoom" button
  - Other links show custom button (or "Would you like to know more?")
  - No link = no button

### Current Website URLs
- **Live Site**: https://www.weareedison.org
- **Events Page**: https://www.weareedison.org/events
- **Test Pages**: 
  - `/sandbox/home-wip` (home slider test)
  - `/sandbox/events-wip` (events page test)

## 🛠️ Technical Details (For Developers)

### Project Information
- **Project ID**: `u8cybb7l`
- **Dataset**: `production`
- **Studio URL**: https://weareedison.sanity.studio/

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy to production
npm run deploy
```

### CI/CD and auto-updates
- **GitHub Actions**: CI runs on every push and pull request: install, **apply security fixes** (`npm audit fix`), **lint**, build, test, then **audit** (fails if high/critical vulnerabilities remain). On push to `main`, the Deploy workflow does the same and then deploys the Studio. Add a `SANITY_AUTH_TOKEN` secret (sanity.io/manage → API → Tokens → "Deploy studio") in the repo's GitHub Settings → Secrets.
- **Renovate**: Dependency updates are opened as PRs; minor, patch, and lockfile (pin/digest) updates are set to automerge when CI passes. That keeps supported versions (e.g. React, Sanity) up to date and avoids deprecation warnings over time.

### Available Scripts
- `npm run dev` - Start development server (localhost:3333)
- `npm run start` - Start production server
- `npm run build` - Build for production
- `npm run test` - Run tests (build)
- `npm run lint` - Run ESLint
- `npm run fix` - Apply security fixes and build (run this if CI fails on audit; then commit and push)
- `npm run deploy` - Deploy to weareedison.sanity.studio

### API Access
- **Base URL**: `https://u8cybb7l.api.sanity.io/v2024-01-01/data/query/production`
- **Query Language**: GROQ (Graph-Relational Object Queries)
- **Authentication**: Public read access (no token required)

### File Structure
```
weareedison-sanity/
├── schemas/           # Content type definitions
│   ├── events.ts     # Events schema
│   ├── garden.ts     # Garden page schema
│   └── slide.ts      # Evergreen slides schema
├── SquareSpace Code/ # Frontend integration code
│   ├── app-page-code-block.html          # App install/redirect page code
│   ├── events-page-code-block.html       # Events page script
│   ├── events-page-header-injection.html # Events page CSS
│   ├── garden-*-code-block.html          # Garden Intro, What's Going On, FAQ
│   ├── garden-page-header-injection.html # Garden page CSS (optional)
│   ├── slider-page-ready.js              # Home slider script
│   └── global-header-injection.html      # Global functionality
├── sanity.config.ts  # Sanity configuration
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## 📁 SquareSpace Code Folder

The `SquareSpace Code/` folder contains scripts that integrate Sanity content into the SquareSpace website. These files are deployed to SquareSpace using Code Blocks and Page Header Code Injection.

### Key Files:
- **`app-page-code-block.html`**: App install/redirect page script (goes in Code Block)
- **`events-page-code-block.html`**: Script for the events page (goes in Code Block)
- **`events-page-header-injection.html`**: CSS styling for events page (goes in Page Header)
- **`slider-page-ready.js`**: Script for home page carousel (goes in Code Block)
- **`global-header-injection.html`**: Global functionality (goes in Site Header)

### Deployment Process:
1. Copy code from these files
2. Paste into appropriate SquareSpace locations:
   - **Code Blocks**: For JavaScript functionality
   - **Page Header**: For CSS styling
   - **Site Header**: For global features

### App Install/Redirect Page Behavior
- Automatically detects Android/iOS and redirects to the appropriate store
- Remembers entry context to avoid a blank page when returning from the store
- If opened from an internal page, returns users to the source page on return
- If opened directly or from external sites, returns users to the home page (`/`)
- If the store redirect doesn’t fire quickly, displays self-hosted App Store/Google Play badges as a fallback

To change return behavior to stay on the app page after coming back from the store, edit `SquareSpace Code/app-page-code-block.html` and replace the home redirect with the fallback display as indicated in the file comments.

## 🔄 Migration Status

This project is transitioning from SquareSpace's built-in content management to Sanity CMS.

### Completed:
- ✅ Events management in Sanity
- ✅ Evergreen slides management
- ✅ Home page carousel integration
- ✅ Events page integration
- ✅ Image cropping and validation
- ✅ Zoom and external link handling

### Benefits:
- **Better Content Management**: More organized and user-friendly
- **Image Control**: Proper cropping and aspect ratios
- **Flexible Display**: Control over time display, featured content
- **Accessibility**: Required alt text for images
- **Future-Proof**: Can be used with any website platform

## 🔧 Maintenance (for anyone running the project)

- **CI fails on "Audit (fail on high/critical)"**  
  Run `npm run fix`, commit the updated `package-lock.json` (and any `package.json` changes), and push. CI will pass once high/critical vulnerabilities are fixed.

- **Deprecation warnings (e.g. "react should be ^19.2.2")**  
  Renovate will open PRs to bump those dependencies; merge them (they automerge when CI passes). Or run `npm update` and commit if you want to fix immediately.

- **No need to remember manual steps**  
  Pushing and merging runs tests and (on `main`) deploy. Renovate keeps dependencies updated. Use `npm run fix` only when CI fails on audit.

- **"npm warn Unknown env config \"devdir\""**  
  Something in your environment (e.g. shell profile or another package manager) sets `npm_config_devdir`. CI unsets it so the warning does not appear there. Locally, for the current terminal run `unset npm_config_devdir`. To stop it permanently, find where it’s set (e.g. `grep -r devdir ~/.zshrc ~/.bashrc ~/.npmrc 2>/dev/null`)   and remove or comment out that line.

- **"npm warn EBADENGINE Unsupported engine"**  
  Some dependencies (e.g. jsdom, eslint-visitor-keys) declare supported Node versions like `^20.19.0 || ^22.12.0 || >=24` and do not yet list Node 23. If you're on Node 23, npm warns. **Fix:** Use Node 20 LTS or 22 LTS. CI already uses Node 20. Locally run `nvm use` (this repo has `.nvmrc` set to `20`) or install Node 20 from [nodejs.org](https://nodejs.org/). The project's `package.json` has `"engines": { "node": ">=20.19.0" }` to document the requirement.

### Why the build is still "success" with warnings
- **devdir** and **EBADENGINE** are npm warnings only; they do not stop the build or tests. We treat success as "lint, build, test, and deploy all complete."
- We've reduced warnings where we can: **devdir** is unset in CI; **EBADENGINE** is avoided by using Node 20 in CI and by documenting Node 20/22 locally (and providing `.nvmrc`). For a clean log locally, use Node 20 or 22 and unset `npm_config_devdir`.

## 🆘 Troubleshooting

### Common Issues:
1. **Images not cropping**: Use the crop tool after upload
2. **Events not showing**: Check "Publish" status
3. **Slider not updating**: Verify "Show on home slider" is checked
4. **Links not working**: Ensure URLs start with `http://` or `https://`
5. **Deploy ran but I don't see the update**: In GitHub → Actions, open the **Deploy** workflow for that push and confirm the **Deploy to Sanity** step completed successfully (not skipped). If it was skipped, an earlier step (lint/build/audit) failed. If the step failed, check the log for auth or network errors; ensure `SANITY_AUTH_TOKEN` is set in the repo secrets.
6. **"Not fully compatible with dashboard"**: Shown by Sanity's dashboard (sanity.io). You can keep using the Studio directly at **https://weareedison.sanity.studio** (or **https://weareedison.sanity.studio/default**). For full compatibility, ensure one successful `sanity deploy` has run (e.g. from the Deploy workflow) and that the project uses Sanity Studio v3.88.1+ (this repo uses v5). To hide the message you can disable Dashboard in [Sanity Manage](https://www.sanity.io/manage) → your organization → Settings → turn off "Dashboard is enabled".

### Getting Help:
- Check this README first
- Review the field descriptions in Sanity Studio
- Contact the development team for technical issues

---

**Last Updated**: August 2025  
**Maintained By**: We Are Edison Development Team
