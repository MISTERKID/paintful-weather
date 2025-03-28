
import React from "react";
import { cn } from "@/lib/utils";
import { WeatherData } from "@/utils/weatherApi";
import { formatTemperature } from "@/utils/weatherUtils";
import ArtisticWeatherIcon from "./ArtisticWeatherIcon";

interface CurrentWeatherProps {
  weatherData: WeatherData;
  className?: string;
  isNight?: boolean;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weatherData,
  className,
  isNight = false,
}) => {
  const { location, temperature, condition, description, time, date } = weatherData;

  return (
    <div className={cn("text-center", className)}>
      <h1 className="text-4xl font-bold mb-1 paintbrush-text">
        {location}
      </h1>
      <p className="text-gray-600 mb-6">{date} • {time}</p>
      
      <div className="mb-6 flex justify-center">
        <ArtisticWeatherIcon 
          condition={condition} 
          size="xl" 
          isNight={isNight}
          className="mb-2"
        />
      </div>
      
      <div className="mb-4">
        <div className="text-6xl font-bold mb-2 paintbrush-text">
          {formatTemperature(temperature)}
        </div>
        <div className="text-xl capitalize paint-stroke inline-block">
          {description}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
