// useChatStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  searchUserByUsername: async (username) => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get(`/auth/check-username/${username}`);
      return res.data.user; // Expecting backend to return user object if found
    } catch (error) {
      toast.error(error.response?.data?.message || "User not found");
      return null;
    } finally {
      set({ isUsersLoading: false });
    }
  },

  startConversation: async (receiverId) => {
    const { setSelectedUser, getMyChatPartners } = get();
    //const { authUser } = useAuthStore.getState();

    try {
      // Send an initial message to start the conversation
      const messageData = { text: "Hello" }; // Default message
      await axiosInstance.post(`/messages/send/${receiverId}`, messageData);

      // Fetch updated chat partners to include the new conversation
      await getMyChatPartners();

      // Fetch user details to set as selected user
      const userRes = await axiosInstance.get(`/messages/contacts`);
      const user = userRes.data.find((u) => u._id === receiverId);
      if (user) {
        setSelectedUser(user);
        toast.success(`Conversation started with @${user.username}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start conversation");
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, getMyChatPartners } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.filter((m) => m._id !== tempId).concat(res.data) });
      await getMyChatPartners(); // Update chats list to include new conversation
    } catch (error) {
      set({ messages: messages.filter((m) => m._id !== tempId) });
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      console.log("Received newMessage:", newMessage);
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));