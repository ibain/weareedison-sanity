# SquareSpace Code Integration

This folder contains the code that connects Sanity CMS content to the SquareSpace website. These files make the events and slides from Sanity appear on the live website.

## 📋 File Overview

### 🏠 Home Page Files
- **`slider-page-ready.js`** - Home page carousel script
- **`original-slider-code.txt`** - Reference code from original implementation

### 📅 Events Page Files  
- **`events-page-code-block.html`** - Events page functionality script
- **`events-page-header-injection.html`** - Events page styling CSS

### 🌐 Global Files
- **`global-header-injection.html`** - Global functionality (calendar links, etc.)
- **`sanity-test.js`** - Testing script for debugging

## 🚀 How to Deploy to SquareSpace

### Step 1: Home Page Carousel
1. Go to SquareSpace Dashboard → Pages → Home
2. Add a **Code Block** to the page
3. Copy the entire contents of `slider-page-ready.js`
4. Paste into the Code Block
5. Save the page

### Step 2: Events Page
1. Go to SquareSpace Dashboard → Pages → Events
2. **Page Header Code Injection**:
   - Copy contents of `events-page-header-injection.html`
   - Paste into Page Settings → Advanced → Page Header Code Injection
3. **Code Block**:
   - Add a Code Block to the page
   - Copy contents of `events-page-code-block.html`
   - Paste into the Code Block
4. Save the page

### Step 3: Global Features
1. Go to SquareSpace Dashboard → Settings → Advanced → Code Injection
2. Copy contents of `global-header-injection.html`
3. Paste into **Site Header Code Injection**
4. Save

## 📁 File Details

### `slider-page-ready.js`
**Purpose**: Creates the home page carousel that shows events and slides from Sanity

**What it does:**
- Fetches events marked "Show on home slider" from Sanity
- Fetches evergreen slides from Sanity
- Creates a carousel with navigation arrows and dots
- Handles image cropping and responsive display
- Manages click behavior (external links vs. events page)

**Deployment**: Code Block on Home page

### `events-page-code-block.html`
**Purpose**: Replaces SquareSpace's built-in events with Sanity events

**What it does:**
- Fetches all published events from Sanity
- Displays events in a single-column layout
- Shows date/time ranges with proper formatting
- Handles Zoom and external link buttons
- Hides original SquareSpace events

**Deployment**: Code Block on Events page

### `events-page-header-injection.html`
**Purpose**: Provides CSS styling for the Sanity events page

**What it does:**
- Styles event layout to match SquareSpace design
- Ensures proper button alignment
- Maintains responsive design
- Applies SquareSpace color scheme and fonts

**Deployment**: Page Header Code Injection on Events page

### `global-header-injection.html`
**Purpose**: Provides global functionality across the entire site

**What it does:**
- Handles calendar subscription links (webcal/HTTPS fallback)
- Provides consistent behavior for calendar links anywhere on site
- Works with existing SquareSpace calendar functionality

**Deployment**: Site Header Code Injection

### `original-slider-code.txt`
**Purpose**: Reference code from the original SquareSpace implementation

**What it contains:**
- Original carousel HTML/CSS/JavaScript
- Used for comparison and debugging
- Shows how the original slider worked

**Deployment**: Reference only (not deployed)

### `sanity-test.js`
**Purpose**: Simple test script for debugging Sanity connection

**What it does:**
- Tests basic connection to Sanity API
- Shows raw data from Sanity
- Useful for troubleshooting data issues

**Deployment**: Temporary debugging only

## 🔧 Technical Details

### Sanity Integration
- **API Endpoint**: `https://u8cybb7l.api.sanity.io/v2024-01-01/data/query/production`
- **Query Language**: GROQ (Graph-Relational Object Queries)
- **Authentication**: Public read access (no tokens required)

### Key Features
- **Image Optimization**: Automatic cropping and resizing via Sanity CDN
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Proper alt text and keyboard navigation
- **Performance**: Optimized loading and caching

### Data Flow
1. **Sanity Studio**: Content managers add/edit content
2. **Sanity API**: Content is served via public API
3. **SquareSpace**: JavaScript fetches and displays content
4. **Website**: Users see dynamic, up-to-date content

## 🐛 Troubleshooting

### Common Issues:

**1. Content not appearing**
- Check Sanity Studio for published content
- Verify API endpoint is correct
- Check browser console for errors

**2. Images not loading**
- Ensure images are uploaded and cropped in Sanity
- Check image URLs in browser network tab
- Verify image asset references in GROQ queries

**3. Styling issues**
- Ensure CSS is in Page Header Code Injection
- Check for CSS conflicts with SquareSpace theme
- Verify CSS selectors match HTML structure

**4. Links not working**
- Check URL format (must start with http:// or https://)
- Verify Zoom links are properly formatted
- Test external links in new tabs

### Debug Steps:
1. Open browser Developer Tools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed API requests
4. Use `sanity-test.js` to verify data connection
5. Compare with `original-slider-code.txt` for reference

## 📝 Maintenance Notes

### When to Update Files:
- **Content changes**: No file updates needed (handled in Sanity)
- **Design changes**: Update CSS in header injection files
- **Functionality changes**: Update JavaScript in code block files
- **New features**: May require new files or modifications

### Backup Strategy:
- Keep copies of working versions before making changes
- Test changes on `/sandbox/` pages first
- Document any custom modifications

### Performance Considerations:
- Images are automatically optimized by Sanity CDN
- JavaScript is minified for production
- CSS is scoped to prevent conflicts
- API responses are cached by browsers

---

**Last Updated**: August 2025  
**For Technical Support**: Track down Ian Bain
