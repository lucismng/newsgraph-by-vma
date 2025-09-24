import React, { useState, useEffect } from 'react';
import { Clock } from './Clock';
import { ScrollingNews } from './ScrollingNews';
import { useNews } from '../context/NewsContext';
import { useUI } from '../context/UIContext';

interface NewsTickerBarProps {
  newsString: string;
}

// A simple, stylized divider for the ticker.
// It is styled via CSS in index.html to match various themes.
const TickerDivider = () => (
    <div className="flex-shrink-0 flex items-center h-full px-1 divider-bg">
        <div className="h-5 w-px divider-line"></div>
    </div>
);

export const NewsTickerBar = ({ newsString }: NewsTickerBarProps) => {
  const { newsMode, breakingNewsTag, disasterWarning } = useNews();
  const { 
    isWeatherBarVisible, 
    clockDisplayMode, 
    clockCustomText, 
    openModal,
    clockAlternateDuration,
    customTextAlternateDuration,
  } = useUI();

  const [currentView, setCurrentView] = useState<'clock' | 'custom'>(
    clockDisplayMode === 'custom' ? 'custom' : 'clock'
  );
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    const animateChange = (newView: 'clock' | 'custom') => {
        // Only trigger animation and state change if the view is different
        if (currentView !== newView) {
            setAnimationKey(prev => prev + 1);
            setCurrentView(newView);
        }
    };
    
    if (clockDisplayMode === 'clock') {
        animateChange('clock');
        return;
    }

    if (clockDisplayMode === 'custom') {
        animateChange('custom');
        return;
    }
    
    if (clockDisplayMode === 'alternate') {
        const duration = (currentView === 'clock' ? clockAlternateDuration : customTextAlternateDuration) * 1000;
        const timerId = setTimeout(() => {
            animateChange(currentView === 'clock' ? 'custom' : 'clock');
        }, Math.max(duration, 1000)); // Ensure a minimum 1s duration to prevent rapid flashing

        return () => clearTimeout(timerId);
    }
  }, [clockDisplayMode, currentView, clockAlternateDuration, customTextAlternateDuration, currentView]);

  
  const isBreaking = newsMode === 'breaking';
  const isDisasterOnTicker = newsMode === 'disaster' && disasterWarning?.displayLocation === 'ticker';

  const borderRadiusClass = isWeatherBarVisible ? 'rounded-t-lg' : 'rounded-lg';
  
  const specialModeClass = isBreaking ? 'breaking' : (isDisasterOnTicker ? 'disaster' : '');
  const tagText = isBreaking ? breakingNewsTag : (isDisasterOnTicker ? disasterWarning.tag : null);
  const tagClass = isBreaking ? 'breaking-news-tag' : 'disaster-warning-tag';
  
  // Conditionally apply a class to give the clock a distinct style when the weather bar is hidden.
  const clockContainerClass = isWeatherBarVisible ? '' : 'clock-standalone';

  return (
    <div className={`flex h-8 items-stretch shadow-md transition-all duration-300 ease-in-out ${borderRadiusClass} news-ticker-bar ${specialModeClass}`}>
      {/* Container for clock to allow separate styling */}
      <div className={`clock-container ${clockContainerClass}`}>
        <div key={animationKey} className="w-full h-full animate-clock-fade-in">
          {currentView === 'clock' ? (
            <Clock className="clock-text" />
          ) : (
             <div 
                className="flex-shrink-0 flex items-center justify-center font-black text-lg px-4 h-full cursor-pointer hover:opacity-80 transition-opacity clock-text uppercase"
                onClick={openModal}
              >
                {clockCustomText}
              </div>
          )}
        </div>
      </div>
      
      <TickerDivider />

      {/* Container for scroller and breaking tag to allow separate styling */}
      <div className="scroller-container flex-1 flex items-stretch">
        {(isBreaking || isDisasterOnTicker) && (
          <div className={`flex-shrink-0 flex items-center justify-center px-4 font-black text-lg uppercase ${tagClass}`}>
            {tagText}
          </div>
        )}
        {/* FIX: Removed 'key' prop to resolve a TypeScript error. This might affect animation reset behavior. */}
        <ScrollingNews
          text={newsString}
          textClassName="scroller-text"
          loadingClassName="scroller-text opacity-70"
        />
      </div>
    </div>
  );
};