import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
  // 상태: 초기값은 로컬스토리지에서 복구
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const url =
    import.meta.env.VITE_LIVE === '0'
      ? import.meta.env.VITE_API_URL_LOCAL
      : import.meta.env.VITE_API_URL;
  const uri = `${url}/users`;

  // Getter: 로그인 여부
  const isAuthenticated = computed(() => !!user.value);

  // 1. 회원가입 (Signup)
  const signUp = async (userData) => {
    try {
      // POST 요청 시 userData 객체를 본문에 실어 보냄
      await axios.post(uri, userData);
      return true;
    } catch (err) {
      console.error('회원가입 에러:', err);
      return false;
    }
  };

  // 2. 로그인 (SignIn)
  const signIn = async (credentials, rememberMe = false) => {
    try {
      console.log('전달된 로그인 데이터:', credentials); // 여기서 키 이름 확인!
      // url 뒤에 /users를 또 붙이지 않도록 수정

      const response = await axios.get(uri, {
        params: {
          userid: credentials.userid,
          password: credentials.password,
        },
      });
      console.log(response);

      if (response.data.length > 0) {
        const userData = response.data[0];

        // 유저 정보 저장 (보안상 비밀번호는 제거하고 저장하는 것을 추천)
        const { password, ...userWithoutPassword } = userData;
        user.value = userWithoutPassword;

        localStorage.setItem('user', JSON.stringify(user.value));

        // 아이디 저장(Remember Me) 처리
        if (rememberMe) {
          localStorage.setItem('savedUserId', credentials.userid);
        } else {
          localStorage.removeItem('savedUserId');
        }

        return true;
      } else {
        return false; // 일치하는 유저 없음
      }
    } catch (err) {
      console.error('로그인 에러:', err);
      return false;
    }
  };

  // 3. 로그아웃 (SignOut)
  const signOut = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  return {
    user,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
  };
});
