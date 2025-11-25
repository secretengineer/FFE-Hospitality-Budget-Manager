# Quick Reference Guide

Quick lookup for common operations and code patterns in the **FF&E Hospitality Budget Manager**.

---

##  Project Setup

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

##  File Operations

The application uses the **File System Access API** for native file handling.

| Action | Function | Description |
|--------|----------|-------------|
| **New** | `handleNewDocument()` | Resets all data to defaults. Prompts if unsaved changes exist. |
| **Open** | `handleOpen()` | Opens a file picker to load a `.ffe` JSON file. |
| **Save** | `handleSave()` | Saves to the current file handle. If none, opens "Save As" dialog. |
| **Save As** | `handleSaveAs()` | Always opens a file picker to save as a new file. |

---

##  Common Code Patterns

### Update Project Field
```javascript
handleProjectUpdate('name', 'New Project Name');
handleProjectUpdate('allowance', 750000);
handleProjectUpdate('salesTaxRate', 10.25);
```

### Manage Categories (Dynamic Sections)

**Add New Category:**
```javascript
// Adds a new section with default title "New Section"
addCategory(); 
```

**Update Category Title:**
```javascript
// updateCategoryTitle(categoryId, newTitle)
updateCategoryTitle('foh', 'Front of House Furniture');
updateCategoryTitle('cat_1732401234567', 'Lobby Lighting');
```

**Delete Category:**
```javascript
// deleteCategory(categoryId)
deleteCategory('cat_1732401234567');
```

### Manage Line Items

**Add New Item:**
```javascript
// addItem(categoryId)
addItem('foh');
addItem('cat_1732401234567');
```

**Update Item Field:**
```javascript
// updateItem(categoryId, itemId, fieldName, newValue)
updateItem('foh', 1732387200000, 'qty', 50);
updateItem('foh', 1732387200000, 'unitPrice', 170);
updateItem('custom', 1732387300000, 'desc', 'New Description');
```

**Remove Item:**
```javascript
// removeItem(categoryId, itemId)
removeItem('foh', 1732387200000);
```

### Access Calculations
```javascript
// Category subtotals
const fohSubtotal = totals.categoryTotals['foh'];

// Overall totals
const preTaxTotal = totals.grandTotal;
const taxAmount = totals.tax;
const finalTotal = totals.totalWithTax;

// Budget variance (positive = under, negative = over)
const budgetVariance = totals.variance;
const isOverBudget = totals.variance < 0;
```

---

##  Category IDs Reference

Default categories have static IDs. New categories get dynamic IDs based on timestamp.

| ID Type | Example | Description |
|---------|---------|-------------|
| **Static** | `foh` | Front of House \| Furniture & Equipment |
| **Static** | `custom` | Custom Fixtures, Millwork & Lighting |
| **Static** | `wayfinding` | Wayfinding & Environmental Graphics |
| **Static** | `exterior` | Exterior Patio & Accessories |
| **Static** | `fees` | Project Fees & Jobsite Logistics |
| **Dynamic** | `cat_1732401234567` | Created via "Add Section" button |

---

##  Line Item Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | number | Unique identifier (timestamp) | `1732387200000` |
| `mfr` | string | Manufacturer/vendor name | "Industry West" |
| `desc` | string | Item description | "Dining Chairs - Main Hall" |
| `dimensions` | string | Item dimensions | "22\"W x 24\"D" |
| `qty` | number | Quantity | `50` |
| `unitPrice` | number | Cost per unit | `170.00` |
| `leadTime` | string | Estimated lead time | "8 Weeks" |
| `notes` | string | Additional notes | "Walnut Finish" |

---

##  Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Save/Open not working** | Browser support | Use Chrome, Edge, or Opera. Firefox/Safari lack full File System API support. |
| **"Unsaved Changes"** | State tracking | The app tracks all edits. Save your work before closing or refreshing. |
| **Print Layout** | CSS Media Query | Ensure "Background graphics" is enabled in print dialog. |

