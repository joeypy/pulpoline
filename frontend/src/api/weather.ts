import { WeatherData } from "@/types/weather.type";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function getWeather(city: string): Promise<WeatherData> {
  const res = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
    params: { city },
  });
  return res.data;
}
