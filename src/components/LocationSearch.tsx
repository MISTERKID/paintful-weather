import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getCurrentLocation, getWeatherByCoordinates } from "@/utils/weatherApi";

interface LocationSearchProps {
  onSearch: (location: string) => void;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch, className }) => {
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = location.trim();
    
    if (!searchTerm) {
      toast.error("Please enter a location to search");
      return;
    }
    
    setIsSearching(true);
    
    try {
      onSearch(searchTerm);
      // Only toast success on actual API integration
      // toast.success(`Weather for ${searchTerm} loaded successfully`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search for location");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseLocation = async () => {
    setIsSearching(true);
    try {
      const { lat, lon } = await getCurrentLocation();
      const weatherData = await getWeatherByCoordinates(lat, lon);
      onSearch(weatherData.current.location);
      if (weatherData.current.location) {
        toast.success("Location found!");
      }
    } catch (error) {
      console.error("Location error:", error);
      if (error instanceof Error) {
        if (error.message.includes("Geolocation is not supported")) {
          toast.error("Your browser doesn't support location services. Please try searching manually.");
        } else if (error.message.includes("denied")) {
          toast.error("Location access was denied. Please allow location access in your browser settings or try searching manually.");
        } else if (error.message.includes("timeout")) {
          toast.error("Location request timed out. Please check your internet connection and try again.");
        } else if (error.message.includes("API key")) {
          toast.error("Weather service is not properly configured. Please try again later.");
        } else {
          toast.error(`Failed to get your location: ${error.message}`);
        }
      } else {
        toast.error("Failed to get your location. Please try searching manually.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="flex gap-3 relative">
        <div className="relative w-full group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-1000 animate-gradient"></div>
          <Input
            type="text"
            placeholder="Enter city name..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 text-lg bg-white/80 backdrop-blur-sm border-white/40 placeholder:text-gray-500/70 relative shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500/50"
            disabled={isSearching}
          />
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-300 animate-gradient"></div>
          <Button 
            type="submit" 
            className="h-12 px-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white backdrop-blur-sm relative shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-300 animate-gradient"></div>
          <Button 
            type="button"
            onClick={handleUseLocation}
            className="h-12 px-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white backdrop-blur-sm relative shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isSearching}
            title="Use my current location"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocationSearch;
