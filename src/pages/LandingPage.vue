<template>
  <div class="relative min-h-screen w-screen overflow-hidden bg-[#f4f2ee] font-sans">
    <Loading
      v-if="isLoading"
      @loading-complete="handleLoadingComplete"
    />

    <transition name="fade-in">
      <div
        v-if="!isLoading"
        class="relative h-screen w-screen flex overflow-hidden"
      >
        <div class="absolute inset-0 z-0 pointer-events-none">
          <div
            class="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] bg-[#fcaf17] opacity-[0.07] rounded-full blur-[120px] animate-pulse"
          ></div>
          <div
            class="absolute -bottom-[10%] -left-[5%] w-[700px] h-[700px] bg-[#4a7cbe] opacity-[0.05] rounded-full blur-[150px] animate-pulse"
            style="animation-duration: 12s"
          ></div>
          <div
            class="absolute inset-0 opacity-[0.02]"
            style="
              background-image: radial-gradient(#645b4c 1.5px, transparent 1.5px);
              background-size: 40px 40px;
            "
          ></div>
        </div>

        <LandingSlide class="relative z-10 hidden lg:flex lg:w-[60%]" />

        <div
          class="relative z-10 w-full lg:w-[40%] flex flex-col justify-center items-center px-8 py-12"
        >
          <LoginForm @open-signup="isSignupModalOpen = true" />
        </div>

        <SignupModal
          v-if="isSignupModalOpen"
          class="z-[100]"
          @close="isSignupModalOpen = false"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Loading from './Loading.vue';
import SignupModal from '@/components/landing/SignupModal.vue';
import LoginForm from '@/components/landing/LoginForm.vue';
import LandingSlide from '@/components/landing/LandingSlide.vue';

const isLoading = ref(true);
const isSignupModalOpen = ref(false);

const handleLoadingComplete = () => {
  isLoading.value = false;
};
</script>

<style scoped>
/* 트랜지션 효과 유지 */
.fade-in-enter-active {
  transition: opacity 1.2s ease-out;
}
.fade-in-enter-from {
  opacity: 0;
}

:deep(h1),
:deep(h2),
:deep(button) {
  word-break: keep-all;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.05;
    transform: scale(1);
  }
  50% {
    opacity: 0.08;
    transform: scale(1.05);
  }
}
.animate-pulse {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
