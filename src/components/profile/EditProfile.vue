<template>
  <!-- 1. 트리거 아이콘 -->
  <div
    class="relative cursor-pointer group flex flex-col items-center"
    @click="openModal"
  >
    <Settings
      class="text-[#a39b8f] hover:text-[#fcaf17] group-hover:text-[#645b4c] group-hover:rotate-45 transition-all duration-300"
    />
    <span
      class="absolute left-full ml-3 hidden group-hover:block whitespace-nowrap px-3 py-1.5 bg-[#f4f2ee] text-[#645b4c] text-xs font-bold rounded-xl shadow-[4px_4px_8px_rgba(217,213,206,0.8),-4px_-4px_8px_rgba(255,255,255,0.9)] transition-all duration-200 top-1/2 -translate-y-1/2 z-10"
    >
      설정
      <span
        class="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-[#f4f2ee]"
      ></span>
    </span>
  </div>

  <!-- 2. 모달 레이어 (Teleport) -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        <!-- 배경 (클릭 시 닫힘) -->
        <div
          class="absolute inset-0 bg-[#645b4c]/20 backdrop-blur-sm"
          @click="closeModal"
        ></div>

        <!-- 모달 컨텐츠 박스 -->
        <div
          class="relative w-full max-w-[540px] p-8 sm:p-10 bg-[#f4f2ee] rounded-[40px] shadow-[20px_20px_60px_#d0cfcb,-20px_-20px_60px_#ffffff] overflow-y-auto max-h-[90vh] custom-scrollbar"
          @click.stop
        >
          <h2 class="text-[28px] sm:text-[32px] font-bold text-[#fcaf17] text-center mb-8">
            회원 정보 수정
          </h2>

          <form
            novalidate
            class="space-y-5"
            @submit.prevent="handleUpdate"
          >
            <!-- 아이디 (Readonly) -->
            <div class="relative">
              <label class="block text-xs font-semibold text-[#7a7062] ml-4 mb-2">아이디</label>
              <input
                v-model="formData.userid"
                type="text"
                readonly
                class="w-full px-6 py-3 bg-[#eceae6] rounded-full text-[#a1998d] outline-none shadow-[inset_2px_2px_5px_#d1cfca] cursor-not-allowed"
              />
            </div>

            <!-- 비밀번호 변경 구역 -->
            <!-- <div
              class="bg-[#edebe7]/50 p-5 rounded-[30px] shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)]"
            >
              <label class="block text-xs font-semibold text-[#7a7062] ml-2 mb-3"
                >비밀번호 변경</label
              >
              <div class="space-y-3">
                <div class="relative">
                  <input
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="새 비밀번호 (8자 이상)"
                    class="w-full px-6 py-3 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-6 top-1/2 -translate-y-1/2 text-[#a1998d]"
                  >
                    <Eye
                      v-if="!showPassword"
                      class="w-5 h-5 cursor-pointer"
                    /><EyeOff
                      v-else
                      class="w-5 h-5 cursor-pointer"
                    />
                  </button>
                </div>
                <input
                  v-model="formData.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="새 비밀번호 확인"
                  class="w-full px-6 py-3 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
                />
              </div>
            </div> -->
            <div
              class="bg-[#edebe7]/50 p-5 rounded-[30px] shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)]"
            >
              <label class="block text-xs font-semibold text-[#7a7062] ml-2 mb-3"
                >비밀번호 변경 (선택)</label
              >

              <div class="space-y-4">
                <div>
                  <div class="relative">
                    <input
                      v-model="formData.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="새 비밀번호 (8자 이상)"
                      class="w-full px-6 py-3 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all pr-14"
                      :class="{ 'ring-1 ring-red-400': errors.password }"
                      @blur="touched.password = true"
                      @input="touched.password = true"
                    />
                    <button
                      type="button"
                      class="absolute right-6 top-1/2 -translate-y-1/2 text-[#a1998d]"
                      @click="showPassword = !showPassword"
                    >
                      <Eye
                        v-if="!showPassword"
                        class="w-5 h-5"
                      />
                      <EyeOff
                        v-else
                        class="w-5 h-5"
                      />
                    </button>
                  </div>
                  <p
                    v-if="errors.password"
                    class="text-[10px] text-red-500 ml-4 mt-1 font-medium"
                  >
                    {{ errors.password }}
                  </p>
                  <p
                    v-else-if="touched.password && formData.password && !errors.password"
                    class="text-[10px] text-green-600 ml-4 mt-1 font-medium"
                  >
                    안전한 비밀번호입니다.
                  </p>
                </div>

                <div>
                  <input
                    v-model="formData.confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="새 비밀번호 확인"
                    class="w-full px-6 py-3 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
                    :class="{ 'ring-1 ring-red-400': errors.confirmPassword }"
                    @blur="touched.confirmPassword = true"
                    @input="touched.confirmPassword = true"
                  />
                  <p
                    v-if="errors.confirmPassword"
                    class="text-[10px] text-red-500 ml-4 mt-1 font-medium"
                  >
                    {{ errors.confirmPassword }}
                  </p>
                  <p
                    v-else-if="
                      touched.confirmPassword &&
                      formData.password &&
                      formData.confirmPassword === formData.password &&
                      !errors.confirmPassword
                    "
                    class="text-[10px] text-green-600 ml-4 mt-1 font-medium"
                  >
                    비밀번호가 일치합니다.
                  </p>
                </div>
              </div>
            </div>
            <!-- 이름 (Readonly) -->
            <div class="relative">
              <label class="block text-xs font-semibold text-[#7a7062] ml-4 mb-2">이름</label>
              <input
                v-model="formData.name"
                type="text"
                readonly
                class="w-full px-6 py-3 bg-[#eceae6] rounded-full text-[#a1998d] outline-none shadow-[inset_2px_2px_5px_#d1cfca] cursor-not-allowed"
              />
            </div>

            <!-- 생년월일 & 성별 (Readonly) -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-[#7a7062] ml-4 mb-2">생년월일</label>
                <input
                  v-model="formData.birthDate"
                  type="date"
                  readonly
                  class="w-full px-6 py-3 bg-[#eceae6] rounded-full text-[#a1998d] outline-none shadow-[inset_2px_2px_5px_#d1cfca] cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#7a7062] ml-4 mb-2">성별</label>
                <input
                  v-model="formData.gender"
                  type="text"
                  readonly
                  class="w-full px-6 py-3 bg-[#eceae6] rounded-full text-[#a1998d] text-center outline-none shadow-[inset_2px_2px_5px_#d1cfca] cursor-not-allowed"
                />
              </div>
            </div>

            <!-- 수정 가능 필드 -->
            <div class="space-y-4">
              <div
                v-for="field in ['email', 'phone', 'job']"
                :key="field"
              >
                <label class="block text-xs font-semibold text-[#7a7062] ml-4 mb-2 uppercase">
                  {{ field === 'email' ? '이메일' : field === 'phone' ? '전화번호' : '직업' }}
                </label>

                <input
                  v-model="formData[field]"
                  :type="field === 'email' ? 'email' : 'text'"
                  :placeholder="
                    field === 'email' ? '이메일' : field === 'phone' ? '010-0000-0000' : '직업'
                  "
                  class="w-full px-6 py-3 bg-[#f4f2ee] rounded-full text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_rgba(217,213,206,0.8),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] focus:shadow-[inset_5px_5px_10px_#d9d5ce,inset_-5px_-5px_10px_#ffffff] transition-all"
                  :class="{ 'ring-1 ring-red-400': errors[field] }"
                  @blur="touched[field] = true"
                  @input="touched[field] = true"
                />

                <p
                  v-if="errors[field]"
                  class="text-[10px] text-red-500 ml-4 mt-1 font-medium"
                >
                  {{ errors[field] }}
                </p>

                <p
                  v-else-if="touched[field] && formData[field] && !errors[field]"
                  class="text-[10px] text-green-600 ml-4 mt-1 font-medium"
                >
                  {{
                    field === 'email'
                      ? '올바른 이메일 형식입니다.'
                      : field === 'phone'
                        ? '올바른 전화번호 형식입니다.'
                        : '입력되었습니다.'
                  }}
                </p>
              </div>
            </div>

            <!-- 하단 버튼 -->
            <div class="pt-6 flex gap-4">
              <button
                type="button"
                class="cursor-pointer text-[#fcaf17] hover:bg-[#eae6e1] flex-1 py-3 bg-[#f4f2ee] rounded-full text-[#7a7062] font-bold shadow-[4px_4px_8px_#d0cfcb,-4px_-4px_8px_#ffffff] transition-all"
                @click="closeModal"
              >
                취소
              </button>
              <button
                type="submit"
                class="cursor-pointer text-[#fcaf17] flex-[2] py-3 bg-[#f4f2ee] rounded-full text-[#645b4c] font-bold shadow-[4px_4px_8px_#d0cfcb,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#d0cfcb] hover:bg-[#eae6e1] transition-all"
              >
                수정 완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { Settings, Eye, EyeOff } from 'lucide-vue-next';
import { editProfileSchema } from '@/schemas/schema';
const userStore = useUserStore();
const isOpen = ref(false);
const showPassword = ref(false);

// 수정을 위한 임시 데이터 객체
const formData = reactive({
  userid: '',
  name: '',
  birthDate: '',
  gender: '',
  email: '',
  phone: '',
  job: '',
  password: '',
  confirmPassword: '',
});

const errors = ref({}); // 에러 메시지 객체

// 사용자가 필드를 건드렸는지 확인 (회원가입과 동일한 방식)
const touched = reactive({
  email: false,
  phone: false,
  job: false,
  password: false,
  confirmPassword: false,
});

watch(
  formData,
  () => {
    const result = editProfileSchema.safeParse(formData);
    errors.value = {}; // 초기화

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        // 해당 필드를 한 번이라도 건드렸을 때만 에러 표시
        if (touched[fieldName]) {
          errors.value[fieldName] = issue.message;
        }
      });
    }
  },
  { deep: true }
);

const openModal = () => {
  // 1. 모든 touched 상태를 false로 초기화 (에러 메시지 숨기기)
  Object.keys(touched).forEach((key) => {
    touched[key] = false;
  });

  // 2. 에러 객체 초기화
  errors.value = {};

  // 3. 기존 유저 데이터 복사 (원본 데이터 보호)
  const u = userStore.user;
  if (u) {
    Object.assign(formData, {
      ...u,
      password: '', // 비밀번호 필드는 보안상 항상 비움
      confirmPassword: '',
    });
  }
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  showPassword.value = false;
};

const handleUpdate = async () => {
  Object.keys(touched).forEach((key) => (touched[key] = true));
  const result = editProfileSchema.safeParse(formData);
  // if (formData.password && formData.password !== formData.confirmPassword) {
  //   alert('새 비밀번호가 일치하지 않습니다.');
  //   return;
  // }
  if (!result.success) {
    // 에러 처리...
    return;
  }
  const payload = {
    password: formData.password || undefined,
    email: formData.email,
    phone: formData.phone,
    job: formData.job,
  };

  // 비밀번호를 실제로 입력했을 때만 payload에 추가
  if (result.data.password && result.data.password.trim() !== '') {
    payload.password = result.data.password;
  }

  const success = await userStore.update(payload);
  if (success) {
    alert('성공적으로 수정되었습니다.');
    closeModal();
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d0cfcb;
  border-radius: 10px;
}

input[readonly]::-webkit-calendar-picker-indicator {
  display: none;
}
</style>
