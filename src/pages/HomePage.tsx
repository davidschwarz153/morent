import { useState } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import SearchForm from '../components/SearchForm';
import VehicleCard from '../components/VehicleCard';
import Footer from '../components/Footer';
import { useVehicles } from '../lib/hooks/useVehicles';
import { Vehicle } from '../lib/supabase';

interface SearchFilters {
  brand?: string;
  model?: string;
  priceRange?: [number, number];
  vehicle_type?: string;
  year?: number;
  transmission?: string;
  fuel?: string;
  seats?: number;
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
  const [filters, setFilters] = useState<SearchFilters>({});
  const { vehicles, loading, error } = useVehicles(filters);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setVisibleCount(8);
  };
  
  const handleRentClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };
  
  const loadMore = () => {
    setVisibleCount(prev => prev + 8);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <HeroBanner />
        
        <div className="my-6">
          <SearchForm onSearch={handleSearch} />
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error.message} />
        ) : vehicles.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Keine Fahrzeuge gefunden</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.slice(0, visibleCount).map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onRentClick={handleRentClick}
                />
              ))}
            </div>
            
            {visibleCount < vehicles.length && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mehr anzeigen
                </button>
              </div>
            )}
          </>
        )}
      </main>
      
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {selectedVehicle.brand} {selectedVehicle.model}
            </h3>
            <p className="text-gray-600 mb-4">
              Die Buchungsfunktion wird bald verfügbar sein!
            </p>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
} 