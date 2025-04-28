import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaPlay,
  FaPause,
  FaClock,
  FaCalendarAlt,
  FaMicrophone,
  FaSpotify,
  FaApple,
  FaRss,
} from "react-icons/fa";

export default function Podcast() {
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Beispiel-Podcast-Episoden
  const episodes = [
    {
      id: 1,
      title: "Die Revolution der Elektromobilität",
      description:
        "In dieser Episode sprechen wir mit Experten über die Zukunft der Elektromobilität und ihre Auswirkungen auf unseren Alltag.",
      duration: "45:30",
      date: "15. Mai 2025",
      host: "Dr. Sarah Schmidt",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 2,
      title: "Autonomes Fahren: Chance oder Risiko?",
      description:
        "Wir diskutieren die neuesten Entwicklungen im Bereich des autonomen Fahrens und was das für die Zukunft der Mobilität bedeutet.",
      duration: "38:15",
      date: "1. Mai 2025",
      host: "Michael Weber",
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 3,
      title: "Nachhaltige Mobilität im Alltag",
      description:
        "Praktische Tipps und Erfahrungsberichte, wie Sie Ihren Mobilitätsalltag nachhaltiger gestalten können.",
      duration: "42:00",
      date: "15. April 2025",
      host: "Lisa Müller",
      image:
        "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 4,
      title: "Die Zukunft der Sharing Economy",
      description:
        "Wie verändert die Sharing Economy unsere Art der Fortbewegung? Eine Analyse aktueller Trends und Entwicklungen.",
      duration: "36:45",
      date: "1. April 2025",
      host: "Thomas Becker",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  const handlePlayPause = (episodeId: number) => {
    if (activeEpisode === episodeId) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveEpisode(episodeId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Morent Podcast
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tauchen Sie ein in spannende Gespräche über Mobilität, Technologie
            und Nachhaltigkeit. Jeden zweiten Mittwoch eine neue Episode.
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <a
              href="#"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaSpotify className="text-2xl mr-2" />
              Spotify
            </a>
            <a
              href="#"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaApple className="text-2xl mr-2" />
              Apple Podcasts
            </a>
            <a
              href="#"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaRss className="text-2xl mr-2" />
              RSS Feed
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${
                activeEpisode === episode.id
                  ? "ring-2 ring-blue-500 dark:ring-blue-400"
                  : ""
              }`}
            >
              <div className="md:flex">
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img
                    src={episode.image}
                    alt={episode.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {episode.title}
                    </h2>
                    <button
                      onClick={() => handlePlayPause(episode.id)}
                      className={`p-3 rounded-full ${
                        activeEpisode === episode.id && isPlaying
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {activeEpisode === episode.id && isPlaying ? (
                        <FaPause className="w-5 h-5" />
                      ) : (
                        <FaPlay className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {episode.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FaMicrophone className="mr-2 text-blue-500 dark:text-blue-400" />
                      <span>{episode.host}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-blue-500 dark:text-blue-400" />
                      <span>{episode.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                      <span>{episode.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Verpassen Sie keine Episode!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Abonnieren Sie unseren Newsletter und erhalten Sie
            Benachrichtigungen über neue Episoden.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                Abonnieren
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
