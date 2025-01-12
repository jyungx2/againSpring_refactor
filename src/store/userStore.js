import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

const UserStore = (set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    const storage = user.autoLogin ? localStorage : sessionStorage;
    // * setItem: 지정된 키("user")에 값을 저장하는 메서드
    // * JSON.stringify: 브라우저의 localStorage와 sessionStorage는 문자열만 저장할 수 있기 때문에, 객체나 배열 등의 데이터를 저장하려면 반드시 문자열로 변환해야 하기 때문에 user객체를 JSON 문자열로 변환하였다.
    storage.setItem("user", JSON.stringify(user));
  },
  resetUser: () => {
    set({ user: null });
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  },
});

const useUserStore = create(UserStore);

export default useUserStore;
