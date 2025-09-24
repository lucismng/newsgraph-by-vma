import React, { useState, useEffect, useRef } from 'react';
import { NewsSource, AiNewsItem } from '../../types';

interface HeadlineSelectionModalProps {
    isOpen: boolean;
    items: AiNewsItem[];
    sources: NewsSource[];
    tag: string;
    onClose: () => void;
    onConfirm: (selectedItems: AiNewsItem[], tag: string) => void;
}

export const HeadlineSelectionModal = ({ 
    isOpen, 
    items, 
    sources, 
    tag,
    onClose, 
    onConfirm 
}: HeadlineSelectionModalProps) => {
    const [selectedItems, setSelectedItems] = useState<Set<AiNewsItem>>(new Set());
    const modalRef = useRef<HTMLDivElement>(null);

    const isAllSelected = items.length > 0 && selectedItems.size === items.length;

    // Reset selection when items change
    useEffect(() => {
        setSelectedItems(new Set());
    }, [items]);

    // Handle keyboard events
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);

        // Focus first element
        const firstFocusableElement = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusableElement?.focus();

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);


    if (!isOpen) {
        return null;
    }

    const handleCheckboxChange = (item: AiNewsItem, isChecked: boolean) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(item);
            } else {
                newSet.delete(item);
            }
            return newSet;
        });
    };
    
    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(new Set(items));
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleConfirmClick = () => {
        if (selectedItems.size > 0) {
            onConfirm(Array.from(selectedItems), tag);
        }
    };

    return (
        <div 
            ref={modalRef}
            className="fixed top-12 left-12 w-[26rem] bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl z-[60] text-gray-800 border border-gray-200 flex flex-col" 
            style={{ maxHeight: 'calc(100vh - 12.5rem)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="headline-modal-title"
        >
            {/* Header */}
            <div className="p-5 flex justify-between items-center flex-shrink-0 border-b border-gray-200">
                <div>
                    <h2 id="headline-modal-title" className="text-xl font-bold text-red-600">Chọn Tin khẩn</h2>
                    <p className="text-sm text-gray-600">Nhãn tin sẽ hiển thị: <span className="font-semibold uppercase">{tag}</span></p>
                </div>
                <button
                    onClick={onClose}
                    className="text-2xl font-bold text-gray-500 hover:text-gray-800"
                    aria-label="Đóng"
                >&times;</button>
            </div>

            {/* Body */}
            <div className="p-5 flex-grow overflow-y-auto space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Chọn một hoặc nhiều tin để phát sóng:</h3>
                    <div className="border rounded-md bg-gray-50/70">
                        <div className="flex items-center p-3 border-b border-gray-200">
                             <input
                                type="checkbox"
                                id="select-all"
                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                checked={isAllSelected}
                                onChange={handleSelectAllChange}
                                disabled={items.length === 0}
                            />
                            <label htmlFor="select-all" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                                Chọn tất cả
                            </label>
                        </div>
                        <div className="space-y-3 max-h-[calc(100vh-35rem)] overflow-y-auto p-3">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-start p-2 rounded hover:bg-red-500/10 transition-colors">
                                    <input
                                        type="checkbox"
                                        id={`headline-select-${index}`}
                                        className="h-4 w-4 mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer flex-shrink-0"
                                        checked={selectedItems.has(item)}
                                        onChange={e => handleCheckboxChange(item, e.target.checked)}
                                    />
                                    <label
                                        htmlFor={`headline-select-${index}`}
                                        className="ml-3 block text-sm text-gray-800 w-full cursor-pointer"
                                    >
                                        <span className="font-bold uppercase text-gray-900">{item.headline}</span>
                                        <p className="font-normal text-gray-600 mt-0.5">{item.summary}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {sources.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Nguồn tin đã tham khảo</h4>
                        <div className="max-h-24 overflow-y-auto space-y-1 pr-2 text-xs">
                            {sources.map((source, index) => (
                                <a
                                    key={index}
                                    href={source.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 hover:text-blue-800 hover:underline truncate"
                                    title={source.uri}
                                >
                                    {source.title || source.uri}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0 flex items-center justify-end space-x-3 bg-gray-50/50 rounded-b-lg">
                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                >
                    Hủy
                </button>
                <button
                    onClick={handleConfirmClick}
                    disabled={selectedItems.size === 0}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Phát sóng ({selectedItems.size}) tin
                </button>
            </div>
        </div>
    );
};