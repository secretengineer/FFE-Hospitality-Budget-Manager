# Quick Reference Guide

Quick lookup for common operations and code patterns in the FF&E Budget Manager.

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Common Code Patterns

### Update Project Field
```javascript
handleProjectUpdate('name', 'New Project Name');
handleProjectUpdate('allowance', 750000);
handleProjectUpdate('salesTaxRate', 10.25);
```

### Update Line Item Field
```javascript
// updateItem(categoryId, itemId, fieldName, newValue)
updateItem('foh', 1732387200000, 'qty', 50);
updateItem('foh', 1732387200000, 'unitPrice', 170);
updateItem('custom', 1732387300000, 'desc', 'New Description');
```

### Add New Line Item
```javascript
// addItem(categoryId)
addItem('foh');           // Front of House
addItem('custom');        // Custom Fixtures
addItem('wayfinding');    // Wayfinding
addItem('exterior');      // Exterior
addItem('fees');          // Project Fees
```

### Remove Line Item
```javascript
// removeItem(categoryId, itemId)
removeItem('foh', 1732387200000);
```

### Format Currency
```javascript
const formatted = formatCurrency(1234.56);
// Returns: "$1,235"
```

### Access Calculations
```javascript
// Category subtotals
const fohSubtotal = totals.categoryTotals['foh'];

// Overall totals
const preTexTotal = totals.grandTotal;
const taxAmount = totals.tax;
const finalTotal = totals.totalWithTax;

// Budget variance (positive = under, negative = over)
const budgetVariance = totals.variance;
const isOverBudget = totals.variance < 0;
```

---

## Category IDs Reference

| ID | Title | Icon |
|----|-------|------|
| `foh` | Front of House \| Furniture & Equipment | Armchair |
| `custom` | Custom Fixtures, Millwork & Lighting | Lightbulb |
| `wayfinding` | Wayfinding & Environmental Graphics | Signpost |
| `exterior` | Exterior Patio & Accessories | TreePine |
| `fees` | Project Fees & Jobsite Logistics | Briefcase |

---

## Line Item Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | number | Unique identifier (timestamp) | 1732387200000 |
| `mfr` | string | Manufacturer/vendor name | "Industry West" |
| `desc` | string | Item description | "Dining Chairs - Main Hall" |
| `dimensions` | string | Physical dimensions | "22\"W x 24\"D" |
| `qty` | number | Quantity (≥ 0) | 50 |
| `unitPrice` | number | Price per unit in USD (≥ 0) | 170 |
| `leadTime` | string | Delivery/production time | "8 Weeks" |
| `notes` | string | Additional information | "Walnut Finish" |

---

## Project Info Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Project name |
| `address` | string | Project location |
| `date` | string | Project date (YYYY-MM-DD) |
| `client` | string | Client/developer name |
| `allowance` | number | Total budget (≥ 0) |
| `salesTaxRate` | number | Tax percentage (e.g., 10.25) |
| `companyName` | string | Your company name |
| `companyAddress` | string | Your company address |
| `companyPhone` | string | Your company phone |
| `companyEmail` | string | Your company email |
| `logoUrl` | string | Company logo image URL |

---

## Validation Rules

### Numeric Fields
All numeric fields must be:
- **Non-negative** (≥ 0)
- **Valid numbers** (not NaN)
- **Rejected if invalid** (with console warning)

**Validated Fields:**
- `projectInfo.allowance`
- `projectInfo.salesTaxRate`
- `item.qty`
- `item.unitPrice`

**Example Console Warning:**
```
Invalid qty for item 1732387200000: -5. Must be a positive number.
```

---

## State Update Patterns

### Immutable Updates

**✅ Correct:**
```javascript
// Use spread operator
setProjectInfo(prev => ({ ...prev, name: 'New Name' }));

// Use .map() for arrays
setCategories(prev => prev.map(cat => 
  cat.id === 'foh' 
    ? { ...cat, items: [...cat.items, newItem] }
    : cat
));
```

**❌ Wrong:**
```javascript
// Don't mutate directly
projectInfo.name = 'New Name';
setProjectInfo(projectInfo);

// Don't push to arrays
categories[0].items.push(newItem);
setCategories(categories);
```

---

## Tailwind-Style Classes

### Common Spacing
```
p-4      → padding: 1rem
px-6     → padding-left/right: 1.5rem
py-2     → padding-top/bottom: 0.5rem
m-2      → margin: 0.5rem
mb-8     → margin-bottom: 2rem
gap-4    → gap: 1rem
```

### Colors
```
text-gray-600    → gray text
bg-blue-50       → light blue background
border-red-500   → red border
```

### Layout
```
flex             → display: flex
grid             → display: grid
grid-cols-2      → 2 columns
gap-4            → gap between items
justify-between  → space-between
items-center     → vertical center
```

### Responsive
```
md:grid-cols-2   → 2 columns on medium screens
lg:w-1/3         → 1/3 width on large screens
sm:px-6          → padding-x on small screens
```

### Print
```
print:hidden     → hide when printing
print:bg-white   → white background when printing
```

---

## Icon Reference (Lucide React)

Common icons used:
```javascript
import { 
  Printer,      // Print button
  Plus,         // Add item button
  Trash2,       // Delete item button
  Layout,       // App logo
  Armchair,     // Front of House
  Lightbulb,    // Custom Fixtures
  Signpost,     // Wayfinding
  TreePine,     // Exterior
  Briefcase     // Fees
} from 'lucide-react';
```

**Usage:**
```javascript
<Printer size={16} />
<Armchair size={20} className="text-blue-600" />
```

---

## Event Handler Reference

```javascript
// Project updates
handleProjectUpdate(field, value)
// Example: handleProjectUpdate('name', 'Hotel Renovation')

// Item updates
updateItem(catId, itemId, field, value)
// Example: updateItem('foh', 123, 'qty', 50)

// Add item
addItem(catId)
// Example: addItem('custom')

// Remove item
removeItem(catId, itemId)
// Example: removeItem('wayfinding', 456)

// Print
handlePrint()
// Example: Called by print button click
```

---

## Calculation Formulas

```javascript
// Line Item Total
lineTotal = qty × unitPrice

// Category Subtotal
categoryTotal = Σ(lineTotal for all items in category)

// Grand Total (Pre-Tax)
grandTotal = Σ(all categoryTotals)

// Tax
tax = grandTotal × (salesTaxRate / 100)

// Total with Tax
totalWithTax = grandTotal + tax

// Budget Variance
variance = allowance - totalWithTax
// Positive = under budget, Negative = over budget
```

---

## Debugging Tips

### View State in Console
```javascript
console.log('Project Info:', projectInfo);
console.log('Categories:', categories);
console.log('Totals:', totals);
```

### Check Validation Logs
```javascript
// Watch console for warnings like:
"Invalid qty for item 123: -5. Must be a positive number."
```

### React DevTools
1. Install React Developer Tools browser extension
2. Open browser DevTools
3. Go to "Components" tab
4. Select "App" component
5. View props and state in right panel

---

## Print Settings

**Recommended Settings:**
- Destination: Save as PDF
- Paper size: A4 or Letter
- Layout: Portrait
- Margins: Default
- Options: ✓ Background graphics
- Scale: 100%

**Page Elements:**
- Header: (none)
- Footer: Project name (left), Page # (center), Date (right)

---

## Common Issues & Solutions

### State Not Updating
**Check:** Are you mutating state directly?
**Fix:** Use spread operators and .map()

### Totals Not Calculating
**Check:** Are qty and unitPrice valid numbers?
**Fix:** Verify numeric fields, check console for NaN

### Print Looks Wrong
**Check:** Is "Background graphics" enabled?
**Fix:** Enable in print dialog settings

### Validation Not Working
**Check:** Are you passing strings to numeric fields?
**Fix:** Use parseFloat() or Number() before passing

---

## File Locations

```
Key files:
├── src/App.jsx              # Main component (all logic here)
├── src/index.css            # Global styles
├── src/main.jsx             # Entry point
├── docs/DATA_STRUCTURES.md  # Data structure reference
├── docs/DEVELOPER_GUIDE.md  # Comprehensive guide
├── docs/QUICK_REFERENCE.md  # This file
└── README.md                # Project overview
```

---

## Keyboard Shortcuts (Dev Server)

- `Tab` - Navigate between inputs
- `Ctrl+P` / `Cmd+P` - Print dialog
- `Ctrl+Shift+R` - Hard refresh (clear cache)
- `F12` - Open DevTools

---

## Git Commands (If Using Version Control)

```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin main

# Pull latest
git pull origin main
```

---

## Additional Resources

- **Full Documentation:** See `docs/DEVELOPER_GUIDE.md`
- **Data Structures:** See `docs/DATA_STRUCTURES.md`
- **Project Overview:** See `README.md`
- **React Docs:** https://react.dev
- **Lucide Icons:** https://lucide.dev

---

**Last Updated:** November 23, 2025
