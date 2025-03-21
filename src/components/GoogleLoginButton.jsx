import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { jwtDecode } from 'jwt-decode';
import useAxiosInstance from '@hooks/useAxiosInstance';
import useUserStore from '@store/userStore';

function GoogleLoginButton() {
  const instance = useAxiosInstance();
  const setUser = useUserStore((store) => store.setUser);

  // 로그인 함수
  async function handleGoogleLogin() {
    try {
      // Firebase로 구글 로그인
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // ID 토큰 → 구글 사용자 정보 추출
      const idToken = await result.user.getIdToken(true);
      const decoded = jwtDecode(idToken);

      const sub = decoded.sub;
      const email = decoded.email;
      const name = decoded.name;
      const picture = decoded.picture;

      // 회원 가입 API (/users/signup/oauth)
      const signupBody = {
        type: 'user', // or 'seller'
        loginType: 'google',
        name,
        email,
        image: picture,
        extra: {
          providerAccountId: sub,
          sub,
          // iss, aud, azp 등 전체를 넣어도 됨
        },
      };
      await instance.post('/users/signup/oauth', signupBody);

      // 로그인 API (/users/login/with)
      const loginBody = { providerAccountId: sub };
      const loginResponse = await instance.post('/users/login/with', loginBody);
      const userData = loginResponse.data.item;

      // userStore에 토큰/회원정보 저장
      setUser({
        _id: userData._id,
        name: userData.name,
        type: userData.type,
        accessToken: userData.token.accessToken,
        refreshToken: userData.token.refreshToken,
      });

      alert(`${userData.name}님, Google 회원가입 + 로그인이 완료되었습니다.`);
    } catch (error) {
      console.error('Google OAuth 에러:', error);
      alert('로그인 실패. 서버 상태 및 에러 메시지를 확인해 주세요');
    }
  }

  return (
    <button onClick={handleGoogleLogin} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      Google로 로그인
    </button>
  );
}

export default GoogleLoginButton;
