import { WeatherCondition } from "./weatherApi";

// Get background gradient based on weather condition and time
export const getWeatherBackground = (
  condition: WeatherCondition,
  isNight: boolean = false
): string => {
  if (isNight) {
    return "bg-gradient-to-br from-indigo-900 to-purple-800";
  }

  switch (condition) {
    case "clear":
      return "bg-gradient-to-br from-yellow-300 to-orange-500";
    case "clouds":
      return "bg-gradient-to-br from-gray-200 to-gray-400";
    case "rain":
    case "drizzle":
    case "thunderstorm":
      return "bg-gradient-to-br from-blue-200 to-blue-400";
    case "snow":
      return "bg-gradient-to-br from-blue-50 to-gray-200";
    case "mist":
    case "fog":
    case "haze":
      return "bg-gradient-to-br from-gray-300 to-gray-400";
    default:
      return "bg-gradient-to-br from-yellow-300 to-orange-500";
  }
};

// Get icon for weather condition
export const getIconForCondition = (condition: WeatherCondition): string => {
  switch (condition) {
    case "clear":
      return "sun";
    case "clouds":
      return "cloud";
    case "rain":
    case "drizzle":
      return "cloud-rain";
    case "thunderstorm":
      return "cloud-lightning";
    case "snow":
      return "snowflake";
    case "mist":
    case "fog":
    case "haze":
      return "cloud-fog";
    default:
      return "sun";
  }
};

// Format temperature to display
export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

// Check if current time is night
export const isNightTime = (): boolean => {
  const hours = new Date().getHours();
  return hours >= 18 || hours < 6;
};

// Format date to display
export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  
  return new Date(date).toLocaleDateString("en-US", options);
};
