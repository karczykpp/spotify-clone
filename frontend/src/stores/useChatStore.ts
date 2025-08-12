import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import type { Message, User } from "@/types";
import { io } from "socket.io-client";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

const baseUrl =
  import.meta.env.MODE === "development" ? "http://localhost:5173" : "/";

const socket = io(baseUrl, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  // Function to fetch users from the API
  fetchUsers: async () => {
    try {
      const response = await axiosInstance.get("api/users");
      set({ users: response.data });
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId: string) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();
      socket.emit("user_connected", userId);

      socket.on("users_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });
      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });
      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });
      socket.on("user_disconnected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set(
            [...state.onlineUsers].filter((id) => id !== userId)
          ),
        }));
      });
      socket.on("receive_message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });
      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });
      socket.on(
        "update_activity",
        ({ userId, activity }: { userId: string; activity: string }) => {
          set((state) => {
            const newActivities = new Map(state.userActivities);
            newActivities.set(userId, activity);
            return { userActivities: newActivities };
          });
        }
      );
      set({ isConnected: true });
    }
  },
  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },
  sendMessage: (receiverId: string, senderId: string, content: string) => {
    if (!socket) return;
    socket.emit("send_message", { receiverId, senderId, content });
  },
  fetchMessages: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/api/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      console.error("Failed to fetch messages:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },
}));

export default useChatStore;
