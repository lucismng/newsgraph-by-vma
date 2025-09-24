
import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types';
import { CITIES_DATA } from '../constants';

export const useWeather = (cityIndex: number | null) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  
  const fetchWeatherForCity = useCallback(async (city: { name: string; lat: number; lon: number }) => {
    try {
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&current=relative_humidity_2m&timezone=Asia/Ho_Chi_Minh`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} for ${city.name}`);
      }
      const data = await response.json();
      
      const weatherResult: WeatherData = {
        city: city.name,
        tempMin: Math.round(data.daily.temperature_2m_min[0]),
        tempMax: Math.round(data.daily.temperature_2m_max[0]),
        humidity: Math.round(data.current.relative_humidity_2m),
        rainChance: Math.round(data.daily.precipitation_probability_max[0]),
        weatherCode: data.daily.weather_code[0],
      };

      if (weatherResult && typeof weatherResult.city === 'string' && typeof weatherResult.tempMax === 'number') {
        setCurrentWeather(weatherResult);
      } else {
        throw new Error("Dữ liệu thời tiết trả về không hợp lệ.");
      }
    } catch (error) {
      console.error(`Lỗi khi tìm nạp dữ liệu thời tiết cho ${city.name}:`, error);
      setCurrentWeather(null); 
    }
  }, []);

  useEffect(() => {
    if (cityIndex === null) {
        return;
    }
    const city = CITIES_DATA[cityIndex];
    if (city) {
        fetchWeatherForCity(city);
    }
  }, [cityIndex, fetchWeatherForCity]);

  return currentWeather;
};
