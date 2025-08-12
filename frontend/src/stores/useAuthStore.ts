import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;

  checkAdminStatus: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,

  checkAdminStatus: async () => {
    set({
      isLoading: true,
      error: null,
    });
    try {
      const response = await axiosInstance.get("api/admin/check");
      set({ isAdmin: response.data.admin });
    } catch (error) {
      set({ isAdmin: false, error: (error as any).response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () =>
    set({
      isAdmin: false,
      isLoading: false,
      error: null,
    }),
}));
