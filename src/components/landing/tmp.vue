<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-[#f4f2ee]/50 backdrop-blur-xl p-4"
    @click.self="$emit('close')"
  >
    <div
      class="w-full max-w-lg max-h-[90vh] bg-[#f4f2ee] rounded-[3rem] relative flex flex-col overflow-hidden shadow-[20px_20px_40px_rgba(217,213,206,0.8),-20px_-20px_40px_rgba(255,255,255,0.9)]"
      @click.stop
    >
      <button
        class="absolute top-10 right-10 z-50 w-11 h-11 rounded-full flex items-center justify-center text-[#a39b8f]/70 hover:text-[#fcaf17] transition-all shadow-[3px_3px_6px_rgba(217,213,206,0.7),-3px_-3px_6px_rgba(255,255,255,0.8)] active:shadow-[inset_2px_2px_4px_#d9d5ce,inset_-2px_-2px_4px_#ffffff]"
        @click="$emit('close')"
      >
        <X class="w-6 h-6" />
      </button>

      <div class="flex-1 overflow-y-auto p-12 no-scrollbar">
        <div class="mb-12 flex flex-col items-center">
          <div
            class="w-24 h-24 rounded-full bg-[#f4f2ee] shadow-[6px_6px_12px_rgba(217,213,206,0.8),-6px_-6px_12px_rgba(255,255,255,0.9)] flex items-center justify-center mb-6"
          >
            <span class="text-4xl font-black text-[#fcaf17]">PB</span>
          </div>
          <h2 class="text-2xl font-bold text-[#645b4c] mb-1.5 break-keep font-sans">회원가입</h2>
          <p class="text-base text-[#a39b8f] font-sans">PiggyBank와 함께 시작하세요</p>
        </div>

        <form
          class="space-y-6"
          @submit.prevent="handleSignup"
        >
          <div class="relative">
            <input
              v-model="formData.name"
              type="text"
              placeholder="이름을 입력해 주세요."
              class="w-full px-6 py-4.5 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70;"
              required
            />
          </div>
          <div class="relative">
            <input
              v-model="formData.email"
              type="email"
              placeholder="이메일을 입력해 주세요."
              class="w-full px-6 py-4.5 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70;"
              required
            />
          </div>
          <div class="relative">
            <input
              v-model="formData.username"
              type="text"
              placeholder="아이디를 입력해 주세요."
              class="w-full px-6 py-4.5 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70;"
              required
            />
          </div>
          <div class="relative">
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호를 입력해 주세요."
              class="w-full px-6 py-4.5 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70; pr-14"
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
          <div class="relative">
            <input
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="비밀번호를 다시 입력해 주세요."
              class="w-full px-6 py-4.5 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none font-sans shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-base placeholder-[#a39b8f]/70; pr-14"
              required
            />
            <button
              type="button"
              class="absolute right-5 top-1/2 -translate-y-1/2 text-[#a39b8f]"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <Eye
                v-if="!showConfirmPassword"
                class="w-5 h-5"
              /><EyeOff
                v-else
                class="w-5 h-5"
              />
            </button>
          </div>

          <div class="pt-10">
            <button
              type="submit"
              class="w-full py-5 bg-[#f4f2ee] text-[#fcaf17] font-bold text-lg rounded-3xl shadow-[6px_6px_12px_rgba(217,213,206,0.8),-6px_-6px_12px_rgba(255,255,255,0.9)] hover:shadow-[8px_8px_16px_rgba(217,213,206,0.9),-8px_-8px_16px_rgba(255,255,255,1)] active:shadow-[inset_4px_4px_8px_#d9d5ce,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 transform active:scale-[0.98]"
            >
              가입하기
            </button>
          </div>
        </form>

        <div class="text-center mt-12 text-sm text-[#a39b8f] font-sans pb-4">
          이미 계정이 있으신가요?
          <button
            class="text-[#fcaf17] font-medium hover:underline ml-1.5"
            @click="$emit('close')"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { X, Eye, EyeOff } from 'lucide-vue-next';

const formData = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// 비밀번호 표시 상태 관리
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const emit = defineEmits('close');

const handleSignup = () => {
  // 간단한 유효성 검사 (CAV-46 마무리용)
  if (formData.password !== formData.confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  console.log('Signup Data:', formData);
  // 여기에 백엔드 API 연동 로직 추가
  alert('가입 신청이 완료되었습니다! (백엔드 승인 대기 중)');
  emit('close');
};
</script>

<style scoped>
/* [핵심] 스크롤바 숨기기 */
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.break-keep {
  word-break: keep-all;
}
</style>
