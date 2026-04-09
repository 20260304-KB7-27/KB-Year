<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  />
  <div class="fixed right-4 bottom-4 z-50">
    <TradePostBtn />
  </div>
  <div
    class="group fixed right-4 bottom-20 z-50 flex items-center justify-center h-12 w-12 hover:h-40 hover:w-40 bg-gradient-to-r from-[#fcaf17] to-[#fdb913] text-white rounded-2xl transition-all duration-300 ease-in-out shadow-lg overflow-hidden"
  >
    <div
      class="absolute transition-opacity duration-300 opacity-100 group-hover:opacity-0 flex items-center justify-center pointer-events-none"
    >
      <i class="fa fa-navicon text-lg"></i>
    </div>

    <div
      class="absolute inset-0 flex flex-col justify-center gap-3 p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none group-hover:pointer-events-auto"
    >
      <select
        class="w-full bg-white/90 text-slate-700 text-sm border-none rounded-xl px-3 py-2.5 transition duration-300 outline-none shadow-sm focus:ring-2 focus:ring-white/50 cursor-pointer appearance-none font-semibold"
        @change="emits('duration', $event.target.value)"
      >
        <option value="month">월간</option>
        <option value="week">주간</option>
        <option value="day">일간</option>
      </select>

      <button
        :class="BtnYellowClass"
        @click="emits('reset')"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TradePostBtn from '@/components/tradeList/TradePostBtn.vue';

// 💡 'duration' 이벤트를 추가로 선언해 줍니다.
const emits = defineEmits(['reset', 'duration']);

const BtnYellowClass = computed(() => [
  'w-full px-4 py-2.5 rounded-xl font-bold cursor-pointer transition-all',
  'bg-[#f4f2ee] text-[#645b4c]',
  'shadow-[4px_4px_8px_#d1950d,-4px_-4px_8px_#ffc921]',

  // 클릭(Active) 시 상태
  'active:scale-95 active:bg-gradient-to-r active:from-[#fcaf17] active:to-[#fdb913] active:text-white',
  'active:shadow-[inset_4px_4px_8px_#d79e10,inset_-4px_-4px_8px_#ffd416]',
]);
</script>

<style scoped></style>
