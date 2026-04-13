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
      return false;
    }
  };

  // 2. 로그인 (SignIn)
  const signIn = async (credentials, rememberMe = false) => {
    try {
      // url 뒤에 /users를 또 붙이지 않도록 수정

      const response = await axios.get(uri, {
        params: {
          userid: credentials.userid,
          password: credentials.password,
        },
      });

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
      return false;
    }
  };

  // 3. 로그아웃 (SignOut)
  const signOut = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  // 4. 유저 정보 수정

  const update = async (payload) => {
    try {
      // 1. 현재 로그인한 유저의 ID 확인
      if (!user.value || !user.value.id) {
        return false;
      }

      // 2. json-server에 PATCH 요청 (기존 데이터 유지하며 일부만 수정)
      // PUT을 쓰면 payload에 없는 필드는 삭제될 수 있으므로 PATCH를 권장합니다.
      const response = await axios.patch(`${uri}/${user.value.id}`, payload);

      if (response.status === 200) {
        // 3. 서버 응답 데이터로 로컬 ref 업데이트
        // 기존 데이터와 새 데이터를 병합하여 상태를 최신화합니다.
        const updatedData = { ...user.value, ...response.data };
        user.value = updatedData;

        // 4. localStorage에도 최신 정보 저장
        localStorage.setItem('user', JSON.stringify(updatedData));

        return true;
      }
    } catch (err) {
      return false;
    }
  };

  // 5. 유저 아이디 중복 체크
  const checkDuplicateId = async (userid) => {
    try {
      const response = await axios.get(uri, {
        params: { userid },
      });

      // 1. 만약 서버가 배열을 반환한다면 (예: json-server)
      if (Array.isArray(response.data)) {
        return response.data.length === 0; // 데이터가 없어야(0) 사용 가능(true)
      }

      // 2. 만약 서버가 단일 객체를 반환한다면
      if (response.data && response.data.userid) {
        return false; // 데이터가 존재하면 중복(false)
      }

      return true; // 데이터가 없으면 사용 가능(true)
    } catch (error) {
      // 404 에러가 발생한다는 것은 해당 아이디가 없다는 뜻이므로 사용 가능으로 처리
      if (error.response && error.response.status === 404) {
        return true;
      }
      return false; // 그 외 에러는 안전하게 중복으로 처리
    }
  };

  return {
    user,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    update,
    checkDuplicateId,
  };
});
