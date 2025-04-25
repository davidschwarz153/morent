import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaHandshake, FaCar, FaBuilding, FaChartLine } from "react-icons/fa";

export default function Partnership() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier würde die Logik für das Absenden des Formulars implementiert
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const partnershipTypes = [
    {
      icon: <FaCar className="w-8 h-8 text-blue-500" />,
      title: "Fahrzeugpartner",
      description: "Werden Sie Teil unseres Fahrzeugnetzwerks und teilen Sie Ihre Fahrzeuge mit unserer Community."
    },
    {
      icon: <FaBuilding className="w-8 h-8 text-blue-500" />,
      title: "Standortpartner",
      description: "Öffnen Sie einen Morent-Standort in Ihrer Stadt und werden Sie Teil unseres wachsenden Netzwerks."
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-500" />,
      title: "Technologiepartner",
      description: "Entwickeln Sie innovative Lösungen für die Zukunft der Mobilität mit Morent."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4">Werden Sie Partner</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Morent bietet verschiedene Partnerschaftsmöglichkeiten für Unternehmen, 
            die im Bereich Mobilität und Fahrzeugvermietung tätig sind oder werden möchten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {partnershipTypes.map((type, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center">
                {type.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{type.title}</h3>
                <p className="text-gray-600">{type.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Kontaktieren Sie uns</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Unternehmen
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Nachricht
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Absenden
            </button>
          </form>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Vorteile einer Partnerschaft</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <FaHandshake className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Gemeinsames Wachstum</h3>
              <p className="text-gray-600">Profitieren Sie von unserem wachsenden Kundenstamm</p>
            </div>
            <div>
              <FaChartLine className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Erhöhte Reichweite</h3>
              <p className="text-gray-600">Erreichen Sie neue Kunden durch unsere Plattform</p>
            </div>
            <div>
              <FaCar className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Technologie-Integration</h3>
              <p className="text-gray-600">Nutzen Sie unsere modernen Technologielösungen</p>
            </div>
            <div>
              <FaBuilding className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Support & Training</h3>
              <p className="text-gray-600">Erhalten Sie umfassende Unterstützung bei der Integration</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 