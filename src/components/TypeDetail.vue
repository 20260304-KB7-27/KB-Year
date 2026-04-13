<template>
  <div class="w-full h-75 flex flex-col p-1">
    <div class="flex items-center mb-4 gap-3">
      <button
        class="flex items-center justify-center w-8 h-8 rounded-full bg-[#f4f2ee] shadow-[2px_2px_5px_#d9d5ce,-2px_-2px_5px_#ffffff] text-gray-500 transition-all active:shadow-[inset_2px_2px_5px_#d9d5ce,inset_-2px_-2px_5px_#ffffff]"
        @click="$emit('back')"
      >
        <i class="fa-solid fa-chevron-left text-sm"></i>
      </button>
      <h2 class="text-gray-700 font-bold text-lg cursor-default">{{ category }} 상세 내역</h2>
    </div>

    <div class="flex-1 overflow-y-scroll flex flex-col gap-3 pr-1 custom-scrollbar">
      <p
        v-if="data.length === 0"
        class="text-center text-sm text-gray-400 mt-5"
      >
        내역이 없습니다.
      </p>

      <div
        v-for="tx in sortedData"
        :key="tx.id"
        class="group min-h-[60px] flex items-center justify-between p-3 rounded-xl bg-white/60 shadow-sm border border-white/50 cursor-pointer"
      >
        <div class="flex flex-col gap-1 group-hover:hidden">
          <span class="text-[10px] font-bold text-[#a39b8f]">
            {{ formatTime(tx.date) }}
          </span>
          <span
            class="block text-sm font-bold text-gray-700 w-30 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {{ tx.memo || '내용 없음' }}
          </span>
        </div>

        <span
          class="block font-extrabold text-[15px] w-30 whitespace-nowrap overflow-hidden text-ellipsis text-right group-hover:w-full group-hover:text-center"
          :class="tx.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]'"
        >
          {{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount.toLocaleString() }}원
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

defineEmits(['back']);

// 최신 날짜순으로 정렬
const sortedData = computed(() => {
  return [...props.data].sort((a, b) => new Date(b.date) - new Date(a.date));
});

// 날짜 포맷 (예: "3월 2일 09:05")
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}월 ${day}일 ${hours}:${minutes}`;
};
</script>

<style scoped>
/* 예쁜 스크롤바 디자인 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d9d5ce;
  border-radius: 10px;
}
</style>
