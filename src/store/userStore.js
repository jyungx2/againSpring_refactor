import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ✅ setUser(): 사용자가 로그인하거나 회원가입할 때 실행되는 코드 (👉 사용자의 행동에 의해 호출)
const UserStore = (set) => ({
  user: null,
  setUser: (user) => {
    // autoLogin: true냐, false냐에 따라 나중에 다른 브라우저를 열었을 때도 자동로그인이 될지 말지 판별해야 하기 때문에 무조건 localStorage에 저장.
    localStorage.setItem("autoLogin", JSON.stringify(user.autoLogin));

    // setOptions()를 사용하여 user의 autoLogin 값에 따라 저장소를 동적으로 설정가능
    // persist를 쓰면서 동시에 조건문을 활용해 동적으로 스토리지 종류를 컨트롤 가능!

    let selectedStorage;

    if (user.loginType) {
      // loginType이 truthy 값인 경우 무조건 localStorage 사용
      selectedStorage = localStorage;
    } else {
      // loginType이 falsy 값인 경우 autoLogin 값에 따라 저장소 선택
      if (JSON.parse(user.autoLogin)) {
        selectedStorage = localStorage;
      } else {
        selectedStorage = sessionStorage;
      }
    }

    useUserStore.persist.setOptions({
      storage: createJSONStorage(() => selectedStorage),
    });
    // 사용자 정보 저장 (어느 스토리지에 저장할지는 위의 setOptions에서 동적으로 처리)
    set({ user });
  },
  resetUser: () => {
    set({ user: null });
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  },
});

// ✅ 앱을 처음 열 때(= 브라우저를 열었을 때) 실행되는 코드로, 이전에 저장된 사용자 정보를 불러온다. (👉 앱이 시작될 때 호출되어 초기 상태를 설정)
// useUserStore는 스토어를 초기화하는 역할을 하며, persist 미들웨어를 사용하여 localStorage나 sessionStorage에서 사용자 정보를 읽어오는데, 사용자 정보 내에 있는 autoLogin값에 따라 그 값을 다시 local에 저장할지, session에 저장할지 결정된다.
// 이때 session storage에 저장된 유저정보는 브라우저를 닫으며 바로 사라지기 때문에 사실상 세션스토리지에서 유저정보를 읽어오는 것 자체가 의미없지만, 우리 앱의 기본 동작은 세션스토리지에 저장하는 것이므로 이렇게 설정!
const useUserStore = create(
  persist(UserStore, {
    name: "user",
    // 앱이 처음 로드되었을 때(초기화 시) 저장소를 결정하기 위해 create() 내부에서도 storage 속성 설정
    storage: createJSONStorage(() => {
      // localStorage에서 현재 저장된 user 정보를 확인
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // loginType이 있으면 무조건 localStorage 사용
        if (parsedUser.state?.user?.loginType) {
          return localStorage;
        }
      }

      // 위의 UserStore의 setUser 함수에서 autoLogin이라는 속성은 무조건 localStorage에 저장해줬었음. (이 값에 의해 자동로그인 여부가 결정되므로 항상 로컬에 킵하고 있어야 나중에 바로 로그인시킬지 말지 결정 가능하기 때문)
      const autoLogin = localStorage.getItem("autoLogin") === "true";

      // 앱 초기화 시, 저장된 데이터를 적절한 저장소에서 읽어오기 위해 필요
      // setUser는 사용자 행동에 의해 호출되지만, 앱 로드 시 초기화 과정은 setUser와 관계없이 항상 실행
      return autoLogin ? localStorage : sessionStorage;
    }),
  })
);

export default useUserStore;
