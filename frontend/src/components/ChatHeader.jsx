import { XIcon, Star } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-gradient-to-br from-white via-indigo-100 to-pink-100 px-6 py-2 rounded-t-xl shadow-md relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-12 h-12 bg-yellow-400 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-400 rounded-lg rotate-45 opacity-25 animate-bounce"></div>

      <div className="relative z-10 flex justify-between items-center w-full">
        {/* Left: Avatar + Info */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-purple-200 shadow-sm">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-sm animate-pulse ${
                isOnline ? "opacity-100" : "opacity-50"
              }`}
            >
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {selectedUser.fullName}
            </h3>
            <p className="text-sm text-gray-600">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* Right: Close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <XIcon className="w-5 h-5 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-sm animate-pulse">
            <Star className="w-2 h-2 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;