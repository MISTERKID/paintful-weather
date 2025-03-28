import React from "react";
import { cn } from "@/lib/utils";
import { ForecastDay } from "@/utils/weatherApi";
import { formatTemperature } from "@/utils/weatherUtils";
import ArtisticWeatherIcon from "./ArtisticWeatherIcon";

interface WeatherForecastProps {
  forecast: ForecastDay[];
  className?: string;
  isNight?: boolean;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast, className, isNight = false }) => {
  // Function to determine if it's night time based on the time
  const isNightTime = (time: string) => {
    // Since we're using 24-hour format from the API, we can directly parse the hour
    const hour = parseInt(time.split(':')[0]);
    // Night time is between 6 PM (18:00) and 6 AM (06:00)
    // Add some buffer time for sunset/sunrise
    return hour >= 17 || hour < 7;
  };

  return (
    <div className={cn("", className)}>
      <h2 className="text-xl font-semibold mb-4 paintbrush-text">5-Day Forecast</h2>
      
      <div className="grid grid-cols-5 gap-2">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="watercolor-card p-3 flex flex-col items-center transition-transform hover:scale-105"
          >
            <p className="text-sm font-medium mb-2">{day.date}</p>
            <ArtisticWeatherIcon 
              condition={day.condition} 
              size="md" 
              isNight={isNight}
            />
            <div className="mt-2 text-sm">
              <span className="font-semibold">{formatTemperature(day.temperature.max)}</span>
              <span className="text-gray-500 mx-1">/</span>
              <span className="text-gray-500">{formatTemperature(day.temperature.min)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
