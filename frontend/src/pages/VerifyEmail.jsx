import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Loader, Star, Rocket, Heart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { verifyOtp } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }
    setIsVerifying(true);
    try {
      await verifyOtp({ email, otp });
      toast.success("Email verified!");
      navigate(`/set-username?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
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
                  <Mail className="w-6 h-6 text-white transform -rotate-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-1">
              Verify Email
            </h1>
            <p className="text-sm text-gray-600">Enter the OTP sent to {email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 text-center tracking-widest"
                placeholder="******"
                maxLength={6}
                required
              />
            </div>

            <button
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-sm font-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              type="submit"
              disabled={isVerifying}
            >
              {isVerifying ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;