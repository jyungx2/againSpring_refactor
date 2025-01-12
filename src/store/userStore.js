import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

const UserStore = (set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    const storage = user.autoLogin ? localStorage : sessionStorage;
    // * setItem(): localStorage와 sessionStorage에서 제공하는 메서드로, 지정된 키("user")에 값을 저장한다. (브라우저 내에서 localStorage나 sessionStorage에 접근할 수 있는 곳이라면 어디서든 사용 가능)
    // * JSON.stringify(): 브라우저의 localStorage와 sessionStorage는 문자열만 저장할 수 있기 때문에, 객체나 배열 등의 데이터를 저장하려면 반드시 문자열로 변환해야 하기 때문에 user객체를 JSON 문자열로 변환하였다.
    storage.setItem("user", JSON.stringify(user));
  },
  resetUser: () => {
    set({ user: null });
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  },
});

// ❌ autoLogin 상태값에 의해서만 스토리지 종류를 설정하고 싶다면, persist 함수 쓰지말자 ❌
// 👉 persist()의 storage 부분을 아예 제거하여, 상태값은 기본적으로 set을 통해 관리하여 두 스토리지 모두(local & session)에 저장되는 문제 해결.
// ∵ persist 함수만 써주고, storage 속성 값을 지정하지 않아도, 무조건 localStorage에 저장되는 것이 기본 동작, 그렇다고 sessionStorage라고 설정하면 자동로그인 설정 안했을 때(autoLogin: false)도 로컬 스토리지에 저장되어 브라우저창을 닫고도 유저 정보가 계속해서 유지되는 문제 발생.

// 📝 수정된 코드
// * create(): Zustand의 store를 생성할 때 사용되는 함수
const useUserStore = create(UserStore);

// 🚨 문제의 코드
// const useUserStore = create(
//   persist(UserStore, {
//     name: "user",
//     storage: createJSONStorage(() => sessionStorage), // 기본은 localStorage
//   })
// );

export default useUserStore;
