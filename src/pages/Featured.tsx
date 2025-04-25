import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VehicleCard from "../components/VehicleCard";
import { useVehicles } from "../lib/hooks/useVehicles";
import { FaStar, FaTag, FaClock } from "react-icons/fa";

export default function Featured() {
  const { vehicles, loading, error } = useVehicles();
  const [activeTab, setActiveTab] = useState("featured");

  // Filter featured vehicles (example criteria)
  const featuredVehicles = vehicles.filter(vehicle => 
    // Prüfen, ob die Eigenschaften existieren, bevor darauf zugegriffen wird
    (vehicle as any).featured === true || 
    ((vehicle as any).rating !== undefined && (vehicle as any).rating >= 4.5)
  );

  // Filter special offers
  const specialOffers = vehicles.filter(vehicle => 
    // Prüfen, ob die Eigenschaft existiert, bevor darauf zugegriffen wird
    (vehicle as any).discount !== undefined && (vehicle as any).discount > 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-12">Ausgewählte Fahrzeuge</h1>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1">
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "featured"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("featured")}
            >
              <FaStar className="inline-block mr-2" />
              Hervorgehoben
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "offers"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("offers")}
            >
              <FaTag className="inline-block mr-2" />
              Sonderangebote
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Fahrzeuge werden geladen...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error.message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(activeTab === "featured" ? featuredVehicles : specialOffers).map((vehicle) => (
              <div key={vehicle.id} className="relative">
                <VehicleCard vehicle={vehicle} />
                {(vehicle as any).discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{(vehicle as any).discount}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Warum Morent wählen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaStar className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Qualität garantiert</h3>
              <p className="text-gray-600">Alle unsere Fahrzeuge werden regelmäßig gewartet und überprüft.</p>
            </div>
            <div className="text-center">
              <FaTag className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Beste Preise</h3>
              <p className="text-gray-600">Wir bieten wettbewerbsfähige Preise und regelmäßige Sonderangebote.</p>
            </div>
            <div className="text-center">
              <FaClock className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Unser Kundenservice ist rund um die Uhr für Sie da.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 