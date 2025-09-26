import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="p-2 bg-gradient-to-br from-white via-indigo-100 to-pink-100 border-b-2 border-purple-200 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-lg rotate-45 opacity-20 animate-bounce"></div>

      <div className="flex relative z-10">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-2.5 rounded-l-lg font-medium text-sm transition-all duration-300 ${
            activeTab === "chats"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
              : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200"
          }`}
        >
          Chats
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 py-2.5 rounded-r-lg font-medium text-sm transition-all duration-300 ${
            activeTab === "contacts"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
              : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200"
          }`}
        >
          Contacts
        </button>
      </div>
    </div>
  );
}

export default ActiveTabSwitch;