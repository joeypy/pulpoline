// src/hooks/useHistory.ts
import { useState, useEffect } from "react";

export function useHistory(): {
  history: string[];
  addHistory: (city: string) => void;
  clearHistory: () => void;
} {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("weatherHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const addHistory = (city: string) => {
    setHistory((prev) => {
      const updated = [...prev.filter((c) => c !== city), city];
      localStorage.setItem("weatherHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("weatherHistory");
  };

  return { history, addHistory, clearHistory };
}
