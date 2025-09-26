import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-white via-indigo-100 to-pink-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-yellow-400 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-green-400 rounded-lg rotate-45 opacity-25 animate-bounce"></div>

      {/* Header - Fixed position */}
      <div className="border-b border-purple-200 relative z-10 flex-shrink-0">
        <ChatHeader />
        {/* Gradient underline */}
        <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" />
      </div>

      {/* Messages - Scrollable area with fixed height */}
      <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0" style={{ maxHeight: 'calc(110vh - 200px)' }}>
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative rounded-2xl px-4 py-2 shadow-md max-w-sm ${
                    msg.senderId === authUser._id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gradient-to-r from-gray-50 to-indigo-50 text-gray-800 border border-purple-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-60 object-cover mb-2 shadow-sm w-full"
                    />
                  )}
                  {msg.text && (
                    <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                  )}
                  <p className="text-xs mt-1 opacity-70 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {/* Input - Fixed position */}
      <div className="border-t border-purple-200 relative z-10 flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatContainer;