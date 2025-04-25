import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Seite nicht gefunden</h2>
          <p className="text-gray-600 mb-8">
            Die von Ihnen gesuchte Seite existiert leider nicht oder wurde möglicherweise verschoben.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaHome className="mr-2" />
              Zur Startseite
            </Link>
            
            <Link 
              to="/search"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaSearch className="mr-2" />
              Fahrzeug suchen
            </Link>
          </div>
          
          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Häufig besuchte Seiten</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/vehicles" className="text-blue-500 hover:text-blue-700">
                Alle Fahrzeuge
              </Link>
              <Link to="/about" className="text-blue-500 hover:text-blue-700">
                Über uns
              </Link>
              <Link to="/contact" className="text-blue-500 hover:text-blue-700">
                Kontakt
              </Link>
              <Link to="/blog" className="text-blue-500 hover:text-blue-700">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 