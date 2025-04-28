// src/api/favorites.ts
import api from "./axios";

export interface Favorite {
  id: string;
  city: string;
}

export async function getFavorites(): Promise<Favorite[]> {
  return (await api.get("/weather/favorites")).data;
}
export async function addFavorite(city: string): Promise<Favorite> {
  return (await api.post("/weather/favorites", { city })).data;
}
export async function removeFavorite(id: string): Promise<void> {
  await api.delete(`/weather/favorites/${id}`);
}
