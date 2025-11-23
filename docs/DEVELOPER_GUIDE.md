# Developer Guide

Complete guide for developers working with the FF&E Hospitality Budget Manager codebase.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Code Organization](#code-organization)
4. [Component Deep Dive](#component-deep-dive)
5. [State Management](#state-management)
6. [Styling Approach](#styling-approach)
7. [Common Tasks](#common-tasks)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

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

## Project Architecture

### High-Level Overview

```
┌─────────────────────────────────────┐
│         Browser Entry Point         │
│           (index.html)              │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         React Bootstrap             │
│           (main.jsx)                │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         App Component               │
│      (App.jsx - 600+ lines)         │
│                                     │
│  ┌─────────────────────────────┐  │
│  │   Reusable Components       │  │
│  │   - Card                    │  │
│  │   - SectionHeader           │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │   State Management          │  │
│  │   - projectInfo             │  │
│  │   - categories              │  │
│  │   - totals (computed)       │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │   Event Handlers            │  │
│  │   - handleProjectUpdate     │  │
│  │   - updateItem              │  │
│  │   - addItem                 │  │
│  │   - removeItem              │  │
│  └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Design Patterns Used

1. **Single Component Application**
   - All logic in one file for simplicity
   - Easy to understand data flow
   - Suitable for small-to-medium apps

2. **Controlled Components**
   - All form inputs tied to state
   - Single source of truth
   - Predictable UI updates

3. **Immutable State Updates**
   - Never mutate state directly
   - Use spread operators and .map()
   - Ensures React detects changes

4. **Memoization**
   - `useMemo` for expensive calculations
   - Prevents unnecessary re-computations
   - Improves performance

---

## Code Organization

### File Structure

```
src/
├── App.jsx           # Main component (600+ lines)
│   ├── Imports
│   ├── Reusable Components (Card, SectionHeader)
│   ├── App Component
│   │   ├── State declarations
│   │   ├── Utility functions
│   │   ├── Event handlers
│   │   └── Render/JSX
│   └── Print styles
│
├── App.css           # Application styles (minimal)
├── index.css         # Global styles + Tailwind imports
├── main.jsx          # React bootstrap/entry point
└── assets/           # Static assets
```

### Code Sections in App.jsx

The file is organized into clearly marked sections:

```javascript
// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================
// Card, SectionHeader components

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  // projectInfo, categories state

  // ============================================================================
  // UTILITY FUNCTIONS & CALCULATIONS
  // ============================================================================
  // formatCurrency, totals computation

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  // All update/add/remove functions

  // ============================================================================
  // RENDER
  // ============================================================================
  // JSX with inline comments for sections
```

---

## Component Deep Dive

### Card Component

**Purpose:** Reusable container with consistent styling

```javascript
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);
```

**Props:**
- `children` - Content to render inside
- `className` - Additional Tailwind classes

**Usage:**
```javascript
<Card className="p-6 mb-4">
  <h2>My Content</h2>
</Card>
```

### SectionHeader Component

**Purpose:** Category headers with icon, title, and subtotal

```javascript
const SectionHeader = ({ icon: Icon, title, total, colorClass = "text-gray-800" }) => (
  // ... renders header with icon and total
);
```

**Props:**
- `icon` - Lucide icon component (e.g., `Armchair`)
- `title` - Section title string
- `total` - Formatted currency string
- `colorClass` - Tailwind color class for theming

**Usage:**
```javascript
<SectionHeader 
  icon={Armchair} 
  title="Front of House" 
  total="$25,000" 
  colorClass="text-blue-600"
/>
```

### App Component

**Purpose:** Main application container managing all state and logic

**Key Responsibilities:**
1. State management (project info, categories)
2. Business logic (calculations, validations)
3. Event handling (user interactions)
4. Rendering (UI composition)

---

## State Management

### State Variables

#### projectInfo
```javascript
const [projectInfo, setProjectInfo] = useState({
  name: string,
  address: string,
  date: string,
  client: string,
  allowance: number,
  salesTaxRate: number,
  companyName: string,
  companyAddress: string,
  companyPhone: string,
  companyEmail: string,
  logoUrl: string,
});
```

**Update Pattern:**
```javascript
handleProjectUpdate('name', 'New Name');
// Internal: setProjectInfo(prev => ({ ...prev, name: 'New Name' }));
```

#### categories
```javascript
const [categories, setCategories] = useState([
  {
    id: string,
    title: string,
    icon: LucideIcon,
    color: string,
    items: [
      {
        id: number,
        mfr: string,
        desc: string,
        dimensions: string,
        qty: number,
        unitPrice: number,
        leadTime: string,
        notes: string,
      }
    ]
  }
]);
```

**Update Patterns:**
```javascript
// Update item
updateItem('foh', 123, 'qty', 50);

// Add item
addItem('foh');

// Remove item
removeItem('foh', 123);
```

#### totals (computed)
```javascript
const totals = useMemo(() => ({
  categoryTotals: { [catId]: number },
  grandTotal: number,
  tax: number,
  totalWithTax: number,
  variance: number,
}), [categories, projectInfo.allowance, projectInfo.salesTaxRate]);
```

**Auto-recalculates when:**
- Categories change
- Allowance changes
- Tax rate changes

### State Update Rules

**✅ DO:**
```javascript
// Use functional updates
setCategories(prev => prev.map(cat => 
  cat.id === catId 
    ? { ...cat, items: [...cat.items, newItem] }
    : cat
));

// Use spread operator
setProjectInfo(prev => ({ ...prev, field: value }));
```

**❌ DON'T:**
```javascript
// Mutate state directly
categories[0].items.push(newItem);
setCategories(categories);

// Forget to copy nested objects
const cat = categories[0];
cat.items = [...cat.items, newItem];
```

---

## Styling Approach

### Tailwind CSS Utility Classes

All styling is done via Tailwind utility classes directly in JSX:

```javascript
<div className="bg-gray-100 p-4 rounded-lg shadow-sm">
  <h2 className="text-xl font-bold text-gray-900 mb-2">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
```

### Common Patterns

**Responsive Design:**
```javascript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
// 1 column on mobile, 2 on tablet, 4 on desktop
```

**Conditional Styling:**
```javascript
className={`p-5 ${totals.variance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}
```

**Print Styles:**
```javascript
className="print:hidden"  // Hide when printing
className="print:bg-white"  // Change for print
```

### CSS Files

**index.css:**
- Tailwind imports
- Global resets
- Print-specific rules

**App.css:**
- Reserved for custom CSS (currently minimal)
- Prefer Tailwind over custom CSS

### Inline Styles

Only used for print media queries that require dynamic data:

```javascript
<style>{`
  @media print {
    @page {
      @bottom-center {
        content: "Page " counter(page);
      }
    }
  }
`}</style>
```

---

## Common Tasks

### Add a New Category

1. **Define the category:**
```javascript
const [categories, setCategories] = useState([
  // ... existing categories
  {
    id: 'new-category',
    title: 'New Category Name',
    icon: NewIcon, // Import from lucide-react
    color: 'text-purple-600',
    items: []
  }
]);
```

2. **Import icon:**
```javascript
import { NewIcon } from 'lucide-react';
```

### Add a Field to Line Items

1. **Update initial state:**
```javascript
items: [
  {
    // ... existing fields
    newField: 'default value',
  }
]
```

2. **Update addItem function:**
```javascript
const newItem = {
  // ... existing fields
  newField: '',
};
```

3. **Add table column in JSX:**
```javascript
<th>New Field</th>
// ...
<td>
  <input 
    value={item.newField}
    onChange={(e) => updateItem(category.id, item.id, 'newField', e.target.value)}
  />
</td>
```

### Add Validation

Add to `updateItem` or `handleProjectUpdate`:

```javascript
if (field === 'newNumericField') {
  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    console.warn(`Invalid ${field}: ${value}`);
    return;
  }
}
```

### Change Calculation Logic

Edit the `totals` useMemo:

```javascript
const totals = useMemo(() => {
  // Add custom calculation
  const customTotal = categories.reduce((sum, cat) => 
    sum + (cat.items.length * 100), 0
  );
  
  return { 
    // ... existing totals
    customTotal 
  };
}, [categories]);
```

---

## Testing

### Manual Testing Checklist

**Project Information:**
- [ ] Edit project name
- [ ] Edit address (multiline)
- [ ] Change date
- [ ] Update client name
- [ ] Change budget allowance
- [ ] Adjust tax rate
- [ ] Verify totals update

**Company Branding:**
- [ ] Edit company name
- [ ] Update address
- [ ] Change phone/email
- [ ] Replace logo URL

**Line Items:**
- [ ] Add new item to each category
- [ ] Edit each field type
- [ ] Test quantity changes
- [ ] Test price changes
- [ ] Verify row total calculates
- [ ] Delete item
- [ ] Test hover effects

**Calculations:**
- [ ] Category subtotals correct
- [ ] Grand total correct
- [ ] Tax calculates properly
- [ ] Total with tax correct
- [ ] Variance shows correctly
- [ ] Variance color (green/red) correct

**Print/PDF:**
- [ ] Print preview looks clean
- [ ] Interactive elements hidden
- [ ] Page breaks appropriate
- [ ] Footer content appears
- [ ] Page numbers show
- [ ] Colors print correctly

**Validation:**
- [ ] Negative numbers rejected
- [ ] Non-numeric input in number fields
- [ ] Console warnings appear

### Automated Testing (Future)

Consider adding:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

**Static Hosting:**
- Vercel (recommended)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

**Deployment Steps (Vercel):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Environment Variables

Currently none required. To add:

1. Create `.env` file:
```
VITE_API_KEY=your_key_here
```

2. Access in code:
```javascript
const apiKey = import.meta.env.VITE_API_KEY;
```

---

## Troubleshooting

### Development Server Won't Start

**Issue:** Port 5173 already in use
**Solution:**
```bash
# Find and kill process
npx kill-port 5173
# Or specify different port
npm run dev -- --port 3000
```

### Hot Reload Not Working

**Issue:** Changes not reflecting
**Solutions:**
1. Clear browser cache (Ctrl+Shift+R)
2. Restart dev server
3. Delete `node_modules` and reinstall
4. Check file permissions

### State Not Updating

**Issue:** UI not reflecting changes
**Debug:**
```javascript
// Add console logs
console.log('Before:', categories);
setCategories(newCategories);
console.log('After:', newCategories);

// Check React DevTools
// Install React Developer Tools browser extension
```

**Common Causes:**
- Mutating state directly
- Forgetting return statement in map()
- Async state updates not accounted for

### Calculations Wrong

**Debug:**
```javascript
// Log intermediate values
console.log('Category totals:', categoryTotals);
console.log('Grand total:', grandTotal);
console.log('Tax:', tax);
console.log('Variance:', variance);
```

**Common Causes:**
- Tax rate as decimal instead of percentage
- Missing items in calculation
- Incorrect qty or unitPrice (check for NaN)

### Print Styles Not Working

**Check:**
1. Browser print preview (not regular view)
2. Background graphics enabled in print settings
3. Page margins set correctly
4. @media print rules in style tag
5. print: classes from Tailwind

### Build Fails

**Issue:** Production build errors
**Solutions:**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build

# Check for console errors
# Fix any linting issues
npm run lint
```

---

## Best Practices

### Code Style

1. **Use meaningful names:**
```javascript
// ✅ Good
const handleProjectUpdate = (field, value) => { ... }

// ❌ Bad
const hpu = (f, v) => { ... }
```

2. **Keep functions small:**
```javascript
// ✅ Good - single responsibility
const calculateTax = (subtotal, rate) => subtotal * (rate / 100);
const calculateTotal = (subtotal, tax) => subtotal + tax;

// ❌ Bad - doing too much
const calculateEverything = () => { ... }
```

3. **Comment complex logic:**
```javascript
// Calculate variance (positive = under budget, negative = over budget)
const variance = projectInfo.allowance - totalWithTax;
```

### Performance

1. **Use useMemo for expensive calculations:**
```javascript
const totals = useMemo(() => {
  // Expensive calculation here
}, [dependencies]);
```

2. **Avoid inline function creation in render:**
```javascript
// ✅ Good
const handleClick = useCallback(() => { ... }, [deps]);
<button onClick={handleClick}>

// ❌ Bad (creates new function every render)
<button onClick={() => { ... }}>
```

3. **Minimize re-renders:**
```javascript
// Use functional setState when updating based on previous state
setCount(prev => prev + 1);
```

### Accessibility

1. **Add aria labels:**
```javascript
<button aria-label="Delete item">
  <Trash2 />
</button>
```

2. **Use semantic HTML:**
```javascript
<table>, <thead>, <tbody>, <th>
```

3. **Keyboard navigation:**
- Inputs are focusable by default
- Test with Tab key

---

## Additional Resources

### Documentation
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

### Learning Resources
- [React Patterns](https://reactpatterns.com)
- [JavaScript Info](https://javascript.info)
- [CSS Tricks](https://css-tricks.com)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Vite Plugin Inspect](https://github.com/antfu/vite-plugin-inspect)

---

## Contact & Support

For questions or issues:
- Email: pat@patryan.com
- Review this guide first
- Check console for error messages
- Use React DevTools for debugging

---

**Happy Coding! 🚀**
