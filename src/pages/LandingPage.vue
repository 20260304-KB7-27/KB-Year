<template>
  <div class="relative min-h-screen w-screen overflow-hidden bg-[#f4f2ee] font-sans">
    <Loading
      v-if="isLoading"
      @loading-complete="handleLoadingComplete"
    />

    <div
      v-if="!isLoading"
      class="opacity-0 relative h-screen w-screen flex overflow-hidden"
      :class="cardEnterLeaveClass('main')"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import Loading from './Loading.vue';
import SignupModal from '@/components/landing/SignupModal.vue';
import LoginForm from '@/components/landing/LoginForm.vue';
import LandingSlide from '@/components/landing/LandingSlide.vue';
import { useCardFadeAnimation, CARD_FADE_LEAVE_MS } from '@/composables/useCardFadeAnimation';

const isLoading = ref(true);
const isSignupModalOpen = ref(false);

const cardOn = ref(false);
const isFirstLoad = ref(true);

const { cardEnterLeaveClass } = useCardFadeAnimation(cardOn, isFirstLoad, {
  defaultDirection: 'top',
});

/** 로딩 종료 후 본문 마운트 → 등장 애니 시작까지 (MainPage와 동일) */
const CONTENT_SHOW_DELAY_MS = 300;

const handleLoadingComplete = () => {
  isLoading.value = false;
  setTimeout(() => {
    cardOn.value = true;
    isFirstLoad.value = false;
  }, CONTENT_SHOW_DELAY_MS);
};

onBeforeRouteLeave((to, from, next) => {
  if (isLoading.value || !cardOn.value) {
    next();
    return;
  }
  cardOn.value = false;
  setTimeout(() => next(), CARD_FADE_LEAVE_MS);
});
</script>

<style scoped>
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
