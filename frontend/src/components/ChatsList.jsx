import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  if (chats.length === 0) {
    return (
      <div className="w-full h-full flex-1">
        <NoChatsFound />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex-1 space-y-2 overflow-y-auto p-2">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-3"
          onClick={() => setSelectedUser(chat)}
        >
          {/* Avatar */}
          <div
            className={`avatar ${
              onlineUsers.includes(chat._id) ? "online" : "offline"
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={chat.profilePic || "/avatar.png"}
                alt={chat.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h4 className="text-gray-900 font-medium truncate">
              {chat.fullName}
            </h4>
          </div>

          {/* Online Indicator */}
          {onlineUsers.includes(chat._id) && (
            <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatsList;
