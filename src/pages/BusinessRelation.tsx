import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaBuilding, FaUsers, FaCar, FaChartBar, FaHandshake, FaHeadset } from "react-icons/fa";

export default function BusinessRelation() {
  const benefits = [
    {
      icon: <FaBuilding className="w-8 h-8 text-blue-500" />,
      title: "Unternehmenslösungen",
      description: "Maßgeschneiderte Lösungen für Unternehmen jeder Größe"
    },
    {
      icon: <FaUsers className="w-8 h-8 text-blue-500" />,
      title: "Flottenmanagement",
      description: "Effizientes Management Ihrer Firmenflotte"
    },
    {
      icon: <FaCar className="w-8 h-8 text-blue-500" />,
      title: "Flexible Mietoptionen",
      description: "Langfristige und kurzfristige Mietmöglichkeiten"
    },
    {
      icon: <FaChartBar className="w-8 h-8 text-blue-500" />,
      title: "Kosteneffizienz",
      description: "Optimierte Kosten durch maßgeschneiderte Tarife"
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-blue-500" />,
      title: "Dedizierter Support",
      description: "Persönlicher Ansprechpartner für Ihr Unternehmen"
    },
    {
      icon: <FaHeadset className="w-8 h-8 text-blue-500" />,
      title: "24/7 Service",
      description: "Rund um die Uhr Unterstützung für Ihr Unternehmen"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4">Geschäftskunden</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Morent bietet spezielle Lösungen für Unternehmen, die ihre Mobilitätsbedürfnisse 
            effizient und kostengünstig gestalten möchten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center">
                {benefit.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Unsere Geschäftslösungen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Flottenmanagement</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Zentrales Management Ihrer Firmenflotte</li>
                <li>• Detaillierte Auswertungen und Berichte</li>
                <li>• Optimierte Routenplanung</li>
                <li>• Wartungsmanagement</li>
                <li>• Kostenanalyse und -optimierung</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Mietoptionen</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Langfristige Mietverträge</li>
                <li>• Flexible Verlängerungsoptionen</li>
                <li>• Kurzfristige Mietmöglichkeiten</li>
                <li>• Ersatzfahrzeuge bei Bedarf</li>
                <li>• Spezielle Unternehmensrabatte</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Kontaktieren Sie uns</h2>
          <p className="text-gray-600 mb-8">
            Unser Team steht Ihnen für eine persönliche Beratung zur Verfügung.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="tel:+49123456789"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              +49 123 456 789
            </a>
            <a
              href="mailto:business@morent.com"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              business@morent.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 