import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 bg-gradient-to-br from-white via-indigo-100 to-pink-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-yellow-400 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-green-400 rounded-lg rotate-45 opacity-25 animate-bounce"></div>
      <div className="absolute top-1/2 left-4 w-8 h-8 bg-orange-400 rounded-full opacity-20 animate-ping"></div>

      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Centered Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 rounded-full flex items-center justify-center">
          <MessageCircleIcon className="w-10 h-10 text-purple-600" />
        </div>

        <h4 className="text-gray-800 font-medium text-lg bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
          No conversations yet
        </h4>
        <p className="text-gray-600 text-sm px-4 max-w-md">
          Start a new chat by selecting a contact from the contacts tab
        </p>

        <button
          onClick={() => setActiveTab("contacts")}
          className="px-5 py-2 text-sm text-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Find contacts
        </button>
      </div>
    </div>
  );
}

export default NoChatsFound;
