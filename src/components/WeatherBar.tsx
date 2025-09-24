import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WeatherData } from '../types';
import { useNews } from '../context/NewsContext';
import { WeatherIcon } from './WeatherIcon';
import { ThermometerIcon } from './icons/ThermometerIcon';
import { ScrollingNews } from './ScrollingNews';

interface BarProps {
    weatherData: WeatherData | null;
    isVisible: boolean;
}

// Gets a more descriptive weather summary
const getWeatherDescription = (code: number): string => {
    if (code === 0) return "Trời quang đãng";
    if (code >= 1 && code <= 2) return "Ít mây";
    if (code === 3) return "Nhiều mây";
    if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67)) return "Khả năng có mưa";
    if (code >= 80 && code <= 82) return "Mưa rào";
    if (code >= 95 && code <= 99) return "Dông bão";
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "Tuyết rơi";
    if (code >= 45 && code <= 48) return "Sương mù";
    return "Thời tiết hỗn hợp";
};

const renderWeatherData = (weather: WeatherData | null): React.ReactNode => {
    if (!weather) {
        return (
            <div className="w-full text-center text-white/80 weather-text-muted">
                Đang cập nhật dữ liệu...
            </div>
        );
    }

    return (
         <div className="flex items-center justify-start space-x-6">
            <span className="font-bold uppercase w-40 text-base weather-text-strong flex-shrink-0">{weather.city}</span>

            <div className="flex items-center space-x-2">
                <WeatherIcon code={weather.weatherCode} className="w-7 h-7 -ml-1" />
                <span className="weather-text-muted text-base whitespace-nowrap">{getWeatherDescription(weather.weatherCode)}</span>
            </div>
            
            <div className="flex items-center space-x-1 font-mono font-extrabold text-lg weather-text-strong">
                <span className="text-cyan-300">{weather.tempMin}°</span>
                <span className="text-white/70">/</span>
                <span className="text-orange-300">{weather.tempMax}°C</span>
            </div>
            
            <span className="weather-text-muted whitespace-nowrap text-sm font-medium">Độ ẩm: <span className="font-mono font-bold text-base weather-text-strong">{weather.humidity}%</span></span>
            
            <span className="weather-text-muted whitespace-nowrap text-sm font-medium">Mưa: <span className="font-mono font-bold text-base weather-text-strong">{weather.rainChance}%</span></span>
         </div>
    );
};

const Title = () => (
    <div className="flex-shrink-0 flex items-center space-x-2 uppercase font-extrabold weather-text text-base">
        <ThermometerIcon className="w-5 h-5 opacity-90" />
        <span>Thời tiết</span>
    </div>
);

const Divider = () => <div className="h-6 w-px bg-white/30 select-none mx-4"></div>;


export const WeatherBar = ({ weatherData, isVisible }: BarProps) => {
    const { newsMode, disasterWarning } = useNews();
    const isMounted = useRef(false);

    const isBreaking = newsMode === 'breaking';
    const isDisasterOnWeather = newsMode === 'disaster' && disasterWarning?.displayLocation === 'weather';

    const specialModeClass = isBreaking ? 'breaking' : (isDisasterOnWeather ? 'disaster' : '');

    const [animationClass, setAnimationClass] = useState('');
    
    const newContent = useMemo(() => {
        return renderWeatherData(weatherData);
    }, [weatherData]);

    const [displayedContent, setDisplayedContent] = useState(newContent);

    useEffect(() => {
        // Prevent animation on initial mount
        if (isMounted.current) {
            setAnimationClass('animate-slide-out');
            const timer = setTimeout(() => {
                setDisplayedContent(newContent);
                setAnimationClass('animate-slide-in');
            }, 300);
            return () => clearTimeout(timer);
        } else {
            isMounted.current = true;
            // Set initial content without animation
            setDisplayedContent(newContent);
        }
    }, [newContent]);

    return (
        <div 
            className={`
                flex items-center tracking-wide text-white rounded-b-lg weather-bar
                overflow-hidden transition-all duration-300 ease-in-out
                ${specialModeClass}
                ${isVisible ? 'h-10 px-5 opacity-100' : 'h-0 p-0 opacity-0'}
            `}
        >
            {isDisasterOnWeather ? (
                <div className="flex items-center w-full h-full">
                    <div className="flex-shrink-0 flex items-center justify-center pr-4 font-black text-lg uppercase disaster-weather-tag">
                        {disasterWarning.tag}
                    </div>
                    <ScrollingNews
                        text={disasterWarning.content}
                        textClassName="scroller-text font-bold"
                        loadingClassName="scroller-text opacity-70"
                    />
                </div>
            ) : (
                <>
                    <Title />
                    <Divider />
                    <div className="flex-1 w-full h-full overflow-hidden text-sm">
                        <div className={`w-full h-full flex items-center ${animationClass}`}>
                            {displayedContent}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};