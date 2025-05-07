import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const UserStore = (set) => ({
  user: null,
  setUser: (user) => {
    localStorage.setItem("autoLogin", JSON.stringify(user.autoLogin));

    let selectedStorage;

    if (user.loginType) {
      selectedStorage = localStorage;
    } else {
      if (user.autoLogin) {
        selectedStorage = localStorage;
      } else {
        selectedStorage = sessionStorage;
      }
    }

    useUserStore.persist.setOptions({
      storage: createJSONStorage(() => selectedStorage),
    });

    // state.user.name, state.user.phone -> 이런식으로 접근하기 위해 ...(spread operator)없이 바로 객체안에 저장({user})
    set({ user });
  },
  resetUser: () => {
    set({ user: null });
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  },
});

const useUserStore = create(
  persist(UserStore, {
    name: "user",
    storage: createJSONStorage(() => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.state?.user?.loginType) {
          return localStorage;
        }
      }

      const autoLogin = localStorage.getItem("autoLogin") === "true";

      return autoLogin ? localStorage : sessionStorage;
    }),
  })
);

export default useUserStore;
