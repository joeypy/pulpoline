// src/weather/dto/weather-data.dto.ts
export interface WeatherData {
  name: string;
  temp_c: number;
  temp_f: number;
  condition: string;
  icon: string;
  wind_kph: number;
  humidity: number;
  localtime: string;
}
