<template>
  <div class="flex items-center justify-between rounded-[22px] bg-[#f4f2ee] px-5 py-4 neo-outset">
    <!-- 왼쪽 -->
    <div class="flex items-center gap-4">
      <!-- 아이콘 -->
      <div
        class="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f4f2ee] neo-inset"
        :class="transaction.type === 'income' ? 'text-[#4CD67A]' : 'text-[#FF6F6F]'"
      >
        <component
          :is="iconComponent"
          class="h-6 w-6"
        />
      </div>

      <!-- 텍스트 -->
      <div class="flex flex-col">
        <span class="text-[15px] font-extrabold leading-none text-[#4b4b4b]">
          {{ transaction.memo }}
        </span>
        <span class="mt-2 text-[12px] leading-none text-[#8d8d8d]">
          {{ transaction.category }}
        </span>
      </div>
    </div>

    <!-- 오른쪽 -->
    <div class="flex flex-col items-end">
      <span
        class="text-[15px] font-extrabold leading-none"
        :class="transaction.type === 'income' ? 'text-[#4CD67A]' : 'text-[#FF6F6F]'"
      >
        {{ transaction.type === 'income' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}원
      </span>
      <span class="mt-2 text-[12px] leading-none text-[#8d8d8d]">
        {{ formatTime(transaction.date) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { UtensilsCrossed, Gift, ShoppingBag } from 'lucide-vue-next';
import { computed } from 'vue';
import { formatTime } from '@/utils/date.js';

const props = defineProps({
  transaction: {
    type: Object,
  },
});

const iconComponent = computed(() => {
  if (props.transaction.type === 'income') return Gift;

  if (props.transaction.category?.includes('쇼핑')) return ShoppingBag;

  return UtensilsCrossed;
});

const formatAmount = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};
</script>

<style scoped>
.neo-outset {
  box-shadow:
    10px 10px 20px #d9d4cd,
    -10px -10px 20px #fffdf8;
}

.neo-inset {
  box-shadow:
    inset 6px 6px 12px #ddd8d1,
    inset -6px -6px 12px #fffdf8;
}
</style>
