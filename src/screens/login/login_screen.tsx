import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginController from "./login_screen_controller.ts";
import RequestHandlerImpl from "../../services/RequestHandler.ts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import Toast styling
import appLogo from '../../resources/app_logo.png';  // Import the logo
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';  // Import icons

interface LoginPageProps {
  onLoginCompleted: Function;
  onNavigateToRegister: Function;
}

export interface Notification {
  eventType: string; // Can be 'success', 'error', 'info'
  message: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginCompleted, onNavigateToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Map<string, string>>(new Map());
  const [showPassword, setShowPassword] = useState(false);  // State for password visibility
  const navigate = useNavigate();

  // Set up the notification callback
  LoginController.getInstance().setNotificationCallback((notif: Notification) => {
    if (notif.eventType === 'success') {
      toast.success(notif.message);
    } else if (notif.eventType === 'error') {
      toast.error(notif.message);
    }
  });

  const handleLogin = async () => {
    const controller = LoginController.getInstance();
    try {
      const response = await controller.loginUser(email, password, rememberMe);
      if (response.status === 200) {
        onLoginCompleted(response.message);
        navigate(`/home/${RequestHandlerImpl.getInstance().getCredentials().userUid}`);
      } else {
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
        className="w-40 mb-6"  // Adjust this value for a different size
      />

      <h1 className="text-3xl font-bold mb-6">Login</h1>

      {/* Form Fields */}
      <div className="w-full max-w-md">
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
          <p className="text-red-500 text-sm mb-1">{fieldErrors.get("email")}</p>
        )}

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}  // Toggle between text and password input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 pl-10 w-full rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}  // Toggle password visibility
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {fieldErrors.has("password") && (
          <p className="text-red-500 text-sm mb-1">{fieldErrors.get("password")}</p>
        )}

        {/* Remember Me Checkbox centered */}
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

        {/* Login Button - Bigger */}
        <button
          onClick={handleLogin}
          className="bg-blue-600 min-w-72 px-8 py-3 rounded text-white hover:bg-blue-700 transition-colors duration-300 text-xl"
        >
          Login
        </button>

        {/* Go to Register - Below Login Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/register")}
            className="underline text-blue-400 hover:text-blue-600"
          >
            Don't have an account? Register
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

export default LoginPage;
