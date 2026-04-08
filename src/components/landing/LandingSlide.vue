<template>
  <div class="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-transparent">
    <button
      aria-label="Previous Slide"
      class="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-transparent rounded-full text-[#645b4c] opacity-40 hover:opacity-100 transition-all duration-300 ease-in-out hover:drop-shadow-[2px_2px_3px_#d9d5ce] hover:drop-shadow-[-2px_-2px_3px_#ffffff] active:scale-95 active:drop-shadow-none"
      @click="prevSlide"
    >
      <ChevronLeft class="w-8 h-8 stroke-[1.5]" />
    </button>

    <button
      aria-label="Next Slide"
      class="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-transparent rounded-full text-[#645b4c] opacity-40 hover:opacity-100 transition-all duration-300 ease-in-out hover:drop-shadow-[2px_2px_3px_#d9d5ce] hover:drop-shadow-[-2px_-2px_3px_#ffffff] active:scale-95 active:drop-shadow-none"
      @click="nextSlide"
    >
      <ChevronRight class="w-8 h-8 stroke-[1.5]" />
    </button>

    <div class="relative z-10 flex flex-col justify-center px-12 xl:px-20 h-full w-full">
      <div class="relative h-64 w-full">
        <transition-group name="slide">
          <div
            v-for="(slide, index) in slides"
            v-show="currentSlide === index"
            :key="slide.id"
            class="absolute inset-0 flex flex-col justify-center"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-16 h-16 rounded-full bg-[#f4f2ee] shadow-[6px_6px_12px_#d9d5ce,-6px_-6px_12px_#ffffff] flex items-center justify-center"
              >
                <Vue3Lottie
                  :animation-data="pigHeroAnimation"
                  :height="50"
                  :width="50"
                />
              </div>
            </div>
            <h1
              class="text-5xl xl:text-6xl font-bold italic text-[#645b4c] mb-4 drop-shadow-sm break-keep"
            >
              {{ slide.title }}
            </h1>
            <p class="text-2xl xl:text-3xl font-bold text-[#4a7cbe]">
              {{ slide.subtitle }}
            </p>
          </div>
        </transition-group>
      </div>

      <div class="absolute bottom-12 flex gap-3">
        <button
          v-for="(_, i) in slides"
          :key="i"
          :class="[
            'h-2.5 rounded-full transition-all duration-500',
            currentSlide === i ? 'w-10 bg-[#fcaf17]' : 'w-2.5 bg-[#d9d5ce]',
          ]"
          @click="goToSlide(i)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { Vue3Lottie } from 'vue3-lottie';
import pigHeroAnimation from '@/assets/lottie/piggy-bank-dancing.json';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  { id: 1, title: 'PiggyBank Savings', subtitle: '스마트 저축을 환영합니다.' },
  { id: 2, title: 'Track Your Goals', subtitle: '목표를 향해 나아가세요.' },
  { id: 3, title: 'Financial Freedom', subtitle: '재정적 자유를 경험하세요.' },
];

const currentSlide = ref<number>(0);
let timer: ReturnType<typeof setInterval> | null = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};
const goToSlide = (i: number) => {
  if (currentSlide.value === i) return;
  currentSlide.value = i;
  resetTimer();
};

const resetTimer = () => {
  if (timer) clearInterval(timer);
  timer = setInterval(nextSlide, 5000);
};

onMounted(() => {
  resetTimer();
});
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
</style>
