export const KAKAO_url = "https://kauth.kakao.com/oauth/authorize";
export const API_KEY = "7b635f7b3d4379252462f78787fc908b";
export const REDIRECT_URI = "http://localhost:5173/users/login/kakao";

// handleKakaoLogin 함수는 같은 파일에 있는 KAKAO_url, API_KEY, REDIRECT_URI를 참조
// 이 참조는 **파일 레벨에서의 스코프(scope)**로 동작하므로, 변수들을 따로 import하지 않아도 함수 내부에서 사용할 수 있습니다.
export const handleKakaoLogin = () => {
  window.location.href = `${KAKAO_url}?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&state=auto`;
};

// ❓ Login.jsx에서 handleKakaoLogin 함수만 import해서 사용하는데, 해당 함수 내부에서 참조하는 변수들(KAKAO_url, API_KEY, REDIRECT_URI)을 따로 import하지 않아도 정상적으로 작동하는 이유는 무엇인가요?

// => 현재 구조에서는 handleKakaoLogin 함수가 kakaoUtils 파일에서 제대로 작동합니다. 이유는 JavaScript에서 함수 내에서 사용되는 변수(KAKAO_url, API_KEY, REDIRECT_URI)가 같은 파일에서 정의되어 있고, 함수 내부에서 그 변수들을 참조하기 때문입니다.

// 왜 작동하는지?
// handleKakaoLogin 함수는 클로저(closure)의 개념을 사용합니다. 함수가 정의될 때, 함수 내부에서 참조하는 변수(KAKAO_url, API_KEY, REDIRECT_URI)는 함수와 함께 메모리에 저장됩니다. 따라서 이 변수들이 함수 내에서 정상적으로 접근 가능합니다.
