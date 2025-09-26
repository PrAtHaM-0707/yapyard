import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Lock, Loader, Star } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function ResetPassword() {
  const [formData, setFormData] = useState({ otp: "", newPassword: "" });
  const [isResetting, setIsResetting] = useState(false);
  const { resetPassword } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }
    if (!formData.newPassword || formData.newPassword.length < 6) {
      toast.error("Password min 6 chars");
      return;
    }
    setIsResetting(true);
    try {
      await resetPassword({ email, otp: formData.otp, newPassword: formData.newPassword });
      toast.success("Password reset!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setIsResetting(false);
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
                  <Lock className="w-6 h-6 text-white transform -rotate-12" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-1">
              Reset Password
            </h1>
            <p className="text-sm text-gray-600">Enter OTP and new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "").slice(0,6) })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 text-center tracking-widest"
                placeholder="OTP ******"
                maxLength={6}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500" />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all duration-300"
                placeholder="New password"
                required
              />
            </div>

            <button 
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-sm font-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              type="submit" 
              disabled={isResetting}
            >
              {isResetting ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Reset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;