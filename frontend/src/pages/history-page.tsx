// src/pages/HistoryPage.tsx
import { useState, useEffect } from "react";
import { getWeather } from "@/api/weather";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  Favorite as FavType,
} from "@/api/favorites";
import { useHistory } from "@/hooks/use-history";
import { useAuth } from "@/context/auth-context";
import { WeatherData } from "@/types/weather.type";
import { WeatherCard } from "@/components/weather/weather-card";

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const { history, clearHistory } = useHistory(); // 🟢 añadimos clearHistory
  const [favorites, setFavorites] = useState<FavType[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getFavorites().then(setFavorites);
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const handleSelect = async (city: string) => {
    setSelectedCity(city);
    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch {
      setWeather(null);
    }
  };

  const toggleFavorite = async () => {
    const exists = favorites.find((f) => f.city === selectedCity);
    if (exists) {
      await removeFavorite(exists.id);
      setFavorites(favorites.filter((f) => f.id !== exists.id));
    } else {
      const newFav = await addFavorite(selectedCity);
      setFavorites([...favorites, newFav]);
    }
  };

  const isFav = favorites.some((f) => f.city === selectedCity);

  return (
    <main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Lista de historial */}
      <div className="order-2 md:order-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Historial</h2>
          <button
            onClick={clearHistory}
            className="text-sm text-red-500 hover:underline"
          >
            Borrar historial
          </button>
        </div>
        <ul className="space-y-2">
          {history.map((city) => (
            <li key={city}>
              <button
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Card de clima */}
      <div className="order-1 md:order-2 flex flex-col gap-4">
        {weather ? (
          <WeatherCard
            data={weather}
            isFavorite={isAuthenticated ? isFav : undefined}
            onToggleFavorite={isAuthenticated ? toggleFavorite : undefined}
          />
        ) : (
          <p className="text-gray-500">Selecciona una ciudad del historial</p>
        )}
      </div>
    </main>
  );
}
