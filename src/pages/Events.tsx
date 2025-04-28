import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
} from "react-icons/fa";

export default function Events() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Beispiel-Veranstaltungen
  const events = [
    {
      id: 1,
      title: "Morent Autoshow 2025",
      date: "15. Juni 2025",
      time: "10:00 - 18:00",
      location: "Messe Berlin",
      description:
        "Entdecken Sie die neuesten Fahrzeugmodelle und exklusive Angebote von Morent.",
      category: "show",
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 2,
      title: "Elektromobilität Workshop",
      date: "22. Juli 2025",
      time: "14:00 - 17:00",
      location: "Technologiezentrum München",
      description:
        "Lernen Sie alles über die Zukunft der Elektromobilität und unsere E-Fahrzeugflotte.",
      category: "workshop",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 3,
      title: "Morent Community Treffen",
      date: "5. August 2025",
      time: "19:00 - 22:00",
      location: "Urban Hub Hamburg",
      description:
        "Netzwerken Sie mit anderen Morent-Nutzern und teilen Sie Ihre Erfahrungen.",
      category: "community",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 4,
      title: "Fahrzeugpflege-Seminar",
      date: "12. September 2025",
      time: "11:00 - 15:00",
      location: "Morent Service Center Frankfurt",
      description:
        "Professionelle Tipps zur Pflege und Wartung Ihres Mietfahrzeugs.",
      category: "seminar",
      image:
        "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  // Filter events based on category
  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) => event.category === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Veranstaltungen
        </h1>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800">
            <button
              className={`px-4 py-2 rounded-md ${
                activeFilter === "all"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              Alle
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeFilter === "show"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              }`}
              onClick={() => setActiveFilter("show")}
            >
              Shows
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeFilter === "workshop"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              }`}
              onClick={() => setActiveFilter("workshop")}
            >
              Workshops
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeFilter === "community"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              }`}
              onClick={() => setActiveFilter("community")}
            >
              Community
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <button className="mt-4 flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <FaTicketAlt className="mr-2" />
                  Jetzt anmelden
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Keine Veranstaltungen in dieser Kategorie gefunden.
            </p>
          </div>
        )}

        <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Veranstaltung vorschlagen
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
            Haben Sie eine Idee für eine Veranstaltung? Teilen Sie sie mit uns!
          </p>
          <div className="max-w-md mx-auto">
            <button className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
              Vorschlag einreichen
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
