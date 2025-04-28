import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { WeatherData } from "@/types/weather.type";

interface WeatherCardProps {
  data: WeatherData;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function WeatherCard({
  data,
  isFavorite = false,
  onToggleFavorite,
}: WeatherCardProps) {
  return (
    <Card className="mt-4 relative w-full mx-auto sm:max-w-md">
      {onToggleFavorite && (
        <motion.button
          onClick={onToggleFavorite}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.2 }}
          className="absolute top-2 right-2"
          style={{ cursor: "pointer" }}
        >
          <Star
            className={`w-6 h-6 ${
              isFavorite ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        </motion.button>
      )}
      <CardHeader className="flex items-center space-x-4">
        <img
          src={`https:${data.icon}`}
          alt={data.condition}
          className="w-12 h-12"
        />
        <div className="flex flex-col gap-1">
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>
            {data.country} - {data.region}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <p>Condition: {data.condition}</p>
        <p>
          Temp: {data.temp_c}°C / {data.temp_f}°F
        </p>
        <p>Wind: {data.wind_kph} kph</p>
        <p>Humidity: {data.humidity}%</p>
        <p>Local Time: {data.localtime}</p>
      </CardContent>
    </Card>
  );
}
