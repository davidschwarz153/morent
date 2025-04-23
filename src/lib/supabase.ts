import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Diese Umgebungsvariablen müssen in einer .env-Datei definiert werden
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL und Anon Key müssen in der .env-Datei definiert werden"
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Typendefinitionen basierend auf der Datenbankstruktur
export type Vehicle = {
  id: string;
  vehicleid: string;
  brand: string;
  model: string;
  year: number;
  vehicletype: string;
  colors: string[];
  locations: string[];
  priceperday: number;
  availability: boolean;
  electricVehicle: boolean;
  carimg: string;
  seats: number;
  luggage: number;
  horsepower: number;
  transmission: string;
  consumption: string;
  fuel: string;
  created_at: string;
  updated_at: string;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  vehicleid: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
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
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("created_at", { ascending: false });

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
