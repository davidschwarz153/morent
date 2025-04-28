import { useState, useEffect, useCallback } from "react";
import { supabase, Vehicle } from "../supabase";

export interface VehicleFilters {
  brand?: string;
  vehicletype?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  dropoffLocation?: string;
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

  const fetchVehicles = useCallback(async () => {
    try {
      console.log('[useVehicles] Starte Laden mit Filtern:', filters);
      setLoading(true);
      setError(null);

      let query = supabase.from("vehicles").select("*");

      // Filter anwenden, wenn vorhanden
      if (filters) {
        console.log('[useVehicles] Wende Filter an:', filters);
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
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
                // Verwende contains statt containedBy für die Suche nach einem Wert im Array
                query = query.contains('locations', [value.trim()]);
                break;
              case "vehicletype":
                query = query.ilike("vehicletype", `%${value}%`);
                break;
              default:
                if (key !== 'dropoffLocation') {
                  query = query.eq(key, value);
                }
            }
          }
        });
      }

      let { data, error: supabaseError } = await query;
      console.log('[useVehicles] Daten von Supabase erhalten:', data);

      if (filters?.dropoffLocation && data) {
        const dropoff = filters.dropoffLocation.trim();
        console.log('[useVehicles] Filtere nach Rückgabeort:', dropoff);
        data = data.filter((vehicle: Vehicle) => {
          const locations = Array.isArray(vehicle.locations)
            ? vehicle.locations
            : typeof vehicle.locations === "string"
            ? (vehicle.locations as string).split(",").map((s: string) => s.trim())
            : [];
          const hasLocation = locations.some((loc: string) => 
            loc.trim().toLowerCase() === dropoff.toLowerCase()
          );
          console.log(`[useVehicles] Prüfe Standorte für ${vehicle.brand}:`, locations, 'Ergebnis:', hasLocation);
          return hasLocation;
        });
        console.log('[useVehicles] Gefilterte Daten:', data);
      }

      if (supabaseError) {
        throw new Error(
          `Fehler beim Laden der Fahrzeuge: ${supabaseError.message}`
        );
      }

      if (!data) {
        throw new Error("Keine Daten vom Server erhalten");
      }

      // Daten sortieren und Status aktualisieren
      const sortedData = [...data].sort(
        (a, b) => (a.priceperday || 0) - (b.priceperday || 0)
      );

      console.log('[useVehicles] Setze sortierte Daten:', sortedData);
      setVehicles(sortedData as Vehicle[]);
    } catch (err) {
      console.error('[useVehicles] Fehler beim Laden:', err);
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

  // Daten bei Filteränderungen aktualisieren
  useEffect(() => {
    console.log('[useVehicles] Effekt ausgelöst, Filter:', filters);
    fetchVehicles();
  }, [filters, fetchVehicles]);

  const refresh = useCallback(() => {
    console.log('[useVehicles] Erzwinge Aktualisierung');
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refresh,
  };
}
