import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const UserStore = (set) => ({
  user: null,
  setUser: (user) => {
    localStorage.setItem("autoLogin", JSON.stringify(user.autoLogin));

    // setOptions()를 사용하여 user의 autoLogin 값에 따라 저장소를 동적으로 설정가능
    useUserStore.persist.setOptions({
      storage: createJSONStorage(() =>
        user.autoLogin ? localStorage : sessionStorage
      ),
    });
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
      const autoLogin = localStorage.getItem("autoLogin") === "true";
      console.log(autoLogin);

      // autoLogin 값에 따라 저장소를 동적으로 선택
      return autoLogin ? localStorage : sessionStorage;
    }),
  })
);

export default useUserStore;
