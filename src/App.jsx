import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Plus, 
  Trash2, 
  Layout, 
  Armchair, 
  Lightbulb, 
  Signpost, 
  TreePine, 
  Briefcase 
} from 'lucide-react';

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

/**
 * Card Component
 * A reusable wrapper component that provides consistent styling for content containers.
 * Used throughout the application for visual grouping and hierarchy.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered inside the card
 * @param {string} props.className - Additional CSS classes to apply
 * @returns {JSX.Element} Styled card container
 */
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

/**
 * SectionHeader Component
 * Displays a header for budget category sections with an icon, title, and subtotal.
 * Provides visual distinction between different FF&E categories.
 * 
 * @param {Object} props - Component props
 * @param {React.Component} props.icon - Lucide icon component to display
 * @param {string} props.title - Section title text
 * @param {string} props.total - Formatted currency string for subtotal
 * @param {string} props.colorClass - Tailwind color class for theming
 * @returns {JSX.Element} Styled section header
 */
const SectionHeader = ({ icon: Icon, title, total, colorClass = "text-gray-800" }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 rounded-t-lg">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-md ${colorClass} bg-opacity-10`}>
        <Icon size={20} className={colorClass} />
      </div>
      <h3 className="font-bold text-lg text-gray-800 uppercase tracking-wide">{title}</h3>
    </div>
    <div className="text-right">
      <div className="text-xs text-gray-500 font-medium uppercase">Subtotal</div>
      <div className="font-bold text-xl font-mono">{total}</div>
    </div>
  </div>
);

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

/**
 * App Component
 * Main application component for the Hospitality FF&E Budget Manager.
 * Manages project information, budget categories, line items, and calculations.
 * 
 * Features:
 * - Real-time budget tracking with variance calculation
 * - Multi-category FF&E item management
 * - Editable project details and company branding
 * - Print-friendly layout with automatic page numbering
 * - Tax calculation with configurable rates
 * 
 * @returns {JSX.Element} Complete budget management application
 */
export default function App() { 
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Project Information State
   * Stores all project-specific details including client info, budget allowance,
   * and company branding information for document headers.
   */
  const [projectInfo, setProjectInfo] = useState({
    // Project Details
    name: "Project Name",
    address: "project address goes here, city, state, zip code",
    date: new Date().toISOString().split('T')[0],
    client: "Development Group LLC",
    allowance: 750000, // Total budget allowance in USD
    salesTaxRate: 10.25, // Tax rate as percentage (e.g., 10.25%)
    
    // Company Branding
    companyName: "Pat Ryan Things LLC.",
    companyAddress: "1521 Syracuse St, Denver, CO 80220",
    companyPhone: "303 434 4595",
    companyEmail: "pat@patryan.com",
    logoUrl: "https://placehold.co/72x72/0A6EBD/FFFFFF?text=DSG", // Placeholder logo URL
  });

  /**
   * Budget Categories State
   * Organizes FF&E items into logical categories with associated icons and colors.
   * Each category contains an array of line items with detailed specifications.
   * 
   * Category Structure:
   * - id: Unique identifier for the category
   * - title: Display name for the category section
   * - icon: Lucide icon component for visual representation
   * - color: Tailwind color class for theming
   * - items: Array of line items within this category
   * 
   * Item Structure:
   * - id: Unique identifier for the line item
   * - mfr: Manufacturer or vendor name
   * - desc: Item description
   * - dimensions: Physical dimensions or specifications
   * - qty: Quantity ordered
   * - unitPrice: Price per unit in USD
   * - leadTime: Expected delivery or production time
   * - notes: Additional information (finish, color, special instructions)
   */
  const [categories, setCategories] = useState([
    {
      id: 'foh',
      title: 'Front of House | Furniture & Equipment',
      icon: Armchair,
      color: 'text-blue-600',
      items: [
        { id: 1, mfr: 'Industry West', desc: 'Dining Chairs - Main Hall', dimensions: '22"W x 24"D', qty: 50, unitPrice: 170, leadTime: '8 Weeks', notes: 'Walnut Finish' },
        { id: 2, mfr: 'Grand Rapids', desc: 'Bar Stools - Central Bar', dimensions: '18" Round', qty: 46, unitPrice: 225, leadTime: '10 Weeks', notes: 'Leather Seat' },
        { id: 3, mfr: 'Custom', desc: 'Community Tables', dimensions: '120"L x 40"W', qty: 4, unitPrice: 2500, leadTime: '12 Weeks', notes: 'Reclaimed Oak' },
      ]
    },
    {
      id: 'custom',
      title: 'Custom Fixtures, Millwork & Lighting',
      icon: Lightbulb,
      color: 'text-amber-600',
      items: [
        { id: 4, mfr: 'Fabricator A', desc: 'Motor Row Parts Sculpture', dimensions: 'Variable', qty: 1, unitPrice: 18000, leadTime: '16 Weeks', notes: 'Suspended Ceiling Mount' },
        { id: 5, mfr: 'MetalWorks', desc: 'Decorative Railing w/ Finish', dimensions: '140 LF', qty: 1, unitPrice: 22000, leadTime: '12 Weeks', notes: 'Perforated Infill' },
        { id: 6, mfr: 'LuxeLight', desc: 'Oversized Dome Pendants', dimensions: '48" Dia', qty: 6, unitPrice: 1200, leadTime: '14 Weeks', notes: 'Brass Interior' },
      ]
    },
    {
      id: 'wayfinding',
      title: 'Wayfinding & Environmental Graphics',
      icon: Signpost,
      color: 'text-purple-600',
      items: [
        { id: 7, mfr: 'SignPro', desc: 'Vendor Stall Headers', dimensions: '48" x 12"', qty: 12, unitPrice: 450, leadTime: '4 Weeks', notes: 'Illuminated' },
        { id: 8, mfr: 'SignPro', desc: 'Restroom Directional', dimensions: '12" x 12"', qty: 4, unitPrice: 125, leadTime: '2 Weeks', notes: 'Vinyl on Acrylic' },
      ]
    },
    {
      id: 'exterior',
      title: 'Exterior Patio & Accessories',
      icon: TreePine,
      color: 'text-emerald-600',
      items: [
        { id: 9, mfr: 'Fermob', desc: 'Bistro Tables', dimensions: '24" Round', qty: 15, unitPrice: 340, leadTime: 'In Stock', notes: 'Poppy Red' },
        { id: 10, mfr: 'Fermob', desc: 'Folding Chairs', dimensions: 'Standard', qty: 30, unitPrice: 120, leadTime: 'In Stock', notes: 'Metal' },
        { id: 11, mfr: 'PlanterCo', desc: 'Dividing Planters', dimensions: '48"L x 18"W', qty: 8, unitPrice: 650, leadTime: '3 Weeks', notes: 'Cortens Steel' },
      ]
    },
    {
      id: 'fees',
      title: 'Project Fees & Jobsite Logistics',
      icon: Briefcase,
      color: 'text-gray-600',
      items: [
        { id: 12, mfr: 'Internal', desc: 'Project Management Fee', dimensions: 'N/A', qty: 200, unitPrice: 85, leadTime: 'Ongoing', notes: 'Est Hours' },
        { id: 13, mfr: 'Logistics Co', desc: 'Receiving & Assembly', dimensions: 'N/A', qty: 1, unitPrice: 13000, leadTime: 'N/A', notes: 'White glove' },
        { id: 14, mfr: 'Travel', desc: 'Site Visits / Travel', dimensions: 'N/A', qty: 1, unitPrice: 6000, leadTime: 'N/A', notes: 'Flight + Hotel' },
      ]
    }
  ]);

  // ============================================================================
  // UTILITY FUNCTIONS & CALCULATIONS
  // ============================================================================

  /**
   * Format Currency Helper
   * Converts numeric values to USD currency format without decimal places.
   * Uses the browser's built-in Intl.NumberFormat for localization.
   * 
   * @param {number} val - Numeric value to format
   * @returns {string} Formatted currency string (e.g., "$1,234")
   */
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  /**
   * Budget Totals Calculation
   * Memoized calculation of all budget totals to optimize performance.
   * Recalculates only when categories, allowance, or tax rate changes.
   * 
   * Calculations:
   * - categoryTotals: Sum of items within each category
   * - grandTotal: Sum of all categories (pre-tax)
   * - tax: Calculated tax based on salesTaxRate
   * - totalWithTax: Grand total including tax
   * - variance: Difference between allowance and total (positive = under budget)
   * 
   * @returns {Object} Object containing all calculated totals
   */
  const totals = useMemo(() => {
    let grandTotal = 0;
    const categoryTotals = {};

    // Calculate subtotal for each category
    categories.forEach(cat => {
      const catSum = cat.items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
      categoryTotals[cat.id] = catSum;
      grandTotal += catSum;
    });

    // Calculate tax and final totals
    const tax = grandTotal * (projectInfo.salesTaxRate / 100);
    const totalWithTax = grandTotal + tax;
    const variance = projectInfo.allowance - totalWithTax;

    return { categoryTotals, grandTotal, tax, totalWithTax, variance };
  }, [categories, projectInfo.allowance, projectInfo.salesTaxRate]);


  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Update Project Information
   * Updates a specific field in the project information state.
   * Uses functional setState to ensure we're working with latest state.
   * Includes validation for numeric fields to prevent invalid data.
   * 
   * @param {string} field - The field name to update in projectInfo
   * @param {any} value - The new value to set
   */
  const handleProjectUpdate = (field, value) => {
    // Validate numeric fields
    if (field === 'allowance' || field === 'salesTaxRate') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        console.warn(`Invalid ${field} value: ${value}. Must be a positive number.`);
        return; // Don't update with invalid value
      }
    }
    
    setProjectInfo(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Update Line Item
   * Updates a specific field of a line item within a category.
   * Immutably updates the nested state structure.
   * Includes validation for numeric fields (qty, unitPrice).
   * 
   * @param {string} catId - Category ID containing the item
   * @param {number} itemId - Line item ID to update
   * @param {string} field - Field name to update in the item
   * @param {any} value - New value to set
   */
  const updateItem = (catId, itemId, field, value) => {
    // Validate numeric fields for line items
    if (field === 'qty' || field === 'unitPrice') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        console.warn(`Invalid ${field} for item ${itemId}: ${value}. Must be a positive number.`);
        return; // Don't update with invalid value
      }
    }
    
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, [field]: value };
        })
      };
    }));
  };

  /**
   * Add New Line Item
   * Adds a new empty line item to the specified category.
   * Uses timestamp as unique ID to prevent collisions.
   * 
   * @param {string} catId - Category ID to add the item to
   */
  const addItem = (catId) => {
    const newItem = {
      id: Date.now(), // Using timestamp as unique ID
      mfr: '',
      desc: 'New Item',
      dimensions: '',
      qty: 1,
      unitPrice: 0,
      leadTime: '',
      notes: ''
    };
    
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: [...cat.items, newItem] };
    }));
  };

  /**
   * Remove Line Item
   * Removes a line item from a category.
   * Logs the action for debugging purposes.
   * 
   * @param {string} catId - Category ID containing the item
   * @param {number} itemId - Line item ID to remove
   */
  const removeItem = (catId, itemId) => {
    // Log removal action for audit trail
    console.log(`Removing item ${itemId} from category ${catId}`);
    
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
    }));
  };

  /**
   * Handle Print Action
   * Triggers the browser's print dialog for PDF generation or printing.
   * CSS print styles are applied automatically via @media print rules.
   */
  const handlePrint = () => {
    window.print();
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 print:bg-white pb-20">
      
      {/* ===== TOP NAVIGATION BAR ===== */}
      {/* Hidden when printing, provides app branding and print functionality */}
      <div className="bg-slate-900 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layout className="text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight">Hospitality FF&E Manager</h1>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-md text-sm font-semibold"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        
        {/* ===== HEADER SECTION ===== */}
        {/* Company branding and project information displayed at top of document */}
        <Card className="mb-8 p-6 print:shadow-none print:border-none print:p-0">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            
            {/* Company Branding Column (Left) */}
            {/* Displays company logo, name, address, and contact information */}
            <div className="flex flex-col gap-1 w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-8 pb-4 lg:pb-0">
              <img 
                src={projectInfo.logoUrl} 
                alt={`${projectInfo.companyName} Logo`}
                className="w-[72px] h-[72px] object-contain mb-2 rounded-lg border border-gray-100" 
              />
              <input 
                type="text" 
                value={projectInfo.companyName} 
                onChange={(e) => handleProjectUpdate('companyName', e.target.value)}
                className="text-xl font-bold text-gray-900 border-none focus:ring-0 p-0 placeholder-gray-300 bg-transparent"
                placeholder="Company Name"
              />
              <input 
                type="text" 
                value={projectInfo.companyAddress} 
                onChange={(e) => handleProjectUpdate('companyAddress', e.target.value)}
                className="text-sm text-gray-600 border-none focus:ring-0 p-0 resize-none bg-transparent"
                placeholder="Company Address"
              />
              <div className="text-sm text-gray-600 mt-1">
                <input 
                    type="text" 
                    value={projectInfo.companyPhone} 
                    onChange={(e) => handleProjectUpdate('companyPhone', e.target.value)}
                    className="text-sm text-gray-600 border-none focus:ring-0 p-0 resize-none bg-transparent"
                    placeholder="Phone"
                /> | 
                <input 
                    type="email" 
                    value={projectInfo.companyEmail} 
                    onChange={(e) => handleProjectUpdate('companyEmail', e.target.value)}
                    className="text-sm text-gray-600 border-none focus:ring-0 p-0 resize-none bg-transparent"
                    placeholder="Email"
                />
              </div>
            </div>

            {/* Project Details Columns (Right) */}
            {/* Editable fields for project name, client, date, and location */}
            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Project Name</label>
                  <input 
                    type="text" 
                    value={projectInfo.name} 
                    onChange={(e) => handleProjectUpdate('name', e.target.value)}
                    className="w-full text-3xl font-bold text-gray-900 border-none focus:ring-0 p-0 placeholder-gray-300 bg-transparent"
                    placeholder="Project Name"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Client</label>
                        <input 
                        type="text" 
                        value={projectInfo.client} 
                        onChange={(e) => handleProjectUpdate('client', e.target.value)}
                        className="w-full text-sm font-medium text-gray-700 border-b border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-1 bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</label>
                        <input 
                        type="date" 
                        value={projectInfo.date} 
                        onChange={(e) => handleProjectUpdate('date', e.target.value)}
                        className="w-full text-sm font-medium text-gray-700 border-b border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-1 bg-transparent"
                        />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location / Address</label>
                  <textarea 
                    value={projectInfo.address} 
                    onChange={(e) => handleProjectUpdate('address', e.target.value)}
                    rows={3}
                    className="w-full text-lg text-gray-600 border-none focus:ring-0 p-0 resize-none bg-transparent"
                    placeholder="Project Address"
                  />
                </div>
            </div>
          </div>
        </Card>

        {/* ===== DASHBOARD SUMMARY ===== */}
        {/* Four-card dashboard showing key budget metrics at a glance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Budget Allowance Card - Editable total budget */}
          <Card className="p-5 border-l-4 border-blue-500">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Budget Allowance</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-lg">$</span>
              <input 
                type="number"
                value={projectInfo.allowance}
                onChange={(e) => handleProjectUpdate('allowance', parseFloat(e.target.value))}
                className="text-2xl font-bold text-gray-800 w-full border-none focus:ring-0 p-0 bg-transparent"
              />
            </div>
          </Card>

          {/* FF&E Subtotal Card - Calculated from all line items (pre-tax) */}
          <Card className="p-5 border-l-4 border-gray-400">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">FF&E Subtotal</div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(totals.grandTotal)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Before Tax</div>
          </Card>

          {/* Tax Card - Shows calculated tax with editable rate */}
          <Card className="p-5 border-l-4 border-gray-400">
            <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Est. Tax Total</div>
                <div className="flex items-center gap-1">
                    <input 
                        type="number" 
                        value={projectInfo.salesTaxRate}
                        onChange={(e) => handleProjectUpdate('salesTaxRate', parseFloat(e.target.value))}
                        className="w-12 text-xs text-right border-none p-0 bg-gray-100 rounded focus:ring-0"
                    />
                    <span className="text-xs text-gray-500">%</span>
                </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(totals.tax)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total w/ Tax: {formatCurrency(totals.totalWithTax)}</div>
          </Card>

          {/* Budget Variance Card - Shows over/under budget status with color coding */}
          {/* Green background = under budget, Red background = over budget */}
          <Card className={`p-5 border-l-4 ${totals.variance >= 0 ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${totals.variance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              Budget Variance
            </div>
            <div className={`text-2xl font-bold ${totals.variance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {totals.variance >= 0 ? '+' : ''}{formatCurrency(totals.variance)}
            </div>
            <div className={`text-xs font-medium mt-1 ${totals.variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totals.variance >= 0 ? 'Under Budget' : 'Over Budget'}
            </div>
          </Card>
        </div>

        {/* ===== BUDGET CATEGORIES ===== */}
        {/* Iterates through all categories to display line item tables */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="break-inside-avoid">
              <Card className="overflow-hidden">
                <SectionHeader 
                  icon={category.icon} 
                  title={category.title} 
                  total={formatCurrency(totals.categoryTotals[category.id])} 
                  colorClass={category.color}
                />
                
                {/* Line Items Table */}
                {/* Responsive table with inline editing for all item fields */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase text-xs tracking-wider font-semibold">
                        <th className="px-4 py-3 w-10">#</th>
                        <th className="px-4 py-3 w-32">Manufacturer</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3 w-32">Dimensions</th>
                        <th className="px-4 py-3 w-24">Lead Time</th>
                        <th className="px-4 py-3 w-20 text-center">Qty</th>
                        <th className="px-4 py-3 w-28 text-right">Unit Price</th>
                        <th className="px-4 py-3 w-28 text-right">Total</th>
                        <th className="px-4 py-3 w-40">Notes</th>
                        <th className="px-4 py-3 w-10 print:hidden"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {/* Map through each line item in category */}
                      {category.items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                          {/* Row number (1-indexed for user readability) */}
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs">{index + 1}</td>
                          {/* Manufacturer/Vendor field */}
                          <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 font-medium text-gray-900 placeholder-gray-300"
                              value={item.mfr}
                              onChange={(e) => updateItem(category.id, item.id, 'mfr', e.target.value)}
                              placeholder="Mfr Name"
                            />
                          </td>
                          {/* Item description field */}
                          <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-gray-900 placeholder-gray-300"
                              value={item.desc}
                              onChange={(e) => updateItem(category.id, item.id, 'desc', e.target.value)}
                              placeholder="Item Description"
                            />
                          </td>
                          {/* Dimensions field */}
                          <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-gray-600 placeholder-gray-300"
                              value={item.dimensions}
                              onChange={(e) => updateItem(category.id, item.id, 'dimensions', e.target.value)}
                              placeholder='Dimensions'
                            />
                          </td>
                          {/* Lead time field */}
                          <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-gray-600 placeholder-gray-300"
                              value={item.leadTime}
                              onChange={(e) => updateItem(category.id, item.id, 'leadTime', e.target.value)}
                              placeholder='L/T'
                            />
                          </td>
                          {/* Quantity field - highlighted with blue background */}
                          <td className="px-4 py-2">
                            <input 
                              type="number"
                              className="w-full bg-blue-50/50 border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-center font-bold text-gray-900"
                              value={item.qty}
                              onChange={(e) => updateItem(category.id, item.id, 'qty', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          {/* Unit price field with dollar sign prefix */}
                          <td className="px-4 py-2">
                            <div className="relative">
                                <span className="absolute left-1 top-1 text-gray-400 text-xs">$</span>
                                <input 
                                type="number"
                                className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 pl-4 text-right text-gray-600"
                                value={item.unitPrice}
                                onChange={(e) => updateItem(category.id, item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                          </td>
                          {/* Calculated total for this line (qty × unit price) */}
                          <td className="px-4 py-3 text-right font-medium text-gray-900 bg-gray-50/50">
                            {formatCurrency(item.qty * item.unitPrice)}
                          </td>
                          {/* Notes field - for finish, color, or special instructions */}
                          <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-xs p-1 text-gray-500 italic placeholder-gray-300"
                              value={item.notes}
                              onChange={(e) => updateItem(category.id, item.id, 'notes', e.target.value)}
                              placeholder="Finish / Note"
                            />
                          </td>
                          {/* Delete button - appears on hover, hidden when printing */}
                          <td className="px-4 py-2 text-center print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => removeItem(category.id, item.id)}
                              className="text-gray-400 hover:text-red-500 transition"
                              aria-label="Delete item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Add Item Button - Hidden when printing */}
                <div className="bg-gray-50 p-3 border-t border-gray-100 print:hidden">
                  <button 
                    onClick={() => addItem(category.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition px-2 py-1 rounded"
                    aria-label={`Add item to ${category.title}`}
                  >
                    <Plus size={16} /> Add {category.title.split('|')[0]} Item
                  </button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* ===== FOOTER / TERMS & CONDITIONS ===== */}
        {/* Document footer with standard terms and generation timestamp */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-gray-500 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold uppercase tracking-wider mb-2 text-xs">Terms & Conditions</h4>
              <p className="mb-2">1. Estimates are valid for 30 days from date of issue.</p>
              <p className="mb-2">2. Freight and delivery charges are estimated and will be billed at actual cost.</p>
              <p>3. A 50% deposit is required to initiate orders.</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <div className="text-right">
                <p className="italic">Generated via Pat Ryan Things LLC Budget Tool</p>
                <p className="font-bold text-gray-900 mt-1">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* ===== PRINT STYLES ===== */}
      {/* Inline styles for print media - controls page layout, margins, and footer content */}
      <style>{`
        @media print {
          /* Configure print page settings with margins and automatic footer content */}
          @page {
              size: A4 portrait;
              margin: 2.54cm 1.5cm 2.54cm 1.5cm; /* T R B L margins */

              /* Page Numbering: Centered at the bottom */
              @bottom-center {
                  content: "Page " counter(page) " of " counter(pages);
                  font-size: 10pt;
                  color: #6b7280; /* text-gray-500 */
                  border-top: 1px solid #e5e7eb; /* border-gray-200 */
                  padding-top: 5pt;
              }
              
              /* Project Name: Bottom Left */
              @bottom-left {
                  content: "Project: ${projectInfo.name}";
                  font-size: 10pt;
                  color: #1f2937; /* text-gray-800 */
                  font-weight: bold;
              }

              /* Date: Bottom Right */
              @bottom-right {
                  content: "Date: ${projectInfo.date}";
                  font-size: 10pt;
                  color: #6b7280; /* text-gray-500 */
              }
          }
          
          body { -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:bg-white { background-color: white !important; }
          input, textarea { border: none !important; padding: 0 !important; }
          
          input[type="number"]::-webkit-inner-spin-button, 
          input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
        }
      `}</style>
    </div>
  );
}