import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaStar, FaLock, FaCreditCard } from "react-icons/fa";
import { MdArrowBack, MdKeyboardArrowRight } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Vehicle, getVehicleById, createBooking } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

type PaymentStep = "billing" | "rental" | "payment" | "confirmation";

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("billing");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Form states
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    town: "",
  });

  const [rentalInfo, setRentalInfo] = useState({
    pickupLocation: "Bremen",
    pickupDate: "",
    pickupTime: "",
    dropoffLocation: "Bremen",
    dropoffDate: "",
    dropoffTime: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    "credit" | "paypal" | "bitcoin"
  >("credit");

  const [paymentInfo, setPaymentInfo] = useState({
    creditCard: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
    paypal: {
      email: "",
    },
    bitcoin: {
      walletAddress: "",
    },
  });

  const [agreements, setAgreements] = useState({
    marketing: false,
    terms: false,
  });

  // Preisliste
  const [priceDetails, setPriceDetails] = useState({
    basePrice: 100,
    tax: 0,
    total: 100,
  });

  // Получаем список городов из vehicle.locations
  const availableLocations = Array.isArray(vehicle?.locations)
    ? vehicle.locations
    : typeof vehicle?.locations === 'string'
    ? (vehicle.locations as string).split(',').map((s: string) => s.trim())
    : [];

  // Lade Fahrzeugdaten
  useEffect(() => {
    const loadVehicle = async () => {
      if (id) {
        try {
          setLoading(true);
          const vehicleData = await getVehicleById(id);
          setVehicle(vehicleData);

          if (vehicleData) {
            setPriceDetails({
              basePrice: vehicleData.priceperday || 100,
              tax: 0,
              total: vehicleData.priceperday || 100,
            });
          }
        } catch (error) {
          console.error("Error loading vehicle data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadVehicle();
  }, [id]);

  // Предзаполнение формы данными из location.state
  useEffect(() => {
    if (location.state) {
      const {
        pickupLocation,
        pickupDate,
        pickupTime,
        dropoffLocation,
        dropoffDate,
        dropoffTime,
      } = location.state as Partial<typeof rentalInfo>; // Указываем тип для state

      setRentalInfo((prev) => ({
        ...prev,
        pickupLocation: pickupLocation || prev.pickupLocation,
        pickupDate: pickupDate || prev.pickupDate,
        pickupTime: pickupTime || prev.pickupTime,
        dropoffLocation: dropoffLocation || prev.dropoffLocation,
        dropoffDate: dropoffDate || prev.dropoffDate,
        dropoffTime: dropoffTime || prev.dropoffTime,
      }));
    }
  }, [location.state]); // Зависимость от location.state

  // Расчет цены при изменении дат или автомобиля
  useEffect(() => {
    if (vehicle && rentalInfo.pickupDate && rentalInfo.dropoffDate) {
      const pickup = new Date(rentalInfo.pickupDate);
      const dropoff = new Date(rentalInfo.dropoffDate);

      if (dropoff > pickup) {
        const timeDiff = dropoff.getTime() - pickup.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Разница в днях, округляем вверх
        const calculatedDays = days > 0 ? days : 1; // Минимум 1 день аренды

        const basePrice = calculatedDays * (vehicle.priceperday || 0);
        const tax = 0; // Пока налог 0, можно изменить логику
        const total = basePrice + tax;

        setPriceDetails({ basePrice, tax, total });
      } else {
        // Если даты некорректны, используем цену за 1 день
        const basePrice = vehicle.priceperday || 0;
        const tax = 0;
        const total = basePrice + tax;
        setPriceDetails({ basePrice, tax, total });
      }
    } else if (vehicle) {
      // Если даты не выбраны, показываем базовую цену за 1 день
      const basePrice = vehicle.priceperday || 0;
      const tax = 0;
      const total = basePrice + tax;
      setPriceDetails({ basePrice, tax, total });
    }
  }, [rentalInfo.pickupDate, rentalInfo.dropoffDate, vehicle]);

  // Formularänderungen verarbeiten
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleRentalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRentalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (
    method: "credit" | "paypal" | "bitcoin"
  ) => {
    setPaymentMethod(method);
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [paymentMethod]: {
        ...prev[paymentMethod],
        [name]: value,
      },
    }));
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
  };

  // Weiter zum nächsten Schritt
  const nextStep = () => {
    if (currentStep === "billing") {
      setCurrentStep("rental");
    } else if (currentStep === "rental") {
      const pickup = new Date(
        rentalInfo.pickupDate + "T" + (rentalInfo.pickupTime || "00:00")
      );
      const dropoff = new Date(
        rentalInfo.dropoffDate + "T" + (rentalInfo.dropoffTime || "00:00")
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (
        !rentalInfo.pickupDate ||
        !rentalInfo.dropoffDate ||
        !rentalInfo.pickupTime ||
        !rentalInfo.dropoffTime
      ) {
        alert("Please fill in all rental details.");
        return;
      }
      if (pickup < today) {
        alert("Pickup date cannot be in the past.");
        return;
      }
      if (dropoff <= pickup) {
        alert("Return date must be after the pickup date.");
        return;
      }

      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      // Überprüfe, ob alle erforderlichen Zahlungsinformationen eingegeben wurden
      if (paymentMethod === "credit") {
        const { cardNumber, cardHolder, expiryDate, cvv } = paymentInfo.creditCard;
        if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
          alert("Bitte füllen Sie alle Kreditkarteninformationen aus.");
          return;
        }
      } else if (paymentMethod === "paypal") {
        const { email } = paymentInfo.paypal;
        if (!email) {
          alert("Bitte geben Sie Ihre PayPal-E-Mail-Adresse ein.");
          return;
        }
      } else if (paymentMethod === "bitcoin") {
        const { walletAddress } = paymentInfo.bitcoin;
        if (!walletAddress) {
          alert("Bitte geben Sie Ihre Bitcoin-Wallet-Adresse ein.");
          return;
        }
      }
      
      setCurrentStep("confirmation");
    } else if (currentStep === "confirmation") {
      completeRental();
    }
  };

  // Zurück zum vorherigen Schritt
  const prevStep = () => {
    if (currentStep === "rental") setCurrentStep("billing");
    else if (currentStep === "payment") setCurrentStep("rental");
    else if (currentStep === "confirmation") setCurrentStep("payment");
  };

  // Abschluss der Buchung
  const completeRental = async () => {
    if (!user) {
      alert("Please log in to complete the booking.");
      navigate("/login");
      return;
    }

    if (!vehicle) {
      alert("Error: Vehicle data not loaded.");
      return;
    }

    if (
      !rentalInfo.pickupDate ||
      !rentalInfo.dropoffDate ||
      !rentalInfo.pickupTime ||
      !rentalInfo.dropoffTime
    ) {
      alert("Please ensure all rental dates and times are selected.");
      setCurrentStep("rental");
      return;
    }

    const pickupDateTime = new Date(
      `${rentalInfo.pickupDate}T${rentalInfo.pickupTime}`
    ).toISOString();
    const dropoffDateTime = new Date(
      `${rentalInfo.dropoffDate}T${rentalInfo.dropoffTime}`
    ).toISOString();

    const newBooking = {
      vehicle_id: vehicle.id,
      user_id: user.id,
      pickup_location: rentalInfo.pickupLocation,
      dropoff_location: rentalInfo.dropoffLocation,
      pickup_date: pickupDateTime,
      dropoff_date: dropoffDateTime,
      total_price: priceDetails.total,
      status: "confirmed" as const,
      payment_method: paymentMethod,
      payment_info: paymentInfo[paymentMethod],
    };

    setLoading(true);
    try {
      const created = await createBooking(newBooking);
      console.log("Booking created:", created);
      alert("Booking successfully created! Thank you for your order.");
      navigate("/");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while creating the booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Bestimmt den Fortschritt
  const getStepNumber = (step: PaymentStep): number => {
    switch (step) {
      case "billing":
        return 1;
      case "rental":
        return 2;
      case "payment":
        return 3;
      case "confirmation":
        return 4;
      default:
        return 1;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto py-12 px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
            Fahrzeugdaten werden geladen...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto py-12 px-4 text-center">
          <p className="text-red-500">Fahrzeug nicht gefunden</p>
          <Link
            to="/"
            className="text-blue-500 dark:text-blue-400 mt-4 inline-block"
          >
            Zurück zur Startseite
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Link
            to={`/cars/${id}`}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <MdArrowBack className="mr-1" /> Zurück
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Левая колонка - форма */}
          <div className="md:col-span-2">
            {/* Billing Info */}
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6 ${
                currentStep !== "billing" ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Billing Info
                  </h2>
                  {getStepNumber(currentStep) > 1 && (
                    <IoCheckmarkCircle
                      className="text-green-500 ml-2"
                      size={20}
                    />
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Step {getStepNumber("billing")} of 4
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Bitte geben Sie Ihre Rechnungsdaten ein
              </p>

              {currentStep === "billing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Ihr Name"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={billingInfo.name}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Telefonnummer
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Telefonnummer"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={billingInfo.phoneNumber}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Adresse
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Adresse"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={billingInfo.address}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="town"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Stadt / Ort
                      </label>
                      <input
                        type="text"
                        id="town"
                        name="town"
                        placeholder="Stadt oder Ort"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={billingInfo.town}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={nextStep}
                      className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center"
                    >
                      Weiter <MdKeyboardArrowRight className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Rental Info */}
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6 ${
                currentStep !== "rental" ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Rental Info
                  </h2>
                  {getStepNumber(currentStep) > 2 && (
                    <IoCheckmarkCircle
                      className="text-green-500 ml-2"
                      size={20}
                    />
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Step {getStepNumber("rental")} of 4
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Bitte wählen Sie Ihre Mietdaten
              </p>

              {currentStep === "rental" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Pick - Up
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="pickupLocation"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Ort
                        </label>
                        <select
                          id="pickupLocation"
                          name="pickupLocation"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          value={rentalInfo.pickupLocation}
                          onChange={handleRentalChange}
                          required
                        >
                          {availableLocations.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="pickupDate"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Datum
                        </label>
                        <input
                          type="date"
                          id="pickupDate"
                          name="pickupDate"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          value={rentalInfo.pickupDate}
                          onChange={handleRentalChange}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label
                        htmlFor="pickupTime"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Zeit
                      </label>
                      <input
                        type="time"
                        id="pickupTime"
                        name="pickupTime"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={rentalInfo.pickupTime}
                        onChange={handleRentalChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Drop - Off
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="dropoffLocation"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Ort
                        </label>
                        <select
                          id="dropoffLocation"
                          name="dropoffLocation"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          value={rentalInfo.dropoffLocation}
                          onChange={handleRentalChange}
                          required
                        >
                          {availableLocations.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="dropoffDate"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Datum
                        </label>
                        <input
                          type="date"
                          id="dropoffDate"
                          name="dropoffDate"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          value={rentalInfo.dropoffDate}
                          onChange={handleRentalChange}
                          min={
                            rentalInfo.pickupDate ||
                            new Date().toISOString().split("T")[0]
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label
                        htmlFor="dropoffTime"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Zeit
                      </label>
                      <input
                        type="time"
                        id="dropoffTime"
                        name="dropoffTime"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={rentalInfo.dropoffTime}
                        onChange={handleRentalChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center"
                    >
                      Weiter <MdKeyboardArrowRight className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6 ${
                currentStep !== "payment" ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Payment Method
                  </h2>
                  {getStepNumber(currentStep) > 3 && (
                    <IoCheckmarkCircle
                      className="text-green-500 ml-2"
                      size={20}
                    />
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Step {getStepNumber("payment")} of 4
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Bitte wählen Sie Ihre Zahlungsmethode
              </p>

              {currentStep === "payment" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center p-3 border dark:border-gray-600 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        id="credit"
                        name="paymentMethod"
                        checked={paymentMethod === "credit"}
                        onChange={() => handlePaymentMethodChange("credit")}
                        className="mr-3"
                      />
                      <FaCreditCard className="mr-2 text-gray-600 dark:text-gray-400" />
                      <label
                        htmlFor="credit"
                        className="flex-grow cursor-pointer text-gray-900 dark:text-white"
                      >
                        Credit Card
                      </label>
                      <div className="flex space-x-2">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                          alt="Visa"
                          className="h-6"
                        />
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                          alt="Mastercard"
                          className="h-6"
                        />
                      </div>
                    </div>

                    {paymentMethod === "credit" && (
                      <div className="mt-4 p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                          Kreditkarteninformationen
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="cardNumber"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Kartennummer
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              value={paymentInfo.creditCard.cardNumber}
                              onChange={handlePaymentInfoChange}
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="cardHolder"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Name auf der Karte
                            </label>
                            <input
                              type="text"
                              id="cardHolder"
                              name="cardHolder"
                              placeholder="Max Mustermann"
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              value={paymentInfo.creditCard.cardHolder}
                              onChange={handlePaymentInfoChange}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="expiryDate"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                Ablaufdatum
                              </label>
                              <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                placeholder="MM/YY"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                value={paymentInfo.creditCard.expiryDate}
                                onChange={handlePaymentInfoChange}
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="cvv"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                value={paymentInfo.creditCard.cvv}
                                onChange={handlePaymentInfoChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center p-3 border dark:border-gray-600 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        checked={paymentMethod === "paypal"}
                        onChange={() => handlePaymentMethodChange("paypal")}
                        className="mr-3"
                      />
                      <label
                        htmlFor="paypal"
                        className="flex-grow cursor-pointer text-gray-900 dark:text-white"
                      >
                        PayPal
                      </label>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                        alt="PayPal"
                        className="h-6"
                      />
                    </div>

                    {paymentMethod === "paypal" && (
                      <div className="mt-4 p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                          PayPal-Informationen
                        </h3>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            PayPal-E-Mail
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="ihre.email@beispiel.de"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            value={paymentInfo.paypal.email}
                            onChange={handlePaymentInfoChange}
                            required
                          />
                        </div>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                          Sie werden nach der Bestätigung zur PayPal-Anmeldung weitergeleitet.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center p-3 border dark:border-gray-600 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        id="bitcoin"
                        name="paymentMethod"
                        checked={paymentMethod === "bitcoin"}
                        onChange={() => handlePaymentMethodChange("bitcoin")}
                        className="mr-3"
                      />
                      <label
                        htmlFor="bitcoin"
                        className="flex-grow cursor-pointer text-gray-900 dark:text-white"
                      >
                        Bitcoin
                      </label>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg"
                        alt="Bitcoin"
                        className="h-6"
                      />
                    </div>

                    {paymentMethod === "bitcoin" && (
                      <div className="mt-4 p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                          Bitcoin-Zahlungsinformationen
                        </h3>
                        <div>
                          <label
                            htmlFor="walletAddress"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Bitcoin-Wallet-Adresse
                          </label>
                          <input
                            type="text"
                            id="walletAddress"
                            name="walletAddress"
                            placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            value={paymentInfo.bitcoin.walletAddress}
                            onChange={handlePaymentInfoChange}
                            required
                          />
                        </div>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                          Nach der Bestätigung erhalten Sie eine Bitcoin-Adresse, an die Sie den Betrag überweisen können.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center"
                    >
                      Weiter <MdKeyboardArrowRight className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation */}
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6 ${
                currentStep !== "confirmation" ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Confirmation
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Step {getStepNumber("confirmation")} of 4
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Fast geschafft! Nur noch ein paar Klicks und Ihre Buchung ist
                abgeschlossen.
              </p>

              {currentStep === "confirmation" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="marketing"
                        name="marketing"
                        checked={agreements.marketing}
                        onChange={handleAgreementChange}
                        className="mr-3"
                      />
                      <label
                        htmlFor="marketing"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        Ich stimme dem Erhalt von Marketing und Newsletter
                        E-Mails zu. Kein Spam, versprochen!
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={agreements.terms}
                        onChange={handleAgreementChange}
                        className="mr-3"
                        required
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        Ich stimme den Nutzungsbedingungen und der
                        Datenschutzerklärung zu
                      </label>
                    </div>
                  </div>

                  <div className="border dark:border-gray-600 rounded-lg p-4 bg-blue-50 dark:bg-blue-900 flex items-start">
                    <FaLock className="text-blue-500 dark:text-blue-400 mr-3 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Alle Ihre Daten sind sicher
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Wir verwenden modernste Sicherheitsvorkehrungen, um
                        Ihnen das beste Erlebnis zu bieten.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={completeRental}
                      className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                      disabled={!agreements.terms}
                    >
                      Jetzt mieten!
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка - сводка */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Rental Summary
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Preise können sich je nach Mietdauer und Fahrzeug unterscheiden.
              </p>

              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={
                    vehicle.carimg ||
                    `https://source.unsplash.com/random/800x600/?car,${vehicle.brand},${vehicle.model}`
                  }
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-20 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < 4
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }
                          size={12}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      5 Bewertungen
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-b dark:border-gray-600 py-4 space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Preis ({vehicle.priceperday}$ / Tag x
                    {(() => {
                      if (rentalInfo.pickupDate && rentalInfo.dropoffDate) {
                        const pickup = new Date(rentalInfo.pickupDate);
                        const dropoff = new Date(rentalInfo.dropoffDate);
                        if (dropoff > pickup) {
                          const timeDiff = dropoff.getTime() - pickup.getTime();
                          const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
                          return days > 0 ? days : 1;
                        }
                        return 1;
                      }
                      return 1;
                    })()}{" "}
                    Tag(e))
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${priceDetails.basePrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Steuern
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${priceDetails.tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-900 dark:text-white">
                  Gesamtpreis
                </span>
                <span className="text-gray-900 dark:text-white">
                  ${priceDetails.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
