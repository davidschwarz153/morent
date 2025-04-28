import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    navigate("/search");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Erster Banner */}
      <div className="relative overflow-hidden rounded-lg bg-blue-600 text-white p-6">
        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Der beste Platz, um ein Auto zu mieten
            </h2>
            <p className="text-blue-100 text-sm md:text-base">
              Finden Sie für jeden Anlass das perfekte Fahrzeug
            </p>
          </div>

          <div>
            <button
              onClick={handleBookNowClick}
              className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Buchen Sie jetzt
            </button>
          </div>
        </div>

        {/* Hintergrundbild */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 md:opacity-50">
          <img
            src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            alt="Luxus-Auto"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Zweiter Banner */}
      <div className="relative overflow-hidden rounded-lg bg-violet-700 text-white p-6">
        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Fahren leicht gemacht
            </h2>
            <p className="text-violet-100 text-sm md:text-base">
              Einfache Buchung, schnelle Bereitstellung
            </p>
          </div>

          <div>
            <button className="bg-white text-violet-700 font-medium px-4 py-2 rounded-lg hover:bg-violet-50 transition-colors">
              Mehr erfahren
            </button>
          </div>
        </div>

        {/* Hintergrundbild */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 md:opacity-50">
          <img
            src="https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            alt="Luxus-Auto"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
