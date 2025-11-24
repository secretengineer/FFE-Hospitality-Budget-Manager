# FF&E Hospitality BudgetBuilder™

A modern, interactive web application for managing Furniture, Fixtures, and Equipment (FF&E) budgets for hospitality projects. Built with React and Vite for optimal performance and developer experience.

## Features

### 📊 Budget Management
- **Real-time budget tracking** with automatic calculation of totals, tax, and variance
- **Multi-category organization** for different FF&E types (Front of House, Custom Fixtures, Wayfinding, Exterior, Fees)
- **Line-item detail tracking** including manufacturer, dimensions, quantity, pricing, lead time, and notes
- **Configurable tax rates** for accurate cost projections
- **Budget variance visualization** with color-coded indicators (green = under budget, red = over budget)

### 📝 Project Information
- Editable project details (name, address, client, date)
- Customizable company branding (logo, name, address, contact info)
- Professional document formatting for client presentations

### 💾 Save & Load Documents
- **Save to local filesystem** with native file picker dialog
- **Reopen saved documents** for continued editing
- **Automatic unsaved changes detection** with warning prompts
- **Custom .ffe file format** (JSON-based) for easy portability
- **Save As functionality** to create copies with different names/locations

### 🖨️ Print & Export
- **Print-optimized layout** with automatic page formatting
- **Professional PDF generation** via browser print dialog
- **Automatic page numbering** with project information in footer
- Clean, print-friendly styling that hides interactive elements

### 🎨 User Interface
- Intuitive, spreadsheet-like editing experience
- Inline editing for all fields
- Color-coded category sections with custom icons
- Responsive design for desktop and tablet use
- Hover effects and visual feedback for better UX

## Technology Stack

- **React 19.2** - Modern UI component library
- **Vite 7.2** - Lightning-fast build tool and dev server
- **Tailwind CSS** (via utility classes) - Utility-first styling
- **Lucide React** - Beautiful, customizable icons
- **ESLint** - Code quality and consistency

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FFE-Hospitality-Budget-Manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build production-ready application
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Usage Guide

### Adding Line Items
1. Navigate to the desired category section
2. Click the "Add [Category] Item" button at the bottom of the table
3. Fill in the item details (manufacturer, description, dimensions, qty, price, etc.)
4. Totals update automatically

### Editing Information
- Click any field to edit inline
- Numeric fields (quantity, price, tax rate) validate input automatically
- Changes are reflected in real-time throughout the document

### Deleting Items
- Hover over a line item row
- Click the trash icon that appears in the rightmost column
- Item is removed immediately

### Printing/PDF Export
1. Click the "Print / Save PDF" button in the top navigation
2. In the print dialog:
   - Choose "Save as PDF" as the destination
   - Select appropriate paper size (A4 recommended)
   - Ensure "Background graphics" is enabled for proper styling
3. Save or print the document

### Saving & Loading Documents
1. **Creating a New Document**:
   - Click the "New" button in the top navigation
   - System will warn if you have unsaved changes
   - Document resets to default template

2. **Saving Your Work**:
   - Click "Save" to save to the current file (or choose location if first save)
   - Click "Save As" to save to a new location/filename
   - Files are saved with .ffe extension (JSON format)
   - Yellow asterisk (*) indicates unsaved changes

3. **Opening Saved Documents**:
   - Click "Open" button in the top navigation
   - Browse to your .ffe file
   - System will warn if current document has unsaved changes
   - Document loads with all project data preserved

4. **File Format**:
   - Files use .ffe extension (FFE Budget Files)
   - JSON format for easy data portability
   - Can be saved to any folder on your computer

### Customizing Company Branding
- Edit company name, address, phone, and email in the header section
- Update logo URL in the code or replace with your own hosted image
- All changes persist when you save the document

## Project Structure

```
FFE-Hospitality-Budget-Manager/
├── src/
│   ├── App.jsx          # Main application component with all logic
│   ├── App.css          # Application-specific styles (minimal, uses Tailwind)
│   ├── index.css        # Global styles and Tailwind imports
│   ├── main.jsx         # Application entry point
│   └── assets/          # Static assets (images, icons)
├── public/              # Public static files
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
└── README.md           # This file
```

## Code Architecture

### Component Structure
- **App Component** - Main application container managing all state
- **Card Component** - Reusable wrapper for content sections
- **SectionHeader Component** - Category headers with icons and subtotals

### State Management
- `projectInfo` - Stores project details and company branding
- `categories` - Array of budget categories with nested line items
- `totals` - Memoized calculations for performance optimization

### Key Functions
- `formatCurrency()` - Consistent currency formatting
- `handleProjectUpdate()` - Updates project information with validation
- `updateItem()` - Updates line items with input validation
- `addItem()` - Adds new line items to categories
- `removeItem()` - Removes line items from categories
- `handleNewDocument()` - Creates new document with confirmation
- `handleSave()` - Saves document using File System Access API
- `handleSaveAs()` - Saves document to new location
- `handleOpen()` - Opens saved .ffe files with validation

## Input Validation

The application includes built-in validation for:
- **Numeric fields** - Ensures positive numbers for prices, quantities, and rates
- **Invalid inputs** - Prevents state updates with invalid data
- **Console warnings** - Logs validation issues for debugging

## Customization

### Adding New Categories
Edit the `categories` state in `App.jsx`:
```javascript
{
  id: 'unique-id',
  title: 'Category Name',
  icon: IconComponent, // from lucide-react
  color: 'text-color-600', // Tailwind color class
  items: []
}
```

### Modifying Print Styles
Edit the `<style>` block at the bottom of `App.jsx` for print-specific CSS customization.

### Changing Default Values
Update the initial state values in `useState` declarations within `App.jsx`.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern browsers with ES6+ support

## Performance Considerations

- **useMemo** hook optimizes expensive calculations
- State updates are batched for efficiency
- Inline styles for print media avoid CSS file bloat
- Minimal re-renders through proper React patterns

## Browser Requirements

The save/load functionality uses the **File System Access API**, which requires:
- Chrome/Edge 86+ (recommended)
- Opera 72+
- **Not supported**: Firefox, Safari (as of Nov 2025)

For unsupported browsers, the save/load buttons will attempt to work but may show errors. Consider using Chrome or Edge for full functionality.

## Future Enhancements

Potential features for future development:
- Export to Excel/CSV
- Import from existing spreadsheets
- Multi-project management
- User authentication and cloud storage
- Collaborative editing
- Budget templates library
- Historical version tracking
- Fallback save methods for unsupported browsers

## Contributing

This is a template project. Feel free to fork and customize for your needs.

## License

Private project - All rights reserved

## Support

For questions or issues, contact Pat Ryan Things LLC at pat@patryan.com

---

**Built with ❤️ for hospitality professionals**
