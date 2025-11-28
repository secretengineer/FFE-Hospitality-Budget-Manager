import React, { useEffect, useRef } from 'react';
import { ExternalLink, DollarSign, X, Loader2 } from 'lucide-react';

/**
 * PricingPopover Component
 * Displays search results for item pricing.
 */
const PricingPopover = ({ isOpen, onClose, results, isLoading, onSelectPrice, position }) => {
    const popoverRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={popoverRef}
            className="absolute z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{
                top: position.top + 40,
                left: position.left - 200, // Align somewhat to the left of the button
            }}
        >
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarSign size={14} className="text-green-600" />
                    Market Pricing
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={14} />
                </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <Loader2 size={24} className="animate-spin mb-2 text-blue-500" />
                        <span className="text-xs">Searching web...</span>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-xs">
                        No pricing found. Try adjusting the manufacturer or description.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {results.map((result, idx) => (
                            <div key={idx} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <a
                                        href={result.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline line-clamp-2 flex-1"
                                    >
                                        {result.title} <ExternalLink size={10} className="inline ml-0.5" />
                                    </a>
                                    {result.price && (
                                        <button
                                            onClick={() => onSelectPrice(result.price)}
                                            className="flex-shrink-0 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                            title="Use this price"
                                        >
                                            {result.price}
                                        </button>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {result.snippet}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingPopover;
