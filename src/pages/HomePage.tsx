import { useState, useEffect } from "react";
import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import SearchForm from "../components/SearchForm";
import VehicleCard from "../components/VehicleCard";
import Footer from "../components/Footer";
import { useVehicles, VehicleFilters } from "../lib/hooks/useVehicles";
import { Vehicle } from "../lib/supabase";

// This type must match the one in SearchForm
interface FormSearchFilters {
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
}

const LoadingSpinner = () => (
  <div className="text-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    <p className="text-gray-500 mt-4">Fahrzeuge werden geladen...</p>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center py-10">
    <p className="text-red-500">{message}</p>
  </div>
);

export default function HomePage() {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { vehicles, loading, error } = useVehicles(filters);
  const [visibleCount, setVisibleCount] = useState(8);
  const [displayedVehicles, setDisplayedVehicles] = useState<Vehicle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Обработка начальной загрузки и обновлений
  useEffect(() => {
    if (!loading && vehicles) {
      // Если это первая загрузка
      if (!initialLoadComplete) {
        setDisplayedVehicles(vehicles);
        setInitialLoadComplete(true);
        return;
      }

      // Если это поиск, добавляем небольшую задержку для плавности
      if (isSearching) {
        const timer = setTimeout(() => {
          setDisplayedVehicles(vehicles);
          setIsSearching(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [vehicles, loading, initialLoadComplete, isSearching]);

  const handleSearch = (searchFilters: FormSearchFilters) => {
    setIsSearching(true);
    const vehicleFilters: VehicleFilters = {};
    
    if (searchFilters.pickupLocation) {
      vehicleFilters.location = searchFilters.pickupLocation.trim();
    }
    if (searchFilters.dropoffLocation) {
      vehicleFilters.dropoffLocation = searchFilters.dropoffLocation.trim();
    }

    setVisibleCount(8);
    setFilters(vehicleFilters);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  // Определяем, что показывать
  const showLoadingSpinner = !initialLoadComplete && loading;
  const showNoVehicles = initialLoadComplete && displayedVehicles.length === 0;
  const showVehicles = initialLoadComplete && displayedVehicles.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto py-6 px-4">
        <HeroBanner />

        <div className="my-6">
          <SearchForm onSearch={handleSearch} />
        </div>

        <div className="relative min-h-[400px]">
          {showLoadingSpinner && <LoadingSpinner />}
          
          {error && <ErrorMessage message={error.message} />}
          
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
      </main>

      <Footer />
    </div>
  );
}
