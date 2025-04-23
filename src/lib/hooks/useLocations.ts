import { useState, useEffect, useCallback } from "react";
import { supabase, Location } from "../supabase";

export interface LocationOption {
  id: string;
  name: string;
  fullAddress: string;
}

export function useLocations() {
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Cache-Dauer in Millisekunden (1 Stunde)
  const CACHE_DURATION = 60 * 60 * 1000;

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("locations")
        .select("*")
        .order("name");

      if (supabaseError) {
        throw new Error(
          `Fehler beim Laden der Standorte: ${supabaseError.message}`
        );
      }

      if (!data) {
        throw new Error("Keine Daten vom Server erhalten");
      }

      const locationOptions: LocationOption[] = (data as Location[]).map(
        (loc) => ({
          id: loc.id,
          name: loc.name,
          fullAddress: `${loc.address}, ${loc.postal_code} ${loc.city}, ${loc.country}`,
        })
      );

      setLocations(locationOptions);
      setLastFetch(Date.now());
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Ein unbekannter Fehler ist aufgetreten")
      );
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const shouldRefetch = Date.now() - lastFetch > CACHE_DURATION;

    if (shouldRefetch || locations.length === 0) {
      fetchLocations();
    }
  }, [fetchLocations, lastFetch, locations.length]);

  const refresh = useCallback(() => {
    setLastFetch(0); // Erzwingt einen neuen Fetch
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    loading,
    error,
    refresh,
  };
}
