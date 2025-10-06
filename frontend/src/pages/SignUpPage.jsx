import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircle, Lock, Mail, User, Loader, Rocket, Heart, Star, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await signup(formData);
      toast.success("Signup successful! Verify your email.");
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      toast.error(error || "Signup failed"); // Use thrown error message
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 relative overflow-hidden flex items-center justify-center p-4">
      {/* Floating Info Button */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowDisclaimer(!showDisclaimer)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 shadow-lg transition-colors duration-300"
            title="Hosting Info"
          >
            <Info className="w-5 h-5" />
          </button>

          {showDisclaimer && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-yellow-400 rounded-lg shadow-xl p-4 text-xs text-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-yellow-600">⚡ Hosting Info</span>
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p>
                This project is hosted on Render’s free tier. The backend may take up to 1 minute to wake up after inactivity. Thank you for your patience 🙏
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-60 right-8 w-24 h-24 bg-green-400 rounded-lg rotate-45 opacity-30 animate-pulse"></div>
        <div className="absolute bottom-8 left-16 w-48 h-48 bg-blue-400 rounded-full opacity-15 animate-ping"></div>
        <div className="absolute top-24 left-1/2 w-12 h-12 bg-red-400 rotate-12 opacity-40"></div>
        <svg className="absolute bottom-0 left-0 w-full h-16 opacity-30" viewBox="0 0 1440 120">
          <path fill="#ffffff" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"></div>
          <div className="grid lg:grid-cols-5 gap-0">
            {/* LEFT COLUMN - FORM */}
            <div className="lg:col-span-3 p-4 lg:p-8 bg-gradient-to-br from-white to-indigo-50">
              <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="flex justify-center items-center mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center transform rotate-12 shadow-lg">
                        <MessageCircle className="w-6 h-6 text-white transform -rotate-12" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="w-2 h-2 text-white" />
                      </div>
                    </div>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-1 font-sans">
                    Hey There!
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">Let's create something amazing together</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="relative">
                    <label className="text-m font-bold text-gray-700 block mb-1">What's your name?</label>
                    <div className="relative group">
                      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-50 pr-1" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full max-w-md pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300 relative z-10"
                        placeholder="Your awesome name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label className="text-m font-bold text-gray-700 block mb-1">Your email address</label>
                    <div className="relative group">
                      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-50 pr-1" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 relative z-10"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="text-m font-bold text-gray-700 block mb-1">Create a password</label>
                    <div className="relative group">
                      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-pink-400 to-red-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500 z-50 pr-1" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all duration-300 relative z-10"
                        placeholder="Make it super secure!"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700 text-white text-sm font-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                    type="submit"
                  >
                    <div className="flex items-center justify-center">
                      {isSigningUp ? <Loader className="w-4 h-4 animate-spin" /> : <><Rocket className="w-4 h-4 mr-2" /> Let's Go! Create My Account</>}
                    </div>
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <Link to="/login" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 font-semibold text-xs group">
                    Already part of our family? 
                    <span className="ml-1 text-purple-600 group-hover:translate-x-1 inline-block transition-transform duration-300">Welcome back! →</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - ILLUSTRATION */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 p-4 lg:p-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-full opacity-30"></div>
              <div className="absolute bottom-8 left-4 w-10 h-10 bg-green-400 rounded-lg rotate-45 opacity-40"></div>
              <div className="absolute top-1/2 left-3 w-4 h-4 bg-orange-400 rounded-full opacity-50"></div>

              <div className="text-center relative z-10">
                <div className="relative mb-3">
                  <div className="w-40 h-40 lg:w-48 lg:h-48 bg-white rounded-2xl p-3 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 mx-auto">
                    <img src="/signup.png" alt="Join our community" className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg lg:text-xl font-black text-white mb-1">Join 50,000+ Happy Users!</h3>
                  <p className="text-white/90 text-xs lg:text-sm font-medium leading-relaxed">Be part of an amazing community where creativity meets technology</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
