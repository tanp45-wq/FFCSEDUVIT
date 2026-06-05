# EduHub VIT — Portal Architecture & Structure

This document outlines the refactored modular folder structure of the **EduHub VIT** portal. All code has been decoupled from the original monolithic `app.js` and `style.css` files into a highly clean, structured, and modular system.

---

## 📂 Directory Layout

```text
FFCSEDUVIT/
├── css/
│   └── style.css            # Centralized Premium Styles & Layout Rules
├── js/
│   ├── data/                # Data Modules (Static JSON/Object mappings)
│   │   ├── mis-papers.js    # Data mapping for MIS course papers
│   │   ├── nptel-courses.js # Course code, week counts, & sample NPTEL questions
│   │   └── pyq-papers.js    # Direct Google Cloud storage URLs for previous year papers
│   │
│   ├── modules/             # Page Sub-system Logic Modules
│   │   ├── cgpa-calculator.js # GPA, CGPA, target grade prediction logic
│   │   ├── cursor.js          # Custom visual mouse-pointer follow trail
│   │   ├── ffcs-planner.js    # Slots, conflict checks, local storage, CSV exports
│   │   ├── navigation.js      # Global modal switches, toast display, section views
│   │   ├── nptel-practice.js  # Swayam prep rendering and option checks
│   │   └── pyq-papers.js      # Paper searches, exam/year filters, and click logic
│   │
│   └── main.js              # Application Bootstrap & Initialization
│
├── sections/                # Modular HTML component templates (fetched on startup)
│   ├── home.html            # Hero landing screen & Pick Your Tool grid
│   ├── ffcs.html            # FFCS Planner timetable & course grid
│   ├── cgpa.html            # CGPA / GPA calculator and VIT grade scale
│   ├── nptel.html           # NPTEL practice dashboard & week selection quiz
│   ├── pyq.html             # CAT/FAT paper search grids & filters
│   └── modals.html          # Dynamic dialog components (slots, conflicts, reset)
│
├── index.html               # Main entry HTML markup (imports js/main.js & css/style.css)
├── README.md                # General introduction & setup instruction
└── README_STRUCTURE.md      # This architectural and structural map
```

---

## ⚙️ How it Works

### 1. Script Loading
Instead of standard script blocks, `index.html` loads the central application entry point with `type="module"`:
```html
<script type="module" src="js/main.js"></script>
```

### 2. Main Entry Point & HTML Component Loading (`js/main.js`)
On `DOMContentLoaded`, `main.js` dynamically fetches all of the component template fragments, inserts them into their respective placeholders in `index.html`, and then initializes the page modules:
```javascript
async function loadSection(placeholderId, filePath) {
  const response = await fetch(filePath);
  const html = await response.text();
  document.getElementById(placeholderId).outerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadSection('placeholder-home', 'sections/home.html'),
    loadSection('placeholder-ffcs', 'sections/ffcs.html'),
    ...
  ]);

  initCursor();
  initNavigation();
  ...
});
```

### 3. Backward Compatibility & Interactive Binding
To keep the application fully functional with the existing HTML's inline event handlers (like `onclick="showSection('ffcs')"`), modules bind their core interface APIs to the global `window` object:
```javascript
export function initNavigation() {
  window.showSection = showSection;
  window.showToast = showToast;
  ...
}
```

---

## 🛠️ Debugging & Maintenance

- **Adding a new NPTEL course**: Open `js/data/nptel-courses.js`, add a course object to the `NPTEL_COURSES` array, and the home page grid will auto-render it.
- **Modifying Timetable Slots**: Update the slots definition array or header mappings at the top of `js/modules/ffcs-planner.js`.
- **Adjusting Themes & Colors**: Open `css/style.css`, modify the CSS Custom Properties inside `:root`.
- **Modifying Layout Constraints**: Background elements are scaled full-viewport directly, while central page content sits within `max-width: 1280px` containers (`.hero-container`, `.tools-container`).
