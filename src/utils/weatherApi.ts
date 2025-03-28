import { toast } from "sonner";

// Weather condition types
export type WeatherCondition = 
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'fog'
  | 'haze';

// Weather data types
export interface WeatherData {
  location: string;
  temperature: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  time: string;
  date: string;
}

export interface ForecastDay {
  date: string;
  time: string;
  temperature: {
    min: number;
    max: number;
  };
  condition: WeatherCondition;
  icon: string;
}

export interface WeatherResponse {
  current: WeatherData;
  forecast: ForecastDay[];
}

// API keys would normally be stored in environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

// Mock data for development (to avoid API rate limits)
const mockWeatherData: WeatherResponse = {
  current: {
    location: "New York",
    temperature: 22,
    condition: "clear",
    description: "Clear sky",
    icon: "01d",
    feelsLike: 23,
    humidity: 65,
    windSpeed: 5.2,
    time: "14:30",
    date: "May 15, 2024",
  },
  forecast: [
    {
      date: "May 16",
      time: "14:30",
      temperature: { min: 18, max: 25 },
      condition: "clear",
      icon: "01d",
    },
    {
      date: "May 17",
      time: "14:30",
      temperature: { min: 17, max: 24 },
      condition: "clouds",
      icon: "02d",
    },
    {
      date: "May 18",
      time: "14:30",
      temperature: { min: 16, max: 23 },
      condition: "rain",
      icon: "10d",
    },
    {
      date: "May 19",
      time: "14:30",
      temperature: { min: 15, max: 22 },
      condition: "clouds",
      icon: "03d",
    },
    {
      date: "May 20",
      time: "14:30",
      temperature: { min: 19, max: 26 },
      condition: "clear",
      icon: "01d",
    },
  ],
};

/**
 * Get weather data for a specific location
 * Uses mock data as fallback when API fails
 */
export const getWeatherData = async (
  location: string = "New York"
): Promise<WeatherResponse> => {
  try {
    // Try to fetch real data from API
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
    );
    
    if (!currentWeatherResponse.ok) {
      throw new Error("Failed to fetch current weather data");
    }
    
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error("Failed to fetch forecast data");
    }
    
    const currentData = await currentWeatherResponse.json();
    const forecastData = await forecastResponse.json();
    
    // Transform API data to our format
    const transformedData: WeatherResponse = {
      current: {
        location: currentData.name,
        temperature: currentData.main.temp,
        condition: mapWeatherCondition(currentData.weather[0].main.toLowerCase()),
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        feelsLike: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        time: new Date((currentData.dt + currentData.timezone) * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        }),
        date: new Date((currentData.dt + currentData.timezone) * 1000).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric',
          timeZone: 'UTC'
        }),
      },
      forecast: forecastData.list
        .filter((item: any, index: number) => index % 8 === 0) // Get one reading per day
        .slice(0, 5) // Get 5 days
        .map((item: any) => ({
          date: new Date((item.dt + currentData.timezone) * 1000).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            timeZone: 'UTC'
          }),
          time: new Date((item.dt + currentData.timezone) * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          }),
          temperature: {
            min: item.main.temp_min,
            max: item.main.temp_max,
          },
          condition: mapWeatherCondition(item.weather[0].main.toLowerCase()),
          icon: item.weather[0].icon,
        })),
    };
    
    return transformedData;
  } catch (error) {
    console.warn("Using mock data due to API error:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        toast.error("Weather service is not properly configured. Please check your API key.");
      } else if (error.message.includes("401")) {
        toast.error("Invalid API key. Please check your OpenWeatherMap API key.");
      } else if (error.message.includes("429")) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(`Weather service error: ${error.message}`);
      }
    } else {
      toast.error("Failed to fetch weather data. Using sample data instead.");
    }
    toast.info("Using sample weather data because the weather service is unavailable. This is a fallback to ensure you can still preview the app's features.");
    return mockWeatherData;
  }
};

/**
 * Get weather data by coordinates
 */
export const getWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<WeatherResponse> => {
  try {
    if (!API_KEY || API_KEY === "your-openweathermap-api-key") {
      throw new Error("API key is not configured. Please check your environment variables.");
    }

    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!currentWeatherResponse.ok) {
      const errorData = await currentWeatherResponse.json();
      throw new Error(errorData.message || "Failed to fetch current weather data");
    }
    
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      throw new Error(errorData.message || "Failed to fetch forecast data");
    }
    
    const currentData = await currentWeatherResponse.json();
    const forecastData = await forecastResponse.json();
    
    // Transform API data to our format
    const transformedData: WeatherResponse = {
      current: {
        location: currentData.name,
        temperature: currentData.main.temp,
        condition: mapWeatherCondition(currentData.weather[0].main.toLowerCase()),
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        feelsLike: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        time: new Date((currentData.dt + currentData.timezone) * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        }),
        date: new Date((currentData.dt + currentData.timezone) * 1000).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric',
          timeZone: 'UTC'
        }),
      },
      forecast: forecastData.list
        .filter((item: any, index: number) => index % 8 === 0)
        .slice(0, 5)
        .map((item: any) => ({
          date: new Date((item.dt + currentData.timezone) * 1000).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            timeZone: 'UTC'
          }),
          time: new Date((item.dt + currentData.timezone) * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          }),
          temperature: {
            min: item.main.temp_min,
            max: item.main.temp_max,
          },
          condition: mapWeatherCondition(item.weather[0].main.toLowerCase()),
          icon: item.weather[0].icon,
        })),
    };
    
    return transformedData;
  } catch (error) {
    console.warn("Using mock data due to API error:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        toast.error("Weather service is not properly configured. Please check your API key.");
      } else if (error.message.includes("401")) {
        toast.error("Invalid API key. Please check your OpenWeatherMap API key.");
      } else if (error.message.includes("429")) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(`Weather service error: ${error.message}`);
      }
    } else {
      toast.error("Failed to fetch weather data. Using sample data instead.");
    }
    toast.info("Using sample weather data because the weather service is unavailable. This is a fallback to ensure you can still preview the app's features.");
    return mockWeatherData;
  }
};

/**
 * Get current location using browser's Geolocation API
 */
export const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    // Request location with high accuracy and force a new permission prompt
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location access was denied. Please allow location access in your browser settings."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable. Please check your device's location services."));
            break;
          case error.TIMEOUT:
            reject(new Error("Location request timed out. Please check your internet connection."));
            break;
          default:
            reject(new Error("An unknown error occurred while getting your location."));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// Helper function to map OpenWeatherMap conditions to our WeatherCondition type
function mapWeatherCondition(condition: string): WeatherCondition {
  const conditionMap: Record<string, WeatherCondition> = {
    'clear': 'clear',
    'clouds': 'clouds',
    'rain': 'rain',
    'drizzle': 'drizzle',
    'thunderstorm': 'thunderstorm',
    'snow': 'snow',
    'mist': 'mist',
    'fog': 'fog',
    'haze': 'haze',
  };
  
  return conditionMap[condition] || 'clear';
}
