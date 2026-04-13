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
          <!-- 아이디 -->
          <div>
            <div class="flex gap-3">
              <div class="relative flex-1">
                <input
                  v-model="formData.userid"
                  type="text"
                  placeholder="아이디"
                  :class="{
                    'ring-1 ring-red-400':
                      errors.userid || (touched.userid && isIdChecked && !isIdAvailable),
                    'ring-1 ring-green-500': touched.userid && isIdChecked && isIdAvailable,
                    'ring-1 ring-amber-400':
                      touched.userid && !isIdChecked && formData.userid && !errors.userid,
                  }"
                  class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8)] transition-all"
                  @input="handleIdInput"
                />
              </div>
              <button
                type="button"
                :disabled="!formData.userid || errors.userid || isIdChecking"
                :class="neumoBtnClass"
                @click="checkIdDuplicate"
              >
                <span v-if="isIdChecking">확인 중...</span>
                <span v-else>중복 확인</span>
              </button>
            </div>

            <p
              v-if="errors.userid"
              class="text-xs text-red-500 ml-4 mt-2 font-medium"
            >
              {{ errors.userid }}
            </p>
            <p
              v-else-if="touched.userid && isIdChecked && isIdAvailable"
              class="text-xs text-green-600 ml-4 mt-2 font-medium"
            >
              사용 가능한 아이디입니다.
            </p>
            <p
              v-else-if="touched.userid && !isIdChecked && formData.userid && !errors.userid"
              class="text-xs text-amber-500 ml-4 mt-2 font-medium"
            >
              아이디 중복 확인이 필요합니다.
            </p>
          </div>
          <!-- 비밀번호 -->
          <div>
            <div class="relative">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="비밀번호 (8자 이상)"
                :class="{
                  // 에러가 명확히 있을 때만 빨간색
                  'ring-1 ring-red-400': touched.password && errors.password,
                  // 에러가 없고, 최소 길이 등 조건을 만족했을 때만 초록색
                  'ring-1 ring-green-500':
                    touched.password && !errors.password && formData.password.length >= 8,
                }"
                class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8)] transition-all pr-14"
                @blur="touched.password = true"
                @input="touched.password = true"
              />
            </div>

            <p
              v-if="touched.password && errors.password"
              class="text-xs text-red-500 ml-4 mt-1 font-medium"
            >
              {{ errors.password }}
            </p>

            <p
              v-else-if="touched.password && !errors.password && formData.password.length >= 8"
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
              :class="{
                // 비밀번호와 일치하지 않을 때만 빨간색
                'ring-1 ring-red-400':
                  touched.confirmPassword && formData.password !== formData.confirmPassword,
                // 일치하고 값이 비어있지 않을 때만 초록색
                'ring-1 ring-green-500':
                  touched.confirmPassword &&
                  formData.password === formData.confirmPassword &&
                  formData.confirmPassword !== '',
              }"
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8)] transition-all"
              @blur="touched.confirmPassword = true"
              @input="touched.confirmPassword = true"
            />

            <p
              v-if="touched.confirmPassword && formData.password !== formData.confirmPassword"
              class="text-xs text-red-500 ml-4 mt-1 font-medium"
            >
              비밀번호가 일치하지 않습니다.
            </p>
            <p
              v-else-if="
                touched.confirmPassword &&
                formData.password === formData.confirmPassword &&
                formData.confirmPassword !== ''
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
              novalidate
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              :class="{
                // 1. 에러가 있으면 무조건 빨간색 (최우선)
                'ring-1 ring-red-400': touched.name && errors.name,
                // 2. 터치되었고, 에러가 없으며, 실제 값이 입력되었을 때만 초록색
                'ring-1 ring-green-500':
                  touched.name && !errors.name && formData.name.trim() !== '',
              }"
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
                novalidate
                class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#a39b8f] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
                :class="{
                  'ring-1 ring-red-400': touched.birthDate && errors.birthDate,
                  'ring-1 ring-green-500':
                    touched.birthDate && !errors.birthDate && formData.birthDate !== '',
                }"
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
                class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#a39b8f] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all appearance-none"
                :class="{
                  'ring-1 ring-red-400': touched.gender && errors.gender,
                  'ring-1 ring-green-500':
                    touched.gender && !errors.gender && formData.gender !== '',
                }"
                @blur="touched.gender = true"
                @change="touched.gender = true"
              >
                <option
                  value=""
                  disabled
                >
                  성별
                </option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>

              <p
                v-if="touched.gender && errors.gender"
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
              placeholder="이메일"
              novalidate
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              :class="{
                'ring-1 ring-red-400': touched.email && errors.email,
                'ring-1 ring-green-500':
                  touched.email && !errors.email && formData.email.trim() !== '',
              }"
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
              novalidate
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              :class="{
                'ring-1 ring-red-400': touched.phone && errors.phone,
                'ring-1 ring-green-500': touched.phone && !errors.phone && formData.phone !== '',
              }"
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
              class="w-full px-6 py-4 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
              :class="{
                'ring-1 ring-red-400': touched.job && errors.job,
                'ring-1 ring-green-500': touched.job && !errors.job && formData.job !== '',
              }"
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

const isIdChecked = ref(false); // 중복 확인 버튼을 눌렀는지 여부
const isIdAvailable = ref(false); // 실제 사용 가능한 아이디인지 여부
const isIdChecking = ref(false); // 로딩 상태 추가
const handleIdInput = () => {
  touched.userid = true;
  isIdChecked.value = false; // 입력이 바뀌면 다시 중복 확인을 하도록 리셋
  isIdAvailable.value = false;
};

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

// 중복 확인 버튼 클릭
const checkIdDuplicate = async () => {
  if (errors.value.userid || !formData.userid) return;

  isIdChecking.value = true; // 로딩 시작

  try {
    // Store 메서드 호출 시 현재 입력된 userid를 인자로 넘깁니다.
    const isAvailable = await userStore.checkDuplicateId(formData.userid);

    isIdChecked.value = true;
    if (isAvailable) {
      isIdAvailable.value = true;
      // alert보다는 메시지 출력을 권장하지만, 일단 alert 유지
      alert('사용 가능한 아이디입니다.');
    } else {
      isIdAvailable.value = false;
      alert('이미 사용 중인 아이디입니다.');
    }
  } catch (err) {
    alert('중복 확인 중 오류가 발생했습니다.');
  } finally {
    isIdChecking.value = false; // 로딩 종료
  }
};

const handleSignup = async () => {
  // 1. 모든 필드를 '건드린 것'으로 간주하여 에러 메시지가 화면에 나오게 함
  Object.keys(touched).forEach((key) => {
    touched[key] = true;
  });

  // 2. Zod 검증 수행
  const result = signUpSchema.safeParse(formData);

  // 3. 아이디 중복 확인 체크
  if (!isIdChecked.value || !isIdAvailable.value) {
    alert('아이디 중복 확인을 완료해 주세요.');
    return;
  }

  // 4. 검증 실패 시 처리
  if (!result.success) {
    // 에러 객체 업데이트 (watch에서 수행하지만, 제출 시 즉각 반영을 위해 한 번 더 실행)
    errors.value = {};
    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];
      errors.value[fieldName] = issue.message;
    });

    alert('입력 정보를 다시 확인해 주세요.');
    return;
  }

  // 5. 통과 시 제출 로직...
  const { confirmPassword: _, ...payload } = result.data;
  try {
    const success = await userStore.signUp(payload);
    if (success) {
      alert('회원가입이 완료되었습니다!');
      emit('close');
    }
  } catch (err) {
    alert('네트워크 오류가 발생했습니다.');
  }
};

// Script Setup
const neumoBtnClass = `
  px-6 py-4 bg-[#f4f2ee] text-sm font-bold text-[#645b4c] rounded-full transition-all whitespace-nowrap
  shadow-[6px_6px_12px_rgba(217,213,206,0.8),-6px_-6px_12px_rgba(255,255,255,0.9)]
  enabled:hover:text-[#fcaf17]
  enabled:active:shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]
  enabled:active:scale-[0.97]
  disabled:opacity-50
  disabled:cursor-not-allowed
  disabled:shadow-none
`;
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
