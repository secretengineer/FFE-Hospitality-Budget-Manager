# Data Structures Reference

This document describes the data structures used throughout the FF&E Budget Manager application.

## Type Definitions

### ProjectInfo
Stores all project-specific information and company branding details.

```typescript
type ProjectInfo = {
  // Project Details
  name: string;              // Project name/title
  address: string;           // Project location/address
  date: string;              // Project date (ISO format: YYYY-MM-DD)
  client: string;            // Client/developer name
  allowance: number;         // Total budget allowance in USD
  salesTaxRate: number;      // Tax rate as percentage (e.g., 10.25)
  
  // Company Branding
  companyName: string;       // Your company name
  companyAddress: string;    // Your company address
  companyPhone: string;      // Your company phone number
  companyEmail: string;      // Your company email
  logoUrl: string;           // URL to company logo image
}
```

**Example:**
```javascript
{
  name: "Grand Hotel Renovation",
  address: "123 Main St, Denver, CO 80202",
  date: "2025-11-23",
  client: "Luxury Hotels Inc.",
  allowance: 750000,
  salesTaxRate: 10.25,
  companyName: "Pat Ryan Things LLC.",
  companyAddress: "1521 Syracuse St, Denver, CO 80220",
  companyPhone: "303 434 4595",
  companyEmail: "pat@patryan.com",
  logoUrl: "https://example.com/logo.png"
}
```

---

### Category
Represents a budget category grouping related FF&E items.

```typescript
type Category = {
  id: string;                      // Unique identifier (e.g., 'foh', 'custom')
  title: string;                   // Display title for the category
  icon: LucideIcon;                // Icon component from lucide-react
  color: string;                   // Tailwind color class (e.g., 'text-blue-600')
  items: LineItem[];               // Array of line items in this category
}
```

**Example:**
```javascript
{
  id: 'foh',
  title: 'Front of House | Furniture & Equipment',
  icon: Armchair,
  color: 'text-blue-600',
  items: [...]
}
```

**Available Category IDs:**
- `foh` - Front of House
- `custom` - Custom Fixtures, Millwork & Lighting
- `wayfinding` - Wayfinding & Environmental Graphics
- `exterior` - Exterior Patio & Accessories
- `fees` - Project Fees & Jobsite Logistics

---

### LineItem
Represents an individual FF&E item with all specifications and pricing.

```typescript
type LineItem = {
  id: number;                // Unique identifier (typically timestamp)
  mfr: string;               // Manufacturer or vendor name
  desc: string;              // Item description
  dimensions: string;        // Physical dimensions or specifications
  qty: number;               // Quantity ordered (must be >= 0)
  unitPrice: number;         // Price per unit in USD (must be >= 0)
  leadTime: string;          // Expected delivery/production time
  notes: string;             // Additional notes (finish, color, special instructions)
}
```

**Example:**
```javascript
{
  id: 1732387200000,
  mfr: 'Industry West',
  desc: 'Dining Chairs - Main Hall',
  dimensions: '22"W x 24"D',
  qty: 50,
  unitPrice: 170,
  leadTime: '8 Weeks',
  notes: 'Walnut Finish'
}
```

**Field Guidelines:**
- **mfr**: Keep concise, use standard manufacturer abbreviations
- **desc**: Be specific, include location/use case
- **dimensions**: Use standard formats (e.g., '24"W x 18"D x 36"H')
- **qty**: Whole or decimal numbers allowed
- **unitPrice**: Enter without dollar sign or commas
- **leadTime**: Be realistic, use 'In Stock' for immediate availability
- **notes**: Include finish, color, material, or special requirements

---

### Totals
Calculated budget totals, memoized for performance.

```typescript
type Totals = {
  categoryTotals: Record<string, number>;  // Subtotal for each category (keyed by category.id)
  grandTotal: number;                       // Sum of all items (pre-tax)
  tax: number;                             // Calculated tax amount
  totalWithTax: number;                    // Grand total including tax
  variance: number;                        // Difference between allowance and totalWithTax
                                          // Positive = under budget, Negative = over budget
}
```

**Example:**
```javascript
{
  categoryTotals: {
    foh: 20700,
    custom: 47200,
    wayfinding: 5900,
    exterior: 10300,
    fees: 23000
  },
  grandTotal: 107100,
  tax: 10977.75,
  totalWithTax: 118077.75,
  variance: 631922.25  // Positive = under budget
}
```

**Calculations:**
- `categoryTotals[catId]` = Σ(item.qty × item.unitPrice) for all items in category
- `grandTotal` = Σ(all categoryTotals)
- `tax` = grandTotal × (salesTaxRate / 100)
- `totalWithTax` = grandTotal + tax
- `variance` = allowance - totalWithTax

---

## State Management

### Primary State Variables

```javascript
const [projectInfo, setProjectInfo] = useState<ProjectInfo>({...});
const [categories, setCategories] = useState<Category[]>([...]);
const totals = useMemo(() => {...}, [categories, projectInfo.allowance, projectInfo.salesTaxRate]);
```

### State Update Functions

#### handleProjectUpdate(field: string, value: any)
Updates a field in the `projectInfo` object.
- Validates numeric fields (allowance, salesTaxRate)
- Prevents invalid values from being set

#### updateItem(catId: string, itemId: number, field: string, value: any)
Updates a specific field of a line item.
- Validates numeric fields (qty, unitPrice)
- Immutably updates nested state

#### addItem(catId: string)
Adds a new line item to specified category.
- Uses timestamp as unique ID
- Initializes with default values

#### removeItem(catId: string, itemId: number)
Removes a line item from specified category.
- Logs action for audit trail
- Filters item from category's items array

---

## Data Flow

```
User Input
    ↓
Event Handler (handleProjectUpdate, updateItem, etc.)
    ↓
State Update (setProjectInfo, setCategories)
    ↓
React Re-render
    ↓
Totals Recalculation (useMemo)
    ↓
Updated UI Display
```

---

## Validation Rules

### Numeric Fields
All numeric fields must be:
- Non-negative (≥ 0)
- Valid numbers (not NaN)
- Parsed as floats for decimals

**Validated Fields:**
- `projectInfo.allowance`
- `projectInfo.salesTaxRate`
- `item.qty`
- `item.unitPrice`

### String Fields
String fields have no specific validation but should follow conventions:
- Non-empty for critical fields (name, desc)
- Properly formatted for dates (YYYY-MM-DD)
- Valid URLs for logoUrl

---

## Performance Considerations

### Memoization
The `totals` object is memoized with `useMemo` to prevent unnecessary recalculations.

**Recalculates only when:**
- Categories array changes (item added/removed/updated)
- Project allowance changes
- Sales tax rate changes

**Does NOT recalculate when:**
- Project name, address, or branding changes
- UI interactions that don't affect calculations

### State Updates
All state updates use functional setState to ensure they're working with the latest state:

```javascript
setProjectInfo(prev => ({ ...prev, [field]: value }));
```

This prevents race conditions and ensures consistency.

---

## Best Practices

### Adding New Fields

1. **To ProjectInfo:**
   ```javascript
   // In initial state
   const [projectInfo, setProjectInfo] = useState({
     // ... existing fields
     newField: 'default value',
   });
   
   // Add validation if numeric in handleProjectUpdate
   ```

2. **To LineItem:**
   ```javascript
   // In categories initial state
   items: [
     {
       // ... existing fields
       newField: 'default value',
     }
   ]
   
   // Add to addItem function
   const newItem = {
     // ... existing fields
     newField: '',
   };
   
   // Add validation if numeric in updateItem
   ```

3. **To Category:**
   ```javascript
   // Simply add to categories array
   {
     id: 'new-category',
     title: 'New Category Name',
     icon: NewIcon,
     color: 'text-color-600',
     items: []
   }
   ```

### Data Persistence
Currently, state is session-only. To add persistence:

```javascript
// Save to localStorage
useEffect(() => {
  localStorage.setItem('budgetData', JSON.stringify({
    projectInfo,
    categories
  }));
}, [projectInfo, categories]);

// Load from localStorage
useEffect(() => {
  const saved = localStorage.getItem('budgetData');
  if (saved) {
    const { projectInfo, categories } = JSON.parse(saved);
    setProjectInfo(projectInfo);
    setCategories(categories);
  }
}, []);
```

---

## Common Patterns

### Accessing Data

```javascript
// Get specific category
const category = categories.find(cat => cat.id === 'foh');

// Get specific item
const item = category.items.find(item => item.id === itemId);

// Calculate category total
const total = category.items.reduce((sum, item) => 
  sum + (item.qty * item.unitPrice), 0
);

// Check if over budget
const isOverBudget = totals.variance < 0;

// Format value as currency
const formatted = formatCurrency(1234.56); // "$1,235"
```

### Updating Data

```javascript
// Update project field
handleProjectUpdate('name', 'New Project Name');

// Update item field
updateItem('foh', 123456789, 'qty', 25);

// Add new item
addItem('custom');

// Remove item
removeItem('wayfinding', 987654321);
```

---

## Troubleshooting

### Invalid Values Not Updating
Check console for validation warnings. Numeric fields reject:
- Negative numbers
- Non-numeric strings
- NaN values

### Totals Not Recalculating
Ensure you're updating state immutably:
```javascript
// ✅ Correct
setCategories(prev => prev.map(cat => ...));

// ❌ Wrong
categories[0].items[0].qty = 10;
setCategories(categories);
```

### Items Not Appearing
Verify:
1. Item has unique ID
2. Item is in correct category
3. Category is rendering (check categories array)

---

## References

- [React useState Hook](https://react.dev/reference/react/useState)
- [React useMemo Hook](https://react.dev/reference/react/useMemo)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
- [Tailwind CSS](https://tailwindcss.com/docs)
