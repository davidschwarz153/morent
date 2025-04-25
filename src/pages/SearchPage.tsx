import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VehicleCard from "../components/VehicleCard";
import { useVehicles } from "../lib/hooks/useVehicles";
import { MdSwapVert } from "react-icons/md";

interface SearchFilters {
  type?: string[];
  capacity?: number[];
  maxPrice: number;
  brand?: string[];
  minPrice: number;
  sortBy?: "price_asc" | "price_desc" | "model_asc" | "model_desc";
}

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    capacity: [],
    maxPrice: 1000,
    brand: [],
    minPrice: 0,
    sortBy: "price_asc",
  });
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);

  const { vehicles, loading, error } = useVehicles({
    vehicletype: filters.type?.length ? filters.type[0] : undefined,
    maxPrice: filters.maxPrice,
    minPrice: filters.minPrice,
    brand: filters.brand?.length ? filters.brand[0] : undefined,
  });

  // Filter Fahrzeuge basierend auf den ausgewählten Filtern
  const filteredVehicles = vehicles
    .filter((vehicle) => {
      // Filterung nach Fahrzeugtyp
      if (filters.type && filters.type.length > 0) {
        const vehicleType = vehicle.vehicletype?.toLowerCase();
        if (
          !vehicleType ||
          !filters.type.some((type) => type.toLowerCase() === vehicleType)
        ) {
          return false;
        }
      }

      // Filterung nach Marke
      if (filters.brand && filters.brand.length > 0) {
        const vehicleBrand = vehicle.brand?.toLowerCase();
        if (
          !vehicleBrand ||
          !filters.brand.some((brand) => brand.toLowerCase() === vehicleBrand)
        ) {
          return false;
        }
      }

      // Filterung nach Kapazität
      if (filters.capacity && filters.capacity.length > 0) {
        const seats = vehicle.seats || 0;
        let passesCapacityFilter = false;

        for (const capFilter of filters.capacity) {
          if (capFilter === 8 && seats >= 8) {
            passesCapacityFilter = true;
            break;
          }
          if (capFilter === 6 && seats > 4 && seats <= 6) {
            passesCapacityFilter = true;
            break;
          }
          if (capFilter === 4 && seats > 2 && seats <= 4) {
            passesCapacityFilter = true;
            break;
          }
          if (capFilter === 2 && seats <= 2) {
            passesCapacityFilter = true;
            break;
          }
        }

        if (!passesCapacityFilter) return false;
      }

      // Filterung nach Preis
      const vehiclePrice = vehicle.priceperday || 0;
      if (vehiclePrice < filters.minPrice || vehiclePrice > filters.maxPrice) {
        return false;
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
    setFilters((prev) => {
      const brands = prev.brand || [];
      if (brands.includes(brand)) {
        return { ...prev, brand: brands.filter((b) => b !== brand) };
      } else {
        return { ...prev, brand: [...brands, brand] };
      }
    });
  };

  // Aktualisiert den Kapazitätsfilter
  const toggleCapacityFilter = (capacity: number) => {
    setFilters((prev) => {
      const capacities = prev.capacity || [];
      if (capacities.includes(capacity)) {
        return { ...prev, capacity: capacities.filter((c) => c !== capacity) };
      } else {
        return { ...prev, capacity: [...capacities, capacity] };
      }
    });
  };

  // Aktualisiert den Preisfilter
  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  // Aktualisiert die Sortierung
  const handleSortChange = (sortBy: SearchFilters["sortBy"]) => {
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

  // Получаем уникальные значения вместимости
  const getUniqueCapacities = () => {
    const capacities = new Set<number>();
    vehicles.forEach((vehicle) => {
      const seats = vehicle.seats || 0;
      if (seats <= 2) capacities.add(2);
      else if (seats <= 4) capacities.add(4);
      else if (seats <= 6) capacities.add(6);
      else capacities.add(8);
    });
    return Array.from(capacities).sort((a, b) => a - b);
  };

  // Получаем количество автомобилей каждого типа
  const getTypeCount = (type: string) => {
    return vehicles.filter(
      (vehicle) => vehicle.vehicletype?.toLowerCase() === type.toLowerCase()
    ).length;
  };

  // Получаем количество автомобилей по вместимости
  const getCapacityCount = (capacity: number) => {
    return vehicles.filter((vehicle) => {
      const seats = vehicle.seats || 0;
      if (capacity === 8) return seats >= 8;
      if (capacity === 6) return seats > 4 && seats <= 6;
      if (capacity === 4) return seats > 2 && seats <= 4;
      return seats <= 2;
    }).length;
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

  // Получаем количество автомобилей каждой марки
  const getBrandCount = (brand: string) => {
    return vehicles.filter(
      (vehicle) => vehicle.brand?.toLowerCase() === brand.toLowerCase()
    ).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto py-6 px-4">
        {/* Suchformular */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-4">Pickup</h3>
              <div className="mb-2">
                <label className="block text-sm text-gray-500 mb-1">
                  Location:
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Please select"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center self-center">
              <button
                onClick={swapLocations}
                className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Abholung und Rückgabe tauschen"
              >
                <MdSwapVert />
              </button>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-medium mb-4">Drop-Off</h3>
              <div className="mb-2">
                <label className="block text-sm text-gray-500 mb-1">
                  Location:
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Please select"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Linke Spalte: Filter */}
          <div className="md:w-64">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-3">
                  SORT BY
                </h3>
                <select
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
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
                <h3 className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-3">
                  BRAND
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100 hover:scrollbar-thumb-blue-300">
                  {getUniqueBrands().map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`brand-${brand}`}
                        className="h-4 w-4 text-blue-600"
                        checked={filters.brand?.includes(brand)}
                        onChange={() => toggleBrandFilter(brand)}
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="ml-2 text-sm"
                      >
                        {brand.charAt(0).toUpperCase() + brand.slice(1)} (
                        {getBrandCount(brand)})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-3">
                  PRICE RANGE
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Min:</span>
                      <span className="text-sm text-gray-800">
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
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Max:</span>
                      <span className="text-sm text-gray-800">
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
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-3">
                  TYPE
                </h3>
                <div className="space-y-2">
                  {getUniqueTypes().map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`type-${type}`}
                        className="h-4 w-4 text-blue-600"
                        checked={filters.type?.includes(type)}
                        onChange={() => toggleTypeFilter(type)}
                      />
                      <label htmlFor={`type-${type}`} className="ml-2 text-sm">
                        {type.charAt(0).toUpperCase() + type.slice(1)} (
                        {getTypeCount(type)})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-3">
                  CAPACITY
                </h3>
                <div className="space-y-2">
                  {getUniqueCapacities().map((capacity) => (
                    <div key={capacity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`capacity-${capacity}`}
                        className="h-4 w-4 text-blue-600"
                        checked={filters.capacity?.includes(capacity)}
                        onChange={() => toggleCapacityFilter(capacity)}
                      />
                      <label
                        htmlFor={`capacity-${capacity}`}
                        className="ml-2 text-sm"
                      >
                        {capacity === 8 ? "8 or More" : `${capacity} Person`} (
                        {getCapacityCount(capacity)})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rechte Spalte: Fahrzeuge */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">
                  Fahrzeuge werden geladen...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">{error.message}</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Keine Fahrzeuge gefunden</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.slice(0, visibleCount).map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                {visibleCount < filteredVehicles.length && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMore}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Show more car
                    </button>
                    <div className="text-gray-400 text-sm mt-2">
                      {visibleCount} / {filteredVehicles.length} car
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
