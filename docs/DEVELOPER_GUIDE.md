# Developer Guide

Complete guide for developers working with the **FF&E Hospitality Budget Manager** codebase.

---

##  Table of Contents
1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Code Organization](#code-organization)
4. [Component Deep Dive](#component-deep-dive)
5. [State Management](#state-management)
6. [File System & Persistence](#file-system--persistence)
7. [Styling Approach](#styling-approach)
8. [Common Tasks](#common-tasks)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

##  Getting Started

### Development Environment Setup

1. **Install Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org)
   - Verify: `node --version`

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   - Opens on http://localhost:5173
   - Hot Module Replacement (HMR) enabled
   - Changes reflect instantly in browser

4. **Code Editor Setup**
   - VS Code recommended
   - Install ESLint extension
   - Enable format on save

### Project Dependencies

**Core Dependencies:**
- `react` ^19.2.0 - UI library
- `react-dom` ^19.2.0 - React DOM renderer
- `lucide-react` ^0.554.0 - Icon library

**Dev Dependencies:**
- `vite` ^7.2.4 - Build tool
- `@vitejs/plugin-react` ^5.1.1 - React plugin for Vite
- `eslint` ^9.39.1 - Code linting
- `@types/react` & `@types/react-dom` - Type definitions

---

##  Project Architecture

### High-Level Overview

```

         Browser Entry Point         
           (index.html)              

              

         React Bootstrap             
           (main.jsx)                

              

         App Component               
      (App.jsx - 1200+ lines)        
                                     
    
     Reusable Components         
     - Card                      
     - SectionHeader             
    
                                     
    
     State Management            
     - projectInfo               
     - categories                
     - fileHandle                
     - hasUnsavedChanges         
     - totals (computed)         
    
                                     
    
     Event Handlers              
     - handleProjectUpdate       
     - updateItem                
     - addItem / removeItem      
     - addCategory               
     - handleSave / handleOpen   
    

```

---

##  Code Organization

### Directory Structure

```
FFE-Hospitality-Budget-Manager/
 src/
    App.jsx          # Main application logic (Single File Component)
    App.css          # Minimal custom styles
    index.css        # Global styles & Tailwind imports
    main.jsx         # Entry point
    assets/          # Images and static resources
 public/              # Public static files
 docs/                # Documentation
    DATA_STRUCTURES.md
    DEVELOPER_GUIDE.md
    QUICK_REFERENCE.md
    SAVE_LOAD_GUIDE.md
 index.html           # HTML template
 package.json         # Dependencies
 vite.config.js       # Build configuration
```

---

##  Component Deep Dive

### Card Component

**Purpose:** A reusable wrapper for content sections with consistent styling.

```javascript
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);
```

### SectionHeader Component

**Purpose:** Category headers with icon, editable title, subtotal, and delete functionality.

```javascript
const SectionHeader = ({ 
  icon: Icon, 
  title, 
  total, 
  colorClass, 
  onTitleChange, 
  onDelete 
}) => (
  // ... renders header with inline editing and delete button
);
```

**Key Props:**
- `onTitleChange`: Callback for inline title editing
- `onDelete`: Callback for section deletion
- `colorClass`: Tailwind color class for theming

### App Component

**Purpose:** The monolithic controller for the entire application.

**Key Responsibilities:**
1. **State Management:** Holds all application state
2. **Business Logic:** Calculations, validations, data transformations
3. **File Operations:** Save, Load, New Document
4. **Rendering:** Composes the UI

---

##  State Management

### Core State Variables

#### `projectInfo`
Stores project metadata and branding.
```javascript
const [projectInfo, setProjectInfo] = useState({
  name: string,
  address: string,
  date: string,
  client: string,
  allowance: number,
  salesTaxRate: number,
  companyName: string,
  // ... branding fields
});
```

#### `categories`
Stores the budget structure. Now supports dynamic addition/removal.
```javascript
const [categories, setCategories] = useState([
  {
    id: string,        // 'foh' or 'cat_1732400000000'
    title: string,     // Editable title
    icon: LucideIcon,
    color: string,
    items: LineItem[]
  }
]);
```

#### `fileHandle` & `hasUnsavedChanges`
Manages file persistence state.
```javascript
const [fileHandle, setFileHandle] = useState(null); // FileSystemFileHandle
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
```

#### `totals` (Computed)
Memoized calculations for performance.
```javascript
const totals = useMemo(() => ({
  categoryTotals: { [catId]: number },
  grandTotal: number,
  tax: number,
  totalWithTax: number,
  variance: number,
}), [categories, projectInfo.allowance, projectInfo.salesTaxRate]);
```

---

##  File System & Persistence

The application uses the **File System Access API** for native-like document handling.

### Key Functions

- **`handleNewDocument()`**: Resets state to defaults. Checks for unsaved changes.
- **`handleSave()`**: Writes to the existing `fileHandle`. If none, calls `showSaveFilePicker`.
- **`handleSaveAs()`**: Always calls `showSaveFilePicker` to create a new file.
- **`handleOpen()`**: Uses `showOpenFilePicker` to read `.ffe` (JSON) files.

### File Format (.ffe)
Custom JSON format containing:
- `version`: Schema version
- `savedAt`: Timestamp
- `projectInfo`: Project metadata
- `categories`: Budget data

---

##  Styling Approach

### Tailwind CSS Utility Classes

Primary styling method using utility classes directly in JSX.

```javascript
<div className="bg-gray-100 p-4 rounded-lg shadow-sm">
  <h2 className="text-xl font-bold text-gray-900 mb-2">Title</h2>
</div>
```

### Inline Styles (Specific Use Cases)

Used for:
1. **Dynamic Table Columns:** `minWidth`, `tableLayout: 'auto'`
2. **Print Layouts:** `@page` rules, margins
3. **Textarea Auto-resize:** `resize: vertical`

### Print Styling

- **Media Query:** `@media print` in `<style>` tag
- **Landscape Mode:** `@page { size: A4 landscape; }`
- **Hiding Elements:** `className="print:hidden"`

---

##  Common Tasks

### Add a New Category Programmatically

1. **Update `addCategory` function:**
```javascript
const addCategory = () => {
  const newCategory = {
    id: `cat_${Date.now()}`,
    title: 'New Section',
    // ... default props
  };
  setCategories(prev => [...prev, newCategory]);
};
```

### Add a Field to Line Items

1. **Update initial state** in `addCategory` and default `categories`.
2. **Update `addItem` function** to include the new field.
3. **Add table column** in the JSX render method.
4. **Add input/textarea** with `updateItem` handler.

### Modify Print Layout

Edit the `<style>` block at the bottom of `App.jsx`:

```css
@media print {
  @page {
    size: A4 landscape; /* Change to portrait if needed */
    margin: 1.5cm;
  }
  /* ... */
}
```

---

##  Testing

### Manual Testing Checklist

**File Operations:**
- [ ] Create New Document (check warning)
- [ ] Save (check file creation)
- [ ] Save As (check new file)
- [ ] Open (check data load)
- [ ] Unsaved changes indicator (*)

**Dynamic Sections:**
- [ ] Add new section
- [ ] Rename section
- [ ] Delete section (check confirmation)
- [ ] Verify totals update

**Line Items:**
- [ ] Add/Edit/Delete items
- [ ] Check long text in Manufacturer/Description
- [ ] Verify numeric validation

**Print/PDF:**
- [ ] Landscape orientation
- [ ] Margins and footer
- [ ] Hidden buttons

---

##  Deployment

### Build for Production

```bash
npm run build
```
Creates a `dist/` folder with optimized assets.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options
- **Vercel / Netlify:** Drag and drop `dist/` folder or connect Git repo.
- **Static Hosting:** Any web server capable of serving static HTML/JS/CSS.

---

##  Troubleshooting

### "File System Access API not supported"
- **Cause:** Browser is Firefox or Safari.
- **Solution:** Use Chrome, Edge, or Opera.

### "Save As" Dialog Doesn't Appear
- **Cause:** Browser popup blocker or permissions.
- **Solution:** Check browser settings for the site.

### Print Layout Issues
- **Cause:** Browser print settings.
- **Solution:** Ensure "Background graphics" is checked and "Landscape" is selected in the system dialog.

---

##  Contact & Support

For questions or issues:
- **Email:** pat@patryan.com
- **Docs:** Review `SAVE_LOAD_GUIDE.md` for file operation details.

---

**Happy Coding! **
