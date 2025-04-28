import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaSearch, FaCalendarAlt, FaUser, FaTags } from "react-icons/fa";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Beispiel-Blogartikel
  const blogPosts = [
    {
      id: 1,
      title: "Die Zukunft der Elektromobilität",
      excerpt:
        "Entdecken Sie die neuesten Entwicklungen in der Elektromobilität und wie sie unsere Art zu reisen verändern wird.",
      category: "elektromobilitaet",
      author: "Dr. Sarah Schmidt",
      date: "15. Mai 2025",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["Elektroauto", "Nachhaltigkeit", "Innovation"],
    },
    {
      id: 2,
      title: "Tipps für die perfekte Roadtrip-Planung",
      excerpt:
        "Planen Sie Ihren nächsten Roadtrip mit unseren Expertentipps für eine unvergessliche Reise.",
      category: "reisen",
      author: "Michael Weber",
      date: "28. April 2025",
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["Roadtrip", "Reiseplanung", "Tipps"],
    },
    {
      id: 3,
      title: "Nachhaltiges Autofahren: So reduzieren Sie Ihren CO2-Fußabdruck",
      excerpt:
        "Praktische Tipps, wie Sie durch bewusstes Autofahren die Umwelt schonen können.",
      category: "nachhaltigkeit",
      author: "Lisa Müller",
      date: "10. April 2025",
      image:
        "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["Nachhaltigkeit", "Umwelt", "CO2"],
    },
    {
      id: 4,
      title: "Die besten Autos für Familien",
      excerpt:
        "Eine Übersicht der familienfreundlichsten Fahrzeuge mit Fokus auf Sicherheit und Komfort.",
      category: "fahrzeugtest",
      author: "Thomas Becker",
      date: "2. April 2025",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      tags: ["Familie", "Sicherheit", "Komfort"],
    },
  ];

  const categories = [
    { id: "all", name: "Alle Kategorien" },
    { id: "elektromobilitaet", name: "Elektromobilität" },
    { id: "reisen", name: "Reisen" },
    { id: "nachhaltigkeit", name: "Nachhaltigkeit" },
    { id: "fahrzeugtest", name: "Fahrzeugtest" },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Entdecken Sie interessante Artikel über Fahrzeuge, Mobilität und
          nachhaltiges Reisen.
        </p>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Suchen Sie nach Artikeln..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="inline-flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <FaTags className="mr-2 text-blue-500 dark:text-blue-400" />
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="mt-4 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Weiterlesen
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Keine Artikel gefunden.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
