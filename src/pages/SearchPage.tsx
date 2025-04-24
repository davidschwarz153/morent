import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VehicleCard from "../components/VehicleCard";
import { useVehicles } from "../lib/hooks/useVehicles";
import { MdSwapVert } from "react-icons/md";

interface SearchFilters {
  type?: string[];
  capacity?: number[];
  maxPrice?: number;
}

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    capacity: [],
    maxPrice: 100,
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
  });

  // Filter Fahrzeuge basierend auf den ausgewählten Filtern
  const filteredVehicles = vehicles.filter((vehicle) => {
    // Filterung nach Fahrzeugtyp
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(vehicle.vehicletype?.toLowerCase())) {
        return false;
      }
    }

    // Filterung nach Kapazität
    if (filters.capacity && filters.capacity.length > 0) {
      const capacity = vehicle.seats || 0;
      let passesCapacityFilter = false;

      for (const capFilter of filters.capacity) {
        if (capFilter === 2 && capacity === 2) passesCapacityFilter = true;
        if (capFilter === 4 && capacity === 4) passesCapacityFilter = true;
        if (capFilter === 6 && capacity === 6) passesCapacityFilter = true;
        if (capFilter === 8 && capacity >= 8) passesCapacityFilter = true;
      }

      if (!passesCapacityFilter) return false;
    }

    // Filterung nach Preis
    if (filters.maxPrice) {
      if ((vehicle.priceperday || 0) > filters.maxPrice) {
        return false;
      }
    }

    return true;
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
  const handlePriceChange = (value: number) => {
    setFilters((prev) => ({ ...prev, maxPrice: value }));
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
                  TYPE
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="type-sport"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.type?.includes("sport")}
                      onChange={() => toggleTypeFilter("sport")}
                    />
                    <label htmlFor="type-sport" className="ml-2 text-sm">
                      Sport (10)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="type-suv"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.type?.includes("suv")}
                      onChange={() => toggleTypeFilter("suv")}
                    />
                    <label htmlFor="type-suv" className="ml-2 text-sm">
                      SUV (12)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="type-mpv"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.type?.includes("mpv")}
                      onChange={() => toggleTypeFilter("mpv")}
                    />
                    <label htmlFor="type-mpv" className="ml-2 text-sm">
                      MPV (16)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="type-sedan"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.type?.includes("sedan")}
                      onChange={() => toggleTypeFilter("sedan")}
                    />
                    <label htmlFor="type-sedan" className="ml-2 text-sm">
                      Sedan (20)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="type-coupe"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.type?.includes("coupe")}
                      onChange={() => toggleTypeFilter("coupe")}
                    />
                    <label htmlFor="type-coupe" className="ml-2 text-sm">
                      Coupe (14)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="type-hatchback"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.type?.includes("hatchback")}
                      onChange={() => toggleTypeFilter("hatchback")}
                    />
                    <label htmlFor="type-hatchback" className="ml-2 text-sm">
                      Hatchback (14)
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-3">
                  CAPACITY
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="capacity-2"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.capacity?.includes(2)}
                      onChange={() => toggleCapacityFilter(2)}
                    />
                    <label htmlFor="capacity-2" className="ml-2 text-sm">
                      2 Person (10)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="capacity-4"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.capacity?.includes(4)}
                      onChange={() => toggleCapacityFilter(4)}
                    />
                    <label htmlFor="capacity-4" className="ml-2 text-sm">
                      4 Person (14)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="capacity-6"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.capacity?.includes(6)}
                      onChange={() => toggleCapacityFilter(6)}
                    />
                    <label htmlFor="capacity-6" className="ml-2 text-sm">
                      6 Person (12)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="capacity-8"
                      className="h-4 w-4 text-blue-600"
                      checked={filters.capacity?.includes(8)}
                      onChange={() => toggleCapacityFilter(8)}
                    />
                    <label htmlFor="capacity-8" className="ml-2 text-sm">
                      8 or More (16)
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="uppercase text-xs font-semibold text-gray-500 tracking-wider mb-3">
                  PRICE
                </h3>
                <div className="px-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">Min $0</span>
                    <span className="text-sm text-gray-800">
                      Max ${filters.maxPrice}.00
                    </span>
                  </div>
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
