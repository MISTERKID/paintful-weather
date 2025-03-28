
import React from "react";
import { Thermometer, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherData } from "@/utils/weatherApi";
import { formatTemperature } from "@/utils/weatherUtils";

interface WeatherDetailsProps {
  weatherData: WeatherData;
  className?: string;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weatherData, className }) => {
  const { feelsLike, humidity, windSpeed } = weatherData;

  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      <div className="watercolor-card p-4 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-2">
          <Thermometer className="w-5 h-5 mr-1 text-orange-400" />
        </div>
        <span className="text-xs text-gray-500">Feels Like</span>
        <span className="text-lg font-semibold">{formatTemperature(feelsLike)}</span>
      </div>
      
      <div className="watercolor-card p-4 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-2">
          <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xs text-gray-500">Humidity</span>
        <span className="text-lg font-semibold">{humidity}%</span>
      </div>
      
      <div className="watercolor-card p-4 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-2">
          <Wind className="w-5 h-5 mr-1 text-blue-300" />
        </div>
        <span className="text-xs text-gray-500">Wind</span>
        <span className="text-lg font-semibold">{windSpeed} m/s</span>
      </div>
    </div>
  );
};

export default WeatherDetails;
