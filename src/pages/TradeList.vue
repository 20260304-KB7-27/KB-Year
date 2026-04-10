<template>
  <div class="min-h-screen bg-[#f4f2ee] px-6 py-8 text-[#4b4b4b]">
    <div class="mx-auto w-full max-w-[520px]">
      <!-- 헤더 -->
      <div class="mb-6 flex items-center gap-4">
        <button
          class="flex h-12 w-12 items-center justify-center rounded-2xl neo-interactive"
          @click="route.push('/')"
        >
          <ArrowLeft class="h-5 w-5 text-muted-foreground" />
        </button>

        <h1 class="text-[18px] font-extrabold tracking-[-0.02em]">거래 내역</h1>
      </div>

      <!-- 월 선택 -->
      <div class="mb-6 flex items-center justify-center rounded-[22px] px-5 py-4 neo-outset">
        <div class="flex w-full items-center justify-between">
          <button
            class="flex h-10 w-10 items-center justify-center rounded-xl neo-interactive"
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
            class="flex h-10 w-10 items-center justify-center rounded-xl neo-interactive"
            @click="moveMonth(1)"
          >
            <ChevronRight class="h-4 w-4 text-[#8d8d8d]" />
          </button>
        </div>
      </div>

      <!-- 필터 -->
      <div class="mb-6 rounded-[20px] p-2 neo-inset">
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
      <div class="flex flex-col gap-6">
        <div
          v-for="group in groupedTransactions"
          :key="group.dateKey"
          class="flex flex-col gap-4"
        >
          <!-- 날짜 헤더 -->
          <div class="mb-1 flex items-center gap-3">
            <span class="h-3 w-3 rounded-full bg-[#E4A13A]"></span>
            <span class="text-[15px] font-bold text-[#8d8d8d]">
              {{ group.month }}월 {{ group.day }}일
            </span>
            <div class="h-px flex-1 bg-[#d8d3cb]"></div>
          </div>

          <!-- 해당 날짜의 거래 리스트 -->
          <div class="flex flex-col gap-4">
            <TradeCard
              v-for="trade in group.items"
              :key="trade.id"
              :transaction="trade"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTransactionsStore } from '@/stores/transactions';
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import TradeCard from '@/components/tradeList/TradeCard.vue';
import { ChevronLeft, ChevronRight, CalendarDays, ArrowLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const route = useRouter();

const store = useTransactionsStore();
const { transactions, isLoading } = storeToRefs(store);

const selectedDate = ref(new Date());
const selectedType = ref('all');

const moveMonth = (diff) => {
  const newDate = new Date(selectedDate.value);
  newDate.setMonth(newDate.getMonth() + diff);

  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const targetMonthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

  if (targetMonthStart > currentMonthStart) return;

  selectedDate.value = newDate;
};

// 월 필터
const monthTransactions = computed(() => {
  return store.getTransactionsByMonth(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth()
  );
});

onMounted(async () => {
  if (!transactions.value.length) {
    await store.fetchTransactions();
  }
});

const filteredTransactions = computed(() => {
  if (selectedType.value === 'all') return monthTransactions.value;

  return monthTransactions.value.filter((t) => t.type?.toLowerCase() === selectedType.value);
});

const groupedTransactions = computed(() => {
  const sorted = [...filteredTransactions.value].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const groups = {};

  sorted.forEach((trade) => {
    const date = new Date(trade.date);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const key = `${year}-${month}-${day}`;

    if (!groups[key]) {
      groups[key] = {
        dateKey: key,
        month,
        day,
        items: [],
      };
    }

    groups[key].items.push(trade);
  });

  return Object.values(groups);
});
</script>
