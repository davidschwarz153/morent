import { useState, useEffect, useCallback } from "react";
import { supabase, Vehicle } from "../supabase";

export interface VehicleFilters {
  brand?: string;
  vehicletype?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  availability?: boolean;
  electricvehicle?: boolean;
  geartype?: string;
  seats?: number;
  luggage?: number;
}

export function useVehicles(filters?: VehicleFilters) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Cache-Dauer in Millisekunden (5 Minuten)
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("vehicles").select("*");

      // Anwenden der Filter, falls vorhanden
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            switch (key) {
              case "brand":
                query = query.ilike("brand", `%${value}%`);
                break;
              case "minPrice":
                query = query.gte("priceperday", value);
                break;
              case "maxPrice":
                query = query.lte("priceperday", value);
                break;
              case "location":
                query = query.contains("locations", [value]);
                break;
              case "vehicletype":
                query = query.ilike("vehicletype", `%${value}%`);
                break;
              default:
                query = query.eq(key, value);
            }
          }
        });
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw new Error(
          `Fehler beim Laden der Fahrzeuge: ${supabaseError.message}`
        );
      }

      if (!data) {
        throw new Error("Keine Daten vom Server erhalten");
      }

      // Sortiere die Daten clientseitig
      const sortedData = [...data].sort(
        (a, b) => (a.priceperday || 0) - (b.priceperday || 0)
      );

      setVehicles(sortedData as Vehicle[]);
      setLastFetch(Date.now());
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Ein unbekannter Fehler ist aufgetreten")
      );
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const shouldRefetch = Date.now() - lastFetch > CACHE_DURATION;

    if (shouldRefetch || vehicles.length === 0) {
      fetchVehicles();
    }
  }, [fetchVehicles, lastFetch, vehicles.length]);

  const refresh = useCallback(() => {
    setLastFetch(0); // Erzwingt einen neuen Fetch
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refresh,
  };
}
