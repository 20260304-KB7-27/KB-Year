<template>
  <div
    class="w-full max-w-sm bg-[#f4f2ee] rounded-3xl p-8 shadow-[12px_12px_24px_#d9d5ce,-12px_-12px_24px_#ffffff]"
  >
    <div class="mb-10 flex flex-col items-center">
      <div
        class="w-20 h-20 rounded-full bg-[#f4f2ee] shadow-[8px_8px_16px_#d9d5ce,-8px_-8px_16px_#ffffff] flex items-center justify-center mb-4"
      >
        <span class="text-3xl font-black text-[#fcaf17]">PB</span>
      </div>
      <div class="text-center">
        <span class="text-lg font-bold text-[#645b4c]">PiggyBank</span>
        <p class="text-sm text-[#a39b8f]">Savings Platform</p>
      </div>
    </div>

    <div class="space-y-5 mb-6">
      <input
        type="text"
        placeholder="아이디를 입력해 주세요."
        class="w-full px-5 py-4 bg-[#f4f2ee] rounded-xl text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_#d9d5ce,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_12px_#d9d5ce,inset_-6px_-6px_12px_#ffffff] transition-all"
      />

      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="비밀번호를 입력해 주세요."
          class="w-full px-5 py-4 bg-[#f4f2ee] rounded-xl text-[#645b4c] outline-none shadow-[inset_4px_4px_8px_#d9d5ce,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_12px_#d9d5ce,inset_-6px_-6px_12px_#ffffff] transition-all"
        />
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 text-[#a39b8f] hover:text-[#645b4c]"
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
    </div>

    <button
      class="w-full py-4 bg-[#f4f2ee] text-[#fcaf17] font-bold rounded-xl opacity-60 hover:opacity-100 shadow-[6px_6px_12px_#d9d5ce,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#d9d5ce,inset_-4px_-4px_8px_#ffffff] transition-all mb-5"
    >
      LOGIN
    </button>

    <div class="flex items-center justify-center mb-6">
      <label class="flex items-center gap-3 cursor-pointer group">
        <div
          :class="[
            'w-6 h-6 rounded-lg flex items-center justify-center transition-all shadow-[3px_3px_6px_#d9d5ce,-3px_-3px_6px_#ffffff]',
            rememberMe ? 'bg-[#fcaf17]' : 'bg-[#f4f2ee]',
          ]"
          @click="rememberMe = !rememberMe"
        >
          <Check
            v-if="rememberMe"
            class="text-white w-4 h-4"
          />
        </div>
        <span class="text-sm text-[#645b4c]">아이디 저장</span>
      </label>
    </div>

    <div class="text-center pt-4 border-t border-[#e8e4dc]">
      <p class="text-[#a39b8f] text-sm mb-4">PiggyBank는 처음이신가요?</p>
      <button
        class="px-8 py-3 bg-[#f4f2ee] text-[#645b4c] font-medium rounded-xl opacity-60 hover:opacity-100 hover:text-[#fcaf17] shadow-[4px_4px_8px_#d9d5ce,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#d9d5ce,-6px_-6px_12px_#ffffff] transition-all"
        @click="$emit('open-signup')"
      >
        회원가입
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Eye, EyeOff, Check } from 'lucide-vue-next';

const showPassword = ref<boolean>(false);
const rememberMe = ref<boolean>(false);

defineEmits<{
  (e: 'open-signup'): void;
}>();
</script>
