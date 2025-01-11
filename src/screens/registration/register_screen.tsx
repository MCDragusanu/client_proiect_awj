import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterController from "./register_screen_controller.ts";
import RequestHandlerImpl from "../../services/RequestHandler.ts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast styling
import appLogo from "../../resources/app_logo.png"; // Import the logo
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhoneAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"; // Import icons

interface RegisterPageProps {
  onRegistrationCompleted: Function;
  onNavigateToLogin: Function;
}

export interface Notification {
  eventType: string; // Can be 'success', 'error', 'info'
  message: string;
}

interface LearningLevel {
  tag: string;
  description: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegistrationCompleted,
  onNavigateToLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [studyLevel, setStudyLevel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Map<string, string>>(
    new Map()
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  // Define the learning levels
  const learningLevels: LearningLevel[] = [
    {
      tag: "Beginner",
      description:
        "New to the subject and just starting to build foundational knowledge. Prefers short, frequent study sessions to avoid feeling overwhelmed.",
    },
    {
      tag: "Intermediate",
      description:
        "Has acquired a solid understanding of the basics and is able to engage with more complex material. Can handle longer study sessions and higher stress levels but may need breaks.",
    },
    {
      tag: "Expert",
      description:
        "Thrives in stressful environments. Can and will learn everything one day before exams.",
    },
  ];

  // Set up the notification callback
  RegisterController.getInstance().setNotificationCallback(
    (notif: Notification) => {
      if (notif.eventType === "success") {
        toast.success(notif.message);
      } else if (notif.eventType === "error") {
        toast.error(notif.message);
      }
    }
  );

  const handleRegister = async () => {
    const controller = RegisterController.getInstance();
    try {
      const response = await controller.registerUser(
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        studyLevel, // Send the selected study level's tag
        rememberMe
      );

      if (response.status === 200 || response.status === 201) {
        onRegistrationCompleted();
        navigate(
          `/home/${RequestHandlerImpl.getInstance().getCredentials().userUid}`
        );
      } else {
        // Handle field-specific errors
        if (response.errors) {
          setFieldErrors(new Map(response.errors)); // Assuming errors are returned as a map of field names and error messages
        }
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      {/* Logo */}
      <img
        src={appLogo}
        alt="App Logo"
        className="w-40 mb-6" // Adjust this value for a different size
      />

      <h1 className="text-3xl font-bold mb-6">Register</h1>

      {/* Form Fields */}
      <div className="w-full max-w-md">
        {/* Email */}
        <div className="relative mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 pl-10 w-full rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.has("email") && (
          <p className="text-red-500 text-sm mb-1">
            {fieldErrors.get("email")}
          </p>
        )}

        {/* Password */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 pl-10 w-full rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {fieldErrors.has("password") && (
          <p className="text-red-500 text-sm mb-1">
            {fieldErrors.get("password")}
          </p>
        )}

        {/* First Name */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-2 pl-10 w-full rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.has("firstName") && (
          <p className="text-red-500 text-sm mb-1">
            {fieldErrors.get("firstName")}
          </p>
        )}

        {/* Last Name */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-2 pl-10 w-full rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.has("lastName") && (
          <p className="text-red-500 text-sm mb-1">
            {fieldErrors.get("lastName")}
          </p>
        )}

        {/* Phone Number */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="p-2 pl-10 w-full rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.has("phoneNumber") && (
          <p className="text-red-500 text-sm mb-1">
            {fieldErrors.get("phoneNumber")}
          </p>
        )}

        {/* Study Level Dropdown */}
        <div className="relative mb-3">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 w-full rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
          >
            {studyLevel
              ? learningLevels.find((level) => level.tag === studyLevel)?.tag
              : "Select Study Level"}
          </button>
          {isDropdownOpen && (
            <div className="absolute w-full bg-gray-800 rounded mt-1 shadow-lg z-10">
              {learningLevels.map((level) => (
                <div
                  key={level.tag}
                  onClick={() => {
                    setStudyLevel(level.tag);
                    setIsDropdownOpen(false);
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-700"
                >
                  <strong className="text-sm">{level.tag}</strong>
                  <p className="text-xs text-gray-400">{level.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {fieldErrors.has("studyLevel") && (
          <p className="text-red-500 text-sm mb-1">
            {fieldErrors.get("studyLevel")}
          </p>
        )}

        {/* Remember Me Checkbox */}
        <div className="mb-4 flex justify-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            Remember Me
          </label>
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="bg-blue-600 px-8 py-3 rounded text-white hover:bg-blue-700 transition-colors duration-300 text-xl"
        >
          Register
        </button>

        {/* Go to Login Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="underline text-blue-400 hover:text-blue-600"
          >
            Already have an account? Login
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default RegisterPage;
