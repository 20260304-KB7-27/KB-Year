<script setup>
import { ref } from 'vue';

const cards = ref([
  { id: 1, title: '수입', value: 500000, color: '#4ade80', unit: '₩' },
  { id: 2, title: '지출', value: 300000, color: '#f87171', unit: '₩' },
  { id: 3, title: '순수익', value: 200000, color: '#60a5fa', unit: '₩' },
]);

const formatNumber = (num) => {
  return num.toLocaleString();
};
</script>

<template>
  <div
    class="min-h bg-[#f4f2ee] flex items-center justify-center p-2 font-sans"
  >
    <div class="flex flex-col gap-6">
      <div
        v-for="card in cards"
        :key="card.id"
        class="neo-inset p-8 rounded-[40px] min-w-[290px] flex items-center gap-6"
      >
        <!-- 아이콘 -->
        <div
          class="w-12 h-12 rounded-2xl neo-outset flex items-center justify-center"
          :style="{ color: card.color }"
        >
          <span class="text-xl font-bold">●</span>
        </div>

        <!-- 금액 -->
        <div class="flex flex-col">
          <span class="text-gray-500 text-sm font-medium mb-1">{{
            card.title
          }}</span>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-black text-gray-800">
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
  transform: translateY(-2px);
  box-shadow:
    6px 6px 16px #dbd9d4,
    -6px -6px 16px #ffffff;
}
</style>
