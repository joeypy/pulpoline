// src/pages/FavoritesPage.tsx
import { useState, useEffect } from "react";
import { getFavorites, removeFavorite } from "@/api/favorites";
import { Favorite } from "@/api/favorites";
import { getWeather } from "@/api/weather";
import { WeatherData } from "@/types/weather.type";
import { WeatherCard } from "@/components/weather/weather-card";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [selected, setSelected] = useState<Favorite | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleSelect = async (fav: Favorite) => {
    setSelected(fav);
    const data = await getWeather(fav.city);
    setWeather(data);
  };

  const handleToggle = async () => {
    if (!selected) return;
    await removeFavorite(selected.id);
    setSelected(null);
    setWeather(null);
    loadFavorites();
  };

  return (
    <main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
        <ul className="space-y-2">
          {favorites.map((fav) => (
            <li key={fav.id}>
              <button
                onClick={() => handleSelect(fav)}
                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              >
                {fav.city}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {weather && selected ? (
          <WeatherCard
            data={weather}
            isFavorite={true}
            onToggleFavorite={handleToggle}
          />
        ) : (
          <p className="text-gray-500">
            Selecciona una ciudad de favoritos para ver detalles
          </p>
        )}
      </div>
    </main>
  );
}
