import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../context/UIContext';
import { useNews } from '../context/NewsContext';
import { CustomNewsTab } from './modal/CustomNewsTab';
import { BreakingNewsTab } from './modal/BreakingNewsTab';
import { InterfaceTab } from './modal/InterfaceTab';

type ActiveTab = 'custom' | 'breaking' | 'interface';

export const AdvancedSettingsModal = () => {
  const { isModalOpen, closeModal } = useUI();
  const { setRssAsSource, isRssFetching, refetchRssNews } = useNews();
  const [activeTab, setActiveTab] = useState<ActiveTab>('custom');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeModal();
        }

        if (e.key === 'Tab') {
            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    };
    
    const firstFocusableElement = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )[0];
    firstFocusableElement?.focus();

    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, closeModal]);
  
  // Reset to first tab when modal is reopened
  useEffect(() => {
    if (isModalOpen) {
      setActiveTab('custom');
    }
  }, [isModalOpen]);

  if (!isModalOpen) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'custom':
        return <CustomNewsTab />;
      case 'breaking':
        return <BreakingNewsTab />;
      case 'interface':
        return <InterfaceTab />;
      default:
        return null;
    }
  };

  const tabStyle = 'flex-1 pb-2 font-bold text-center transition-all duration-200 border-b-2';
  const inactiveTabStyle = 'text-gray-500 hover:text-gray-800 border-transparent';

  return (
    <div 
      ref={modalRef}
      className="fixed top-12 right-12 w-[26rem] bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl z-50 text-gray-800 border border-gray-200 flex flex-col" 
      style={{ maxHeight: 'calc(100vh - 12.5rem)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="p-5 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-2">
            <h2 id="modal-title" className="text-xl font-bold text-[#0056b3]">Chế độ Nâng cao</h2>
            <button
              onClick={setRssAsSource}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
              title="Trở về Chế độ Bình thường"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
              </svg>
            </button>
             <button
                onClick={refetchRssNews}
                disabled={isRssFetching}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-wait"
                title="Tải lại tin tức từ RSS"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isRssFetching ? 'animate-spin' : ''}`}>
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
            </button>
        </div>
        <button 
            onClick={closeModal} 
            className="text-2xl font-bold text-gray-500 hover:text-gray-800"
            aria-label="Đóng"
        >&times;</button>
      </div>
      
      <div className="flex border-b border-gray-200 px-5 flex-shrink-0">
        <button
          onClick={() => setActiveTab('custom')}
          className={`${tabStyle} ${activeTab === 'custom' ? 'text-[#007BFF] border-[#007BFF]' : inactiveTabStyle}`}
        >
          Text Tùy Chỉnh
        </button>
        <button
          onClick={() => setActiveTab('breaking')}
          className={`${tabStyle} ${activeTab === 'breaking' ? 'text-red-600 border-red-600' : inactiveTabStyle}`}
        >
          Breaking News
        </button>
        <button
          onClick={() => setActiveTab('interface')}
          className={`${tabStyle} ${activeTab === 'interface' ? 'text-gray-800 border-gray-800' : inactiveTabStyle}`}
        >
          Giao diện
        </button>
      </div>

      <div className="p-5 flex-grow overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};