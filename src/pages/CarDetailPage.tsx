import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getVehicleById, Review } from '../lib/supabase';
import { Vehicle } from '../lib/supabase';
import { FaStar } from 'react-icons/fa';
import { MdOutlineArrowBackIos } from 'react-icons/md';

// Erweiterten Vehicle-Typ definieren, der Reviews enthält
type VehicleWithReviews = Vehicle & { 
  reviews: Review[],
  locationCoordinates: Array<{
    name: string;
    lat: number;
    lng: number;
  }>
};

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<VehicleWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadVehicle() {
      if (id) {
        setLoading(true);
        try {
          const vehicleData = await getVehicleById(id);
          setVehicle(vehicleData);
          
          // Reviews direkt vom Fahrzeugobjekt nehmen
          if (vehicleData?.reviews) {
            setReviews(vehicleData.reviews);
          }
        } catch (error) {
          console.error('Error loading vehicle:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadVehicle();
  }, [id]);

  const handleRentClick = () => {
    if (id) {
      navigate(`/payment/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-12 px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-500">Fahrzeugdaten werden geladen...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-12 px-4 text-center">
          <p className="text-red-500">Fahrzeug nicht gefunden</p>
          <Link to="/" className="text-blue-500 mt-4 inline-block">Zurück zur Startseite</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Durchschnittliche Bewertung berechnen
  const averageRating = reviews.length > 0 
    ? Math.round(reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length * 10) / 10
    : 0;

  // Temporäre Daten für das Demo-Beispiel (falls keine Daten aus der Datenbank vorhanden)
  const carData = {
    ...vehicle,
    rating: averageRating || 4.2,
    reviewCount: reviews.length || 0,
    capacity: vehicle.seats || 5,
    fuel: vehicle.fuel || 'Gasoline',
    doors: 4, // Annahme
    transmission: vehicle.geartype || 'Manuell',
    color: vehicle.colors || 'Blau/Grau',
    price: vehicle.priceperday || 50
  };
  
  // Karte mit Markern erstellen
  const buildMapUrl = () => {
    const coords = vehicle.locationCoordinates || [];
    
    if (coords.length === 0) {
      // Default Karte ohne Marker
      return "https://www.openstreetmap.org/export/embed.html?bbox=8.3652%2C49.3869%2C8.5652%2C49.5869&amp;layer=mapnik";
    }

    // Berechne die Bounding Box für die Zentrierung
    const lats = coords.map(c => c.lat);
    const lngs = coords.map(c => c.lng);
    const minLat = Math.min(...lats) - 0.1;
    const maxLat = Math.max(...lats) + 0.1;
    const minLng = Math.min(...lngs) - 0.1;
    const maxLng = Math.max(...lngs) + 0.1;
    
    // Erstelle die OSM Bounding-Box URL
    const bbox = `${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}`;
    let baseUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik`;
    
    // Füge einen Marker hinzu (wir zeigen nur den ersten, da OSM in der URL nur einen Marker unterstützt)
    // Zur vollen Darstellung aller Marker müssten wir eine andere Lösung verwenden
    if (coords.length > 0) {
      baseUrl += `&amp;marker=${coords[0].lat}%2C${coords[0].lng}`;
    }
    
    return baseUrl;
  };
  
  const mapUrl = buildMapUrl();
  
  // Da wir keine Marker direkt in der Karte anzeigen können, zeigen wir eine Liste der Standorte an
  const renderLocationsList = () => {
    const coords = vehicle.locationCoordinates || [];
    if (coords.length === 0) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 text-xs">
        <p className="font-medium mb-1">Verfügbare Standorte:</p>
        <div className="grid grid-cols-2 gap-1">
          {coords.map((coord, index) => (
            <div key={index} className="flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              {coord.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-4">
          <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <MdOutlineArrowBackIos className="mr-1" /> Zurück
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Linke Spalte mit Fahrzeugbild */}
          <div className="lg:col-span-1 bg-white rounded-lg overflow-hidden shadow-sm">
            <img 
              src={vehicle.carimg || `https://source.unsplash.com/random/800x600/?car,${vehicle.brand},${vehicle.model}`} 
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Mittlere Spalte mit Fahrzeugdetails */}
          <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-2">{vehicle.brand} {vehicle.model}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(carData.rating) ? (
                      <FaStar />
                    ) : i < Math.floor(carData.rating) + 0.5 ? (
                      <span className="relative">
                        <FaStar className="text-gray-300" />
                        <FaStar className="absolute top-0 left-0 overflow-hidden" style={{ clipPath: "inset(0 50% 0 0)" }} />
                      </span>
                    ) : (
                      <span className="text-gray-300"><FaStar /></span>
                    )}
                  </span>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">{carData.reviewCount} Bewertungen</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500 text-sm">Typ</p>
                <p className="font-medium">{vehicle.vehicletype || 'Car'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Sitzplätze</p>
                <p className="font-medium">{carData.capacity}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Motor</p>
                <p className="font-medium">{carData.fuel}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Türen</p>
                <p className="font-medium">{carData.doors}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Getriebe</p>
                <p className="font-medium">{carData.transmission}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Farbe</p>
                <p className="font-medium">{carData.color}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div>
                <span className="text-xl font-bold">${carData.price}</span>
                <span className="text-gray-500">/Tag</span>
              </div>
              <button 
                onClick={handleRentClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Jetzt mieten
              </button>
            </div>
          </div>
          
          {/* Rechte Spalte mit Karte */}
          <div className="lg:col-span-1 bg-white rounded-lg overflow-hidden shadow-sm h-[300px] lg:h-auto">
            <div className="h-full w-full relative">
              <iframe 
                src={mapUrl}
                className="w-full h-full border-0"
                title="Standortkarte mit verfügbaren Standorten"
                allowFullScreen
              ></iframe>
              
              {/* Liste der Standorte über der Karte */}
              {renderLocationsList()}
              
              {/* Backup für den Fall, dass die Karte nicht lädt */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-0 pointer-events-none">
                <p className="text-gray-500">Karte mit {vehicle.locationCoordinates?.length || 0} Standorten</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bewertungssektion */}
        <div className="mt-10">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-bold">Bewertungen</h2>
            <div className="ml-3 bg-blue-600 text-white text-sm px-2 py-1 rounded-md">
              {reviews.length}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2 text-sm">Bewertungen werden geladen...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <p className="text-gray-500">Keine Bewertungen für dieses Fahrzeug</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500">{review.name ? review.name.charAt(0) : '?'}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">{review.name}</h3>
                        <p className="text-sm text-gray-500">{review.text}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{review.date}</p>
                      <div className="flex items-center text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < review.stars ? <FaStar /> : <span className="text-gray-300"><FaStar /></span>}
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
        
        {/* Ähnliche Autos in der Nähe */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Verfügbar in der Nähe</h2>
            <Link to="/" className="text-blue-600 hover:underline">Alle anzeigen</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Hier würden normalerweise ähnliche Fahrzeuge angezeigt werden */}
            {/* Diese werden dynamisch aus der Datenbank geladen */}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 