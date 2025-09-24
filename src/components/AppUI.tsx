import React, { useState, useEffect } from 'react';
import { useUI } from '../context/UIContext';
import { useNews } from '../context/NewsContext';
import { useWeather } from '../hooks/useWeather';
import { NewsTickerBar } from './NewsTickerBar';
import { WeatherBar } from './WeatherBar';
import { AdvancedSettingsModal } from './AdvancedSettingsModal';
import { HeadlineSelectionModal } from './modal/HeadlineSelectionModal';
import { CITIES_DATA } from '../constants';


export const AppUI = () => {
    const { 
        isAppVisible,
        isMourningMode, 
        isTetMode,
        isWeatherBarVisible,
        // Headline Selection Modal state from UI context
        isHeadlineModalOpen,
        itemsForSelection,
        sourcesForSelection,
        tagForSelection,
        closeHeadlineModal,
    } = useUI();

    const {
        newsMode, 
        displayNewsString,
        setBreakingNewsFromSelection
    } = useNews();
    
    // Manage weather rotation locally within the UI component
    const [cityIndex, setCityIndex] = useState(0);
    const currentWeather = useWeather(cityIndex);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setCityIndex(prev => (prev + 1) % CITIES_DATA.length);
        }, 5000); // Cycle weather every 5 seconds
        return () => clearTimeout(timerId);
    }, [cityIndex]);


    if (!isAppVisible) {
        return null;
    }

    return (
        <>
            <div 
                key={`${newsMode}-${isMourningMode}-${isTetMode}`}
                className={`fixed bottom-12 left-12 right-12 shadow-2xl animate-flip-in ${isMourningMode ? 'mourning-mode' : ''} ${isTetMode ? 'tet-mode' : ''}`}
            >
                <NewsTickerBar newsString={displayNewsString} />
                <WeatherBar 
                    weatherData={currentWeather}
                    isVisible={isWeatherBarVisible}
                />
            </div>
            <AdvancedSettingsModal />
            <HeadlineSelectionModal 
                isOpen={isHeadlineModalOpen}
                items={itemsForSelection}
                sources={sourcesForSelection}
                tag={tagForSelection}
                onClose={closeHeadlineModal}
                onConfirm={setBreakingNewsFromSelection}
            />
        </>
    );
};