import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "de" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  de: {
    "search.placeholder": "Suchen Sie hier...",
    "search.advanced": "Erweiterte Suche",
    "auth.login": "Einloggen",
    "auth.logout": "Ausloggen",
    "hero.title": "Der beste Platz, um ein Auto zu mieten",
    "hero.subtitle": "Finden Sie für jeden Anlass das perfekte Fahrzeug",
    "hero.button": "Buchen Sie jetzt",
    "hero.second.title": "Fahren leicht gemacht",
    "hero.second.subtitle": "Einfache Buchung, schnelle Bereitstellung",
    "hero.second.button": "Mehr erfahren",
    "vehicle.type": "Typ",
    "vehicle.seats": "Sitzplätze",
    "vehicle.engine": "Motor",
    "vehicle.doors": "Türen",
    "vehicle.transmission": "Getriebe",
    "vehicle.color": "Farbe",
    "vehicle.perDay": "/Tag",
    "vehicle.rentNow": "Jetzt mieten",
    "vehicle.reviews": "Bewertungen",
    "vehicle.noReviews": "Keine Bewertungen für dieses Fahrzeug",
    "location.title": "Standort",
    "location.available": "Verfügbare Standorte",
    "search.form.pickup": "Abholung",
    "search.form.dropoff": "Rückgabe",
    "search.form.location": "Ort",
    "search.form.date": "Datum",
    "search.form.time": "Uhrzeit",
    "search.form.button": "Fahrzeuge suchen",
    "search.form.select": "Bitte wählen",
  },
  en: {
    "search.placeholder": "Search here...",
    "search.advanced": "Advanced Search",
    "auth.login": "Login",
    "auth.logout": "Logout",
    "hero.title": "The best place to rent a car",
    "hero.subtitle": "Find the perfect vehicle for every occasion",
    "hero.button": "Book Now",
    "hero.second.title": "Easy Driving",
    "hero.second.subtitle": "Easy booking, fast delivery",
    "hero.second.button": "Learn More",
    "vehicle.type": "Type",
    "vehicle.seats": "Seats",
    "vehicle.engine": "Engine",
    "vehicle.doors": "Doors",
    "vehicle.transmission": "Transmission",
    "vehicle.color": "Color",
    "vehicle.perDay": "/day",
    "vehicle.rentNow": "Rent Now",
    "vehicle.reviews": "Reviews",
    "vehicle.noReviews": "No reviews for this vehicle",
    "location.title": "Location",
    "location.available": "Available Locations",
    "search.form.pickup": "Pick-up",
    "search.form.dropoff": "Drop-off",
    "search.form.location": "Location",
    "search.form.date": "Date",
    "search.form.time": "Time",
    "search.form.button": "Search Vehicles",
    "search.form.select": "Please select",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("de");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "de" || savedLanguage === "en")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === "de" ? "en" : "de";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["de"]] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
