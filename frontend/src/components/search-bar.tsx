import { useState, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onCitySelect: (city: string) => void;
}

export function SearchBar({ onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(-1);

  // fetch autocomplete
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    axios
      .get<string[]>(
        `${import.meta.env.VITE_BACKEND_URL}/weather/autocomplete`,
        { params: { query: debouncedQuery } }
      )
      .then((res) => setSuggestions(res.data))
      .catch(() => setError("Error fetching suggestions"))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // reset preview when suggestions or query changes
  useEffect(() => {
    setPreviewIndex(-1);
  }, [suggestions, debouncedQuery]);

  // key navigation handler
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setPreviewIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setPreviewIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" || e.key === "Tab") {
      if (previewIndex >= 0) {
        e.preventDefault(); // keep focus
        handleSelect(suggestions[previewIndex]);
      }
    }
  };

  const handleSelect = (city: string) => {
    setQuery(city);
    setSuggestions([]);
    setPreviewIndex(-1);
    onCitySelect(city);
  };

  const handleSubmit = () => {
    if (!query.trim()) {
      setError("Please enter a city");
      return;
    }
    handleSelect(query.trim());
  };

  const clear = () => {
    setQuery("");
    setSuggestions([]);
    setPreviewIndex(-1);
    setError(null);
  };

  // animations
  const listVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    hover: { backgroundColor: "#f3f4f6" },
  };
  const inputVariants = {
    full: { width: "100%" },
    shrink: { width: "auto" },
  };
  const btnHover = {
    scale: 1.05,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
  };

  // value & style for input preview
  const displayValue = previewIndex >= 0 ? suggestions[previewIndex] : query;
  const inputTextColor = previewIndex >= 0 ? "text-gray-500" : "text-black";

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
        {/* Input + clear button */}
        <motion.div
          className="flex items-center w-full md:flex-1"
          variants={inputVariants}
          animate={query ? "shrink" : "full"}
          transition={{ duration: 0.2 }}
        >
          <Input
            className={`flex-1 ${inputTextColor}`}
            placeholder="Search city..."
            value={displayValue}
            onChange={(e) => {
              setQuery(e.target.value);
              setPreviewIndex(-1);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // allow click handler on suggestion first
              setTimeout(() => setIsFocused(false), 100);
            }}
            onKeyDown={handleKeyDown}
            aria-controls="autocomplete-listbox"
            role="combobox"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={clear}
                aria-label="Clear"
                className="ml-2 flex-shrink-0 bg-white border border-gray-300 hover:bg-gray-50 p-2 rounded"
                whileHover={{ scale: 1.1 }}
                style={{ cursor: "pointer" }}
              >
                <X className="w-5 h-5 text-red-500" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search button */}
        <motion.div
          className="w-full md:w-auto"
          whileHover={btnHover}
          style={{ cursor: "pointer" }}
        >
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto bg-gray-500 text-white px-4 py-2 rounded"
          >
            Search
          </Button>
        </motion.div>
      </div>

      {error && (
        <motion.p
          className="text-sm text-red-500 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.ul
            id="autocomplete-listbox"
            role="listbox"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={listVariants}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((city, idx) => {
              const isActive = idx === previewIndex;
              return (
                <motion.li
                  key={city}
                  id={`suggestion-${idx}`}
                  role="option"
                  aria-selected={isActive}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onMouseDown={() => handleSelect(city)}
                  className={`px-3 py-2 cursor-pointer ${
                    isActive ? "bg-gray-100" : ""
                  }`}
                >
                  {city}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
