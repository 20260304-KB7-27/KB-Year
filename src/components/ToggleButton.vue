<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  />
  <div class="fixed right-4 bottom-4 z-50">
    <TradePostBtn />
  </div>

  <div
    class="group fixed right-4 bottom-20 z-50 flex items-center justify-center h-12 w-12 hover:h-40 hover:w-40 bg-gradient-to-r from-[#fcaf17] to-[#fdb913] text-white rounded-2xl transition-all duration-300 ease-in-out shadow-lg"
  >
    <div
      class="absolute transition-opacity duration-300 opacity-100 group-hover:opacity-0 flex items-center justify-center pointer-events-none"
    >
      <i class="fa fa-navicon text-lg"></i>
    </div>

    <div
      class="absolute inset-0 flex flex-col justify-center gap-3 p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none group-hover:pointer-events-auto"
    >
      <div class="relative w-32">
        <button
          class="w-full bg-white/90 text-slate-700 text-sm border-none rounded-xl px-4 py-2.5 flex justify-between items-center transition duration-300 outline-none shadow-sm focus:ring-2 focus:ring-white/50 cursor-pointer font-semibold"
          @click="isSelectOpen = !isSelectOpen"
          @blur="setTimeout(() => (isSelectOpen = false), 150)"
        >
          {{ selectedLabel }}

          <svg
            class="w-4 h-4 text-slate-500 transition-transform duration-200"
            :class="{ 'rotate-180': isSelectOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        <transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="transform opacity-0 translate-y-2"
          enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 translate-y-2"
        >
          <ul
            v-show="isSelectOpen"
            class="absolute bottom-full mb-2 z-50 w-full bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 py-1.5 overflow-hidden"
          >
            <li
              v-for="option in selectOptions"
              :key="option.value"
              class="px-4 py-2 text-sm cursor-pointer transition-colors duration-150 font-semibold"
              :class="
                selectedValue === option.value
                  ? 'bg-slate-100 text-[#645b4c]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              "
              @click="handleSelect(option.value)"
            >
              {{ option.label }}
            </li>
          </ul>
        </transition>
      </div>

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
import { computed, ref } from 'vue';
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

const isSelectOpen = ref(false);
const selectedValue = ref('month');

const selectOptions = [
  { label: '월간', value: 'month' },
  { label: '주간', value: 'week' },
  { label: '일간', value: 'day' },
];

// 현재 선택된 라벨(텍스트) 계산
const selectedLabel = computed(() => {
  return selectOptions.find((opt) => opt.value === selectedValue.value)?.label || '월간';
});

// 옵션 클릭 시 실행되는 함수
const handleSelect = (value) => {
  selectedValue.value = value;
  isSelectOpen.value = false; // 메뉴 닫기
  emits('duration', value); // 부모로 데이터 전송 (기존과 동일)
};
</script>

<style scoped></style>
