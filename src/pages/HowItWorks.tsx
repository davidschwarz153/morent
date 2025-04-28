import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCar, FaCreditCard, FaKey, FaCheckCircle } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaCar className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Wählen Sie Ihr Fahrzeug",
      description:
        "Durchsuchen Sie unsere große Auswahl an Fahrzeugen und finden Sie das perfekte Auto für Ihre Bedürfnisse.",
    },
    {
      icon: (
        <FaCreditCard className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      ),
      title: "Buchen und Bezahlen",
      description:
        "Wählen Sie Ihre Mietdaten, überprüfen Sie die Details und zahlen Sie sicher online.",
    },
    {
      icon: <FaKey className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Abholung",
      description:
        "Holen Sie Ihr Fahrzeug am vereinbarten Ort ab. Wir stellen sicher, dass alles bereit ist.",
    },
    {
      icon: (
        <FaCheckCircle className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      ),
      title: "Genießen Sie Ihre Fahrt",
      description:
        "Fahren Sie los und genießen Sie Ihre Reise. Wir sind immer für Sie da, falls Sie Hilfe benötigen.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Wie Morent funktioniert
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
              >
                <div className="flex flex-col items-center text-center">
                  {step.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Häufig gestellte Fragen
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Was benötige ich für eine Buchung?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sie benötigen einen gültigen Führerschein, einen
                  Personalausweis und eine Kreditkarte für die Buchung.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Wie kann ich stornieren?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Stornierungen sind bis zu 24 Stunden vor Abholung kostenlos
                  möglich. Spätere Stornierungen können Gebühren verursachen.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Was ist im Preis enthalten?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Der Mietpreis beinhaltet Versicherung, Steuern und unbegrenzte
                  Kilometer. Zusätzliche Services wie GPS oder Kindersitze sind
                  optional.
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
