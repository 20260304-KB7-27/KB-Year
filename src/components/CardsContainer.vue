<script setup>
import { computed } from 'vue';
import { useDurationStore } from '@/stores/duration';
import { Vue3Lottie } from 'vue3-lottie';
import LoadAnimation from '../assets/lottie/LoadingDots.json';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const durationStore = useDurationStore();

const currentMonthDisplay = computed(() => {
  const d = durationStore.date;
  if (!d) return '...';
  return `${d.year}년 ${d.month}월`;
});

const handleMonthChange = (offset) => {
  durationStore.date = durationStore.date.add({ months: offset });
};

const isLoading = computed(() => durationStore.isLoading);
const totalIncome = computed(() => durationStore.totalIncome);
const netProfit = computed(() => durationStore.netProfit);
const totalExpense = computed(() => durationStore.totalExpense);

const cards = computed(() => [
  { id: 1, title: '수입', value: totalIncome.value, color: '#4ade80' },
  { id: 2, title: '지출', value: totalExpense.value, color: '#f87171' },
  { id: 3, title: '순수익', value: netProfit.value, color: '#60a5fa' },
]);

const formatNumber = (num) => (num || 0).toLocaleString();
</script>
<template>
  <div class="flex items-center gap-6 justify-center">
    <div class="flex items-center gap-6">
      <button
        class="w-10 h-10 rounded-full neo-interactive flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200"
        @click="handleMonthChange(-1)"
      >
        <span class="text-sm font-bold text-gray-400"
          ><ChevronLeft class="h-4 w-4 text-[#8d8d8d]"
        /></span>
      </button>

      <span class="text-lg font-black text-gray-500 min-w-[120px] text-center tracking-tight">
        {{ currentMonthDisplay }}
      </span>

      <button
        class="w-10 h-10 rounded-full neo-interactive flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200"
        @click="handleMonthChange(1)"
      >
        <span class="text-sm font-bold text-gray-400"
          ><ChevronRight class="h-4 w-4 text-[#8d8d8d]"
        /></span>
      </button>
    </div>
  </div>

  <div class="bg-[#f4f2ee] flex items-center justify-center p-4 font-sans">
    <div
      v-if="isLoading"
      class="text-gray-400 font-bold animate-pulse absolute top-10"
    >
      <Vue3Lottie
        :animation-data="LoadAnimation"
        :height="150"
        :width="150"
      />
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="card in cards"
        :key="card.id"
        class="neo-inset py-4 px-6 rounded-[40px] min-w-[240px] flex items-center gap-6 transition-all duration-300"
      >
        <div class="w-10 h-10 rounded-2xl neo-outset flex items-center justify-center shrink-0">
          <div
            class="rounded-full w-5 h-5"
            :style="{ backgroundColor: card.color }"
          ></div>
        </div>

        <div class="flex flex-col">
          <span class="text-gray-500 text-sm font-medium mb-1">{{ card.title }}</span>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-black text-gray-800 tracking-tight">
              {{ formatNumber(card.value) }}
            </span>
            <span class="text-gray-400 font-bold text-sm">KRW</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
