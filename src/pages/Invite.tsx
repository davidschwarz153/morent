import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import { FaGift, FaUsers, FaCar, FaEnvelope } from "react-icons/fa";

export default function InviteFriend() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("invitations")
        .insert([{ email, message }]);

      if (error) throw error;

      setEmail("");
      setMessage("");
      alert("Einladung erfolgreich gesendet!");
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert(
        "Fehler beim Senden der Einladung. Bitte versuchen Sie es später erneut."
      );
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <FaGift className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Startguthaben",
      description: "Beide erhalten 50€ Fahrguthaben für die erste Fahrt",
    },
    {
      icon: <FaUsers className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Community",
      description: "Teil einer wachsenden Gemeinschaft werden",
    },
    {
      icon: <FaCar className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Exklusive Angebote",
      description: "Zugang zu speziellen Angeboten und Events",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Freunde einladen
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Laden Sie Ihre Freunde ein und profitieren Sie gemeinsam von
            exklusiven Vorteilen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                {benefit.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Freund einladen
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                E-Mail-Adresse des Freundes
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="freund@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Persönliche Nachricht (optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Schreiben Sie eine persönliche Einladungsnachricht..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Wird gesendet..." : "Einladung senden"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
