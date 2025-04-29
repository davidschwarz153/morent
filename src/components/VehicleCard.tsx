import { Link } from "react-router-dom";
import { Vehicle } from "../lib/supabase";
import { FaGasPump, FaCar, FaUserFriends, FaHeart } from "react-icons/fa";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-300">
              {vehicle.vehicletype}
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Als Favorit markieren"
          >
            <FaHeart />
          </button>
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <img
            src={
              vehicle.carimg ||
              `https://source.unsplash.com/random/800x600/?car,${vehicle.brand},${vehicle.model}`
            }
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-40 object-cover rounded"
          />
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaGasPump className="mr-1" />
            <span>{vehicle.fuel || "Benzin"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaCar className="mr-1" />
            <span>{vehicle.geartype || "Manuel"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaUserFriends className="mr-1" />
            <span>{vehicle.seats || "4"}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              ${vehicle.priceperday || "55"}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              / day
            </span>
          </div>
          <Link
            to={`/cars/${vehicle.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Rent now
          </Link>
        </div>
      </div>
    </div>
  );
}
