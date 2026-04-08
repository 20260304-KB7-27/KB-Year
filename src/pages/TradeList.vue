<template>
  <div class="min-h-screen bg-[#f4f2ee] px-6 py-8 text-[#4b4b4b]">
    <div class="mx-auto w-full max-w-[520px]">
      <!-- 헤더 -->
      <div class="mb-6 flex items-center gap-4">
        <button
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[oklch(1 0 0)] shadow-[6px_6px_12px_#c9c5bd,-6px_-6px_12px_#f5f1e9] transition-all duration-200 active:shadow-[inset_3px_3px_6px_#c9c5bd,inset_-3px_-3px_6px_#f5f1e9]"
          @click="route.push('/')"
        >
          <ChevronLeft class="h-5 w-5 text-muted-foreground" />
        </button>

        <h1 class="text-[18px] font-extrabold tracking-[-0.02em]">거래 내역</h1>
      </div>

      <!-- 월 선택 -->
      <div
        class="mb-6 flex items-center justify-center rounded-[22px] bg-[#f4f2ee] px-5 py-4 neo-outset"
      >
        <div class="flex items-center gap-10">
          <button
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card)] shadow-[4px_4px_8px_#c9c5bd,-4px_-4px_8px_#f5f1e9] transition-all duration-200 active:shadow-[inset_2px_2px_4px_#c9c5bd,inset_-2px_-2px_4px_#f5f1e9]"
            @click="moveMonth(-1)"
          >
            <ChevronLeft class="h-4 w-4 text-[#8d8d8d]" />
          </button>

          <div class="flex items-center gap-2.5 text-[#E4A13A]">
            <CalendarDays class="h-5 w-5" />
            <div class="text-[16px] font-extrabold">
              <span>{{ selectedDate.getFullYear() }}년 </span>
              <span>{{ selectedDate.getMonth() + 1 }}월</span>
            </div>
          </div>

          <button
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card)] shadow-[4px_4px_8px_#c9c5bd,-4px_-4px_8px_#f5f1e9] transition-all duration-200 active:shadow-[inset_2px_2px_4px_#c9c5bd,inset_-2px_-2px_4px_#f5f1e9]"
            @click="moveMonth(1)"
          >
            <ChevronRight class="h-4 w-4 text-[#8d8d8d]" />
          </button>
        </div>
      </div>

      <!-- 필터 -->
      <div class="mb-6 rounded-[20px] bg-[#f4f2ee] p-2 neo-inset">
        <div class="flex gap-2.5">
          <button
            class="flex-1 rounded-[14px] px-4 py-2.5 text-[13px] font-semibold transition-all duration-200"
            :class="
              selectedType === 'all' ? 'bg-[#E4A13A] text-white neo-tab-active' : 'text-[#8d8d8d]'
            "
            @click="selectedType = 'all'"
          >
            전체
          </button>

          <button
            class="flex-1 rounded-[14px] px-4 py-2.5 text-[13px] font-semibold transition-all duration-200"
            :class="
              selectedType === 'income'
                ? 'bg-[#E4A13A] text-white neo-tab-active'
                : 'text-[#8d8d8d]'
            "
            @click="selectedType = 'income'"
          >
            수입
          </button>

          <button
            class="flex-1 rounded-[14px] px-4 py-2.5 text-[13px] font-semibold transition-all duration-200"
            :class="
              selectedType === 'expense'
                ? 'bg-[#E4A13A] text-white neo-tab-active'
                : 'text-[#8d8d8d]'
            "
            @click="selectedType = 'expense'"
          >
            지출
          </button>
        </div>
      </div>

      <!-- 날짜 헤더 -->
      <div class="mb-4 flex items-center gap-3">
        <span class="h-3 w-3 rounded-full bg-[#E4A13A]"></span>
        <span class="text-[15px] font-bold text-[#8d8d8d]">
          {{ selectedDate.getMonth() + 1 }}월 {{ selectedDate.getDate() }}일
        </span>
        <div class="h-px flex-1 bg-[#d8d3cb]"></div>
      </div>

      <!-- 리스트 -->
      <div class="flex flex-col gap-4">
        <TradeCard
          v-for="trade in filteredTransactions"
          :key="trade.id"
          :transaction="trade"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transaction';
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { formatQueryDate } from '@/utils/date.js';
import TradeCard from '@/components/tradeList/TradeCard.vue';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const route = useRouter();
const store = useTransactionStore();
const { transactions } = storeToRefs(store);

const selectedDate = ref(store.selectedDate ? new Date(store.selectedDate) : new Date());

const selectedType = ref('all');

const loadTransactions = async (baseDate) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  await store.getUserAllTransaction('user1', formatQueryDate(firstDay), formatQueryDate(lastDay));
};

const moveMonth = async (diff) => {
  const newDate = new Date(selectedDate.value);
  newDate.setMonth(newDate.getMonth() + diff);

  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const targetMonthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

  if (targetMonthStart > currentMonthStart) return;

  selectedDate.value = newDate;
  await loadTransactions(newDate);
};

onMounted(async () => {
  await loadTransactions(selectedDate.value);
});

const filteredTransactions = computed(() => {
  if (selectedType.value === 'all') {
    return transactions.value;
  }

  return transactions.value.filter((t) => t.type === selectedType.value);
});
</script>

<style scoped>
.neo-outset {
  box-shadow:
    10px 10px 20px #d9d4cd,
    -10px -10px 20px #fffdf8;
}

.neo-inset {
  box-shadow:
    inset 4px 4px 8px #ddd8d1,
    inset -4px -4px 8px #fffdf8;
}

.neo-tab-active {
  box-shadow:
    4px 4px 8px rgba(201, 146, 50, 0.28),
    -4px -4px 8px rgba(255, 255, 255, 0.55);
}
</style>
