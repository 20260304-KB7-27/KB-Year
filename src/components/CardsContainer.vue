<script setup>
import { computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transaction';
import { useDurationStore } from '@/stores/duration';
import { useUserStore } from '@/stores/user';

const transactionStore = useTransactionStore();
const durationStore = useDurationStore();
const userStore = useUserStore();

const userId = computed(() => userStore.user?.userid);

onMounted(() => {
  if (userId.value) {
    transactionStore.fetchTransactions(userId.value);
  }
});

const currentMonthDisplay = computed(() => {
  const date = transactionStore.selectedDate;
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
});

// 스토어의 액션을 직접 호출
const handleMonthChange = (offset) => {
  transactionStore.changeMonth(offset, userId.value);
};

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
  <!-- 날짜 파트 -->
  <div class="flex items-center gap-6 justify-center">
    <div class="flex items-center gap-6">
      <button
        class="w-10 h-10 rounded-full neo-interactive flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200"
        @click="handleMonthChange(-1)"
      >
        <span class="text-sm">＜</span>
      </button>

      <span class="text-lg font-black text-gray-500 min-w-[120px] text-center tracking-tight">
        {{ currentMonthDisplay }}
      </span>

      <button
        class="w-10 h-10 rounded-full neo-interactive flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200"
        @click="handleMonthChange(1)"
      >
        <span class="text-sm">＞</span>
      </button>
    </div>
  </div>
  <!-- 요약 카드 파트 -->
  <div class="bg-[#f4f2ee] flex items-center justify-center p-4 font-sans">
    <div
      v-if="transactionStore.isLoading"
      class="text-gray-400 font-bold animate-pulse absolute top-10"
    >
      업데이트 중...
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="card in cards"
        :key="card.id"
        class="neo-inset py-4 px-6 rounded-[40px] min-w-[290px] flex items-center gap-6 transition-all duration-300"
      >
        <div
          class="w-12 h-12 rounded-2xl neo-outset flex items-center justify-center shrink-0"
          :style="{ color: card.color }"
        >
          <span class="text-xl font-bold">●</span>
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

<style scoped>
.neo-inset {
  background: #f4f2ee;
  box-shadow:
    inset 6px 6px 12px #dbd9d4,
    inset -6px -6px 12px #ffffff;
}

.neo-outset {
  background: #f4f2ee;
  box-shadow:
    6px 6px 12px #dbd9d4,
    -6px -6px 12px #ffffff;
}

.neo-inset:hover {
  transform: translateY(-1px);
  box-shadow:
    6px 6px 16px #dbd9d4,
    -6px -6px 16px #ffffff;
}

.neo-interactive {
  background: #f4f2ee;
  border: none;
  box-shadow:
    2px 2px 5px #e8e6e0,
    -2px -2px 5px #ffffff;
}

.neo-interactive:hover {
  box-shadow:
    5px 5px 10px #dbd9d4,
    -5px -5px 10px #ffffff;
  transform: translateY(-1px);
}

.neo-interactive:active {
  box-shadow:
    inset 4px 4px 8px #dbd9d4,
    inset -4px -4px 8px #ffffff;
  transform: translateY(0);
}
</style>
