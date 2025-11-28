import React, { useState, useEffect } from 'react';
import { X, Save, Key, ShieldAlert } from 'lucide-react';

/**
 * SettingsModal Component
 * Allows users to configure application settings, primarily API keys for AI features.
 * Persists data to localStorage.
 */
const SettingsModal = ({ isOpen, onClose }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [searchEngineId, setSearchEngineId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved settings on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedGemini = localStorage.getItem('ffe_gemini_key') || '';
      const savedSearch = localStorage.getItem('ffe_search_key') || '';
      const savedEngineId = localStorage.getItem('ffe_search_engine_id') || '';
      
      setGeminiKey(savedGemini);
      setSearchKey(savedSearch);
      setSearchEngineId(savedEngineId);
      setShowSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('ffe_gemini_key', geminiKey);
    localStorage.setItem('ffe_search_key', searchKey);
    localStorage.setItem('ffe_search_engine_id', searchEngineId);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 print:hidden">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Key size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex gap-3">
              <ShieldAlert size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your API keys are stored locally in your browser's storage. They are never sent to any server other than the respective API providers (Google).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for Visual Spec Assistant. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-purple-600 hover:underline">Get Key</a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google Custom Search API Key
              </label>
              <input
                type="password"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Engine ID (CX)
              </label>
              <input
                type="text"
                value={searchEngineId}
                onChange={(e) => setSearchEngineId(e.target.value)}
                placeholder="0123456789..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for Smart Pricing. <a href="https://programmablesearch.google.com/" target="_blank" rel="noreferrer" className="text-purple-600 hover:underline">Create Search Engine</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
              showSuccess 
                ? 'bg-green-600 text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {showSuccess ? (
              <>Saved!</>
            ) : (
              <>
                <Save size={18} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
