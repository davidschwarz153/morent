import React from 'react';

export default function HeroBanner() {
  return (
    <div className="relative bg-blue-600 text-white rounded-lg overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full">
        <img
          src="/hero-car.jpg"
          alt="Luxusauto"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80';
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-3xl px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Finden Sie Ihr perfektes Mietauto
        </h1>
        <p className="text-lg md:text-xl mb-8 text-blue-100">
          Große Auswahl an Qualitätsfahrzeugen für jeden Anlass. Einfache Buchung, flexible Konditionen.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-white bg-opacity-10 px-4 py-2 rounded-lg">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Keine versteckten Gebühren</span>
          </div>
          <div className="flex items-center bg-white bg-opacity-10 px-4 py-2 rounded-lg">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>24/7 Kundenservice</span>
          </div>
          <div className="flex items-center bg-white bg-opacity-10 px-4 py-2 rounded-lg">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Kostenlose Stornierung</span>
          </div>
        </div>
      </div>
    </div>
  );
} 