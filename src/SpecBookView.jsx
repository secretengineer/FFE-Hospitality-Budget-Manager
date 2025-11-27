import React from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Layout, 
  MapPin, 
  Calendar, 
  FileText,
  Image as ImageIcon,
  Edit,
  Layers,
  Paperclip,
  Download,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';
import { useState } from 'react';

/**
 * SpecBookView Component
 * Renders the project data as a formal Specification Book / Catalog.
 * Designed for printing with one item per page.
 */
const SpecBookView = ({ projectInfo, categories, onBack, onEditItem }) => {
  const [visibleColumns, setVisibleColumns] = useState({
    mfr: true,
    dimensions: true,
    qty: true,
    unitPrice: true,
    leadTime: true,
    status: false,
    notes: true
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  /**
   * Triggers a download of the attachment file.
   * This allows the user to open it with their system default application.
   */
  const openAttachment = (att) => {
    const link = document.createElement('a');
    link.href = att.dataUrl;
    link.download = att.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Flatten all items to a single list for easier iteration if needed, 
  // but iterating by category preserves structure.
  // We will iterate categories -> items.

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 pb-20">
      
      {/* Navigation Bar - Hidden on Print */}
      <div className="bg-slate-900 text-white shadow-lg print:hidden sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <ArrowLeft size={20} />
              <span>Back to Budget</span>
            </button>
            <div className="h-6 w-px bg-gray-700"></div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Layers className="text-blue-400" />
              Specification Book
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 transition px-3 py-2 rounded-md text-sm font-semibold"
              >
                <Settings size={16} /> View Options
              </button>
              
              {showColumnMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50 text-gray-800 dark:text-gray-100">
                  <div className="text-xs font-bold text-gray-500 uppercase px-2 py-1 mb-1">Toggle Columns</div>
                  {[
                    { key: 'mfr', label: 'Manufacturer' },
                    { key: 'dimensions', label: 'Dimensions' },
                    { key: 'qty', label: 'Quantity' },
                    { key: 'unitPrice', label: 'Unit Price' },
                    { key: 'leadTime', label: 'Lead Time' },
                    { key: 'status', label: 'Status' },
                    { key: 'notes', label: 'Finish / Notes' }
                  ].map(col => (
                    <button
                      key={col.key}
                      onClick={() => toggleColumn(col.key)}
                      className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span>{col.label}</span>
                      {visibleColumns[col.key] ? <Eye size={14} className="text-blue-600" /> : <EyeOff size={14} className="text-gray-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-md text-sm font-semibold shadow-sm"
            >
              <Printer size={16} /> Print Spec Book
            </button>
          </div>
        </div>
      </div>

      {/* Document Container */}
      <div className="max-w-[297mm] mx-auto my-8 bg-white text-black shadow-2xl print:shadow-none print:m-0 print:w-full print:max-w-none">
        
        {/* ================= COVER PAGE ================= */}
        <div className="min-h-[210mm] p-12 flex flex-col relative break-after-page print:break-after-page print:min-h-[90vh]">
          
          {/* Header / Logo Area */}
          <div className="flex justify-between items-start mb-12">
            <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-lg">
              {projectInfo.logoUrl ? (
                <img src={projectInfo.logoUrl} alt="Company Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <Layout size={48} className="text-gray-300" />
              )}
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900">{projectInfo.companyName}</h2>
              <p className="text-gray-600 text-sm">{projectInfo.companyAddress}</p>
              <p className="text-gray-600 text-sm">{projectInfo.companyPhone}</p>
              <p className="text-gray-600 text-sm">{projectInfo.companyEmail}</p>
            </div>
          </div>

          {/* Title Area */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
              FF&E<br/>
              SPECIFICATION<br/>
              BOOK
            </h1>
            <div className="w-24 h-2 bg-blue-600 mb-8"></div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{projectInfo.name}</h3>
            <div className="flex items-center gap-2 text-lg text-gray-600 mb-1">
              <MapPin size={18} />
              {projectInfo.address}
            </div>
            <div className="flex items-center gap-2 text-lg text-gray-600">
              <Calendar size={18} />
              {new Date(projectInfo.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Footer Area */}
          <div className="border-t-2 border-gray-100 pt-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Prepared For</h4>
                <p className="text-base font-semibold">{projectInfo.client}</p>
              </div>
              <div className="text-right">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Project Status</h4>
                <p className="text-base font-semibold">Budget & Specification Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SPEC SHEETS ================= */}
        <div className="p-8 print:p-6">
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              {/* Category Header */}
              <div className="mb-4 mt-6 border-b-2 border-gray-900 pb-2 break-inside-avoid">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 uppercase tracking-wide">
                  <span>{category.title}</span>
                </h2>
              </div>
              
              <div className="space-y-4">
                {category.items.map((item, index) => {
                  // Find primary image (first image attachment)
                  const primaryImage = item.specs?.attachments?.find(att => att.type.startsWith('image/'));
                  // Find document attachments (PDFs, etc.)
                  const documents = item.specs?.attachments?.filter(att => !att.type.startsWith('image/')) || [];
                  
                  const refId = `${category.id.substring(0, 3).toUpperCase()}-${String(index + 1).padStart(3, '0')}`;
                  
                  // CONDENSED LAYOUT (No Image)
                  if (!primaryImage) {
                    return (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm print:shadow-none break-inside-avoid relative group">
                        {/* Edit Button */}
                        <button 
                          onClick={() => onEditItem(item, category.id)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                          title="Edit Specifications"
                        >
                          <Edit size={14} />
                        </button>

                        <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-2">
                          <span className="font-mono font-bold text-sm text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {refId}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900">{item.desc}</h3>
                          <span className="text-sm text-gray-500 font-medium ml-auto">{item.mfr || 'Manufacturer TBD'}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          {/* Specs Column */}
                          <div className="md:col-span-4 space-y-1 text-sm">
                            {visibleColumns.dimensions && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Dimensions</span>
                                <span className="font-medium text-gray-900 text-right">{item.dimensions || '-'}</span>
                              </div>
                            )}
                            {visibleColumns.qty && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Quantity</span>
                                <span className="font-medium text-gray-900 text-right">{item.qty}</span>
                              </div>
                            )}
                            {visibleColumns.unitPrice && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Unit Price</span>
                                <span className="font-medium text-gray-900 text-right">${item.unitPrice?.toLocaleString()}</span>
                              </div>
                            )}
                            {visibleColumns.leadTime && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Lead Time</span>
                                <span className="font-medium text-gray-900 text-right">{item.leadTime || '-'}</span>
                              </div>
                            )}
                            {visibleColumns.status && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                                <span className="font-medium text-gray-900 text-right">{item.status || '-'}</span>
                              </div>
                            )}
                          </div>

                          {/* Description & Notes Column */}
                          <div className="md:col-span-8 text-sm">
                            {item.notes && (
                              <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-100">
                                <span className="font-bold text-gray-700 text-xs uppercase mr-2">Note:</span>
                                <span className="text-gray-800">{item.notes}</span>
                              </div>
                            )}
                            
                            {item.specs?.detailedDescription && (
                              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {item.specs.detailedDescription}
                              </div>
                            )}
                            
                            {/* Attached Documents List */}
                            {documents.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-gray-100 border-dashed">
                                <div className="flex flex-wrap gap-2">
                                  {documents.map((doc, i) => (
                                    <button
                                      key={i}
                                      onClick={() => openAttachment(doc)}
                                      className="flex items-center gap-1.5 text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group/doc"
                                    >
                                      <Paperclip size={10} className="text-gray-400" />
                                      <span className="font-medium text-gray-700 group-hover/doc:text-blue-700 truncate max-w-[150px]">{doc.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // FULL LAYOUT (With Image) - Compacted
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm print:shadow-none break-inside-avoid flex flex-col md:flex-row relative group">
                      {/* Edit Button */}
                      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                        <button 
                          onClick={() => onEditItem(item, category.id)}
                          className="bg-white/90 hover:bg-blue-50 text-blue-600 p-1.5 rounded shadow-sm border border-gray-200"
                          title="Edit Specifications"
                        >
                          <Edit size={14} />
                        </button>
                      </div>

                      {/* Image Section - Fixed width on desktop/print */}
                      <div className="w-full md:w-48 print:w-48 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-3 flex flex-col items-center justify-start flex-shrink-0">
                        <div className="aspect-square w-full relative flex items-center justify-center bg-white rounded border border-gray-200 p-1 mb-2">
                          <img src={primaryImage.dataUrl} alt={item.desc} className="max-w-full max-h-full object-contain" />
                        </div>
                        {/* Thumbnails if multiple */}
                        {item.specs?.attachments?.length > 1 && (
                          <div className="grid grid-cols-3 gap-1 w-full">
                            {item.specs.attachments.filter(a => a !== primaryImage).slice(0, 3).map((att, i) => (
                              <button 
                                key={i} 
                                onClick={() => openAttachment(att)}
                                className="aspect-square border border-gray-200 bg-white rounded flex items-center justify-center overflow-hidden hover:border-blue-500 transition-colors"
                              >
                                {att.type.startsWith('image/') ? (
                                  <img src={att.dataUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <FileText size={10} className="text-gray-400" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-4 flex flex-col">
                        <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sm text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              {refId}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900">{item.desc}</h3>
                          </div>
                          <p className="text-sm text-gray-500 font-medium">
                            {visibleColumns.mfr ? (item.mfr || 'Manufacturer TBD') : ''}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                          {/* Specs Column (approx 1/3) */}
                          <div className="md:col-span-4 space-y-1 text-sm border-r border-gray-100 pr-4">
                            {visibleColumns.dimensions && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Dimensions</span>
                                <span className="font-medium text-gray-900 text-right">{item.dimensions || '-'}</span>
                              </div>
                            )}
                            {visibleColumns.qty && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Quantity</span>
                                <span className="font-medium text-gray-900 text-right">{item.qty}</span>
                              </div>
                            )}
                            {visibleColumns.unitPrice && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Unit Price</span>
                                <span className="font-medium text-gray-900 text-right">${item.unitPrice?.toLocaleString()}</span>
                              </div>
                            )}
                            {visibleColumns.leadTime && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Lead Time</span>
                                <span className="font-medium text-gray-900 text-right">{item.leadTime || '-'}</span>
                              </div>
                            )}
                            {visibleColumns.status && (
                              <div className="flex justify-between border-b border-gray-50 py-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                                <span className="font-medium text-gray-900 text-right">{item.status || '-'}</span>
                              </div>
                            )}
                            {visibleColumns.notes && item.notes && (
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Finish / Notes</span>
                                <span className="block font-medium text-gray-900 bg-gray-50 p-2 rounded text-xs">{item.notes}</span>
                              </div>
                            )}
                          </div>

                          {/* Description Column (approx 2/3) */}
                          <div className="md:col-span-8 flex flex-col">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Specifications</h4>
                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap flex-1">
                              {item.specs?.detailedDescription || 'No detailed specifications provided.'}
                            </div>

                            {/* Attached Documents List */}
                            {documents.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-gray-100 border-dashed">
                                <div className="flex flex-wrap gap-2">
                                  {documents.map((doc, i) => (
                                    <button
                                      key={i}
                                      onClick={() => openAttachment(doc)}
                                      className="flex items-center gap-1.5 text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group/doc"
                                    >
                                      <Paperclip size={10} className="text-gray-400" />
                                      <span className="font-medium text-gray-700 group-hover/doc:text-blue-700 truncate max-w-[150px]">{doc.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SpecBookView;
