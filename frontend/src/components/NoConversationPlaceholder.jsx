import { MessageCircleIcon, Rocket } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 bg-gradient-to-br from-white via-indigo-100 to-pink-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-yellow-400 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-green-400 rounded-lg rotate-45 opacity-25 animate-bounce"></div>
      <div className="absolute top-1/2 left-4 w-8 h-8 bg-orange-400 rounded-full opacity-20 animate-ping"></div>

      {/* Icon Section */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 rounded-full flex items-center justify-center mb-6 shadow-md relative">
          <MessageCircleIcon className="w-10 h-10 text-purple-600" />
          {/* <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-sm animate-pulse">
            <Rocket className="w-3 h-3 text-white" />
          </div> */}
        </div>

        {/* Text Section */}
        <h3 className="text-xl font-semibold text-gray-800 bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-2">
          Select a conversation
        </h3>
        <p className="text-gray-600 max-w-md">
          Choose a contact from the sidebar to start chatting or continue a previous conversation.
        </p>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
