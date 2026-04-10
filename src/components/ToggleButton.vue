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
      <CustomSelect
        v-model="selectedValue"
        :options="selectOptions"
        @update:model-value="(val) => emits('duration', val)"
      />

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
import { computed, ref, reactive } from 'vue';
import TradePostBtn from '@/components/tradeList/TradePostBtn.vue';
import CustomSelect from './ui/custom-select/CustomSelect.vue';

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
