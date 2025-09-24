import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { PartlyCloudyIcon } from './icons/PartlyCloudyIcon';
import { CloudIcon } from './icons/CloudIcon';
import { RainIcon } from './icons/RainIcon';
import { ThunderstormIcon } from './icons/ThunderstormIcon';
import { SnowIcon } from './icons/SnowIcon';

interface WeatherIconProps {
    code: number | undefined;
    className?: string;
}

const ICON_CLASS = "w-7 h-7";

export const WeatherIcon = ({ code, className }: WeatherIconProps) => {
    const finalClassName = className || ICON_CLASS;

    if (code === undefined) return <CloudIcon className={finalClassName} />;

    // WMO Code Mapping
    // https://open-meteo.com/en/docs
    if (code === 0) return <SunIcon className={finalClassName} />;
    if (code >= 1 && code <= 2) return <PartlyCloudyIcon className={finalClassName} />;
    if (code === 3) return <CloudIcon className={finalClassName} />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <RainIcon className={finalClassName} />;
    if (code >= 95 && code <= 99) return <ThunderstormIcon className={finalClassName} />;
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <SnowIcon className={finalClassName} />;
    
    // Fog, etc.
    if (code >= 45 && code <= 48) return <CloudIcon className={finalClassName} />;

    // Default
    return <CloudIcon className={finalClassName} />;
};
