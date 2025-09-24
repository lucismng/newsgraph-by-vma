import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { useGemini } from '../../hooks/useGemini';

type DisplayLocation = 'ticker' | 'weather';

export const BreakingNewsTab = () => {
  const { 
    newsMode,
    lastSpecialMode,
    switchToRssMode,
    reactivateSpecialNews,
    clearSpecialNewsData,
    setDisasterWarningAsSource,
  } = useNews();

  const {
    isLoading,
    aiError,
    spellingSuggestion,
    checkSpelling,
    clearSpellingSuggestion,
    generateBreakingNews,
  } = useGemini();

  // AI Section state
  const [breakingNewsTopic, setBreakingNewsTopic] = useState('');
  const [breakingNewsTag, setBreakingNewsTag] = useState('TIN KHẨN');
  const [headlineCount, setHeadlineCount] = useState('');
  const [newsWindowHours, setNewsWindowHours] = useState('3');

  // Manual Section state
  const [customBreakingTag, setCustomBreakingTag] = useState('TIN KHẨN');
  const [customBreakingContent, setCustomBreakingContent] = useState('');
  
  // Disaster Warning Section state
  const [disasterTag, setDisasterTag] = useState('CẢNH BÁO THIÊN TAI');
  const [disasterContent, setDisasterContent] = useState('');
  const [displayLocation, setDisplayLocation] = useState<DisplayLocation>('ticker');


  // Debounced spell checking for AI topic
  useEffect(() => {
      const topic = breakingNewsTopic.trim();
      if (!topic) {
          clearSpellingSuggestion();
          return;
      }

      const handler = setTimeout(() => {
          checkSpelling(topic);
      }, 700); // 700ms debounce

      return () => {
          clearTimeout(handler);
      };
  }, [breakingNewsTopic, checkSpelling, clearSpellingSuggestion]);
  
  const handleGenerateBreakingNews = () => {
    if (breakingNewsTopic.trim()) {
      clearSpellingSuggestion();
      const count = headlineCount ? parseInt(headlineCount, 10) : undefined;
      const hours = newsWindowHours ? parseInt(newsWindowHours, 10) : 3;
      generateBreakingNews(breakingNewsTopic, breakingNewsTag, count, hours);
    }
  };

  const handleSetCustomBreaking = () => {
    // This function is now part of the NewsContext
    // We need to import setCustomBreakingNews
    const { setCustomBreakingNews } = useNews();
    setCustomBreakingNews(customBreakingTag, customBreakingContent);
  };
  
  const handleActivateDisasterWarning = () => {
    setDisasterWarningAsSource(disasterTag, disasterContent, displayLocation);
  };

  const handleAcceptSuggestion = () => {
    if (spellingSuggestion) {
      setBreakingNewsTopic(spellingSuggestion);
      clearSpellingSuggestion();
    }
  };


  const renderAiSection = () => {
    return (
      <div className="space-y-3">
         <div>
          <label htmlFor="breaking-news-tag" className="block text-sm font-medium text-gray-600 mb-1">
            Nhãn tin (ví dụ: TIN KHẨN, TRỰC TIẾP)
          </label>
          <input
              id="breaking-news-tag"
              type="text"
              value={breakingNewsTag}
              onChange={(e) => setBreakingNewsTag(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
          />
        </div>
        <div>
          <label htmlFor="breaking-news-topic" className="block text-sm font-medium text-gray-600 mb-1">
            Chủ đề tin
          </label>
          <input
              id="breaking-news-topic"
              type="text"
              value={breakingNewsTopic}
              onChange={(e) => setBreakingNewsTopic(e.target.value)}
              placeholder="Ví dụ: Bão Biển Đông, giá vàng..."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
          />
        </div>
        {spellingSuggestion && (
          <div className="text-xs -mt-2 p-1.5 bg-blue-50 text-gray-700 rounded-md">
            Có phải ý bạn là: <button onClick={handleAcceptSuggestion} className="font-bold text-blue-600 hover:underline">{spellingSuggestion}</button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
             <div>
                <label htmlFor="breaking-news-count" className="block text-sm font-medium text-gray-600 mb-1">
                    Số lượng tin
                </label>
                <input
                    id="breaking-news-count"
                    type="number"
                    min="1"
                    value={headlineCount}
                    onChange={(e) => setHeadlineCount(e.target.value)}
                    placeholder="Tối đa"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
                />
            </div>
            <div>
                <label htmlFor="news-window-hours" className="block text-sm font-medium text-gray-600 mb-1">
                    Tin trong (giờ)
                </label>
                <input
                    id="news-window-hours"
                    type="number"
                    min="1"
                    value={newsWindowHours}
                    onChange={(e) => setNewsWindowHours(e.target.value)}
                    placeholder="3"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
                />
            </div>
        </div>
        <button
          onClick={handleGenerateBreakingNews}
          disabled={!breakingNewsTopic.trim() || !breakingNewsTag.trim() || isLoading}
          className="w-full bg-[#ff4d4d] hover:bg-[#ff1a1a] text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          <span>Tạo danh sách tin khẩn cấp</span>
        </button>
        {aiError && (
          <p className="text-sm text-red-600 p-2 bg-red-50 rounded-md">{aiError}</p>
        )}
      </div>
    );
  };

  const isSpecialModeActive = newsMode === 'breaking' || newsMode === 'disaster';

  return (
    <div className="space-y-4">
      {/* Special Mode Management Section */}
      {lastSpecialMode && (
        <>
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Quản lý Chế độ Đặc biệt</h3>
            <div className="p-3 bg-gray-50 rounded-lg border space-y-2">
              {isSpecialModeActive ? (
                <div>
                  <button
                    onClick={switchToRssMode}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Tạm dừng (Về tin RSS)
                  </button>
                  <p className="text-xs text-gray-500 mt-1.5 text-center">Chuyển về tin thường, tin khẩn sẽ được lưu lại.</p>
                </div>
              ) : (
                <div>
                  <button
                    onClick={reactivateSpecialNews}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Kích hoạt lại Tin khẩn
                  </button>
                  <p className="text-xs text-gray-500 mt-1.5 text-center">Quay lại chế độ phát tin khẩn đã lưu.</p>
                </div>
              )}
              <div className="pt-2">
                <button
                    onClick={clearSpecialNewsData}
                    className="w-full bg-transparent hover:bg-red-50 text-red-600 font-semibold py-2 px-4 rounded transition-colors border border-red-200 hover:border-red-400"
                >
                    Xóa & Đặt lại tin khẩn
                </button>
              </div>
            </div>
          </div>
          <hr/>
        </>
      )}

      {/* AI Breaking News Section */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-700">Tạo tin bằng AI (hỗ trợ bởi Google Search)</h3>
        {renderAiSection()}
      </div>

      <hr/>

       {/* Flexible Breaking News Section */}
       <div>
        <h3 className="font-semibold mb-2 text-gray-700">Tạo tin Khẩn cấp (Linh hoạt)</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={disasterTag}
            onChange={(e) => setDisasterTag(e.target.value)}
            placeholder="Nhãn tin, ví dụ: CẢNH BÁO BÃO"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <textarea
            value={disasterContent}
            onChange={(e) => setDisasterContent(e.target.value)}
            placeholder="Nội dung cảnh báo..."
            rows={2}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Vị trí hiển thị
            </label>
            <div className="flex rounded-md shadow-sm">
                <button
                    onClick={() => setDisplayLocation('ticker')}
                    className={`flex-1 px-3 py-2 text-sm font-semibold rounded-l-md transition-colors ${
                        displayLocation === 'ticker' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Thanh chạy chữ
                </button>
                <button
                    onClick={() => setDisplayLocation('weather')}
                    className={`flex-1 px-3 py-2 text-sm font-semibold rounded-r-md transition-colors border-l border-gray-200 ${
                        displayLocation === 'weather' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Thanh thời tiết
                </button>
            </div>
          </div>
          <button
            onClick={handleActivateDisasterWarning}
            disabled={!disasterTag.trim() || !disasterContent.trim()}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Kích hoạt Tin khẩn cấp
          </button>
        </div>
      </div>
      
      <hr/>
      
      {/* Custom Breaking News Section */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-700">Tùy chỉnh Tin khẩn cấp (Thủ công)</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={customBreakingTag}
            onChange={(e) => setCustomBreakingTag(e.target.value)}
            placeholder="Nhãn tin, ví dụ: TIN KHẨN"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
          />
          <input
            type="text"
            value={customBreakingContent}
            onChange={(e) => setCustomBreakingContent(e.target.value)}
            placeholder="Nội dung tin khẩn cấp chạy chữ..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
          />
          <button
            onClick={handleSetCustomBreaking}
            disabled={!customBreakingTag.trim() || !customBreakingContent.trim()}
            className="w-full bg-[#c62828] hover:bg-[#b71c1c] text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Kích hoạt Tin khẩn cấp thủ công
          </button>
        </div>
      </div>
    </div>
  );
};