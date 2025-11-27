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
      <div className="max-w-[210mm] mx-auto my-8 bg-white text-black shadow-2xl print:shadow-none print:m-0 print:w-full print:max-w-none">
        
        {/* ================= COVER PAGE ================= */}
        <div className="min-h-[297mm] p-[20mm] flex flex-col relative break-after-page print:break-after-page">
          
          {/* Header / Logo Area */}
          <div className="flex justify-between items-start mb-20">
            <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-lg">
              {projectInfo.logoUrl ? (
                <img src={projectInfo.logoUrl} alt="Company Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <Layout size={48} className="text-gray-300" />
              )}
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900">{projectInfo.companyName}</h2>
              <p className="text-gray-600">{projectInfo.companyAddress}</p>
              <p className="text-gray-600">{projectInfo.companyPhone}</p>
              <p className="text-gray-600">{projectInfo.companyEmail}</p>
            </div>
          </div>

          {/* Title Area */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
              FF&E<br/>
              SPECIFICATION<br/>
              BOOK
            </h1>
            <div className="w-24 h-2 bg-blue-600 mb-8"></div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{projectInfo.name}</h3>
            <div className="flex items-center gap-2 text-xl text-gray-600 mb-1">
              <MapPin size={20} />
              {projectInfo.address}
            </div>
            <div className="flex items-center gap-2 text-xl text-gray-600">
              <Calendar size={20} />
              {new Date(projectInfo.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Footer Area */}
          <div className="border-t-2 border-gray-100 pt-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Prepared For</h4>
                <p className="text-lg font-semibold">{projectInfo.client}</p>
              </div>
              <div className="text-right">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Project Status</h4>
                <p className="text-lg font-semibold">Budget & Specification Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SPEC SHEETS ================= */}
        <div className="p-[15mm]">
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              {/* Category Header - Starts on new page if needed, but tries to stay with content */}
              <div className="mb-6 mt-8 border-b-2 border-gray-900 pb-2 break-inside-avoid">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  {/* Render category icon if available (passed as prop or imported) - simplified here */}
                  <span>{category.title}</span>
                </h2>
              </div>
              
              <div className="space-y-8">
                {category.items.map((item, index) => {
                  // Find primary image (first image attachment)
                  const primaryImage = item.specs?.attachments?.find(att => att.type.startsWith('image/'));
                  // Find document attachments (PDFs, etc.)
                  const documents = item.specs?.attachments?.filter(att => !att.type.startsWith('image/')) || [];
                  
                  const refId = `${category.id.substring(0, 3).toUpperCase()}-${String(index + 1).padStart(3, '0')}`;
                  
                  // CONDENSED LAYOUT (No Image)
                  if (!primaryImage) {
                    return (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm print:shadow-none break-inside-avoid relative group">
                        {/* Edit Button */}
                        <button 
                          onClick={() => onEditItem(item, category.id)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                          title="Edit Specifications"
                        >
                          <Edit size={16} />
                        </button>

                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono font-bold text-lg text-blue-600 dark:text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {refId}
                              </span>
                              <h3 className="text-xl font-bold text-gray-900">{item.desc}</h3>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">{item.mfr || 'Manufacturer TBD'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 bg-gray-50 p-4 rounded-md border border-gray-100">
                          {visibleColumns.mfr && (
                            <div>
                              <span className="block text-xs font-semibold text-gray-500 uppercase">Manufacturer</span>
                              <span className="font-medium text-gray-900">{item.mfr || 'TBD'}</span>
                            </div>
                          )}
                          {visibleColumns.dimensions && (
                            <div>
                              <span className="block text-xs font-semibold text-gray-500 uppercase">Dimensions</span>
                              <span className="font-medium text-gray-900">{item.dimensions || '-'}</span>
                            </div>
                          )}
                          {visibleColumns.qty && (
                            <div>
                              <span className="block text-xs font-semibold text-gray-500 uppercase">Quantity</span>
                              <span className="font-medium text-gray-900">{item.qty}</span>
                            </div>
                          )}
                          {visibleColumns.unitPrice && (
                            <div>
                              <span className="block text-xs font-semibold text-gray-500 uppercase">Unit Price</span>
                              <span className="font-medium text-gray-900">${item.unitPrice?.toLocaleString()}</span>
                            </div>
                          )}
                          {visibleColumns.leadTime && (
                            <div>
                              <span className="block text-xs font-semibold text-gray-500 uppercase">Lead Time</span>
                              <span className="font-medium text-gray-900">{item.leadTime || '-'}</span>
                            </div>
                          )}
                          {visibleColumns.status && (
                            <div>
                              <span className="block text-xs font-semibold text-gray-500 uppercase">Status</span>
                              <span className="font-medium text-gray-900">{item.status || '-'}</span>
                            </div>
                          )}
                        </div>

                        {(visibleColumns.notes && (item.notes || item.specs?.detailedDescription || documents.length > 0)) && (
                          <div className="text-sm text-gray-700 border-t border-gray-100 pt-3 mt-3">
                            {item.notes && (
                              <p className="mb-2"><span className="font-semibold text-gray-900">Notes:</span> {item.notes}</p>
                            )}
                            {item.specs?.detailedDescription && (
                              <p className="whitespace-pre-wrap text-gray-600 mb-3">{item.specs.detailedDescription}</p>
                            )}
                            
                            {/* Attached Documents List */}
                            {documents.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100 border-dashed">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                  <Paperclip size={12} /> Attached Documents
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {documents.map((doc, i) => (
                                    <button
                                      key={i}
                                      onClick={() => openAttachment(doc)}
                                      className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group/doc text-left w-full"
                                      title={`Open ${doc.name}`}
                                    >
                                      <FileText size={14} className="text-red-500 flex-shrink-0" />
                                      <span className="truncate font-medium text-gray-700 group-hover/doc:text-blue-700">{doc.name}</span>
                                      <span className="text-gray-400 text-xs ml-auto whitespace-nowrap">{(doc.size / 1024).toFixed(0)} KB</span>
                                      <Download size={12} className="text-gray-400 opacity-0 group-hover/doc:opacity-100 transition-opacity" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // FULL LAYOUT (With Image) - Compacted
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm print:shadow-none break-inside-avoid flex flex-col md:flex-row relative group">
                      {/* Edit Button */}
                      <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                        <button 
                          onClick={() => openAttachment(primaryImage)}
                          className="bg-white/90 hover:bg-blue-50 text-blue-600 p-2 rounded-full shadow-sm"
                          title="Open/Download Image"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={() => onEditItem(item, category.id)}
                          className="bg-white/90 hover:bg-blue-50 text-blue-600 p-2 rounded-full shadow-sm"
                          title="Edit Specifications"
                        >
                          <Edit size={16} />
                        </button>
                      </div>

                      {/* Image Section - Fixed width on desktop/print */}
                      <div className="w-full md:w-1/3 print:w-1/3 bg-gray-100 border-b md:border-b-0 md:border-r border-gray-200 p-4 flex flex-col items-center justify-center">
                        <div className="aspect-square w-full relative flex items-center justify-center bg-white rounded border border-gray-200 p-2">
                          <img src={primaryImage.dataUrl} alt={item.desc} className="max-w-full max-h-full object-contain" />
                        </div>
                        {/* Thumbnails if multiple */}
                        {item.specs?.attachments?.length > 1 && (
                          <div className="flex gap-2 mt-2 overflow-x-auto w-full py-1">
                            {item.specs.attachments.filter(a => a !== primaryImage).slice(0, 3).map((att, i) => (
                              <button 
                                key={i} 
                                onClick={() => openAttachment(att)}
                                className="w-12 h-12 flex-shrink-0 border border-gray-200 bg-white rounded flex items-center justify-center overflow-hidden hover:border-blue-500 transition-colors"
                                title={att.name}
                              >
                                {att.type.startsWith('image/') ? (
                                  <img src={att.dataUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <FileText size={12} className="text-gray-400" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono font-bold text-lg text-blue-600 dark:text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {refId}
                              </span>
                              <h3 className="text-xl font-bold text-gray-900">{item.desc}</h3>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">
                              {visibleColumns.mfr ? (item.mfr || 'Manufacturer TBD') : ''}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-6">
                          {visibleColumns.dimensions && (
                            <div className="flex justify-between border-b border-gray-100 py-1">
                              <span className="text-gray-500">Dimensions</span>
                              <span className="font-medium text-gray-900 text-right">{item.dimensions || '-'}</span>
                            </div>
                          )}
                          {visibleColumns.qty && (
                            <div className="flex justify-between border-b border-gray-100 py-1">
                              <span className="text-gray-500">Quantity</span>
                              <span className="font-medium text-gray-900 text-right">{item.qty}</span>
                            </div>
                          )}
                          {visibleColumns.unitPrice && (
                            <div className="flex justify-between border-b border-gray-100 py-1">
                              <span className="text-gray-500">Unit Price</span>
                              <span className="font-medium text-gray-900 text-right">${item.unitPrice?.toLocaleString()}</span>
                            </div>
                          )}
                          {visibleColumns.leadTime && (
                            <div className="flex justify-between border-b border-gray-100 py-1">
                              <span className="text-gray-500">Lead Time</span>
                              <span className="font-medium text-gray-900 text-right">{item.leadTime || '-'}</span>
                            </div>
                          )}
                          {visibleColumns.status && (
                            <div className="flex justify-between border-b border-gray-100 py-1">
                              <span className="text-gray-500">Status</span>
                              <span className="font-medium text-gray-900 text-right">{item.status || '-'}</span>
                            </div>
                          )}
                          {visibleColumns.notes && (
                            <div className="col-span-2 flex justify-between border-b border-gray-100 py-1">
                              <span className="text-gray-500">Finish / Notes</span>
                              <span className="font-medium text-gray-900 text-right">{item.notes || '-'}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Specifications</h4>
                          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-6 mb-3">
                            {item.specs?.detailedDescription || 'No detailed specifications provided.'}
                          </div>

                          {/* Attached Documents List */}
                          {documents.length > 0 && (
                            <div className="pt-3 border-t border-gray-100 border-dashed">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Paperclip size={12} /> Attached Documents
                              </h4>
                              <div className="space-y-1">
                                {documents.map((doc, i) => (
                                  <button
                                    key={i}
                                    onClick={() => openAttachment(doc)}
                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-1 rounded -ml-1 transition-colors w-full text-left group/doc"
                                    title={`Open ${doc.name}`}
                                  >
                                    <FileText size={14} className="text-red-500 flex-shrink-0" />
                                    <span className="truncate font-medium">{doc.name}</span>
                                    <span className="text-gray-400 text-xs ml-auto whitespace-nowrap">{(doc.size / 1024).toFixed(0)} KB</span>
                                    <Download size={12} className="text-gray-400 opacity-0 group-hover/doc:opacity-100 transition-opacity ml-2" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
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
