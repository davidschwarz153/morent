import { useState } from 'react';
import { Vehicle } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

type VehicleCardProps = {
  vehicle: Vehicle;
  onRentClick?: (vehicle: Vehicle) => void;
};

export default function VehicleCard({ vehicle, onRentClick }: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  const handleRentClick = () => {
    if (onRentClick) {
      onRentClick(vehicle);
    } else {
      navigate(`/cars/${vehicle.id}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={vehicle.carimg || '/placeholder-car.jpg'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-48 object-cover"
        />
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
          aria-label={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        >
          {isFavorite ? (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-sm text-gray-500">{vehicle.vehicletype}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-blue-600">€{vehicle.priceperday}/Tag</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {vehicle.year}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {vehicle.geartype}
          </div>
        </div>
        
        <button
          onClick={handleRentClick}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Jetzt mieten
        </button>
      </div>
    </div>
  );
} 