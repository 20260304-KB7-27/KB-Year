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
            <span class="text-3xl font-black text-[#fcaf17]">KB</span>
          </div>
          <h2 class="text-2xl font-bold text-[#645b4c] mb-1">회원가입</h2>
          <p class="text-sm text-[#a39b8f]">KB-YEAR 정보를 입력해 주세요</p>
        </div>

        <form
          class="space-y-4"
          @submit.prevent="handleSignup"
        >
          <div>
            <input
              v-model="formData.userid"
              type="text"
              placeholder="아이디"
              novalidate
              required
              :class="{ 'border-red-400': errors.userid }"
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              @blur="touched.userid = true"
              @input="touched.userid = true"
            />
            <p
              v-if="errors.userid"
              class="text-xs text-red-500 ml-4 mt-1 font-medium"
            >
              {{ errors.userid }}
            </p>
            <p
              v-else-if="touched.userid && formData.userid && !errors.userid"
              class="text-xs text-green-600 ml-4 mt-1 font-medium"
            >
              사용 가능한 아이디 형식입니다.
            </p>
          </div>

          <div>
            <div class="relative">
              <input
                v-model="formData.password"
                novalidate
                :type="showPassword ? 'text' : 'password'"
                placeholder="비밀번호"
                required
                class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all pr-14"
                @blur="touched.password = true"
                @input="touched.password = true"
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
            <p
              v-if="errors.password"
              class="text-xs text-red-500 ml-4 mt-1 font-medium"
            >
              {{ errors.password }}
            </p>
            <p
              v-else-if="touched.password && formData.password && !errors.password"
              class="text-xs text-green-600 ml-4 mt-1 font-medium"
            >
              안전한 비밀번호입니다.
            </p>
          </div>
          <div>
            <input
              v-model="formData.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호 확인"
              novalidate
              required
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              @blur="touched.confirmPassword = true"
              @input="touched.confirmPassword = true"
            />
            <p
              v-if="errors.confirmPassword"
              class="text-xs text-red-500 ml-4 mt-1 font-medium"
            >
              {{ errors.confirmPassword }}
            </p>

            <p
              v-else-if="
                touched.confirmPassword &&
                formData.password &&
                formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                !errors.password
              "
              class="text-xs text-green-600 ml-4 mt-1 font-medium"
            >
              비밀번호가 일치합니다.
            </p>
          </div>

          <div>
            <input
              v-model="formData.name"
              type="text"
              placeholder="이름"
              required
              novalidate
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              @blur="touched.name = true"
              @input="touched.name = true"
            />
            <p
              v-if="errors.name"
              class="text-xs text-red-500 ml-4 mt-1 font-medium"
            >
              {{ errors.name }}
            </p>

            <p
              v-else-if="touched.name && formData.name && !errors.name"
              class="text-xs text-green-600 ml-4 mt-1 font-medium"
            >
              사용 가능한 이름입니다.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- birthDate -->
            <div>
              <input
                v-model="formData.birthDate"
                type="date"
                required
                class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#a39b8f] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
                @blur="touched.birthDate = true"
                @input="touched.birthDate = true"
              />
              <p
                v-if="errors.birthDate"
                class="text-xs text-red-500 ml-4 mt-1 font-medium"
              >
                {{ errors.birthDate }}
              </p>
            </div>
            <!-- GENDER -->
            <div>
              <select
                v-model="formData.gender"
                required
                class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#a39b8f] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all appearance-none"
                @blur="touched.gender = true"
                @input="touched.gender = true"
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
              <p
                v-if="errors.gender"
                class="text-xs text-red-500 ml-4 mt-1 font-medium"
              >
                {{ errors.gender }}
              </p>
            </div>
          </div>
          <!-- EMAIL -->
          <div>
            <input
              v-model="formData.email"
              type="email"
              placeholder="이메일"
              novalidate
              required
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              @blur="touched.email = true"
              @input="touched.email = true"
            />
            <p
              v-if="errors.email"
              class="text-xs text-red-500 ml-4 mt-1 font-medium"
            >
              {{ errors.email }}
            </p>
            <p
              v-else-if="touched.email && formData.email && !errors.email"
              class="text-xs text-green-600 ml-4 mt-1 font-medium"
            >
              사용가능한 이메일입니다.
            </p>
          </div>

          <!-- PHONE -->
          <div>
            <input
              v-model="formData.phone"
              type="tel"
              placeholder="전화번호 (010-0000-0000)"
              required
              novalidate
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              @blur="touched.phone = true"
              @input="touched.phone = true"
            />
            <p
              v-if="errors.phone"
              class="text-xs text-red-500 ml-4 mt-1 font-medium"
            >
              {{ errors.phone }}
            </p>
            <p
              v-else-if="touched.phone && formData.phone && !errors.phone"
              class="text-xs text-green-600 ml-4 mt-1 font-medium"
            >
              사용가능한 전화번호입니다.
            </p>
          </div>

          <!-- JOB -->
          <div>
            <input
              v-model="formData.job"
              type="text"
              placeholder="직업 (Software Engineer 등)"
              novalidate
              required
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              @blur="touched.job = true"
              @input="touched.job = true"
            />
            <p
              v-if="errors.job"
              class="text-xs text-red-500 ml-4 mt-1 font-medium"
            >
              {{ errors.job }}
            </p>
          </div>

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
import { reactive, ref, watch } from 'vue';
import { X, Eye, EyeOff } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import { signUpSchema } from '@/schemas/schema';

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

const touched = reactive({
  userid: false,
  password: false,
  confirmPassword: false,
  name: false,
  birthDate: false,
  gender: false,
  email: false,
  phone: false,
  job: false,
});

const errors = ref({}); // 에러 메시지 저장용

const showPassword = ref(false);

watch(
  formData,
  () => {
    const result = signUpSchema.safeParse(formData);

    // 에러 초기화
    errors.value = {};
    console.log(errors);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        // 핵심: 해당 필드를 '건드린 적이 있을 때만' 에러 메시지를 할당함
        if (touched[fieldName] && !errors.value[fieldName]) {
          errors.value[fieldName] = issue.message;
        }
      });
    }
  },
  { deep: true }
); // 객체 내부 변경을 감지하기 위해 deep 옵션 필수

const handleSignup = async () => {
  // 최종 제출 전 한 번 더 검증
  const result = signUpSchema.safeParse(formData);

  if (!result.success) {
    alert('입력 정보를 다시 확인해 주세요.');
    const result = signUpSchema.safeParse(formData);
    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];
      // 핵심: 해당 필드를 '건드린 적이 있을 때만' 에러 메시지를 할당함
      if (!errors.value[fieldName]) {
        errors.value[fieldName] = issue.message;
      }
    });
    return;
  }

  // 통과 시 payload 전송 (기존 로직과 동일)
  const { confirmPassword: _, ...payload } = result.data; // formData 대신 검증된 result.data 권장

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
