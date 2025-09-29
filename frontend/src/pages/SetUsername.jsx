import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Loader, Star } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

function SetUsername() {
  const [usernameInput, setUsernameInput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  const { setUsername } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const validateUsername = (value) => {
    if (!value) return "Username required";
    if (value.length < 3) return "Min 3 characters";
    if (value.length > 30) return "Max 30 characters";
    if (!/^[a-z0-9._]+$/.test(value)) return "Lowercase letters, numbers, . _ only";
    if (value.endsWith(".") || value.endsWith("_")) return "Cannot end with . or _";
    return "";
  };

  const handleChange = async (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "");
    setUsernameInput(value);

    const validationError = validateUsername(value);
    setError(validationError);
    setIsUsernameAvailable(false); // reset availability on change

    if (!validationError && value) {
      setCheckingUsername(true);
      try {
        await axiosInstance.get(`/auth/check-username/${value}`);
        setIsUsernameAvailable(true); // username is free
      } catch (err) {
        setError(err.response?.data?.message || "Username taken");
        setIsUsernameAvailable(false);
      } finally {
        setCheckingUsername(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateUsername(usernameInput);
    setError(validationError);

    if (!validationError && isUsernameAvailable) {
      setIsSubmitting(true);
      try {
        await setUsername({ email, username: usernameInput });
        toast.success("Username set successfully!");
        navigate("/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to set username");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix errors before submitting");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 relative overflow-hidden flex items-center justify-center p-4">
      {/* Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-60 right-8 w-24 h-24 bg-green-400 rounded-lg rotate-45 opacity-30 animate-pulse"></div>
        <div className="absolute bottom-8 left-16 w-48 h-48 bg-blue-400 rounded-full opacity-15 animate-ping"></div>
        <div className="absolute top-24 left-1/2 w-12 h-12 bg-red-400 rotate-12 opacity-40"></div>
        <svg className="absolute bottom-0 left-0 w-full h-16 opacity-30" viewBox="0 0 1440 120">
          <path fill="#ffffff" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center transform rotate-12 shadow-lg">
                  <User className="w-6 h-6 text-white transform -rotate-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-1">
              Choose Your Username
            </h1>
            <p className="text-sm text-gray-600">Pick a unique username for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 bg-gray-50 border-2 ${error ? 'border-red-400' : 'border-gray-200'} rounded-xl text-gray-800 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300`}
                  placeholder="your.username"
                  required
                />
                {checkingUsername && (
                  <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                )}
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <button 
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-sm font-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              type="submit" 
              disabled={isSubmitting || checkingUsername || !!error || !isUsernameAvailable}
            >
              {isSubmitting ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Set Username"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SetUsername;
