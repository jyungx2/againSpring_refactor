import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const UserStore = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
});

const useUserStore = create(
  persist(UserStore, {
    name: "user",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export default useUserStore;
