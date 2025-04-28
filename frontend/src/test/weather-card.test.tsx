// src/test/weather-card.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WeatherCard } from "../components/weather/weather-card";

describe("WeatherCard", () => {
  const sampleData = {
    name: "TestCity",
    region: "R1",
    country: "C1",
    temp_c: 22,
    temp_f: 72,
    condition: "Sunny",
    icon: "/icon.png",
    wind_kph: 5,
    humidity: 55,
    localtime: "2025-04-28 12:00",
  };

  it("renders all weather fields correctly", () => {
    render(<WeatherCard data={sampleData} />);

    // Ciudad
    expect(screen.getByText(/TestCity/)).toBeTruthy();

    // Condición
    expect(screen.getByText(/Condition:\s*Sunny/)).toBeTruthy();

    // Temperaturas
    expect(screen.getByText(/Temp:\s*22\s*°C\s*\/\s*72\s*°F/)).toBeTruthy();

    // Viento
    expect(screen.getByText(/Wind:\s*5\s*kph/)).toBeTruthy();

    // Humedad
    expect(screen.getByText(/Humidity:\s*55\s*%/)).toBeTruthy();

    // Hora local
    expect(screen.getByText(/Local Time:\s*2025-04-28 12:00/)).toBeTruthy();

    // Ícono
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.src).toContain("/icon.png");
  });

  it("calls onToggleFavorite when favorite button is clicked", () => {
    const onToggle = vi.fn();
    render(
      <WeatherCard
        data={sampleData}
        isFavorite={false}
        onToggleFavorite={onToggle}
      />
    );

    // Hay un único botón en el card: el de favorito
    const favBtn = screen.getByRole("button");
    expect(favBtn).toBeTruthy();

    fireEvent.click(favBtn);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("does not render favorite button when no onToggleFavorite prop", () => {
    render(<WeatherCard data={sampleData} />);

    const favBtn = screen.queryByRole("button");
    expect(favBtn).toBeNull();
  });
});
