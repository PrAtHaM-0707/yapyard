import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
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
      <div className="space-y-2 h-96 overflow-y-auto custom-scrollbar">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-3"
            onClick={() => setSelectedUser(chat)}
          >
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={chat.profilePic || "/public/avatar.png"}
                  alt={chat.fullName || "Unknown User"}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "/public/avatar.png"; }}
                />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 font-medium truncate">{chat.fullName || "Unknown User"}</h4>
            </div>
            {onlineUsers.includes(chat._id) && (
              <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
            )}
          </div>
        ))}
      </div>
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

export default ChatsList;
