import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getVehicleById, Review } from "../lib/supabase";
import { Vehicle } from "../lib/supabase";
import { FaStar } from "react-icons/fa";
import { MdOutlineArrowBackIos } from "react-icons/md";

// Erweiterten Vehicle-Typ definieren, der Reviews enthält
type VehicleWithReviews = Vehicle & {
  reviews: Review[];
  locationCoordinates: Array<{
    name: string;
    lat: number;
    lng: number;
  }>;
};

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<VehicleWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadVehicle() {
      if (!id) return;

      setLoading(true);
      try {
        const vehicleData = await getVehicleById(id);
        setVehicle(vehicleData);
        if (vehicleData?.reviews) {
          setReviews(vehicleData.reviews);
        }
      } catch (error) {
        console.error("Error loading vehicle:", error);
      } finally {
        setLoading(false);
      }
    }

    loadVehicle();
  }, [id]);

  const handleRentClick = () => {
    if (id) {
      navigate(`/payment/${id}`);
    }
  };

  const buildMapUrl = () => {
    const coords = vehicle?.locationCoordinates || [];

    if (coords.length === 0) {
      return "https://www.openstreetmap.org/export/embed.html?bbox=8.7833,53.0793,8.8133,53.0893&layer=mapnik&marker=53.0843,8.7983";
    }

    const lats = coords.map((c) => c.lat);
    const lngs = coords.map((c) => c.lng);
    const minLat = Math.min(...lats) - 0.01;
    const maxLat = Math.max(...lats) + 0.01;
    const minLng = Math.min(...lngs) - 0.01;
    const maxLng = Math.max(...lngs) + 0.01;

    const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;
    let baseUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

    coords.forEach((coord) => {
      baseUrl += `&marker=${coord.lat},${coord.lng}`;
    });

    return baseUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto py-12 px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
            Fahrzeugdaten werden geladen...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto py-12 px-4 text-center">
          <p className="text-red-500">Fahrzeug nicht gefunden</p>
          <Link
            to="/"
            className="text-blue-500 dark:text-blue-400 mt-4 inline-block"
          >
            Zurück zur Startseite
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((acc, review) => acc + review.stars, 0) /
            reviews.length) *
            10
        ) / 10
      : 0;

  const carData = {
    rating: averageRating || 4.2,
    reviewCount: reviews.length || 0,
    capacity: vehicle.seats || 5,
    fuel: vehicle.fuel || "Gasoline",
    doors: 4,
    transmission: vehicle.geartype || "Manuell",
    color: vehicle.colors || "Blau/Grau",
    price: vehicle.priceperday || 50,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto py-6 px-4">
        <div className="mb-4">
          <Link
            to="/"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <MdOutlineArrowBackIos className="mr-1" /> Zurück
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
            <img
              src={
                vehicle.carimg ||
                `https://source.unsplash.com/random/800x600/?car,${vehicle.brand},${vehicle.model}`
              }
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {vehicle.brand} {vehicle.model}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(carData.rating) ? (
                      <FaStar />
                    ) : i < Math.floor(carData.rating) + 0.5 ? (
                      <span className="relative">
                        <FaStar className="text-gray-300 dark:text-gray-600" />
                        <FaStar
                          className="absolute top-0 left-0 overflow-hidden"
                          style={{ clipPath: "inset(0 50% 0 0)" }}
                        />
                      </span>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600">
                        <FaStar />
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {carData.reviewCount} Bewertungen
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Typ</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {vehicle.vehicletype || "Car"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Sitzplätze
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {carData.capacity}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Motor
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {carData.fuel}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Türen
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {carData.doors}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Getriebe
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {carData.transmission}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Farbe
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {carData.color}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ${carData.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/Tag</span>
              </div>
              <button
                onClick={handleRentClick}
                className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Jetzt mieten
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Standort
            </h2>
            <div className="relative h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe
                src={buildMapUrl()}
                className="w-full h-full border-0"
                title="Standortkarte mit verfügbaren Standorten"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {vehicle.locationCoordinates &&
                vehicle.locationCoordinates.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-3 text-xs">
                    <p className="font-medium mb-1 text-gray-900 dark:text-white">
                      Verfügbare Standorte:
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {vehicle.locationCoordinates.map((coord, index) => (
                        <div key={index} className="flex items-center">
                          <span className="inline-block w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-1"></span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {coord.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Bewertungen
            </h2>
            <div className="ml-3 bg-blue-600 dark:bg-blue-500 text-white text-sm px-2 py-1 rounded-md">
              {reviews.length}
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Keine Bewertungen für dieses Fahrzeug
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">
                          {review.name ? review.name.charAt(0) : "?"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {review.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {review.text}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.date}
                      </p>
                      <div className="flex items-center text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < review.stars ? (
                              <FaStar />
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600">
                                <FaStar />
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
