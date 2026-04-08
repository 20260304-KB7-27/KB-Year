<template>
  <form
    class="space-y-5"
    @submit.prevent="handleSignup"
  >
    <div class="grid grid-cols-2 gap-4">
      <input
        v-model="formData.name"
        type="text"
        placeholder="이름"
        class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70;"
        required
      />
      <input
        v-model="formData.email"
        type="email"
        placeholder="이메일"
        class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70;"
        required
      />
    </div>

    <input
      v-model="formData.userid"
      type="text"
      placeholder="아이디"
      class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70;"
      required
    />

    <div class="relative">
      <input
        v-model="formData.password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="비밀번호"
        class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70; pr-14"
        required
      />
      <button
        type="button"
        class="absolute right-5 top-1/2 -translate-y-1/2 text-[#a39b8f]"
        @click="showPassword = !showPassword"
      >
        <Eye
          v-if="!showPassword"
          class="w-5 h-5"
        /><EyeOff
          v-else
          class="w-5 h-5"
        />
      </button>
    </div>
    <input
      v-model="formData.confirmPassword"
      :type="showPassword ? 'text' : 'password'"
      placeholder="비밀번호 확인"
      class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70;"
      required
    />

    <div class="grid grid-cols-2 gap-4">
      <input
        v-model="formData.birthDate"
        type="date"
        class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70; text-[#a39b8f]"
        required
      />
      <select
        v-model="formData.gender"
        class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70; text-[#a39b8f]"
        required
      >
        <option
          value=""
          disabled
          selected
        >
          성별 선택
        </option>
        <option value="MALE">MALE</option>
        <option value="FEMALE">FEMALE</option>
      </select>
    </div>

    <input
      v-model="formData.phone"
      type="tel"
      placeholder="전화번호 (010-0000-0000)"
      class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70;"
      required
    />
    <input
      v-model="formData.job"
      type="text"
      placeholder="직업 (예: Software Engineer)"
      class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70;"
      required
    />

    <div class="pt-6">
      <button
        type="submit"
        class="w-full py-5 bg-[#f4f2ee] text-[#fcaf17] font-bold text-lg rounded-3xl shadow-[6px_6px_12px_rgba(217,213,206,0.8),-6px_-6px_12px_rgba(255,255,255,0.9)] hover:shadow-[8px_8px_16px_rgba(217,213,206,0.9),-8px_-8px_16px_rgba(255,255,255,1)] active:shadow-[inset_4px_4px_8px_#d9d5ce,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 transform active:scale-[0.98];"
      >
        가입하기
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { X, Eye, EyeOff } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const emit = defineEmits(['close']);

// 데이터 형식에 맞게 초기값 설정
const formData = reactive({
  userid: '',
  password: '',
  confirmPassword: '',
  name: '',
  birthDate: '',
  gender: '',
  email: '',
  phone: '',
  job: '',
});

const showPassword = ref(false);

const handleSignup = async () => {
  if (formData.password !== formData.confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 데이터 전송 객체 생성 (confirmPassword 제외)
  const { confirmPassword, ...payload } = formData;

  try {
    const success = await userStore.signUp(payload);
    if (success) {
      alert('회원가입 성공!');
      emit('close');
    } else {
      alert('중복된 아이디거나 가입에 실패했습니다.');
    }
  } catch (err) {
    alert('서버 에러가 발생했습니다.');
  }
};
</script>

<style scoped>
/* 반복되는 뉴모피즘 스타일 공통 클래스화 */

/* 생년월일 date 타입 텍스트 정렬 */
input[type='date']::before {
  content: attr(placeholder);
  width: 100%;
}
</style>
