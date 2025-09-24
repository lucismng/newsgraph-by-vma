import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { ClockDisplayMode } from '../../types';

export const InterfaceTab = () => {
    const { 
        isMourningMode, 
        setMourningMode, 
        isTetMode, 
        setTetMode,
        isWeatherBarVisible,
        setWeatherBarVisible,
        clockDisplayMode,
        setClockDisplayMode,
        clockCustomText,
        setClockCustomText,
        clockAlternateDuration,
        setClockAlternateDuration,
        customTextAlternateDuration,
        setCustomTextAlternateDuration,
    } = useUI();

    // Local state for staging changes
    const [localMourning, setLocalMourning] = useState(isMourningMode);
    const [localTet, setLocalTet] = useState(isTetMode);
    const [localWeatherVisible, setLocalWeatherVisible] = useState(isWeatherBarVisible);
    const [localClockMode, setLocalClockMode] = useState<ClockDisplayMode>(clockDisplayMode);
    const [localClockText, setLocalClockText] = useState(clockCustomText);
    const [localClockAlternate, setLocalClockAlternate] = useState(clockAlternateDuration);
    const [localCustomTextAlternate, setLocalCustomTextAlternate] = useState(customTextAlternateDuration);


    // Sync local state when global state changes (e.g., on modal open or external change)
    useEffect(() => {
        setLocalMourning(isMourningMode);
        setLocalTet(isTetMode);
        setLocalWeatherVisible(isWeatherBarVisible);
        setLocalClockMode(clockDisplayMode);
        setLocalClockText(clockCustomText);
        setLocalClockAlternate(clockAlternateDuration);
        setLocalCustomTextAlternate(customTextAlternateDuration);
    }, [isMourningMode, isTetMode, isWeatherBarVisible, clockDisplayMode, clockCustomText, clockAlternateDuration, customTextAlternateDuration]);
    
    const hasChanges = 
        localMourning !== isMourningMode ||
        localTet !== isTetMode ||
        localWeatherVisible !== isWeatherBarVisible ||
        localClockMode !== clockDisplayMode ||
        localClockText !== clockCustomText ||
        localClockAlternate !== clockAlternateDuration ||
        localCustomTextAlternate !== customTextAlternateDuration;

    const handleApply = () => {
        setMourningMode(localMourning);
        setTetMode(localTet);
        setWeatherBarVisible(localWeatherVisible);
        setClockDisplayMode(localClockMode);
        setClockCustomText(localClockText);
        setClockAlternateDuration(localClockAlternate);
        setCustomTextAlternateDuration(localCustomTextAlternate);
    };
    
    const handleReset = () => {
        setLocalMourning(isMourningMode);
        setLocalTet(isTetMode);
        setLocalWeatherVisible(isWeatherBarVisible);
        setLocalClockMode(clockDisplayMode);
        setLocalClockText(clockCustomText);
        setLocalClockAlternate(clockAlternateDuration);
        setLocalCustomTextAlternate(customTextAlternateDuration);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-6 flex-grow">
                <div>
                    <h3 className="font-semibold mb-2 text-gray-700">Chế độ Màu sắc</h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <span className="font-semibold text-gray-700">Chế độ quốc tang</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={localMourning}
                            onChange={(e) => setLocalMourning(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Bật chế độ này sẽ chuyển toàn bộ giao diện sang tông màu đen-trắng.</p>
                
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border mt-4">
                        <span className="font-semibold text-red-600">Chế độ Tết</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={localTet}
                            onChange={(e) => setLocalTet(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Bật chế độ này sẽ chuyển toàn bộ giao diện sang tông màu đỏ - vàng ngày Tết.</p>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 text-gray-700">Thành phần Giao diện</h3>
                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <span className="font-semibold text-gray-700">Hiển thị thanh thời tiết</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={localWeatherVisible}
                            onChange={(e) => setLocalWeatherVisible(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Bật/tắt thanh thông tin thời tiết ở phía dưới.</p>
                </div>
                
                <div>
                     <h3 className="font-semibold mb-2 text-gray-700">Hiển thị Đồng hồ</h3>
                     <div className="flex rounded-md shadow-sm mb-2">
                        <button
                            onClick={() => setLocalClockMode('clock')}
                            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-l-md transition-colors ${
                                localClockMode === 'clock' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Đồng hồ
                        </button>
                        <button
                            onClick={() => setLocalClockMode('custom')}
                            className={`flex-1 px-3 py-2 text-sm font-semibold transition-colors border-l border-r border-gray-200 ${
                                localClockMode === 'custom' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Text Tùy chỉnh
                        </button>
                         <button
                            onClick={() => setLocalClockMode('alternate')}
                            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-r-md transition-colors ${
                                localClockMode === 'alternate' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Luân phiên
                        </button>
                    </div>
                    {localClockMode === 'custom' && (
                        <input
                            type="text"
                            value={localClockText}
                            onChange={(e) => setLocalClockText(e.target.value)}
                            placeholder="Nhập nội dung hiển thị..."
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    )}
                    {localClockMode === 'alternate' && (
                        <div className="space-y-2 mt-3 p-3 border rounded-md bg-gray-50/70">
                             <input
                                type="text"
                                value={localClockText}
                                onChange={(e) => setLocalClockText(e.target.value)}
                                placeholder="Nhập nội dung text luân phiên..."
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            />
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div>
                                    <label htmlFor="clock-duration" className="block text-xs font-medium text-gray-600 mb-1">Thời gian Đồng hồ (giây)</label>
                                    <input
                                        id="clock-duration"
                                        type="number"
                                        min="1"
                                        value={localClockAlternate}
                                        onChange={(e) => setLocalClockAlternate(parseInt(e.target.value, 10) || 1)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="text-duration" className="block text-xs font-medium text-gray-600 mb-1">Thời gian Text (giây)</label>
                                    <input
                                        id="text-duration"
                                        type="number"
                                        min="1"
                                        value={localCustomTextAlternate}
                                        onChange={(e) => setLocalCustomTextAlternate(parseInt(e.target.value, 10) || 1)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex-shrink-0 flex justify-end space-x-3">
                <button
                    onClick={handleReset}
                    disabled={!hasChanges}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Đặt lại
                </button>
                <button
                    onClick={handleApply}
                    disabled={!hasChanges}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};