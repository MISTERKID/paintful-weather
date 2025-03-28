import React, { useEffect, useState } from "react";
import { getWeatherData, WeatherResponse } from "@/utils/weatherApi";
import { getWeatherBackground, isNightTime } from "@/utils/weatherUtils";
import { Toaster } from "@/components/ui/sonner";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherForecast from "@/components/WeatherForecast";
import WeatherDetails from "@/components/WeatherDetails";
import LocationSearch from "@/components/LocationSearch";
import { cn } from "@/lib/utils";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNight, setIsNight] = useState<boolean>(false);
  
  const fetchWeather = async (location?: string) => {
    setLoading(true);
    try {
      const data = await getWeatherData(location);
      setWeatherData(data);
      // Use the time from the API response to determine if it's night
      const currentHour = parseInt(data.current.time.split(':')[0]);
      // Night time is between 6 PM (18:00) and 6 AM (06:00)
      setIsNight(currentHour >= 18 || currentHour < 6);
      
      // Update time status every minute
      const interval = setInterval(() => {
        const updatedHour = parseInt(data.current.time.split(':')[0]);
        setIsNight(updatedHour >= 18 || updatedHour < 6);
      }, 60000);
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSearch = (location: string) => {
    fetchWeather(location);
  };

  const backgroundClass = weatherData 
    ? getWeatherBackground(weatherData.current.condition, isNight) 
    : "bg-gradient-to-br from-yellow-300 to-orange-500";

  return (
    <div 
      className={cn(
        "min-h-screen w-full transition-colors duration-500 canvas-texture",
        backgroundClass
      )}
    >
      <Toaster />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 blur-sm opacity-30 bg-blue-300 rounded-full transform scale-110"></div>
              <svg 
                className="w-8 h-8 text-blue-400 relative z-10 animate-float" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.5 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold paintbrush-text text-center">
              Paintful Weather
            </h1>
          </div>
          
          <LocationSearch onSearch={handleSearch} className="max-w-md mx-auto" />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : weatherData ? (
          <div className="space-y-6">
            <div className="watercolor-card p-6">
              <CurrentWeather 
                weatherData={weatherData.current} 
                isNight={isNight}
              />
            </div>
            
            <div className="watercolor-card p-6">
              <WeatherDetails weatherData={weatherData.current} />
            </div>
            
            <div className="watercolor-card p-6">
              <WeatherForecast forecast={weatherData.forecast} isNight={isNight} />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>Unable to load weather data. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
