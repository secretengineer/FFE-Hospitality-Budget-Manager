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

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

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

// --- Main Application ---

// RENAME: The component name must be App to match the standard Vite/React export structure.
export default function App() { 
  // --- State Management ---
  
  const [projectInfo, setProjectInfo] = useState({
    name: "Project Name",
    address: "project address goes here, city, state, zip code",
    date: new Date().toISOString().split('T')[0],
    client: "Development Group LLC",
    allowance: 750000,
    salesTaxRate: 10.25,
    // NEW BRANDING FIELDS
    companyName: "Pat Ryan Things LLC.",
    companyAddress: "1521 Syracuse St, Denver, CO 80220",
    companyPhone: "303 434 4595",
    companyEmail: "pat@patryan.com",
    logoUrl: "https://placehold.co/72x72/0A6EBD/FFFFFF?text=DSG", // Placeholder Logo
  });

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

  // --- Calculations ---

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totals = useMemo(() => {
    let grandTotal = 0;
    const categoryTotals = {};

    categories.forEach(cat => {
      const catSum = cat.items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
      categoryTotals[cat.id] = catSum;
      grandTotal += catSum;
    });

    const tax = grandTotal * (projectInfo.salesTaxRate / 100);
    const totalWithTax = grandTotal + tax;
    const variance = projectInfo.allowance - totalWithTax;

    return { categoryTotals, grandTotal, tax, totalWithTax, variance };
  }, [categories, projectInfo.allowance, projectInfo.salesTaxRate]);


  // --- Event Handlers ---

  const handleProjectUpdate = (field, value) => {
    setProjectInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateItem = (catId, itemId, field, value) => {
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

  const addItem = (catId) => {
    const newItem = {
      id: Date.now(),
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

  const removeItem = (catId, itemId) => {
    // IMPORTANT: Using console logging instead of window.confirm()
    console.log(`Attempting to remove item ${itemId} from category ${catId}`);
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 print:bg-white pb-20">
      
      {/* Top Navigation Bar */}
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
        
        {/* Header Section: Branding + Project Info */}
        <Card className="mb-8 p-6 print:shadow-none print:border-none print:p-0">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            
            {/* 1. Company Branding (Left Column) */}
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

            {/* 2. Project Details (Right Columns) */}
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

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

          <Card className="p-5 border-l-4 border-gray-400">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">FF&E Subtotal</div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(totals.grandTotal)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Before Tax</div>
          </Card>

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

        {/* Budget Categories */}
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
                      {category.items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs">{index + 1}</td>
                          <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 font-medium text-gray-900 placeholder-gray-300"
                              value={item.mfr}
                              onChange={(e) => updateItem(category.id, item.id, 'mfr', e.target.value)}
                              placeholder="Mfr Name"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-gray-900 placeholder-gray-300"
                              value={item.desc}
                              onChange={(e) => updateItem(category.id, item.id, 'desc', e.target.value)}
                              placeholder="Item Description"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-gray-600 placeholder-gray-300"
                              value={item.dimensions}
                              onChange={(e) => updateItem(category.id, item.id, 'dimensions', e.target.value)}
                              placeholder='Dimensions'
                            />
                          </td>
                           <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-gray-600 placeholder-gray-300"
                              value={item.leadTime}
                              onChange={(e) => updateItem(category.id, item.id, 'leadTime', e.target.value)}
                              placeholder='L/T'
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input 
                              type="number"
                              className="w-full bg-blue-50/50 border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-center font-bold text-gray-900"
                              value={item.qty}
                              onChange={(e) => updateItem(category.id, item.id, 'qty', parseFloat(e.target.value) || 0)}
                            />
                          </td>
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
                          <td className="px-4 py-3 text-right font-medium text-gray-900 bg-gray-50/50">
                            {formatCurrency(item.qty * item.unitPrice)}
                          </td>
                           <td className="px-4 py-2">
                            <input 
                              className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-xs p-1 text-gray-500 italic placeholder-gray-300"
                              value={item.notes}
                              onChange={(e) => updateItem(category.id, item.id, 'notes', e.target.value)}
                              placeholder="Finish / Note"
                            />
                          </td>
                          <td className="px-4 py-2 text-center print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => removeItem(category.id, item.id)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-gray-50 p-3 border-t border-gray-100 print:hidden">
                  <button 
                    onClick={() => addItem(category.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition px-2 py-1 rounded"
                  >
                    <Plus size={16} /> Add {category.title.split('|')[0]} Item
                  </button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Footer / Terms */}
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
      
      {/* Print Styles Injection for Footer and Page Numbering */}
      <style>{`
        @media print {
          /* Setup the @page rule to define margins and print footer content */
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