import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { UserX } from "lucide-react";

function ChatPage() {
  const { activeTab, selectedUser, messages } = useChatStore();
  const { onlineUsers, authUser, blockUser, unblockUser } = useAuthStore();

  // Filter messages to get images shared in the chat
  const sharedMedia = messages
    .filter((msg) => msg.image && (msg.senderId === selectedUser?._id || msg.receiverId === selectedUser?._id))
    .map((msg) => ({
      id: msg._id,
      url: msg.image,
    }));

  const isBlocked = authUser?.blockedUsers?.includes(selectedUser?._id);

  const handleBlockUser = () => {
    isBlocked ? unblockUser(selectedUser._id) : blockUser(selectedUser._id);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Colorful Top Border */}
      <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"></div>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-80 flex flex-col bg-white border-r border-gray-200">
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 flex flex-col">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>

        {/* Right Sidebar - Only visible when chat is opened */}
        {selectedUser && (
          <div className="w-80 flex flex-col bg-white border-l border-gray-200">
            {/* Right Sidebar Content */}
            <div className="flex-1 flex flex-col p-4 space-y-6 min-h-0">
              {/* User Info Section */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-200 mx-auto mb-3">
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt={selectedUser.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedUser.fullName}</h3>
                <p className="text-sm text-gray-600">@{selectedUser.username}</p>
                <p className="text-sm text-gray-600">
                  {onlineUsers.includes(selectedUser._id) ? "Active now" : "Offline"}
                </p>
              </div>

              {/* Media Shared Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Media Shared</h4>
                {sharedMedia.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">No media shared yet</p>
                ) : (
                  <>
                    {/* Scrollable media container with custom scrollbar */}
                    <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                      <div className="grid grid-cols-3 gap-2 pr-2">
                        {sharedMedia.map((media, index) => (
                          <div
                            key={media.id}
                            className={`aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg overflow-hidden ${
                              index >= 6 ? "opacity-80" : ""
                            }`}
                          >
                            <img
                              src={media.url}
                              alt={`Shared media ${media.id}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {sharedMedia.length > 6 && (
                      <p className="text-sm text-gray-500 text-center">
                        {sharedMedia.length} images total
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Spacer to push button to bottom */}
              <div className="flex-1"></div>

              {/* Block/Unblock User Button */}
              <button
                onClick={handleBlockUser}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 mt-auto"
              >
                <UserX className="w-5 h-5" />
                {isBlocked ? "Unblock User" : "Block User"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c084fc #f3f4f6;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #c084fc, #ec4899);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a855f7, #db2777);
        }
      `}</style>
    </div>
  );
}

export default ChatPage;