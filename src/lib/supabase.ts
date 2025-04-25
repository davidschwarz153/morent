import { createClient } from "@supabase/supabase-js";

// Diese Umgebungsvariablen müssen in einer .env-Datei definiert werden
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typendefinitionen basierend auf der Datenbankstruktur
export type Vehicle = {
  id: string;
  vehicleid: string;
  brand: string;
  model: string;
  year: number;
  vehicletype: string;
  colors: string;
  locations: string[];
  priceperday: number;
  availability: boolean;
  electricvehicle: boolean;
  carimg: string;
  seats: number;
  luggage: number;
  horstpower: string;
  ps: number;
  consumption: string;
  fuel: string;
  geartype: string;
  created_at: string;
  featured?: boolean;
  rating?: number;
  discount?: number;
};

export type Location = {
  country: any;
  city: any;
  postal_code: any;
  address: any;
  name: any;
  id: string;
  locations: string[];
  created_at: string;
};

export type Review = {
  id: string;
  vehicleid: string;
  name: string;
  text: string;
  stars: number;
  date: string;
  created_at: string;
};

export type Booking = {
  id: string;
  vehicle_id: string;
  user_id: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
};

// Добавляем тип Profile
export type Profile = {
  id: string; // UUID из auth.users
  full_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

// Hilfsfunktionen für Datenbankoperationen
export const getVehicles = async (filters?: Partial<Vehicle>) => {
  try {
    let query = supabase.from("vehicles").select("*");

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase-Fehler:", error);
      throw new Error(`Fehler beim Laden der Fahrzeuge: ${error.message}`);
    }

    if (!data) {
      console.warn("Keine Daten von Supabase erhalten");
      return [];
    }

    return data as Vehicle[];
  } catch (err) {
    console.error("Unerwarteter Fehler beim Laden der Fahrzeuge:", err);
    throw err;
  }
};

export const getLocations = async () => {
  try {
    const { data, error } = await supabase.from("locations").select("*");

    if (error) {
      console.error("Supabase-Fehler beim Laden der Standorte:", error);
      throw new Error(`Fehler beim Laden der Standorte: ${error.message}`);
    }

    if (!data) {
      console.warn("Keine Standortdaten von Supabase erhalten");
      return [];
    }

    return data as Location[];
  } catch (err) {
    console.error("Unerwarteter Fehler beim Laden der Standorte:", err);
    throw err;
  }
};

export const getReviews = async (vehicleId: string) => {
  try {
    // Versuche zuerst mit vehicle.vehicleid
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("vehicleid", vehicleId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase-Fehler beim Laden der Bewertungen:", error);
      throw new Error(`Fehler beim Laden der Bewertungen: ${error.message}`);
    }

    if (!data) {
      console.warn("Keine Bewertungsdaten von Supabase erhalten");
      return [];
    }

    return data as Review[];
  } catch (err) {
    console.error("Unerwarteter Fehler beim Laden der Bewertungen:", err);
    throw err;
  }
};

export const createBooking = async (
  booking: Omit<Booking, "id" | "created_at" | "updated_at">
) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([booking])
      .select()
      .single();

    if (error) {
      console.error("Supabase-Fehler beim Erstellen der Buchung:", error);
      throw new Error(`Fehler beim Erstellen der Buchung: ${error.message}`);
    }

    if (!data) {
      console.warn("Keine Buchungsdaten von Supabase erhalten");
      throw new Error("Keine Buchungsdaten erhalten");
    }

    return data as Booking;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Erstellen der Buchung:", err);
    throw err;
  }
};

export const getVehicleById = async (id: string) => {
  try {
    // Zuerst das Fahrzeug laden
    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (vehicleError) {
      console.error("Supabase-Fehler beim Laden des Fahrzeugs:", vehicleError);
      throw new Error(
        `Fehler beim Laden des Fahrzeugs: ${vehicleError.message}`
      );
    }

    if (!vehicleData) {
      console.warn("Kein Fahrzeug mit ID", id, "gefunden");
      return null;
    }

    // Dann die zugehörigen Reviews laden
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .eq("vehicleid", vehicleData.vehicleid)
      .order("date", { ascending: false });

    if (reviewsError) {
      console.error(
        "Supabase-Fehler beim Laden der Bewertungen:",
        reviewsError
      );
      // Wir werfen hier keinen Fehler, sondern geben das Fahrzeug zurück, aber ohne Reviews
    }

    // Fahrzeug mit Reviews zurückgeben
    return {
      ...vehicleData,
      reviews: reviewsData || [],
      // Extrahiere Standorte direkt aus dem Vehicle-Objekt
      locationCoordinates: extractLocationCoordinates(
        vehicleData.locations || []
      ),
    } as Vehicle & { reviews: Review[]; locationCoordinates: any[] };
  } catch (err) {
    console.error("Unerwarteter Fehler beim Laden des Fahrzeugs:", err);
    throw err;
  }
};

// Hilfsfunktion zum Extrahieren von Koordinaten aus den Standortstrings
// Format: Mannheim (49.489,8.467), Frankfurt (50.110,8.682)
function extractLocationCoordinates(
  locations: string[]
): { name: string; lat: number; lng: number }[] {
  const coordinates: { name: string; lat: number; lng: number }[] = [];

  // Versuche aus den Einträgen Koordinaten zu extrahieren
  locations.forEach((location) => {
    try {
      // Prüfen ob Koordinaten im Format "Stadt (lat,lng)" vorhanden sind
      const match = location.match(/([^\(]+)\s*\(([0-9.]+),([0-9.]+)\)/);
      if (match) {
        coordinates.push({
          name: match[1].trim(),
          lat: parseFloat(match[2]),
          lng: parseFloat(match[3]),
        });
      } else {
        // Fallback: Wenn keine Koordinaten gefunden werden, verwende Standard-Koordinaten
        // für verschiedene Städte
        const cityCoordinates: { [key: string]: [number, number] } = {
          mannheim: [49.489, 8.467],
          frankfurt: [50.11, 8.682],
          berlin: [52.52, 13.405],
          hamburg: [53.551, 9.993],
          münchen: [48.137, 11.576],
          köln: [50.937, 6.96],
        };

        // Suche nach bekannten Städtenamen im Location-String
        const lowerLocation = location.toLowerCase();
        let found = false;

        for (const [city, coords] of Object.entries(cityCoordinates)) {
          if (lowerLocation.includes(city)) {
            coordinates.push({
              name: location,
              lat: coords[0],
              lng: coords[1],
            });
            found = true;
            break;
          }
        }

        // Wenn keine bekannte Stadt gefunden wurde, verwende Mannheim als Default
        if (!found) {
          coordinates.push({
            name: location,
            lat: 49.489,
            lng: 8.467,
          });
        }
      }
    } catch (error) {
      console.warn("Fehler beim Extrahieren der Koordinaten:", error);
    }
  });

  return coordinates;
}

export const getVehicleLocation = async (locationId: string) => {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("id", locationId)
      .single();

    if (error) {
      console.error("Supabase-Fehler beim Laden des Standorts:", error);
      throw new Error(`Fehler beim Laden des Standorts: ${error.message}`);
    }

    if (!data) {
      console.warn("Kein Standort mit ID", locationId, "gefunden");
      return null;
    }

    return data as Location;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Laden des Standorts:", err);
    throw err;
  }
};

export const getVehicleLocations = async (vehicleId: string) => {
  try {
    // Zuerst das Fahrzeug laden, um die locations zu erhalten
    const vehicle = await getVehicleById(vehicleId);

    if (!vehicle) {
      return [];
    }

    // Da wir das locations Array direkt im Vehicle haben,
    // holen wir die Daten aus der locations Tabelle
    const { data, error } = await supabase.from("locations").select("*");

    if (error) {
      console.error("Supabase-Fehler beim Laden der Locations:", error);
      throw new Error(`Fehler beim Laden der Locations: ${error.message}`);
    }

    if (!data) {
      console.warn("Keine Standortdaten gefunden");
      return [];
    }

    return data as Location[];
  } catch (err) {
    console.error("Unerwarteter Fehler beim Laden der Standorte:", err);
    throw err;
  }
};

// Функция для получения профиля пользователя
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId) // Используем id, так как предполагается, что он совпадает с auth.users.id
      .single();

    if (error && error.code !== "PGRST116") {
      // Игнорируем ошибку "не найдено строк"
      console.error("Supabase-Fehler beim Laden des Profils:", error);
      throw new Error(`Fehler beim Laden des Profils: ${error.message}`);
    }

    return data as Profile | null;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Laden des Profils:", err);
    throw err;
  }
};

// Функция для обновления профиля пользователя
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<Profile, "id" | "updated_at"> & { updated_at?: string }>
) => {
  // Явное указание типа для updates, чтобы исключить id и позволить updated_at
  try {
    // Устанавливаем updated_at на текущее время
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Supabase-Fehler beim Aktualisieren des Profils:", error);
      throw new Error(
        `Fehler beim Aktualisieren des Profils: ${error.message}`
      );
    }
    return data as Profile;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Aktualisieren des Profils:", err);
    throw err;
  }
};

// Функция для получения бронирований пользователя
// Добавляем JOIN с vehicles
export const getUserBookings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        vehicles (*)
      `
      )
      .eq("user_id", userId)
      .order("pickup_date", { ascending: false }); // Сортируем по дате получения (сначала новые)

    if (error) {
      console.error("Supabase-Fehler beim Laden der Buchungen:", error);
      throw new Error(`Fehler beim Laden der Buchungen: ${error.message}`);
    }

    // Приводим тип данных, включая вложенные данные автомобиля
    return data as (Booking & { vehicles: Vehicle | null })[] | null;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Laden der Buchungen:", err);
    throw err;
  }
};
