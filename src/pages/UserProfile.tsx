import { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import {
  supabase,
  Profile, // Импорт типа Profile
  Booking,
  Vehicle,
  getUserProfile,
  updateUserProfile,
  getUserBookings,
} from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Тип для бронирования с данными автомобиля
type BookingWithVehicle = Booking & { vehicles: Vehicle | null };

const UserProfile = () => {
  const { user, loading: authLoading, session } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<BookingWithVehicle[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Функция загрузки профиля
  const loadProfile = useCallback(
    async (userId: string) => {
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
        // Заполняем форму начальными данными
        setFormData({
          fullName: data?.full_name || "",
          lastName: data?.last_name || "",
          phoneNumber: data?.phone_number || "",
          email: user?.email || "",
        });
        setAvatarPreview(data?.avatar_url || null);
        setAvatarFile(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading profile");
        console.error(err);
      }
    },
    [user?.email]
  );

  // Функция загрузки бронирований
  const loadBookings = useCallback(async (userId: string) => {
    try {
      const data = await getUserBookings(userId);
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading bookings");
      console.error(err);
    }
  }, []);

  // Загрузка данных при доступности пользователя
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else if (!authLoading && user) {
      setIsLoading(true);
      setError(null);
      Promise.all([loadProfile(user.id), loadBookings(user.id)])
        .catch((err) => {
          // Ошибки уже обрабатываются внутри loadProfile/loadBookings и записываются в setError
          console.error("Error loading profile/bookings:", err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, authLoading, navigate, loadProfile, loadBookings]);

  // Обработка изменений формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      // Создаем превью
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Если файл не выбран (например, отмена), возвращаем старое превью
      setAvatarFile(null);
      setAvatarPreview(profile?.avatar_url || null);
    }
  };

  // Сохранение профиля
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !session) return;

    setIsSaving(true);
    setError(null);
    let avatarUrl = profile?.avatar_url;
    let emailUpdateError = null;
    let profileUpdateError = null;

    try {
      // 1. Загрузка нового аватара (если выбран)
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(user.id, avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          throw new Error("Avatar upload failed.");
        }
      }

      // 2. Обновление данных профиля (имя, фамилия, телефон, аватар)
      const profileUpdates = {
        full_name: formData.fullName || null,
        last_name: formData.lastName || null,
        phone_number: formData.phoneNumber || null,
        avatar_url: avatarUrl || null,
      };

      if (
        profileUpdates.full_name !== profile?.full_name ||
        profileUpdates.last_name !== profile?.last_name ||
        profileUpdates.phone_number !== profile?.phone_number ||
        profileUpdates.avatar_url !== profile?.avatar_url
      ) {
        try {
          const updatedProfile = await updateUserProfile(
            user.id,
            profileUpdates
          );
          setProfile(updatedProfile);
          setAvatarFile(null);
        } catch (profileError) {
          profileUpdateError = profileError;
        }
      }

      // 3. Обновление Email (если изменился)
      if (formData.email && formData.email !== user.email) {
        try {
          const { error: emailError } = await supabase.auth.updateUser({
            email: formData.email,
          });

          if (emailError) {
            throw emailError;
          }

          alert("Please check your new email address to confirm the change.");
        } catch (emailError) {
          emailUpdateError = emailError;
        }
      }

      if (profileUpdateError || emailUpdateError) {
        let combinedError = "Error saving profile:";
        if (profileUpdateError)
          combinedError += `\nProfile: ${
            profileUpdateError instanceof Error
              ? profileUpdateError.message
              : String(profileUpdateError)
          }`;
        if (emailUpdateError)
          combinedError += `\nEmail: ${
            emailUpdateError instanceof Error
              ? emailUpdateError.message
              : String(emailUpdateError)
          }`;
        throw new Error(combinedError);
      }

      setEditMode(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during save."
      );
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Функция загрузки аватара
  const uploadAvatar = async (
    userId: string,
    file: File
  ): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError("Error uploading avatar. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Фильтрация бронирований
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.pickup_date) >= new Date()
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.pickup_date) < new Date()
  );

  // --- Рендеринг --- //
  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading user data...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Секция Профиля */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit">
            {" "}
            {/* h-fit чтобы блок не растягивался */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {editMode ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="mb-4 text-center">
              <img
                src={
                  avatarPreview ||
                  "https://via.placeholder.com/150?text=No+Avatar"
                }
                alt="Avatar"
                className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-gray-300"
              />
              {editMode && (
                <div className="mt-2">
                  <label
                    htmlFor="avatarUpload"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                  >
                    Change Avatar
                  </label>
                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {isUploading && (
                    <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-3">
              {editMode ? (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your email address"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name:
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name:
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your last name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone:
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your phone number"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className={`w-full px-4 py-2 rounded-md text-white ${
                      isSaving || isUploading
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    } transition-colors`}
                  >
                    {isSaving
                      ? "Saving..."
                      : isUploading
                      ? "Uploading..."
                      : "Save Changes"}
                  </button>
                </form>
              ) : (
                <>
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-medium">First Name:</span>{" "}
                    {profile?.full_name || (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Last Name:</span>{" "}
                    {profile?.last_name || (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {profile?.phone_number || (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Секция Бронирований */}
          <div className="lg:col-span-2 space-y-6">
            {/* Предстоящие бронирования */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming bookings.</p>
              )}
            </div>

            {/* Прошедшие бронирования */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Booking History</h2>
              {pastBookings.length > 0 ? (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Booking history is empty.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Компонент для отображения карточки бронирования (можно вынести в отдельный файл)
const BookingCard = ({ booking }: { booking: BookingWithVehicle }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const vehicleName = booking.vehicles
    ? `${booking.vehicles.brand} ${booking.vehicles.model}`
    : "Vehicle information unavailable";
  const vehicleImage =
    booking.vehicles?.carimg ||
    "https://via.placeholder.com/100x80?text=No+Image";

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
      <img
        src={vehicleImage}
        alt={vehicleName}
        className="w-full md:w-24 h-20 object-cover rounded flex-shrink-0"
      />
      <div className="flex-grow">
        <h3 className="font-semibold">{vehicleName}</h3>
        <p className="text-sm text-gray-600">
          Status:{" "}
          <span
            className={`font-medium ${
              booking.status === "confirmed"
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {booking.status}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Pickup: {booking.pickup_location} ({formatDate(booking.pickup_date)})
        </p>
        <p className="text-sm text-gray-600">
          Return: {booking.dropoff_location} ({formatDate(booking.dropoff_date)}
          )
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-semibold">${booking.total_price.toFixed(2)}</p>
        {/* Можно добавить кнопку для просмотра деталей бронирования */}
      </div>
    </div>
  );
};

export default UserProfile;
