import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VehicleCard from "../components/VehicleCard";
import { useVehicles } from "../lib/hooks/useVehicles";
import { MdSwapVert } from "react-icons/md";
import { Vehicle } from "../lib/supabase";

interface SearchFilters {
  type?: string[];
  maxPrice: number;
  brand?: string[];
  minPrice: number;
  geartype?: string[];
  fuel?: string[];
  sortBy?: "price_asc" | "price_desc" | "model_asc" | "model_desc";
}

const LoadingSpinner = () => (
  <div className="text-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    <p className="text-gray-500 mt-4">Fahrzeuge werden geladen...</p>
  </div>
);

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    maxPrice: 1000,
    brand: [],
    minPrice: 0,
    geartype: [],
    fuel: [],
    sortBy: "price_asc",
  });
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [displayedVehicles, setDisplayedVehicles] = useState<Vehicle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { vehicles, loading, error } = useVehicles({
    vehicletype: filters.type?.length ? filters.type[0] : undefined,
    maxPrice: filters.maxPrice,
    minPrice: filters.minPrice,
    brand: filters.brand?.length ? filters.brand[0] : undefined,
  });

  // Обработка загрузки и обновлений
  useEffect(() => {
    if (!loading && vehicles) {
      const filtered = vehicles
        .filter((vehicle) => {
          // Filter by location (case-insensitive, ignore spaces)
          if (pickupLocation) {
            const locs = Array.isArray(vehicle.locations)
              ? vehicle.locations
              : typeof vehicle.locations === 'string'
              ? (vehicle.locations as string).split(',').map((s: string) => s.trim())
              : [];
            const pickup = pickupLocation.trim().toLowerCase();
            if (!locs.map((l: string) => l.trim().toLowerCase()).includes(pickup)) {
              return false;
            }
          }
          // Filter by vehicle type
          if (filters.type && filters.type.length > 0) {
            const vehicleType = vehicle.vehicletype?.toLowerCase();
            if (
              !vehicleType ||
              !filters.type.some((type) => type.toLowerCase() === vehicleType)
            ) {
              return false;
            }
          }
          // Filter by brand (case-insensitive)
          if (filters.brand && filters.brand.length > 0) {
            const vehicleBrand = vehicle.brand?.toLowerCase();
            if (
              !vehicleBrand ||
              !filters.brand.some((brand) => brand.toLowerCase() === vehicleBrand)
            ) {
              return false;
            }
          }
          // Filter by price
          const vehiclePrice = vehicle.priceperday || 0;
          if (vehiclePrice < filters.minPrice || vehiclePrice > filters.maxPrice) {
            return false;
          }
          // Filter by transmission type
          if (filters.geartype && filters.geartype.length > 0) {
            const vehicleGeartype = vehicle.geartype?.toLowerCase();
            if (
              !vehicleGeartype ||
              !filters.geartype.some((t) => t.toLowerCase() === vehicleGeartype)
            ) {
              return false;
            }
          }
          // Filter by fuel type
          if (filters.fuel && filters.fuel.length > 0) {
            const vehicleFuel = vehicle.fuel?.toLowerCase();
            if (
              !vehicleFuel ||
              !filters.fuel.some((f) => f.toLowerCase() === vehicleFuel)
            ) {
              return false;
            }
          }
          return true;
        })
        .sort((a, b) => {
          switch (filters.sortBy) {
            case "price_asc":
              return (a.priceperday || 0) - (b.priceperday || 0);
            case "price_desc":
              return (b.priceperday || 0) - (a.priceperday || 0);
            case "model_asc":
              return (a.model || "").localeCompare(b.model || "");
            case "model_desc":
              return (b.model || "").localeCompare(a.model || "");
            default:
              return 0;
          }
        });

      if (!initialLoadComplete) {
        setDisplayedVehicles(filtered);
        setInitialLoadComplete(true);
        return;
      }

      const timer = setTimeout(() => {
        setDisplayedVehicles(filtered);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [vehicles, loading, filters, pickupLocation, dropoffLocation]);

  // Filter vehicles based on selected filters, including brand and location
  const filteredVehicles = vehicles
    .filter((vehicle) => {
      // Filter by location (case-insensitive, ignore spaces)
      if (pickupLocation) {
        const locs = Array.isArray(vehicle.locations)
          ? vehicle.locations
          : typeof vehicle.locations === 'string'
          ? (vehicle.locations as string).split(',').map((s: string) => s.trim())
          : [];
        const pickup = pickupLocation.trim().toLowerCase();
        if (!locs.map((l: string) => l.trim().toLowerCase()).includes(pickup)) {
          return false;
        }
      }
      // Filter by vehicle type
      if (filters.type && filters.type.length > 0) {
        const vehicleType = vehicle.vehicletype?.toLowerCase();
        if (
          !vehicleType ||
          !filters.type.some((type) => type.toLowerCase() === vehicleType)
        ) {
          return false;
        }
      }
      // Filter by brand (case-insensitive)
      if (filters.brand && filters.brand.length > 0) {
        const vehicleBrand = vehicle.brand?.toLowerCase();
        if (
          !vehicleBrand ||
          !filters.brand.some((brand) => brand.toLowerCase() === vehicleBrand)
        ) {
          return false;
        }
      }
      // Filter by price
      const vehiclePrice = vehicle.priceperday || 0;
      if (vehiclePrice < filters.minPrice || vehiclePrice > filters.maxPrice) {
        return false;
      }
      // Filter by transmission type
      if (filters.geartype && filters.geartype.length > 0) {
        const vehicleGeartype = vehicle.geartype?.toLowerCase();
        if (
          !vehicleGeartype ||
          !filters.geartype.some((t) => t.toLowerCase() === vehicleGeartype)
        ) {
          return false;
        }
      }
      // Filter by fuel type
      if (filters.fuel && filters.fuel.length > 0) {
        const vehicleFuel = vehicle.fuel?.toLowerCase();
        if (
          !vehicleFuel ||
          !filters.fuel.some((f) => f.toLowerCase() === vehicleFuel)
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price_asc":
          return (a.priceperday || 0) - (b.priceperday || 0);
        case "price_desc":
          return (b.priceperday || 0) - (a.priceperday || 0);
        case "model_asc":
          return (a.model || "").localeCompare(b.model || "");
        case "model_desc":
          return (b.model || "").localeCompare(a.model || "");
        default:
          return 0;
      }
    });

  // Aktualisiert den Filter
  const toggleTypeFilter = (type: string) => {
    setIsSearching(true);
    setFilters((prev) => {
      const types = prev.type || [];
      if (types.includes(type)) {
        return { ...prev, type: types.filter((t) => t !== type) };
      } else {
        return { ...prev, type: [...types, type] };
      }
    });
  };

  // Aktualisiert den Markenfilter
  const toggleBrandFilter = (brand: string) => {
    setIsSearching(true);
    setFilters((prev) => {
      const brands = prev.brand || [];
      if (brands.includes(brand)) {
        return { ...prev, brand: brands.filter((b) => b !== brand) };
      } else {
        return { ...prev, brand: [...brands, brand] };
      }
    });
  };

  // Aktualisiert den Preisfilter
  const handlePriceChange = (min: number, max: number) => {
    setIsSearching(true);
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  // Aktualisiert die Sortierung
  const handleSortChange = (sortBy: SearchFilters["sortBy"]) => {
    setIsSearching(true);
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  // Tauscht Abholung und Rückgabe
  const swapLocations = () => {
    const tempLocation = pickupLocation;
    setPickupLocation(dropoffLocation);
    setDropoffLocation(tempLocation);

    const tempDate = pickupDate;
    setPickupDate(dropoffDate);
    setDropoffDate(tempDate);

    const tempTime = pickupTime;
    setPickupTime(dropoffTime);
    setDropoffTime(tempTime);
  };

  // Lädt mehr Fahrzeuge
  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  // Получаем уникальные марки автомобилей
  const getUniqueBrands = () => {
    const brands = new Set<string>();
    vehicles.forEach((vehicle) => {
      if (vehicle.brand) {
        brands.add(vehicle.brand.toLowerCase());
      }
    });
    return Array.from(brands).sort((a, b) => a.localeCompare(b));
  };

  // Добавляем функции для фильтров
  const toggleGeartypeFilter = (geartype: string) => {
    setFilters((prev) => {
      const geartypes = prev.geartype || [];
      if (geartypes.includes(geartype)) {
        return { ...prev, geartype: geartypes.filter((t) => t !== geartype) };
      } else {
        return { ...prev, geartype: [...geartypes, geartype] };
      }
    });
  };

  const toggleFuelFilter = (fuel: string) => {
    setFilters((prev) => {
      const fuels = prev.fuel || [];
      if (fuels.includes(fuel)) {
        return { ...prev, fuel: fuels.filter((f) => f !== fuel) };
      } else {
        return { ...prev, fuel: [...fuels, fuel] };
      }
    });
  };

  // Получаем уникальные типы автомобилей
  const getUniqueTypes = () => {
    const types = new Set<string>();
    vehicles.forEach((vehicle) => {
      if (vehicle.vehicletype) {
        types.add(vehicle.vehicletype.toLowerCase());
      }
    });
    return Array.from(types);
  };

  // Добавляем функции для получения уникальных значений
  const getUniqueGeartypes = () => {
    const geartypes = new Set<string>();
    vehicles.forEach((vehicle) => {
      if (vehicle.geartype) {
        geartypes.add(vehicle.geartype.toLowerCase());
      }
    });
    return Array.from(geartypes);
  };

  const getUniqueFuels = () => {
    const fuels = new Set<string>();
    vehicles.forEach((vehicle) => {
      if (vehicle.fuel) {
        fuels.add(vehicle.fuel.toLowerCase());
      }
    });
    return Array.from(fuels);
  };

  // Определяем, что показывать
  const showLoadingSpinner = !initialLoadComplete && loading;
  const showNoVehicles = initialLoadComplete && displayedVehicles.length === 0;
  const showVehicles = initialLoadComplete && displayedVehicles.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto py-6 px-4">
        {/* Suchformular */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Abholung
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Ort eingeben"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Datum
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Zeit
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-center my-4">
            <button
              onClick={swapLocations}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <MdSwapVert size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rückgabe
              </label>
              <input
                type="text"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                placeholder="Ort eingeben"
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Datum
              </label>
              <input
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Zeit
              </label>
              <input
                type="time"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Linke Spalte: Filter */}
          <div className="md:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-3">
                  SORT BY
                </h3>
                <select
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleSortChange(e.target.value as SearchFilters["sortBy"])
                  }
                >
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="model_asc">Model: A to Z</option>
                  <option value="model_desc">Model: Z to A</option>
                </select>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-3">
                  BRAND
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100 hover:scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-400 dark:scrollbar-track-gray-700">
                  {getUniqueBrands().map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`brand-${brand}`}
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        checked={filters.brand?.includes(brand)}
                        onChange={() => toggleBrandFilter(brand)}
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="ml-2 text-sm text-gray-700 dark:text-white"
                      >
                        {brand.charAt(0).toUpperCase() + brand.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-3">
                  PRICE RANGE
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Min:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-white">
                        ${filters.minPrice}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handlePriceChange(
                          Number(e.target.value),
                          filters.maxPrice
                        )
                      }
                      className="w-full h-2 bg-blue-200 dark:bg-blue-400 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Max:
                      </span>
                      <span className="text-sm text-gray-800 dark:text-white">
                        ${filters.maxPrice}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={filters.minPrice}
                      max="1000"
                      step="10"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handlePriceChange(
                          filters.minPrice,
                          Number(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-blue-200 dark:bg-blue-400 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-3">
                  TYPE
                </h3>
                <div className="space-y-2">
                  {getUniqueTypes().map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`type-${type}`}
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        checked={filters.type?.includes(type)}
                        onChange={() => toggleTypeFilter(type)}
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="ml-2 text-sm text-gray-700 dark:text-white"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-3">
                  TRANSMISSION
                </h3>
                <div className="space-y-2">
                  {getUniqueGeartypes().map((geartype) => (
                    <div key={geartype} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`geartype-${geartype}`}
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        checked={filters.geartype?.includes(geartype)}
                        onChange={() => toggleGeartypeFilter(geartype)}
                      />
                      <label
                        htmlFor={`geartype-${geartype}`}
                        className="ml-2 text-sm text-gray-700 dark:text-white"
                      >
                        {geartype.charAt(0).toUpperCase() + geartype.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-3">
                  FUEL TYPE
                </h3>
                <div className="space-y-2">
                  {getUniqueFuels().map((fuel) => (
                    <div key={fuel} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`fuel-${fuel}`}
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        checked={filters.fuel?.includes(fuel)}
                        onChange={() => toggleFuelFilter(fuel)}
                      />
                      <label
                        htmlFor={`fuel-${fuel}`}
                        className="ml-2 text-sm text-gray-700 dark:text-white"
                      >
                        {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rechte Spalte: Fahrzeuge */}
          <div className="flex-1">
            <div className="relative min-h-[400px]">
              {showLoadingSpinner && <LoadingSpinner />}
              
              {error && (
                <div className="text-center py-10">
                  <p className="text-red-500">{error.message}</p>
                </div>
              )}
              
              {showNoVehicles && (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">
                    No vehicles found.
                  </p>
                </div>
              )}

              {showVehicles && (
                <div 
                  className={`transition-all duration-300 ${
                    isSearching ? 'opacity-50 scale-98' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedVehicles.slice(0, visibleCount).map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>

                  {visibleCount < displayedVehicles.length && (
                    <div className="text-center mt-8">
                      <button
                        onClick={loadMore}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Show more
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
