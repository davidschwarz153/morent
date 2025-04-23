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
  vehicleID: string;
  brand: string;
  model: string;
  year: number;
  vehicleType: string;
  colors: string[];
  locations: string[];
  pricePerDay: number;
  availability: boolean;
  electricVehicle: boolean;
  imageUrl: string;
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
  postalCode: string;
  country: string;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  vehicleId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  vehicleId: string;
  userId: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
};

// Hilfsfunktionen für Datenbankoperationen
export const getVehicles = async (filters?: Partial<Vehicle>) => {
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
    throw new Error(`Fehler beim Laden der Fahrzeuge: ${error.message}`);
  }

  return data as Vehicle[];
};

export const getLocations = async () => {
  const { data, error } = await supabase.from("locations").select("*");

  if (error) {
    throw new Error(`Fehler beim Laden der Standorte: ${error.message}`);
  }

  return data as Location[];
};

export const getReviews = async (vehicleId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("vehicleId", vehicleId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Fehler beim Laden der Bewertungen: ${error.message}`);
  }

  return data as Review[];
};

export const createBooking = async (
  booking: Omit<Booking, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("bookings")
    .insert([booking])
    .select()
    .single();

  if (error) {
    throw new Error(`Fehler beim Erstellen der Buchung: ${error.message}`);
  }

  return data as Booking;
};
