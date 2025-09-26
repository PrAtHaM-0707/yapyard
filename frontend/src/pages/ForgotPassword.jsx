import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Loader, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Enter email");
      return;
    }
    setIsSubmitting(true);
    try {
      await forgotPassword({ email });
      toast.success("OTP sent to email");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 relative overflow-hidden flex items-center justify-center p-4">
      {/* ... background ... */}
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
              Forgot Password
            </h1>
            <p className="text-sm text-gray-600">Enter your email to reset</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300"
                placeholder="name@example.com"
                required
              />
            </div>

            <button 
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-sm font-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;