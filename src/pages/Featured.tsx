import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VehicleCard from "../components/VehicleCard";
import { useVehicles } from "../lib/hooks/useVehicles";
import { Vehicle } from "../lib/supabase";
import { FaStar, FaTag, FaClock } from "react-icons/fa";

export default function Featured() {
  const { vehicles, loading, error } = useVehicles();
  const [activeTab, setActiveTab] = useState<"featured" | "offers">("featured");

  // Sichere Typprüfung für featured vehicles
  const featuredVehicles = vehicles.filter((vehicle: Vehicle) => {
    if (!vehicle) return false;
    return (
      vehicle.featured ||
      (typeof vehicle.rating === "number" && vehicle.rating >= 4.5)
    );
  });

  // Sichere Typprüfung für special offers
  const specialOffers = vehicles.filter((vehicle: Vehicle) => {
    if (!vehicle) return false;
    return typeof vehicle.discount === "number" && vehicle.discount > 0;
  });

  // Keine Fahrzeuge gefunden Komponente
  const NoVehiclesFound = () => (
    <div className="text-center py-10">
      <p className="text-gray-500">
        {activeTab === "featured"
          ? "Keine hervorgehobenen Fahrzeuge gefunden."
          : "Keine Sonderangebote verfügbar."}
      </p>
    </div>
  );

  const displayVehicles =
    activeTab === "featured" ? featuredVehicles : specialOffers;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Ausgewählte Fahrzeuge
          </h1>

          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800">
              <button
                className={`px-4 py-2 rounded-md ${
                  activeTab === "featured"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
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
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
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
              <p className="text-gray-500 dark:text-gray-400">
                Fahrzeuge werden geladen...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error.message}</p>
            </div>
          ) : displayVehicles.length === 0 ? (
            <NoVehiclesFound />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayVehicles.map((vehicle: Vehicle) => (
                <div key={vehicle.id} className="relative">
                  <VehicleCard vehicle={vehicle} />
                  {typeof vehicle.discount === "number" &&
                    vehicle.discount > 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{vehicle.discount}%
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Warum Morent wählen?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <FaStar className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Qualität garantiert
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Alle unsere Fahrzeuge werden regelmäßig gewartet und
                  überprüft.
                </p>
              </div>
              <div className="text-center">
                <FaTag className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Beste Preise
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Wir bieten wettbewerbsfähige Preise und regelmäßige
                  Sonderangebote.
                </p>
              </div>
              <div className="text-center">
                <FaClock className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  24/7 Support
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Unser Kundenservice ist rund um die Uhr für Sie da.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
