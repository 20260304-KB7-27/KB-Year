<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-[#f4f2ee]/70 backdrop-blur-xl p-4"
  >
    <div
      class="w-full max-w-lg max-h-[95vh] bg-[#f4f2ee] rounded-[3rem] relative flex flex-col overflow-hidden shadow-[20px_20px_40px_rgba(217,213,206,0.8),-20px_-20px_40px_rgba(255,255,255,0.9)]"
      @click.stop
    >
      <button
        class="absolute top-8 right-8 z-50 w-11 h-11 rounded-full flex items-center justify-center text-[#a39b8f] transition-all hover:text-[#fcaf17]"
        @click="$emit('close')"
      >
        <X class="w-6 h-6" />
      </button>
      <div class="flex-1 overflow-y-auto p-10 no-scrollbar">
        <div class="mb-10 flex flex-col items-center">
          <div
            class="w-20 h-20 rounded-full bg-[#f4f2ee] shadow-[6px_6px_12px_rgba(217,213,206,0.8),-6px_-6px_12px_rgba(255,255,255,0.9)] flex items-center justify-center mb-4"
          >
            <span class="text-3xl font-black text-[#fcaf17]">PB</span>
          </div>
          <h2 class="text-2xl font-bold text-[#645b4c] mb-1">회원가입</h2>
          <p class="text-sm text-[#a39b8f]">PiggyBank 정보를 입력해 주세요</p>
        </div>

        <form
          class="space-y-4"
          @submit.prevent="handleSignup"
        >
          <input
            v-model="formData.userid"
            type="text"
            placeholder="아이디"
            required
            class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
          />

          <div class="relative">
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호"
              required
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all pr-14"
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
            required
            class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
          />
          <input
            v-model="formData.name"
            type="text"
            placeholder="이름"
            required
            class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
          />

          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="formData.birthDate"
              type="date"
              required
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#a39b8f] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
            />
            <select
              v-model="formData.gender"
              required
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#a39b8f] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all appearance-none"
            >
              <option
                value=""
                disabled
                selected
              >
                성별
              </option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>

          <input
            v-model="formData.email"
            type="email"
            placeholder="이메일"
            required
            class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
          />

          <input
            v-model="formData.phone"
            type="tel"
            placeholder="전화번호 (010-0000-0000)"
            required
            class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
          />
          <input
            v-model="formData.job"
            type="text"
            placeholder="직업 (Software Engineer 등)"
            required
            class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
          />

          <div class="pt-6">
            <button
              type="submit"
              class="w-full py-5 bg-[#f4f2ee] text-[#fcaf17] font-bold text-lg rounded-[2rem] shadow-[6px_6px_12px_rgba(217,213,206,0.8),-6px_-6px_12px_rgba(255,255,255,0.9)] hover:shadow-[8px_8px_16px_rgba(217,213,206,0.9),-8px_-8px_16px_rgba(255,255,255,1)] active:shadow-[inset_4px_4px_8px_#d9d5ce,inset_-4px_-4px_8px_#ffffff] transition-all active:scale-[0.98]"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { X, Eye, EyeOff } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const emit = defineEmits(['close']);

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

  const { confirmPassword, ...payload } = formData;

  try {
    const success = await userStore.signUp(payload);
    if (success) {
      alert('회원가입이 완료되었습니다!');
      emit('close');
    } else {
      alert('회원가입 실패 (아이디 중복 확인 필요)');
    }
  } catch (err) {
    alert('네트워크 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
