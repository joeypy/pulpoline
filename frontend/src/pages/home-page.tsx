// src/pages/HomePage.tsx
import { useState, useEffect } from "react";
import { getWeather } from "@/api/weather";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  Favorite as FavType,
} from "@/api/favorites";
import { SearchBar } from "@/components/search-bar";
import { WeatherCard } from "@/components/weather/weather-card";
import { useAuth } from "@/context/auth-context";
import { useHistory } from "@/hooks/use-history"; // 🟢
import { WeatherData } from "@/types/weather.type";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentCity, setCurrentCity] = useState("");
  const [favorites, setFavorites] = useState<FavType[]>([]);

  // Desestructuramos addHistory
  const { addHistory } = useHistory(); // 🟢

  const loadFavorites = async () => {
    if (!isAuthenticated) return;
    const favs = await getFavorites();
    setFavorites(favs);
  };

  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  const handleCitySelect = async (city: string) => {
    setCurrentCity(city);
    const data = await getWeather(city);
    setWeather(data);
    addHistory(city); // 🟢 guarda en localStorage
  };

  const toggleFavorite = async () => {
    const existing = favorites.find((f) => f.city === currentCity);
    if (existing) {
      // eliminar favorito
      await removeFavorite(existing.id);
      setFavorites(favorites.filter((f) => f.id !== existing.id));
    } else {
      // añadir favorito
      const newFav = await addFavorite(currentCity);
      setFavorites([...favorites, newFav]);
    }
  };

  const isFav = favorites.some((f) => f.city === currentCity);

  return (
    <main className="p-4">
      <SearchBar onCitySelect={handleCitySelect} />
      {weather && (
        <WeatherCard
          data={weather}
          isFavorite={isAuthenticated ? isFav : undefined}
          onToggleFavorite={isAuthenticated ? toggleFavorite : undefined}
        />
      )}
    </main>
  );
}
