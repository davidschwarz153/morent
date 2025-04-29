import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, Vehicle } from "../supabase";

export interface VehicleFilters {
  brand?: string[];
  vehicletype?: string[];
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  dropoffLocation?: string;
  availability?: boolean;
  electricvehicle?: boolean;
  geartype?: string[];
  fuel?: string[];
  sortBy?: "price_asc" | "price_desc" | "model_asc" | "model_desc";
}

export function useVehicles(filters?: VehicleFilters) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchVehicles = useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      setLoading(true);
      setError(null);

      // Проверяем, есть ли активные фильтры
      const hasActiveFilters = Object.entries(filters || {}).some(
        ([key, value]) => {
          if (key === "minPrice" || key === "maxPrice") return false;
          return Array.isArray(value) ? value.length > 0 : !!value;
        }
      );

      let query = supabase.from("vehicles").select("*").limit(100);

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw new Error(`Database error: ${supabaseError.message}`);
      }

      if (!data) {
        throw new Error("No data received from server");
      }

      setAllVehicles(data as Vehicle[]);

      // Если нет активных фильтров, возвращаем все данные
      if (!hasActiveFilters) {
        setVehicles(data as Vehicle[]);
        return;
      }

      let filteredData = data;

      // Фильтрация по бренду
      if (filters?.brand && filters.brand.length > 0) {
        filteredData = filteredData.filter((vehicle) =>
          filters.brand?.some(
            (brand) => vehicle.brand?.toLowerCase() === brand.toLowerCase()
          )
        );
      }

      // Фильтрация по типу автомобиля
      if (filters?.vehicletype && filters.vehicletype.length > 0) {
        filteredData = filteredData.filter((vehicle) =>
          filters.vehicletype?.some(
            (type) => vehicle.vehicletype?.toLowerCase() === type.toLowerCase()
          )
        );
      }

      // Фильтрация по цене
      if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
        filteredData = filteredData.filter((vehicle) => {
          const price = vehicle.priceperday || 0;
          return (
            (!filters.minPrice || price >= filters.minPrice) &&
            (!filters.maxPrice || price <= filters.maxPrice)
          );
        });
      }

      // Фильтрация по типу коробки передач
      if (
        filters?.geartype &&
        Array.isArray(filters.geartype) &&
        filters.geartype.length > 0
      ) {
        filteredData = filteredData.filter((vehicle) => {
          const vehicleGearType = vehicle.geartype?.toLowerCase() || "";
          return filters.geartype?.some((type) => {
            const filterGearType = type.toLowerCase();
            const normalizedVehicleGearType = vehicleGearType.includes("manuel")
              ? "manuel"
              : vehicleGearType.includes("auto")
              ? "automatic"
              : vehicleGearType;
            const normalizedFilterGearType = filterGearType.includes("manuel")
              ? "manuel"
              : filterGearType.includes("auto")
              ? "automatic"
              : filterGearType;
            return normalizedVehicleGearType === normalizedFilterGearType;
          });
        });
      }

      // Фильтрация по типу топлива
      if (filters?.fuel && filters.fuel.length > 0) {
        filteredData = filteredData.filter((vehicle) =>
          filters.fuel?.some(
            (type) => vehicle.fuel?.toLowerCase() === type.toLowerCase()
          )
        );
      }

      setVehicles(filteredData as Vehicle[]);
    } catch (err) {
      console.error("Error in fetchVehicles:", err);
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      setVehicles([]);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [filters, isFetching]);

  useEffect(() => {
    // Очищаем предыдущий таймаут
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Устанавливаем новый таймаут
    timeoutRef.current = setTimeout(() => {
      fetchVehicles();
    }, 500); // Увеличиваем задержку до 500мс

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [filters]);

  return { vehicles, allVehicles, loading, error, refresh: fetchVehicles };
}
