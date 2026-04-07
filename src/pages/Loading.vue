<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f4f2ee]">
    <div class="relative flex flex-col items-center">
      <!-- {/* Neumorphic container */} -->
      <div class="neu-flat rounded-[40px] p-10 flex flex-col items-center">
        <!--  Pig icon container with neumorphic inset  -->
        <div
          class="neu-pressed rounded-full w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mb-6"
        >
          <div class="w-28 h-28 md:w-36 md:h-36">
            <Vue3Lottie
              :animation-data="loadingAnimation"
              :loop="true"
              style="width: 100%; height: 100%"
            />
          </div>
        </div>

        <!-- Loading text  -->
        <h2 class="text-[#645b4c] font-bold text-xl mb-2">PiggyBank</h2>
        <p class="text-[#a39b8f] text-sm mb-6">Loading your savings...</p>

        <!-- Progress bar container - neumorphic inset -->
        <div class="w-64 md:w-80">
          <div class="relative h-4 w-full overflow-hidden rounded-full neu-pressed-sm">
            <!-- Progress fill  -->
            <div
              class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#fcaf17] to-[#fdb913] transition-all duration-100 ease-out"
              :style="{ width: `${progress}%` }"
            />
            <!--  Shimmer effect  -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
              :style="{
                transform: `translateX(${progress - 100}%)`,
              }"
            />
          </div>

          <!-- Percentage text -->
          <div class="mt-4 flex items-center justify-center">
            <span class="text-4xl font-bold text-[#645b4c] tabular-nums">
              {{ progress }}
            </span>
            <span class="text-2xl font-semibold text-[#a39b8f] ml-1">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Vue3Lottie } from 'vue3-lottie';
import loadingAnimation from '@/assets/lottie/piggy-bank-dancing.json';

// 1. 필요한 상태(ref)와 인터벌 변수 선언
const progress = ref<number>(0);
let intervalId: ReturnType<typeof setInterval> | null = null;

const emit = defineEmits(['loadingComplete']);

onMounted(() => {
  intervalId = setInterval(() => {
    if (progress.value >= 100) {
      if (intervalId) clearInterval(intervalId);

      setTimeout(() => emit('loadingComplete'), 500);
      return;
    }
    progress.value += 2;
  }, 50);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped></style>
