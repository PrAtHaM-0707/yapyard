import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Search, UserPlus } from "lucide-react";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, searchUserByUsername, startConversation } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchedUser, setSearchedUser] = useState(null);

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSearchedUser(null);
    } else if (searchQuery.startsWith("@")) {
      const username = searchQuery.slice(1).toLowerCase();
      searchUserByUsername(username).then((user) => {
        if (user && user._id !== authUser._id) {
          setSearchedUser(user);
          setSearchResults([]);
        } else {
          setSearchedUser(null);
          setSearchResults([]);
        }
      });
    } else {
      const filtered = allContacts.filter(
        (contact) =>
          contact.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setSearchedUser(null);
    }
  }, [searchQuery, allContacts, searchUserByUsername, authUser._id]);

  return (
    <div className="w-full flex-1 space-y-2 p-2 relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts or add by @username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300 shadow-sm"
        />
      </div>

      {isUsersLoading ? (
        <UsersLoadingSkeleton />
      ) : searchQuery.trim() === "" ? (
        allContacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        ) : (
          <div className="space-y-2 h-64 overflow-y-auto custom-scrollbar">
            {allContacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-3"
                onClick={() => setSelectedUser(contact)}
              >
                <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"} relative`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={contact.profilePic || "/avatar.png"}
                      alt={contact.fullName}
                      className="w-full h-full object-cover"
                    />
                    {onlineUsers.includes(contact._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 font-medium truncate">{contact.fullName}</h4>
                  <p className="text-xs text-gray-500 truncate">@{contact.username}</p>
                </div>
                {onlineUsers.includes(contact._id) && (
                  <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        )
      ) : searchedUser ? (
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(searchedUser._id) ? "online" : "offline"} relative">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={searchedUser.profilePic || "/avatar.png"}
                  alt={searchedUser.fullName}
                  className="w-full h-full object-cover"
                />
                {onlineUsers.includes(searchedUser._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 font-medium truncate">{searchedUser.fullName}</h4>
              <p className="text-xs text-gray-500 truncate">@{searchedUser.username}</p>
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 transition-all"
            onClick={() => startConversation(searchedUser._id)}
          >
            Start
          </button>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No contacts found
        </div>
      ) : (
        <div className="space-y-2 h-64 overflow-y-auto custom-scrollbar">
          {searchResults.map((contact) => (
            <div
              key={contact._id}
              className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-3"
              onClick={() => setSelectedUser(contact)}
            >
              <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"} relative">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={contact.profilePic || "/avatar.png"}
                    alt={contact.fullName}
                    className="w-full h-full object-cover"
                  />
                  {onlineUsers.includes(contact._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 font-medium truncate">{contact.fullName}</h4>
                <p className="text-xs text-gray-500 truncate">@{contact.username}</p>
              </div>
              {onlineUsers.includes(contact._id) && (
                <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
              )}
            </div>
          ))}
        </div>
      )}
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

export default ContactList;
