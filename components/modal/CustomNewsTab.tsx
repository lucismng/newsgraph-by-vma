import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';

export const CustomNewsTab = () => {
  const { customNews, addCustomNews, removeCustomNews, clearCustomNews, setCustomNewsAsSource } = useNews();
  const [customInput, setCustomInput] = useState('');

  const handleAddClick = () => {
    if (customInput.trim()) {
      addCustomNews(customInput.trim());
      setCustomInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddClick();
    }
  };

  return (
    <div className="space-y-4">
      {/* Custom News Section */}
      <div>
          <h3 className="font-semibold mb-2 text-gray-700">Thêm tin tức tùy chỉnh</h3>
          <div className="flex space-x-2">
              <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập nội dung tin tức..."
                  className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
              />
              <button
                  onClick={handleAddClick}
                  className="bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold py-2 px-3 rounded transition-colors"
              >
                  Thêm
              </button>
          </div>
          {customNews.length > 0 && (
            <div className="mt-3">
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1 bg-gray-50/70">
                {customNews.map((news, index) => (
                  <div key={index} className="flex justify-between items-center text-sm p-1.5 bg-white rounded shadow-sm">
                    <span className="flex-grow mr-2 truncate" title={news}>{news}</span>
                    <button 
                      onClick={() => removeCustomNews(index)} 
                      className="text-red-500 hover:text-red-700 font-bold text-lg px-2 rounded-full hover:bg-red-100 transition-colors flex-shrink-0"
                      aria-label={`Xóa tin: ${news}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <button
                  onClick={clearCustomNews}
                  className="w-full text-sm mt-2 text-red-600 hover:text-red-800 font-semibold py-1 rounded transition-colors hover:bg-red-50"
              >
                  Xóa tất cả tin tùy chỉnh
              </button>
            </div>
          )}
      </div>
      
      <hr/>

      {/* Activate Custom News */}
      <div>
          <h3 className="font-semibold mb-2 text-gray-700">Kích hoạt tin tùy chỉnh</h3>
           <div className="flex">
              <button
                  onClick={setCustomNewsAsSource}
                  disabled={customNews.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                  Sử dụng danh sách tin tùy chỉnh
              </button>
          </div>
      </div>
    </div>
  );
};