import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface SearchFilters {
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
}

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    dropoffLocation: "",
    dropoffDate: "",
    dropoffTime: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SearchFilters, string>>
  >({});
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("locations").select("locations");
      if (!error && data) {
        // If the locations field is an array, take all unique values
        const all = data.flatMap((row: any) =>
          Array.isArray(row.locations)
            ? row.locations
            : typeof row.locations === "string"
            ? row.locations.split(",").map((s: string) => s.trim())
            : []
        );
        setLocations(Array.from(new Set(all)));
      }
      setLoading(false);
    };
    fetchLocations();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SearchFilters, string>> = {};

    if (!filters.pickupLocation) {
      newErrors.pickupLocation = "Bitte wählen Sie einen Abholort";
    }

    if (!filters.pickupDate) {
      newErrors.pickupDate = "Bitte wählen Sie ein Abholdatum";
    }

    if (!filters.pickupTime) {
      newErrors.pickupTime = "Bitte wählen Sie eine Abholzeit";
    }

    if (!filters.dropoffLocation) {
      newErrors.dropoffLocation = "Bitte wählen Sie einen Rückgabeort";
    }

    if (!filters.dropoffDate) {
      newErrors.dropoffDate = "Bitte wählen Sie ein Rückgabedatum";
    }

    if (!filters.dropoffTime) {
      newErrors.dropoffTime = "Bitte wählen Sie eine Rückgabezeit";
    }

    // Datumvalidierung
    const pickupDateTime = new Date(
      `${filters.pickupDate}T${filters.pickupTime}`
    );
    const dropoffDateTime = new Date(
      `${filters.dropoffDate}T${filters.dropoffTime}`
    );

    if (pickupDateTime >= dropoffDateTime) {
      newErrors.dropoffDate = "Rückgabedatum muss nach Abholdatum liegen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    // Fehler für dieses Feld zurücksetzen
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSearch = () => {
    if (validateForm()) {
      console.log('[SearchForm] onSearch вызван с фильтрами:', filters);
      onSearch(filters);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-lg mb-4 dark:text-white">
            Abholung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ort
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                value={filters.pickupLocation}
                onChange={(e) => handleChange("pickupLocation", e.target.value)}
                disabled={loading}
              >
                <option value="">Bitte wählen</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.pickupLocation && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.pickupLocation}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Datum
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                value={filters.pickupDate}
                onChange={(e) => handleChange("pickupDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.pickupDate && (
                <p className="mt-1 text-sm text-red-500">{errors.pickupDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Uhrzeit
              </label>
              <input
                type="time"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                value={filters.pickupTime}
                onChange={(e) => handleChange("pickupTime", e.target.value)}
              />
              {errors.pickupTime && (
                <p className="mt-1 text-sm text-red-500">{errors.pickupTime}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 dark:text-white">
            Rückgabe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ort
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                value={filters.dropoffLocation}
                onChange={(e) => handleChange("dropoffLocation", e.target.value)}
                disabled={loading}
              >
                <option value="">Bitte wählen</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.dropoffLocation && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.dropoffLocation}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Datum
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                value={filters.dropoffDate}
                onChange={(e) => handleChange("dropoffDate", e.target.value)}
                min={filters.pickupDate || new Date().toISOString().split("T")[0]}
              />
              {errors.dropoffDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.dropoffDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Uhrzeit
              </label>
              <input
                type="time"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                value={filters.dropoffTime}
                onChange={(e) => handleChange("dropoffTime", e.target.value)}
              />
              {errors.dropoffTime && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.dropoffTime}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleSearch}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Fahrzeuge suchen
        </button>
      </div>
    </div>
  );
}
