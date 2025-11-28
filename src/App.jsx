import React, { useState, useMemo, useEffect } from 'react';
import {
  Printer,
  Plus,
  Trash2,
  Layout,
  Armchair,
  Lightbulb,
  Signpost,
  TreePine,
  Briefcase,
  Save,
  FolderOpen,
  FileText,
  Moon,
  Sun,
  Settings,
  X,
  ArrowUp,
  ArrowDown,
  Copy,
  Image,
  Paperclip,
  ExternalLink,
  Book,
  Eye,
  EyeOff,
  Menu,
  FileSpreadsheet,
  Sparkles,
  Loader2,
  Search
} from 'lucide-react';
import SpecBookView from './SpecBookView';
import SettingsModal from './SettingsModal';
import PricingPopover from './PricingPopover';
import { generateSpecFromImage, findPrice } from './services/ai';

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
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 print:bg-white print:border-gray-200 print:shadow-none ${className}`}>
    {children}
  </div>
);

/**
 * SectionHeader Component
 * Displays a header for budget category sections with an icon, title, and subtotal.
 * Provides visual distinction between different FF&E categories.
 * Now includes inline editing for title and delete functionality.
 * 
 * @param {Object} props - Component props
 * @param {React.Component} props.icon - Lucide icon component to display
 * @param {string} props.title - Section title text
 * @param {string} props.total - Formatted currency string for subtotal
 * @param {string} props.colorClass - Tailwind color class for theming
 * @param {Function} props.onTitleChange - Callback when title is edited
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @returns {JSX.Element} Styled section header
 */
const SectionHeader = ({ icon: Icon, title, total, colorClass = "text-gray-800", onTitleChange, onDelete }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 rounded-t-lg print:bg-gray-50 print:border-gray-200 print:text-black">
    <div className="flex items-center gap-3 flex-1">
      <div className={`p-2 rounded-md ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon size={20} className={colorClass} />
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
        className="font-bold text-lg text-gray-800 dark:text-gray-100 uppercase tracking-wide bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 flex-1 print:text-black"
        style={{ outline: 'none' }}
      />
      {onDelete && (
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 print:hidden"
          title="Delete Section"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
    <div className="text-right">
      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase print:text-gray-600">Subtotal</div>
      <div className="font-bold text-xl font-mono text-gray-900 dark:text-white print:text-black">{total}</div>
    </div>
  </div>
);

/**
 * AutoResizeTextarea Component
 * A textarea that automatically adjusts its height to fit content.
 * Used for table cells to prevent content truncation.
 */
const AutoResizeTextarea = ({ value, onChange, placeholder, className, style, ...props }) => {
  const textareaRef = React.useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`resize-none overflow-hidden ${className} print:text-black print:placeholder-transparent`}
      style={{ ...style, minHeight: '32px' }}
      rows={1}
      {...props}
    />
  );
};

/**
 * ConfirmationModal Component
 * A custom modal dialog for confirming user actions.
 * Replaces the native window.confirm() for a more consistent UI.
 */
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 print:hidden">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * SpecEditorModal Component
 * Modal for editing detailed specifications for a line item.
 * Supports rich text description and file attachments.
 */
const SpecEditorModal = ({ isOpen, onClose, item, categoryId, onSave }) => {
  const [detailedDescription, setDetailedDescription] = useState(item.specs?.detailedDescription || '');
  const [attachments, setAttachments] = useState(item.specs?.attachments || []);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateSpec = async () => {
    // Find the first image attachment
    const imageAttachment = attachments.find(att => att.type.startsWith('image/'));

    if (!imageAttachment) {
      alert('Please upload an image first to generate specifications.');
      return;
    }

    const apiKey = localStorage.getItem('ffe_gemini_key');
    if (!apiKey) {
      alert('Please configure your Gemini API Key in Settings first.');
      return;
    }

    setIsGenerating(true);
    try {
      const spec = await generateSpecFromImage(imageAttachment.dataUrl, apiKey);
      setDetailedDescription(prev => prev ? `${prev}\n\n--- AI Generated ---\n${spec}` : spec);
    } catch (error) {
      alert(`Error generating spec: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave(categoryId, item.id, {
      detailedDescription,
      attachments
    });
    onClose();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: event.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 print:hidden">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Item Specifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.mfr} - {item.desc}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Detailed Description */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Detailed Description
              </label>
              <button
                onClick={handleGenerateSpec}
                disabled={isGenerating || attachments.length === 0}
                className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                title="Generate description from uploaded image"
              >
                {isGenerating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                {isGenerating ? 'Analyzing...' : 'Auto-Fill with AI'}
              </button>
            </div>
            <textarea
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter detailed product specifications, materials, finishes, special requirements, installation notes, etc."
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Attachments
            </label>
            <div className="space-y-3">
              {/* Upload Button */}
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition bg-gray-50 dark:bg-gray-700/50">
                <Paperclip size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Photos or Documents</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {attachments.map(att => (
                    <div key={att.id} className="relative group border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-blue-500 transition">
                      {att.type.startsWith('image/') ? (
                        <img src={att.dataUrl} alt={att.name} className="w-full h-32 object-cover rounded mb-2" />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
                          <FileText size={48} className="text-gray-400" />
                        </div>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{att.name}</p>
                      <p className="text-xs text-gray-400">{(att.size / 1024).toFixed(1)} KB</p>
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Save size={16} />
            Save Specifications
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STATUS MANAGEMENT COMPONENTS
// ============================================================================

const STATUS_CONFIG = {
  'Draft': { color: 'bg-gray-300 border-gray-400', label: 'Draft' },
  'Approved': { color: 'bg-blue-500 border-blue-600', label: 'Approved' },
  'In Progress': { color: 'bg-amber-400 border-amber-500', label: 'In Progress' },
  'Received': { color: 'bg-purple-500 border-purple-600', label: 'Received' },
  'Installed': { color: 'bg-emerald-500 border-emerald-600', label: 'Installed' }
};

const StatusLegend = () => (
  <div className="flex flex-wrap gap-6 justify-end mb-8 px-2 print:mb-4">
    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
      <div key={key} className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${config.color} shadow-sm ring-1 ring-white dark:ring-gray-800`}></div>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{config.label}</span>
      </div>
    ))}
  </div>
);

const StatusSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentConfig = STATUS_CONFIG[value] || STATUS_CONFIG['Draft'];

  return (
    <div className="relative flex justify-center" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        title={`Current Status: ${currentConfig.label}`}
      >
        <div className={`w-4 h-4 rounded-full ${currentConfig.color} shadow-sm ring-1 ring-white dark:ring-gray-800`}></div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => {
                onChange(key);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${value === key ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
              <span className={`text-gray-700 dark:text-gray-200 ${value === key ? 'font-semibold' : ''}`}>{config.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
    companyWebsite: "www.patryan.com",
    logoUrl: "src/assets/PRThingsTempLogo.png", // Placeholder logo URL

    // Terms & Conditions
    terms: [
      "1. Estimates are valid for 30 days from date of issue.",
      "2. Freight and delivery charges are estimated and will be billed at actual cost.",
      "3. A formal quote and proposal will be provided. This is a preliminary budgeting tool only."
    ]
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
   * - status: Item status (Draft, Approved, In Progress, Received)
   * - notes: Additional information (finish, color, special instructions)
   */
  const [categories, setCategories] = useState([
    {
      id: 'foh',
      title: 'Front of House | Furniture & Equipment',
      icon: Armchair,
      color: 'text-blue-600',
      items: [
        { id: Date.now(), mfr: '', desc: '', dimensions: '', qty: 0, unitPrice: 0, leadTime: '', status: 'Draft', isTaxable: false, notes: '', specs: { detailedDescription: '', attachments: [] } }
      ]
    }
  ]);

  /**
   * File Handle State
   * Stores the file system handle for save operations (File System Access API).
   * Allows re-saving to the same file without showing the save dialog again.
   */
  const [fileHandle, setFileHandle] = useState(null);

  /**
   * Unsaved Changes State
   * Tracks whether the document has unsaved changes to prompt user before closing.
   */
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Spec Editor State
   * Controls which item is being edited in the specifications modal.
   */
  const [specEditorState, setSpecEditorState] = useState({ isOpen: false, item: null, categoryId: null });

  /**
   * View State
   * Controls the current view of the application.
   * 'welcome' - Initial launch screen
   * 'budget' - Main budget editor
   */
  const [currentView, setCurrentView] = useState('welcome');

  /**
   * Recent Draft State
   * Stores metadata about the auto-saved draft to show on welcome screen.
   */
  const [hasRecentDraft, setHasRecentDraft] = useState(false);
  const [draftInfo, setDraftInfo] = useState(null);

  /**
   * Last Auto-Save Time State
   * Tracks when the last auto-save occurred to display to the user.
   */
  const [lastAutoSave, setLastAutoSave] = useState(null);

  /**
   * Print Settings State
   * Controls the layout and formatting of the printed document.
   */
  const [printSettings, setPrintSettings] = useState({
    paperSize: 'letter', // 'letter', 'legal', 'tabloid', 'a4'
    orientation: 'landscape', // 'portrait', 'landscape'
    scale: 100,
    showFooter: true
  });

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  /**
   * Confirmation Modal State
   * Manages the visibility and content of the custom confirmation dialog.
   */
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  /**
   * Pricing Popover State
   */
  const [pricingPopover, setPricingPopover] = useState({
    isOpen: false,
    results: [],
    isLoading: false,
    position: { top: 0, left: 0 },
    targetItem: null // { categoryId, itemId }
  });

  const handlePriceSearch = async (e, categoryId, item) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();

    // Check for API keys
    const apiKey = localStorage.getItem('ffe_search_key');
    const cx = localStorage.getItem('ffe_search_engine_id');

    if (!apiKey || !cx) {
      alert('Please configure your Search API Key and Engine ID in Settings first.');
      setShowSettingsModal(true);
      return;
    }

    setPricingPopover({
      isOpen: true,
      results: [],
      isLoading: true,
      position: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },
      targetItem: { categoryId, itemId: item.id }
    });

    try {
      const query = `${item.mfr} ${item.desc} price`;
      const results = await findPrice(query, apiKey, cx);
      setPricingPopover(prev => ({ ...prev, isLoading: false, results }));
    } catch (error) {
      console.error(error);
      setPricingPopover(prev => ({ ...prev, isLoading: false, results: [] }));
      // Keep open to show empty/error state or just close?
      // For now, let the popover handle empty state
    }
  };

  const handlePriceSelect = (priceString) => {
    if (!pricingPopover.targetItem) return;

    // Extract number from string (e.g., "$1,234.00" -> 1234)
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));

    if (!isNaN(numericPrice)) {
      updateItem(pricingPopover.targetItem.categoryId, pricingPopover.targetItem.itemId, 'unitPrice', numericPrice);
    }

    setPricingPopover(prev => ({ ...prev, isOpen: false }));
  };

  /**
   * Dark Mode State
   * Manages application theme preference.
   * Persists to localStorage.
   */
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  /**
   * Main Menu State
   * Controls the visibility of the main application dropdown menu.
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Column Visibility State
   * Controls which columns are displayed in the main budget spreadsheet.
   */
  const [visibleColumns, setVisibleColumns] = useState({
    mfr: true,
    dimensions: true,
    leadTime: true,
    status: true,
    qty: true,
    unitPrice: true,
    total: true,
    tax: true,
    notes: true
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  // ============================================================================
  // EFFECT HOOKS
  // ============================================================================

  /**
   * Track Changes Effect
   * Marks document as having unsaved changes whenever state updates.
   * Ignores initial render by checking if this is the first update.
   */
  const isFirstRender = React.useRef(true);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setHasUnsavedChanges(true);
  }, [projectInfo, categories]);

  /**
   * Auto-save Effect
   * Saves current state to localStorage on every change.
   * Debounced to prevent excessive writes.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const stateToSave = {
        version: '1.0',
        savedAt: new Date().toISOString(),
        projectInfo,
        categories: categories.map(cat => ({
          id: cat.id,
          title: cat.title,
          color: cat.color,
          items: cat.items
        }))
      };
      localStorage.setItem('ffe_autosave', JSON.stringify(stateToSave));
      setLastAutoSave(new Date().toLocaleString()); // Update last auto-save time
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [projectInfo, categories]);

  /**
   * Recovery Effect
   * Checks for auto-saved data on mount.
   */
  useEffect(() => {
    const savedState = localStorage.getItem('ffe_autosave');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        const hasData = parsedState.categories.some(cat => cat.items.length > 0 && (cat.items[0].desc !== '' || cat.items.length > 1));

        if (hasData) {
          setHasRecentDraft(true);
          setDraftInfo({
            projectName: parsedState.projectInfo.name,
            lastSaved: new Date(parsedState.savedAt).toLocaleString()
          });
        }
      } catch (e) {
        console.error('Failed to parse auto-save data', e);
      }
    }
  }, []); // Run once on mount

  /**
   * Unsaved Changes Warning
   * Warns user before leaving page if there are unsaved changes.
   */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  /**
   * Dark Mode Effect
   * Updates the DOM and localStorage when theme changes.
   */
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

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
    let taxableTotal = 0;

    if (!categories || !Array.isArray(categories)) {
      return { categoryTotals, grandTotal, tax: 0, totalWithTax: 0, variance: 0 };
    }

    // Calculate subtotal for each category
    categories.forEach(cat => {
      if (!cat.items || !Array.isArray(cat.items)) {
        categoryTotals[cat.id] = 0;
        return;
      }

      const catSum = cat.items.reduce((sum, item) => {
        const itemTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
        if (item.isTaxable !== false) { // Default to true if undefined
          taxableTotal += itemTotal;
        }
        return sum + itemTotal;
      }, 0);
      categoryTotals[cat.id] = catSum;
      grandTotal += catSum;
    });

    // Calculate tax and final totals
    const rate = Number(projectInfo.salesTaxRate) || 0;
    const tax = taxableTotal * (rate / 100);
    const totalWithTax = grandTotal + tax;
    const variance = (Number(projectInfo.allowance) || 0) - totalWithTax;

    return { categoryTotals, grandTotal, tax, totalWithTax, variance };
  }, [categories, projectInfo.allowance, projectInfo.salesTaxRate]);


  // ============================================================================
  // FILE MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Create New Document
   * Resets all state to default values for a fresh document.
   * Prompts user if there are unsaved changes.
   */
  const handleNewDocument = () => {
    const executeNewDocument = () => {
      // Reset to default state
      setProjectInfo({
        name: "Project Name",
        address: "project address goes here, city, state, zip code",
        date: new Date().toISOString().split('T')[0],
        client: "Development Group LLC",
        allowance: 750000,
        salesTaxRate: 10.25,
        companyName: "Pat Ryan Things LLC.",
        companyAddress: "1521 Syracuse St, Denver, CO 80220",
        companyPhone: "303 434 4595",
        companyEmail: "pat@patryan.com",
        companyWebsite: "www.patryan.com",
        logoUrl: "src/assets/PRThingsTempLogo.png",
        terms: [
          "1. Estimates are valid for 30 days from date of issue.",
          "2. Freight and delivery charges are estimated and will be billed at actual cost.",
          "3. A formal quote and proposal will be provided. This is a preliminary budgeting tool only."
        ]
      });

      setCategories([
        {
          id: 'foh',
          title: 'Front of House | Furniture & Equipment',
          icon: Armchair,
          color: 'text-blue-600',
          items: [
            { id: Date.now(), mfr: '', desc: '', dimensions: '', qty: 0, unitPrice: 0, leadTime: '', status: 'Draft', isTaxable: false, notes: '', specs: { detailedDescription: '', attachments: [] } }
          ]
        }
      ]);

      setFileHandle(null);
      setHasUnsavedChanges(false);
      setCurrentView('budget');
      setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    };

    if (hasUnsavedChanges && currentView !== 'welcome') {
      setConfirmationModal({
        isOpen: true,
        title: 'Create New Document',
        message: 'You have unsaved changes. Are you sure you want to create a new document? Any unsaved progress will be lost.',
        onConfirm: executeNewDocument
      });
      return;
    }

    executeNewDocument();
  };

  /**
   * Save Document
   * Saves the current document state to a JSON file.
   * Uses File System Access API for native save dialog.
   * If file was previously saved, updates the same file.
   */
  const handleSave = async () => {
    try {
      let handle = fileHandle;

      // If no file handle exists, prompt for save location (Save As)
      if (!handle) {
        const projectName = projectInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        handle = await window.showSaveFilePicker({
          suggestedName: `${projectName}_budget.ffe`,
          types: [
            {
              description: 'FFE Budget Files',
              accept: { 'application/json': ['.ffe'] }
            }
          ]
        });
        setFileHandle(handle);
      }

      // Prepare document data (serialize categories by removing icon functions)
      const documentData = {
        version: '1.0',
        savedAt: new Date().toISOString(),
        projectInfo,
        categories: categories.map(cat => ({
          id: cat.id,
          title: cat.title,
          color: cat.color,
          items: cat.items
        }))
      };

      // Write to file
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(documentData, null, 2));
      await writable.close();

      setHasUnsavedChanges(false);
      alert('Document saved successfully!');
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        console.error('Save error:', error);
        alert('Failed to save document. Please try again.');
      }
    }
  };

  /**
   * Save As Document
   * Forces a save dialog even if file handle exists.
   * Allows user to save to a different location/name.
   */
  const handleSaveAs = async () => {
    try {
      const projectName = projectInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const handle = await window.showSaveFilePicker({
        suggestedName: `${projectName}_budget.ffe`,
        types: [
          {
            description: 'FFE Budget Files',
            accept: { 'application/json': ['.ffe'] }
          }
        ]
      });

      setFileHandle(handle);

      // Prepare document data
      const documentData = {
        version: '1.0',
        savedAt: new Date().toISOString(),
        projectInfo,
        categories: categories.map(cat => ({
          id: cat.id,
          title: cat.title,
          color: cat.color,
          items: cat.items
        }))
      };

      // Write to file
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(documentData, null, 2));
      await writable.close();

      setHasUnsavedChanges(false);
      alert('Document saved successfully!');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Save As error:', error);
        alert('Failed to save document. Please try again.');
      }
    }
  };

  /**
   * Process File Contents
   * Parses and loads the document data from JSON string.
   */
  const processFileContents = (contents, handle = null) => {
    try {
      const documentData = JSON.parse(contents);

      // Validate document structure
      if (!documentData.projectInfo || !documentData.categories) {
        throw new Error('Invalid file format');
      }

      // Icon mapping for reconstructing categories
      const iconMap = {
        'foh': { icon: Armchair, color: 'text-blue-600' },
        'custom': { icon: Lightbulb, color: 'text-amber-600' },
        'wayfinding': { icon: Signpost, color: 'text-purple-600' },
        'exterior': { icon: TreePine, color: 'text-emerald-600' },
        'fees': { icon: Briefcase, color: 'text-gray-600' }
      };

      // Reconstruct categories with icons and sanitize items
      const loadedCategories = (Array.isArray(documentData.categories) ? documentData.categories : []).map(cat => ({
        ...cat,
        icon: iconMap[cat.id]?.icon || Layout,
        color: cat.color || iconMap[cat.id]?.color || 'text-gray-600',
        // Sanitize items: ensure it's an array and flatten if nested (fix for previous bug)
        items: Array.isArray(cat.items)
          ? cat.items.flat().map(item => ({
            ...item,
            // Ensure numeric values are numbers
            qty: Number(item.qty) || 0,
            unitPrice: Number(item.unitPrice) || 0,
            isTaxable: item.isTaxable !== false, // Default to true
            // Add specs field for backward compatibility with old files
            specs: item.specs || { detailedDescription: '', attachments: [] }
          }))
          : []
      }));

      // Load data into state with backward compatibility
      const loadedProjectInfo = {
        ...documentData.projectInfo,
        // Add default terms if not present in old files
        terms: documentData.projectInfo.terms || [
          "1. Estimates are valid for 30 days from date of issue.",
          "2. Freight and delivery charges are estimated and will be billed at actual cost.",
          "3. A formal quote and proposal will be provided. This is a preliminary budgeting tool only."
        ]
      };

      setProjectInfo(loadedProjectInfo);
      setCategories(loadedCategories);
      setFileHandle(handle);
      setHasUnsavedChanges(false);
      setCurrentView('budget');
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Failed to parse document. Error: ${error.message}`);
    }
  };

  /**
   * Handle File Input Change
   * Fallback for browsers that don't support File System Access API.
   */
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      processFileContents(e.target.result, null);
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  /**
   * Open Document
   * Opens and loads a previously saved FFE budget file.
   * Uses File System Access API if available, otherwise falls back to file input.
   */
  const handleOpen = async () => {
    console.log('handleOpen called', { hasUnsavedChanges, currentView });
    
    const executeOpen = async () => {
      console.log('executeOpen called');
      setConfirmationModal(prev => ({ ...prev, isOpen: false }));

      try {
        // Check if File System Access API is supported
        if (typeof window.showOpenFilePicker === 'function') {
          // Show file picker
          const [handle] = await window.showOpenFilePicker({
            types: [
              {
                description: 'FFE Budget Files',
                accept: { 'application/json': ['.ffe'] }
              }
            ],
            multiple: false
          });

          // Read file contents
          const file = await handle.getFile();
          const contents = await file.text();
          processFileContents(contents, handle);

        } else {
          // Fallback to hidden file input
          console.log('File System Access API not supported, using fallback');
          fileInputRef.current?.click();
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Open error:', error);
          alert(`Failed to open document. Error: ${error.message}`);
        }
      }
    };

    if (hasUnsavedChanges && currentView !== 'welcome') {
      setConfirmationModal({
        isOpen: true,
        title: 'Open Document',
        message: 'You have unsaved changes. Are you sure you want to open a different document? Any unsaved progress will be lost.',
        onConfirm: executeOpen
      });
      return;
    }

    await executeOpen();
  };

  /**
   * Export to CSV
   * Generates a CSV file of the current budget and triggers a download.
   * Compatible with Excel and Google Sheets.
   */
  const handleExportCSV = () => {
    // Helper to escape CSV fields
    const escapeCSV = (str) => {
      if (str === null || str === undefined) return '';
      const stringValue = String(str);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Build CSV content
    let csvContent = [];

    // Project Header
    csvContent.push(['Project Budget Export']);
    csvContent.push(['Project Name', escapeCSV(projectInfo.name)]);
    csvContent.push(['Client', escapeCSV(projectInfo.client)]);
    csvContent.push(['Date', escapeCSV(projectInfo.date)]);
    csvContent.push(['Address', escapeCSV(projectInfo.address)]);
    csvContent.push([]); // Empty row

    // Column Headers
    const headers = ['Category', 'Vendor', 'Description', 'Dimensions', 'Qty', 'Unit Price', 'Total', 'Taxable', 'Lead Time', 'Status', 'Notes'];
    csvContent.push(headers);

    // Data Rows
    categories.forEach(cat => {
      cat.items.forEach(item => {
        const itemTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
        const row = [
          escapeCSV(cat.title),
          escapeCSV(item.mfr),
          escapeCSV(item.desc),
          escapeCSV(item.dimensions),
          item.qty,
          item.unitPrice,
          itemTotal,
          item.isTaxable ? 'Yes' : 'No',
          escapeCSV(item.leadTime),
          escapeCSV(item.status),
          escapeCSV(item.notes)
        ];
        csvContent.push(row);
      });

      // Category Subtotal
      const catTotal = totals.categoryTotals[cat.id] || 0;
      csvContent.push(['', '', '', '', '', 'Subtotal', catTotal, '', '', '', '']);
      csvContent.push([]); // Empty row between categories
    });

    // Grand Totals
    csvContent.push([]);
    csvContent.push(['', '', '', '', '', 'Grand Total', totals.grandTotal]);
    csvContent.push(['', '', '', '', '', 'Est. Tax', totals.tax]);
    csvContent.push(['', '', '', '', '', 'Total w/ Tax', totals.totalWithTax]);
    csvContent.push(['', '', '', '', '', 'Budget Allowance', projectInfo.allowance]);
    csvContent.push(['', '', '', '', '', 'Variance', totals.variance]);

    // Convert to CSV string
    const csvString = csvContent.map(row => row.join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName = `${projectInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_budget.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
   * @param {number} [index] - Optional index to insert the item at. If omitted, appends to end.
   */
  const addItem = (catId, index) => {
    const newItem = {
      id: Date.now(), // Using timestamp as unique ID
      mfr: '',
      desc: 'New Item',
      dimensions: '',
      qty: 1,
      unitPrice: 0,
      leadTime: '',
      status: 'Draft',
      isTaxable: false,
      notes: '',
      specs: { detailedDescription: '', attachments: [] }
    };

    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;

      if (typeof index === 'number' && index >= 0 && index <= cat.items.length) {
        const newItems = [...cat.items];
        newItems.splice(index, 0, newItem);
        return { ...cat, items: newItems };
      }

      return { ...cat, items: [...cat.items, newItem] };
    }));
  };

  /**
   * Move Line Item
   * Moves an item up or down within its category.
   * 
   * @param {string} catId - Category ID
   * @param {number} index - Current index of the item
   * @param {string} direction - 'up' or 'down'
   */
  const moveItem = (catId, index, direction) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;

      const newItems = [...cat.items];
      if (direction === 'up' && index > 0) {
        [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      } else if (direction === 'down' && index < newItems.length - 1) {
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      }

      return { ...cat, items: newItems };
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
    console.log(`Attempting to remove item ${itemId} from category ${catId}`);
    console.log('Current categories:', categories);

    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id !== catId) return cat;
        const filtered = { ...cat, items: cat.items.filter(item => item.id !== itemId) };
        console.log(`Filtered items for category ${catId}:`, filtered.items.length);
        return filtered;
      });
      console.log('Updated categories:', updated);
      return updated;
    });
  };

  /**
   * Save Item Specifications
   * Updates the detailed specifications for a line item.
   * 
   * @param {string} catId - Category ID containing the item
   * @param {number} itemId - Line item ID to update
   * @param {Object} specs - Specification data (detailedDescription, attachments)
   */
  const saveItemSpecs = (catId, itemId, specs) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, specs };
        })
      };
    }));
  };

  /**
   * Add New Category/Section
   * Creates a new budget category with default settings.
   * Uses timestamp for unique ID and includes one empty line item.
   * @param {number} [index] - Optional index to insert the category at. If omitted, appends to end.
   */
  const addCategory = (index) => {
    const newCategory = {
      id: `cat_${Date.now()}`,
      title: 'New Section',
      icon: Layout,
      color: 'text-gray-600',
      items: [
        { id: Date.now(), mfr: '', desc: '', dimensions: '', qty: 0, unitPrice: 0, leadTime: '', status: 'Draft', isTaxable: false, notes: '', specs: { detailedDescription: '', attachments: [] } }
      ]
    };

    setCategories(prev => {
      if (typeof index === 'number' && index >= 0 && index <= prev.length) {
        const newCategories = [...prev];
        newCategories.splice(index, 0, newCategory);
        return newCategories;
      }
      return [...prev, newCategory];
    });
  };

  /**
   * Update Category Title
   * Updates the title of a category section.
   * 
   * @param {string} catId - Category ID to update
   * @param {string} newTitle - New title for the category
   */
  const updateCategoryTitle = (catId, newTitle) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return { ...cat, title: newTitle };
    }));
  };

  /**
   * Remove Category/Section
   * Removes an entire category and all its line items.
   * Prompts for confirmation before deletion.
   * 
   * @param {string} catId - Category ID to remove
   */
  const removeCategory = (catId) => {
    const category = categories.find(cat => cat.id === catId);

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Section',
      message: `Are you sure you want to delete the "${category?.title}" section? This will remove all line items in this section.`,
      onConfirm: () => {
        setCategories(prev => prev.filter(cat => cat.id !== catId));
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  /**
   * Handle Print Action
   * Triggers the browser's print dialog for PDF generation or printing.
   * CSS print styles are applied automatically via @media print rules.
   */
  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const executePrint = () => {
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  /**
   * Load Draft
   * Loads the auto-saved draft from localStorage.
   */
  const handleLoadDraft = () => {
    const savedState = localStorage.getItem('ffe_autosave');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);

        // Icon mapping for reconstructing categories
        const iconMap = {
          'foh': { icon: Armchair, color: 'text-blue-600' },
          'custom': { icon: Lightbulb, color: 'text-amber-600' },
          'wayfinding': { icon: Signpost, color: 'text-purple-600' },
          'exterior': { icon: TreePine, color: 'text-emerald-600' },
          'fees': { icon: Briefcase, color: 'text-gray-600' }
        };

        const loadedCategories = parsedState.categories.map(cat => ({
          ...cat,
          icon: iconMap[cat.id]?.icon || Layout,
          color: cat.color || iconMap[cat.id]?.color || 'text-gray-600',
          // Add specs for backward compatibility
          items: cat.items.map(item => ({
            ...item,
            isTaxable: item.isTaxable !== false,
            specs: item.specs || { detailedDescription: '', attachments: [] }
          }))
        }));

        // Add default terms if not present
        const loadedProjectInfo = {
          ...parsedState.projectInfo,
          terms: parsedState.projectInfo.terms || [
            "1. Estimates are valid for 30 days from date of issue.",
            "2. Freight and delivery charges are estimated and will be billed at actual cost.",
            "3. A formal quote and proposal will be provided. This is a preliminary budgeting tool only."
          ]
        };

        setProjectInfo(loadedProjectInfo);
        setCategories(loadedCategories);
        setHasUnsavedChanges(true);
        setCurrentView('budget');
      } catch (e) {
        console.error('Failed to load draft', e);
        alert('Failed to load draft. Data may be corrupted.');
      }
    }
  };

  /**
   * Handle Logo Upload
   * Reads the uploaded image file and updates the project logo.
   */
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleProjectUpdate('logoUrl', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (currentView === 'specbook') {
    return (
      <>
        <SpecBookView
          projectInfo={projectInfo}
          categories={categories}
          onBack={() => setCurrentView('budget')}
          onEditItem={(item, categoryId) => setSpecEditorState({ isOpen: true, item, categoryId })}
        />
        {specEditorState.isOpen && (
          <SpecEditorModal
            isOpen={specEditorState.isOpen}
            onClose={() => setSpecEditorState({ ...specEditorState, isOpen: false })}
            item={specEditorState.item}
            categoryId={specEditorState.categoryId}
            onSave={(catId, itemId, specs) => {
              saveItemSpecs(catId, itemId, specs);
              setSpecEditorState({ ...specEditorState, isOpen: false });
            }}
          />
        )}
      </>
    );
  }

  if (currentView === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-sans transition-colors duration-200">
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          title={confirmationModal.title}
          message={confirmationModal.message}
          onConfirm={confirmationModal.onConfirm}
          onCancel={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        />
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Welcome Info */}
          <div className="flex flex-col justify-center text-gray-800 dark:text-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
                <Layout className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">BudgetBuilder™</h1>
            </div>
            <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Hospitality FF&E Manager
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Professional budgeting tool for interior designers and procurement agents.
              Manage furniture, fixtures, and equipment with ease.
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Moon size={16} /> Dark Mode
              </div>
              <div className="flex items-center gap-1">
                <Printer size={16} /> Print Ready
              </div>
              <div className="flex items-center gap-1">
                <Save size={16} /> Auto-Save
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Get Started</h3>

            <div className="space-y-4">
              {hasRecentDraft && (
                <button
                  onClick={handleLoadDraft}
                  className="w-full group relative flex items-start gap-4 p-4 rounded-xl border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Continue Draft</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {draftInfo?.projectName || 'Untitled Project'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last saved: {draftInfo?.lastSaved}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                </button>
              )}

              <button
                onClick={handleNewDocument}
                className="w-full group flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all text-left"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Plus size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">New Project</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Start a fresh budget from scratch</div>
                </div>
              </button>

              <button
                onClick={handleOpen}
                className="w-full group flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all text-left"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  <FolderOpen size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Open Existing</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Load a previously saved .ffe file</div>
                </div>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                v1.0.0 • Pat Ryan Things LLC
              </div>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Hidden File Input for Fallback */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".ffe,application/json"
          className="hidden"
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 print:bg-white pb-20 transition-colors duration-200">

      {/* ===== TOP NAVIGATION BAR ===== */}
      {/* Hidden when printing, provides app branding and file/print functionality */}
      <div className="bg-slate-900 text-white shadow-lg print:hidden sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50">
              <Layout className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight flex items-center gap-1">
                BudgetBuilder<span className="text-blue-400">™</span>
                {hasUnsavedChanges && <span className="text-amber-400 text-xs ml-1" title="Unsaved Changes">●</span>}
              </h1>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Hospitality FF&E Manager</div>
            </div>
          </div>

          {/* Center - Auto Save Status */}
          {lastAutoSave && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full">
              <Save size={12} className="text-emerald-400" />
              <span>Auto-saved {lastAutoSave}</span>
            </div>
          )}

          {/* Right - Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${isMenuOpen ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}`}
              title="Menu"
            >
              <Menu size={24} />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">

                  {/* File Operations */}
                  <div className="p-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">File</div>
                    <button onClick={() => { handleNewDocument(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <FileText size={16} className="text-blue-500" /> New Project
                    </button>
                    <button onClick={() => { handleOpen(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <FolderOpen size={16} className="text-amber-500" /> Open Existing
                    </button>
                    <button onClick={() => { handleSave(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Save size={16} className="text-emerald-500" /> Save Project
                    </button>
                    <button onClick={() => { handleSaveAs(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Copy size={16} className="text-emerald-500" /> Save As...
                    </button>
                    <button onClick={() => { handleExportCSV(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <FileSpreadsheet size={16} className="text-green-600" /> Export to Excel (CSV)
                    </button>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2"></div>

                  {/* View & Tools */}
                  <div className="p-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">View & Tools</div>
                    <button onClick={() => { setCurrentView('specbook'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Book size={16} className="text-indigo-500" /> Spec Book View
                    </button>
                    <button onClick={() => { handlePrint(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Printer size={16} className="text-gray-500" /> Print / Export PDF
                    </button>
                    <button onClick={() => { setShowSettingsModal(true); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Settings size={16} className="text-purple-500" /> API Settings
                    </button>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
                      {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2"></div>

                  {/* Column Visibility */}
                  <div className="p-2 bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Visible Columns</div>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { id: 'mfr', label: 'Vendor' },
                        { id: 'dimensions', label: 'Dimensions' },
                        { id: 'leadTime', label: 'Lead Time' },
                        { id: 'status', label: 'Status' },
                        { id: 'qty', label: 'Quantity' },
                        { id: 'unitPrice', label: 'Unit Price' },
                        { id: 'total', label: 'Total' },
                        { id: 'tax', label: 'Taxable' },
                        { id: 'notes', label: 'Notes' }
                      ].map(col => (
                        <button
                          key={col.id}
                          onClick={() => toggleColumn(col.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors ${visibleColumns[col.id] ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                          <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${visibleColumns[col.id] ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            {visibleColumns[col.id] && <div className="w-1.5 h-1.5 bg-white rounded-[1px]"></div>}
                          </div>
                          {col.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== PRINT SETTINGS MODAL ===== */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings size={20} /> Print Settings
              </h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paper Size</label>
                <select
                  value={printSettings.paperSize}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, paperSize: e.target.value }))}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="letter">Letter (8.5" x 11")</option>
                  <option value="legal">Legal (8.5" x 14")</option>
                  <option value="tabloid">Tabloid (11" x 17")</option>
                  <option value="a4">A4 (210mm x 297mm)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Orientation</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="orientation"
                      value="portrait"
                      checked={printSettings.orientation === 'portrait'}
                      onChange={(e) => setPrintSettings(prev => ({ ...prev, orientation: e.target.value }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Portrait</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="orientation"
                      value="landscape"
                      checked={printSettings.orientation === 'landscape'}
                      onChange={(e) => setPrintSettings(prev => ({ ...prev, orientation: e.target.value }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Landscape</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scale ({printSettings.scale}%)</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={printSettings.scale}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, scale: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={executePrint}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          title={confirmationModal.title}
          message={confirmationModal.message}
          onConfirm={confirmationModal.onConfirm}
          onCancel={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        />

        {/* Spec Editor Modal */}
        {specEditorState.isOpen && (
          <SpecEditorModal
            isOpen={specEditorState.isOpen}
            item={specEditorState.item}
            categoryId={specEditorState.categoryId}
            onSave={saveItemSpecs}
            onClose={() => setSpecEditorState({ isOpen: false, item: null, categoryId: null })}
          />
        )}

        {/* ===== HEADER SECTION ===== */}
        {/* Company branding and project information displayed at top of document */}
        <Card className="mb-8 print:shadow-none print:border-none print:p-0">
          {/* Top Bar: Logo & Company Info */}
          <div className="flex items-start justify-between p-8 pb-6 border-b border-gray-100 dark:border-gray-700 print:border-gray-200">
            <div className="flex gap-6 items-start">
              {/* Logo */}
              <div className="flex-shrink-0 relative group h-24 w-24">
                <label htmlFor="logo-upload" className="cursor-pointer block relative h-full w-full">
                  <img
                    src={projectInfo.logoUrl}
                    alt={`${projectInfo.companyName} Logo`}
                    className="w-full h-full object-contain rounded-md border border-gray-200 dark:border-gray-700 bg-white p-2 group-hover:border-blue-500 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                    <span className="text-white text-xs font-bold">Change</span>
                  </div>
                </label>
                <input
                  id="logo-upload"

                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Company Details */}
              <div className="flex flex-col justify-between h-24 py-1">
                <input
                  type="text"
                  value={projectInfo.companyName}
                  onChange={(e) => handleProjectUpdate('companyName', e.target.value)}
                  className="text-xl font-bold text-gray-900 dark:text-white print:text-black border-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0 -ml-1 placeholder-gray-300 bg-transparent leading-none"
                  placeholder="Company Name"
                  style={{ outline: 'none' }}
                />
                <AutoResizeTextarea
                  value={projectInfo.companyAddress}
                  onChange={(e) => handleProjectUpdate('companyAddress', e.target.value)}
                  className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-700 border-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0 -ml-1 bg-transparent leading-tight resize-none"
                  placeholder="Company Address"
                  style={{ outline: 'none', minHeight: 'auto' }}
                />

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-500 print:text-gray-600">
                  {/* Phone */}
                  <input
                    type="text"
                    value={projectInfo.companyPhone}
                    onChange={(e) => handleProjectUpdate('companyPhone', e.target.value)}
                    className="border-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0 -ml-1 bg-transparent w-28"
                    placeholder="Phone"
                    style={{ outline: 'none' }}
                  />

                  {/* Email with Mailto */}
                  <div className="flex items-center group/email relative">
                    <span className="text-gray-300 mr-2">•</span>
                    <input
                      type="email"
                      value={projectInfo.companyEmail}
                      onChange={(e) => handleProjectUpdate('companyEmail', e.target.value)}
                      className="border-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0 bg-transparent w-40"
                      placeholder="Email"
                      style={{ outline: 'none' }}
                    />
                    {projectInfo.companyEmail && (
                      <a
                        href={`mailto:${projectInfo.companyEmail}`}
                        className="ml-1 opacity-0 group-hover/email:opacity-100 text-blue-500 hover:text-blue-700 transition-opacity print:hidden"
                        title="Send Email"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Website with Link */}
                  <div className="flex items-center group/web relative">
                    <span className="text-gray-300 mr-2">•</span>
                    <input
                      type="text"
                      value={projectInfo.companyWebsite}
                      onChange={(e) => handleProjectUpdate('companyWebsite', e.target.value)}
                      className="border-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0 bg-transparent w-40"
                      placeholder="Website"
                      style={{ outline: 'none' }}
                    />
                    {projectInfo.companyWebsite && (
                      <a
                        href={projectInfo.companyWebsite.startsWith('http') ? projectInfo.companyWebsite : `https://${projectInfo.companyWebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 opacity-0 group-hover/web:opacity-100 text-blue-500 hover:text-blue-700 transition-opacity print:hidden"
                        title="Open Website"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Date - Top Right */}
            <div className="text-right">
              {fileHandle && (
                <div className="mb-4 print:hidden">
                  <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Current File</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-end gap-1.5 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                    <FileText size={14} className="text-blue-500" />
                    <span className="truncate max-w-[200px]" title={fileHandle.name}>{fileHandle.name}</span>
                  </div>
                </div>
              )}
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 print:text-gray-500 uppercase tracking-wider mb-1">Date</div>
              <input
                type="date"
                value={projectInfo.date}
                onChange={(e) => handleProjectUpdate('date', e.target.value)}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 print:text-black border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-0 rounded px-2 py-1 bg-transparent dark:[color-scheme:dark] print:border-gray-300"
              />
            </div>
          </div>

          {/* Project Information Section */}
          <div className="p-8 pt-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 print:bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Project Name - Spans 2 columns */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 print:text-gray-900">Project Name</label>
                <AutoResizeTextarea
                  value={projectInfo.name}
                  onChange={(e) => handleProjectUpdate('name', e.target.value)}
                  className="w-full text-4xl font-extrabold text-gray-900 dark:text-white print:text-black border-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 -ml-1 placeholder-gray-300 bg-transparent leading-tight"
                  placeholder="Project Name"
                  style={{ outline: 'none' }}
                />

                {/* Client - Below Project Name */}
                <div className="mt-6">
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 print:text-gray-900">Client</label>
                  <AutoResizeTextarea
                    value={projectInfo.client}
                    onChange={(e) => handleProjectUpdate('client', e.target.value)}
                    className="w-full text-lg font-semibold text-gray-700 dark:text-gray-300 print:text-black border-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 -ml-1 bg-transparent"
                    placeholder="Client Name"
                    style={{ outline: 'none' }}
                  />
                </div>
              </div>

              {/* Location/Address */}
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 print:text-gray-900">Location / Address</label>
                <AutoResizeTextarea
                  value={projectInfo.address}
                  onChange={(e) => handleProjectUpdate('address', e.target.value)}
                  className="w-full text-base text-gray-600 dark:text-gray-400 print:text-gray-700 border-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 -ml-1 bg-transparent leading-relaxed"
                  placeholder="Project Address"
                  style={{ outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ===== DASHBOARD SUMMARY ===== */}
        {/* Four-card dashboard showing key budget metrics at a glance */}
        <div className="grid grid-cols-1 md:grid-cols-4 print:grid-cols-4 gap-4 mb-8">
          {/* Budget Allowance Card - Editable total budget */}
          <Card className="p-5 border-l-4 border-blue-500">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Budget Allowance</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-lg">$</span>
              <input
                type="number"
                value={projectInfo.allowance}
                onChange={(e) => handleProjectUpdate('allowance', parseFloat(e.target.value))}
                className="text-2xl font-bold text-gray-800 dark:text-white w-full border-none focus:ring-0 p-0 bg-transparent [appearance:textfield]"
              />
            </div>
          </Card>

          {/* FF&E Subtotal Card - Calculated from all line items (pre-tax) */}
          <Card className="p-5 border-l-4 border-gray-400">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">FF&E Subtotal</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
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
                  className="w-14 text-xs text-right border-none p-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded focus:ring-0"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(totals.tax)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total w/ Tax: {formatCurrency(totals.totalWithTax)}</div>
          </Card>

          {/* Budget Variance Card - Shows over/under budget status with color coding */}
          {/* Green background = under budget, Red background = over budget */}
          <Card className={`p-5 border-l-4 ${totals.variance >= 0 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'}`}>
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

        {/* Status Legend */}
        <StatusLegend />

        {/* ===== BUDGET CATEGORIES ===== */}
        {/* Iterates through all categories to display line item tables */}
        <div className="flex flex-col pb-4">
          {categories.map((category, index) => (
            <React.Fragment key={category.id}>
              {/* Insert Section Divider */}
              <div
                className="print:hidden h-4 hover:h-12 transition-all duration-200 flex items-center justify-center group/divider cursor-pointer relative z-10 my-1"
                onClick={() => addCategory(index)}
                title="Insert New Section Here"
              >
                <div className="absolute w-full h-px bg-transparent group-hover/divider:bg-blue-300 dark:group-hover/divider:bg-blue-700 transition-colors"></div>
                <button className="bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover/divider:text-blue-600 dark:group-hover/divider:text-blue-400 group-hover/divider:bg-white dark:group-hover/divider:bg-gray-800 px-3 py-1 rounded-full transition-all transform scale-0 group-hover/divider:scale-100 opacity-0 group-hover/divider:opacity-100 flex items-center gap-2 border border-transparent group-hover/divider:border-blue-200 dark:group-hover/divider:border-blue-700 shadow-sm z-20">
                  <Plus size={14} />
                  <span className="text-xs font-bold uppercase tracking-wide">Insert Section</span>
                </button>
              </div>

              <div className="break-inside-avoid group print:mb-8">
                <Card className="overflow-hidden">
                  <SectionHeader
                    icon={category.icon}
                    title={category.title}
                    total={formatCurrency(totals.categoryTotals[category.id])}
                    colorClass={category.color}
                    onTitleChange={(newTitle) => updateCategoryTitle(category.id, newTitle)}
                    onDelete={() => removeCategory(category.id)}
                  />

                  {/* Line Items Table */}
                  {/* Responsive table with inline editing and dynamic column widths */}
                  <div className="overflow-x-auto">
                    <table style={{ width: '100%', fontSize: '14px', tableLayout: 'auto', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase">
                          <th style={{ padding: '12px 16px', width: '40px', textAlign: 'left' }}>#</th>
                          {visibleColumns.status && <th style={{ padding: '12px 16px', width: '100px', textAlign: 'center' }}>Status</th>}
                          {visibleColumns.mfr && <th style={{ padding: '12px 16px', minWidth: '120px', textAlign: 'left' }}>Vendor</th>}
                          <th style={{ padding: '12px 16px', minWidth: '200px', textAlign: 'left' }}>Description</th>
                          {visibleColumns.dimensions && <th style={{ padding: '12px 16px', width: '120px', textAlign: 'left' }}>Dimensions</th>}
                          {visibleColumns.qty && <th style={{ padding: '12px 16px', width: '80px', textAlign: 'center' }}>Qty</th>}
                          {visibleColumns.unitPrice && <th style={{ padding: '12px 16px', width: '110px', textAlign: 'right' }}>Unit Price</th>}
                          {visibleColumns.total && <th style={{ padding: '12px 16px', width: '110px', textAlign: 'right' }}>Total</th>}
                          {visibleColumns.tax && <th style={{ padding: '12px 16px', width: '60px', textAlign: 'center' }}>Tax</th>}
                          {visibleColumns.leadTime && <th style={{ padding: '12px 16px', width: '100px', textAlign: 'left' }}>Lead Time</th>}
                          {visibleColumns.notes && <th style={{ padding: '12px 16px', width: '140px', textAlign: 'left' }}>Notes</th>}
                          <th style={{ padding: '12px 16px', width: '90px', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {/* Map through each line item in category */}
                        {category.items.map((item, index) => (
                          <React.Fragment key={item.id}>
                            {/* Insert Row Divider */}
                            <tr className="print:hidden h-0 hover:h-auto group/divider">
                              <td colSpan="11" className="p-0 border-none">
                                <div
                                  className="h-2 hover:h-8 transition-all duration-200 flex items-center justify-center cursor-pointer relative z-10 -my-1"
                                  onClick={() => addItem(category.id, index)}
                                  title="Insert New Row Here"
                                >
                                  <div className="absolute w-full h-px bg-transparent group-hover/divider:bg-blue-300 dark:group-hover/divider:bg-blue-700 transition-colors"></div>
                                  <button className="bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover/divider:text-blue-600 dark:group-hover/divider:text-blue-400 group-hover/divider:bg-white dark:group-hover/divider:bg-gray-800 px-2 py-0.5 rounded-full transition-all transform scale-0 group-hover/divider:scale-100 opacity-0 group-hover/divider:opacity-100 flex items-center gap-1 border border-transparent group-hover/divider:border-blue-200 dark:group-hover/divider:border-blue-700 shadow-sm z-20 text-[10px] font-bold uppercase tracking-wide">
                                    <Plus size={10} />
                                    <span>Insert Row</span>
                                  </button>
                                </div>
                              </td>
                            </tr>

                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                              {/* Row number (1-indexed for user readability) */}
                              <td className="px-4 py-3 text-gray-400 font-mono text-xs">{index + 1}</td>
                              {/* Status field */}
                              {visibleColumns.status && (
                                <td className="px-4 py-2">
                                  <StatusSelector
                                    value={item.status || 'Draft'}
                                    onChange={(val) => updateItem(category.id, item.id, 'status', val)}
                                  />
                                </td>
                              )}
                              {/* Manufacturer/Vendor field */}
                              {visibleColumns.mfr && (
                                <td style={{ padding: '8px 16px', verticalAlign: 'top' }}>
                                  <AutoResizeTextarea
                                    style={{
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                      border: '1px solid transparent',
                                      borderRadius: '4px',
                                      padding: '4px',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      fontFamily: 'inherit',
                                      lineHeight: '1.5'
                                    }}
                                    className="text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-0"
                                    value={item.mfr}
                                    onChange={(e) => updateItem(category.id, item.id, 'mfr', e.target.value)}
                                    placeholder="Vendor Name"
                                  />
                                </td>
                              )}
                              {/* Item description field */}
                              <td style={{ padding: '8px 16px', verticalAlign: 'top' }}>
                                <AutoResizeTextarea
                                  style={{
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    border: '1px solid transparent',
                                    borderRadius: '4px',
                                    padding: '4px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.5'
                                  }}
                                  className="text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-0"
                                  value={item.desc}
                                  onChange={(e) => updateItem(category.id, item.id, 'desc', e.target.value)}
                                  placeholder="Item Description"
                                />
                              </td>
                              {/* Dimensions field */}
                              {visibleColumns.dimensions && (
                                <td className="px-4 py-2 align-top">
                                  <AutoResizeTextarea
                                    className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-gray-600 dark:text-gray-300 placeholder-gray-300"
                                    value={item.dimensions}
                                    onChange={(e) => updateItem(category.id, item.id, 'dimensions', e.target.value)}
                                    placeholder='Dimensions'
                                  />
                                </td>
                              )}
                              {/* Quantity field - highlighted with blue background */}
                              {visibleColumns.qty && (
                                <td className="px-4 py-2">
                                  <input
                                    type="number"
                                    className="w-full bg-blue-50/50 dark:bg-blue-900/20 border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-2 text-center font-bold text-gray-900 dark:text-white"
                                    value={item.qty}
                                    onChange={(e) => updateItem(category.id, item.id, 'qty', parseFloat(e.target.value) || 0)}
                                  />
                                </td>
                              )}
                              {/* Unit price field with dollar sign prefix */}
                              {visibleColumns.unitPrice && (
                                <td className="px-4 py-2">
                                  <div className="relative flex items-center">
                                    <span className="absolute left-2 text-gray-400 text-xs">$</span>
                                    <input
                                      type="number"
                                      className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-2 pl-6 pr-8 text-right text-gray-600 dark:text-gray-300"
                                      value={item.unitPrice}
                                      onChange={(e) => updateItem(category.id, item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                    />
                                    <button
                                      onClick={(e) => handlePriceSearch(e, category.id, item)}
                                      className="absolute right-1 p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Search Market Price"
                                      tabIndex={-1}
                                    >
                                      <Search size={12} />
                                    </button>
                                  </div>
                                </td>
                              )}
                              {/* Calculated total for this line (qty × unit price) */}
                              {visibleColumns.total && (
                                <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">
                                  {formatCurrency(item.qty * item.unitPrice)}
                                </td>
                              )}
                              {/* Tax Toggle */}
                              {visibleColumns.tax && (
                                <td className="px-4 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={item.isTaxable !== false}
                                    onChange={(e) => updateItem(category.id, item.id, 'isTaxable', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    title="Toggle Taxable Status"
                                  />
                                </td>
                              )}
                              {/* Lead time field */}
                              {visibleColumns.leadTime && (
                                <td className="px-4 py-2 align-top">
                                  <AutoResizeTextarea
                                    className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-gray-600 dark:text-gray-300 placeholder-gray-300"
                                    value={item.leadTime}
                                    onChange={(e) => updateItem(category.id, item.id, 'leadTime', e.target.value)}
                                    placeholder='L/T'
                                  />
                                </td>
                              )}
                              {/* Notes field - for finish, color, or special instructions */}
                              {visibleColumns.notes && (
                                <td className="px-4 py-2 align-middle">
                                  <div className="flex flex-col items-center justify-center space-y-2">
                                    <AutoResizeTextarea
                                      className="w-full bg-transparent border-transparent focus:border-blue-500 focus:ring-0 rounded text-sm p-1 text-gray-900 dark:text-gray-100 text-center placeholder-gray-300"
                                      value={item.notes}
                                      onChange={(e) => updateItem(category.id, item.id, 'notes', e.target.value)}
                                      placeholder="Finish / Note"
                                    />
                                    <button
                                      onClick={() => setSpecEditorState({ isOpen: true, item, categoryId: category.id })}
                                      className={`flex items-center gap-1 text-xs rounded px-2 py-1 transition print:hidden ${item.specs?.detailedDescription || item.specs?.attachments?.length > 0
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                      title="View or edit detailed specifications"
                                    >
                                      <FileText size={12} />
                                      <span>{item.specs?.detailedDescription || item.specs?.attachments?.length > 0 ? 'View Specs' : 'Add Specs'}</span>
                                      {item.specs?.attachments?.length > 0 && (
                                        <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                                          {item.specs.attachments.length}
                                        </span>
                                      )}
                                    </button>
                                    {(item.specs?.detailedDescription || item.specs?.attachments?.length > 0) && (
                                      <div className="hidden print:block text-xs text-gray-900 font-bold mt-1">
                                        (See Spec Book)
                                      </div>
                                    )}
                                  </div>
                                </td>
                              )}
                              {/* Delete button - subtle trash icon, hidden when printing */}
                              <td style={{
                                padding: '8px',
                                textAlign: 'center',
                                display: 'table-cell'
                              }}>
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeItem(category.id, item.id);
                                    }}
                                    aria-label="Delete item"
                                    title="Delete this item"
                                    type="button"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      padding: '4px',
                                      border: 'none',
                                      background: 'transparent',
                                      cursor: 'pointer',
                                      color: '#9ca3af'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#9ca3af';
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                  <div className="flex flex-col gap-1">
                                    <button
                                      onClick={() => moveItem(category.id, index, 'up')}
                                      disabled={index === 0}
                                      className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 p-0.5"
                                      title="Move Up"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button
                                      onClick={() => moveItem(category.id, index, 'down')}
                                      disabled={index === category.items.length - 1}
                                      className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 p-0.5"
                                      title="Move Down"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Item Button - Footer of the card */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 rounded-b-lg print:hidden">
                    <button
                      onClick={() => addItem(category.id)}
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
                    >
                      <Plus size={16} />
                      Add {category.title.split('|')[0].trim()} Item
                    </button>
                  </div>
                </Card>
              </div>
            </React.Fragment>
          ))}

          {/* Add New Section Button */}
          <div className="print:hidden">
            <button
              onClick={addCategory}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
            >
              <Plus size={20} />
              Add New Section
            </button>
          </div>
        </div>

        {/* ===== FOOTER / TERMS & CONDITIONS ===== */}
        {/* Document footer with editable terms and generation timestamp */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 text-gray-500 dark:text-gray-400 text-sm print:border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold uppercase tracking-wider mb-3 text-xs text-gray-700 dark:text-gray-300 print:text-gray-900">Terms & Conditions</h4>
              <div className="space-y-2">
                {projectInfo.terms.map((term, index) => (
                  <div key={index} className="flex gap-2">
                    <AutoResizeTextarea
                      value={term}
                      onChange={(e) => {
                        const newTerms = [...projectInfo.terms];
                        newTerms[index] = e.target.value;
                        handleProjectUpdate('terms', newTerms);
                      }}
                      className="flex-1 bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 -ml-1 text-gray-600 dark:text-gray-400 print:text-black"
                      placeholder={`Term ${index + 1}`}
                      style={{ outline: 'none' }}
                    />
                    <button
                      onClick={() => {
                        const newTerms = projectInfo.terms.filter((_, i) => i !== index);
                        handleProjectUpdate('terms', newTerms);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 opacity-0 hover:opacity-100 focus:opacity-100 transition print:hidden"
                      title="Remove term"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const newTerms = [...projectInfo.terms, `${projectInfo.terms.length + 1}. `];
                  handleProjectUpdate('terms', newTerms);
                }}
                className="mt-3 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 print:hidden"
              >
                <Plus size={14} />
                Add Term
              </button>
            </div>
            <div className="flex flex-col justify-end items-end">
              <div className="text-right">
                <p className="italic text-gray-500 dark:text-gray-400 print:text-gray-600">© 2025-Generated via Pat Ryan Things LLC BudgetBuilder</p>
                <p className="font-bold text-gray-900 dark:text-white print:text-black mt-1">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

      </div >

      {/* ===== PRINT STYLES ===== */}
      {/* Inline styles for print media - controls page layout, margins, and footer content */}
      <style>{`
        /* Remove number input spinners for cleaner look */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }

        @media print {
          /* Configure print page settings with margins and automatic footer content */
          @page {
              size: ${printSettings.paperSize} ${printSettings.orientation};
              margin: 1.0cm;

              @bottom-center {
                  content: "Page " counter(page) " of " counter(pages);
                  font-size: 10pt;
                  color: #6b7280;
                  border-top: 1px solid #e5e7eb;
                  padding-top: 5pt;
              }
              
              @bottom-left {
                  content: "Project: ${projectInfo.name}";
                  font-size: 10pt;
                  color: #1f2937;
                  font-weight: bold;
              }

              @bottom-right {
                  content: "Date: ${projectInfo.date}";
                  font-size: 10pt;
                  color: #6b7280;
              }
          }
          
          body { 
            -webkit-print-color-adjust: exact; 
            transform: scale(${printSettings.scale / 100});
            transform-origin: top left;
            width: ${100 * (100 / printSettings.scale)}%;
          }
          
          .print\\:hidden { 
            display: none !important; 
          }
          
          .print\\:shadow-none { 
            box-shadow: none !important; 
          }
          
          .print\\:border-none { 
            border: none !important; 
          }
          
          .print\\:bg-white { 
            background-color: white !important; 
          }
          
          input, textarea { 
            border: none !important; 
            padding: 0 !important; 
          }
          
          input[type="number"]::-webkit-inner-spin-button, 
          input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
          
          /* Hide delete column and add buttons */
          table thead th:last-child,
          table tbody td:last-child {
            display: none !important;
          }
        }
      `}</style>
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      <PricingPopover
        isOpen={pricingPopover.isOpen}
        onClose={() => setPricingPopover(prev => ({ ...prev, isOpen: false }))}
        results={pricingPopover.results}
        isLoading={pricingPopover.isLoading}
        position={pricingPopover.position}
        onSelectPrice={handlePriceSelect}
      />

      {/* Hidden File Input for Fallback */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".ffe,application/json"
        className="hidden"
        style={{ display: 'none' }}
      />
    </div>
  );
}