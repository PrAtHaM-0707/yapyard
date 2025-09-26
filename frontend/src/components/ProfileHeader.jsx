import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
      } catch {
        toast.error("Failed to update profile picture");
      }
    };
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white via-indigo-100 to-pink-100 border-b-2 border-purple-200 relative overflow-hidden shadow-lg">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-12 h-12 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-400 rounded-lg rotate-45 opacity-20 animate-bounce"></div>

      <div className="flex items-center justify-between relative z-10">
        {/* Avatar + User Info */}
        <div className="flex items-center gap-3">
          <div className="avatar relative">
            <button
              className="w-14 h-14 rounded-full overflow-hidden relative group shadow-lg"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-pink-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-full">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-gray-800 font-bold text-base max-w-[180px] truncate bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {authUser.fullName}
            </h3>
            <p className="text-purple-600 text-xs font-medium">@{authUser.username}</p>
          </div>
        </div>

        {/* Buttons in Separate Gradient Boxes */}
        <div className="flex gap-3 items-center pl-2">
          <button
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-2.5 shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={async () => {
              try {
                await logout();
              } catch {
                toast.error("Logout failed");
              }
            }}
          >
            <LogOutIcon className="w-4 h-4 text-white" />
          </button>

          <button
            className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg p-2.5 shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch(() => {});
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="w-4 h-4 text-white" />
            ) : (
              <VolumeOffIcon className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
