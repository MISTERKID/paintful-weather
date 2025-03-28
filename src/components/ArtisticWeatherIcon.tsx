import React from "react";
import { Cloud, CloudRain, CloudSun, Moon, Sun, Thermometer, Wind, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherCondition } from "@/utils/weatherApi";

interface ArtisticWeatherIconProps {
  condition: WeatherCondition;
  size?: "sm" | "md" | "lg" | "xl";
  isAnimated?: boolean;
  className?: string;
  isNight?: boolean;
}

const ArtisticWeatherIcon: React.FC<ArtisticWeatherIconProps> = ({
  condition,
  size = "md",
  isAnimated = true,
  className,
  isNight = false,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const iconClassName = cn(
    sizeClasses[size],
    isAnimated && "transition-all duration-300 ease-in-out",
    isAnimated && "hover:scale-110",
    className
  );

  // Add a painterly filter to the icons
  const renderIcon = () => {
    // For night time with clear weather
    if (isNight && condition === "clear") {
      return (
        <div className="relative">
          {/* Night sky background */}
          <div className="absolute inset-0 blur-sm opacity-40 bg-indigo-900 rounded-full transform scale-110" />
          {/* Moon glow */}
          <div className="absolute inset-0 blur-sm opacity-30 bg-indigo-400 rounded-full transform scale-110" />
          {/* Moon */}
          <Moon className={cn(iconClassName, "text-indigo-200 relative z-10")} />
          {/* Stars */}
          <div className="absolute -top-1 -right-1">
            <Star className="w-3 h-3 text-yellow-200 animate-twinkle" />
          </div>
          <div className="absolute -bottom-1 -left-1">
            <Star className="w-2 h-2 text-yellow-200 animate-twinkle [animation-delay:0.5s]" />
          </div>
          <div className="absolute top-1/2 -right-2">
            <Star className="w-2.5 h-2.5 text-yellow-200 animate-twinkle [animation-delay:1s]" />
          </div>
        </div>
      );
    }

    // For all other conditions (both day and night)
    switch (condition) {
      case "clear":
        return (
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-30 bg-yellow-300 rounded-full transform scale-110" />
            <Sun className={cn(iconClassName, "text-yellow-400 relative z-10")} />
          </div>
        );
      case "clouds":
        return (
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-30 bg-gray-300 rounded-full transform scale-110" />
            <CloudSun className={cn(iconClassName, "text-gray-500 relative z-10")} />
          </div>
        );
      case "rain":
      case "drizzle":
      case "thunderstorm":
        return (
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-30 bg-blue-300 rounded-full transform scale-110" />
            <CloudRain className={cn(iconClassName, "text-blue-400 relative z-10")} />
          </div>
        );
      case "snow":
        return (
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-30 bg-blue-100 rounded-full transform scale-110" />
            <Cloud className={cn(iconClassName, "text-gray-300 relative z-10")} />
          </div>
        );
      case "mist":
      case "fog":
      case "haze":
        return (
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-30 bg-gray-300 rounded-full transform scale-110" />
            <Cloud className={cn(iconClassName, "text-gray-400 relative z-10")} />
          </div>
        );
      default:
        return (
          <div className="relative">
            <div className="absolute inset-0 blur-sm opacity-30 bg-yellow-300 rounded-full transform scale-110" />
            <Sun className={cn(iconClassName, "text-yellow-400 relative z-10")} />
          </div>
        );
    }
  };

  return (
    <div className={cn("relative", isAnimated && "animate-float")}>
      {renderIcon()}
      <div className="absolute -inset-2 bg-white/20 rounded-full blur-lg -z-10" />
    </div>
  );
};

export default ArtisticWeatherIcon;
