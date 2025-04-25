import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCar, FaLeaf, FaUsers, FaHandshake, FaChartLine, FaGlobe } from "react-icons/fa";

export default function About() {
  // Unternehmenswerte
  const values = [
    {
      icon: <FaCar className="text-4xl text-blue-500" />,
      title: "Innovation",
      description: "Wir setzen auf moderne Fahrzeugflotten und digitale Lösungen für ein nahtloses Mieterlebnis."
    },
    {
      icon: <FaLeaf className="text-4xl text-blue-500" />,
      title: "Nachhaltigkeit",
      description: "Umweltbewusstsein steht bei uns an erster Stelle. Unsere Flotte umfasst zunehmend elektrische und hybride Fahrzeuge."
    },
    {
      icon: <FaUsers className="text-4xl text-blue-500" />,
      title: "Kundenorientierung",
      description: "Wir hören unseren Kunden zu und entwickeln unsere Dienstleistungen kontinuierlich weiter."
    },
    {
      icon: <FaHandshake className="text-4xl text-blue-500" />,
      title: "Zuverlässigkeit",
      description: "Pünktlichkeit, Transparenz und faire Preise sind für uns selbstverständlich."
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-500" />,
      title: "Wachstum",
      description: "Wir expandieren kontinuierlich und erschließen neue Standorte für noch bessere Verfügbarkeit."
    },
    {
      icon: <FaGlobe className="text-4xl text-blue-500" />,
      title: "Internationalität",
      description: "Als globales Unternehmen verbinden wir Menschen und Orte auf der ganzen Welt."
    }
  ];

  // Team-Mitglieder
  const team = [
    {
      name: "Dr. Sarah Schmidt",
      position: "Geschäftsführerin",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Mit über 15 Jahren Erfahrung in der Automobilbranche führt Sarah Morent mit Vision und Innovation."
    },
    {
      name: "Michael Weber",
      position: "Technischer Leiter",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Michael verantwortet die technische Entwicklung und den Ausbau unserer digitalen Plattform."
    },
    {
      name: "Lisa Müller",
      position: "Marketing-Direktorin",
      image: "https://images.unsplash.com/photo-1580489944761-15a119d65507?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Lisa entwickelt innovative Marketingstrategien, die Morent als führende Marke positionieren."
    },
    {
      name: "Thomas Becker",
      position: "Kundenservice-Leiter",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      bio: "Thomas und sein Team sorgen für ein erstklassiges Kundenerlebnis bei jedem Kontakt."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero-Sektion */}
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Über Morent</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Wir revolutionieren die Art und Weise, wie Menschen Fahrzeuge mieten und nutzen.
              Mit innovativen Lösungen und einem Fokus auf Nachhaltigkeit gestalten wir die Zukunft der Mobilität.
            </p>
          </div>
        </section>

        {/* Unternehmensgeschichte */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Unsere Geschichte</h2>
              <div className="prose prose-lg mx-auto">
                <p>
                  Morent wurde 2015 mit einer Vision gegründet: Die Fahrzeugmiete sollte einfacher, 
                  transparenter und nachhaltiger werden. Was als kleines Startup in Berlin begann, 
                  hat sich zu einem der führenden Anbieter für flexible Mobilitätslösungen entwickelt.
                </p>
                <p>
                  Heute verfügen wir über eine Flotte von über 10.000 Fahrzeugen an mehr als 50 
                  Standorten in ganz Deutschland. Unsere digitale Plattform ermöglicht es Kunden, 
                  Fahrzeuge in Sekundenschnelle zu reservieren und zu nutzen – ohne versteckte Kosten 
                  oder komplizierte Prozesse.
                </p>
                <p>
                  Unser Erfolg basiert auf unserem Engagement für Innovation, Nachhaltigkeit und 
                  Kundenzufriedenheit. Wir investieren kontinuierlich in neue Technologien und 
                  erweitern unsere Flotte um elektrische und hybride Fahrzeuge, um unseren 
                  ökologischen Fußabdruck zu reduzieren.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Unternehmenswerte */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Unsere Werte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Unser Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-blue-500 mb-2">{member.position}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA-Sektion */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Werden Sie Teil der Morent-Familie</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Entdecken Sie unsere Fahrzeugflotte und erleben Sie Mobilität auf eine neue Art.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/vehicles" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Fahrzeuge entdecken
              </a>
              <a 
                href="/contact" 
                className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Kontakt aufnehmen
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 