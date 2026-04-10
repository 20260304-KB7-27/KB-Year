<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  />
  <div class="fixed right-4 bottom-4 z-50">
    <TradePostBtn />
  </div>

  <div
    v-if="toggleActive"
    class="fixed inset-0 z-40"
    @click="toggleActive = false"
    @touchstart="toggleActive = false"
  ></div>

  <div
    class="fixed right-4 bottom-20 z-50 flex items-center justify-center bg-linear-to-r from-[#fcaf17] to-[#fdb913] text-white rounded-2xl transition-all duration-300 ease-in-out shadow-lg"
    :class="toggleActive ? 'h-40 w-40' : 'h-12 w-12'"
    @mouseenter="toggleActive = true"
    @mouseleave="toggleActive = false"
  >
    <div
      class="absolute transition-opacity duration-300 flex items-center justify-center w-full h-full cursor-pointer"
      :class="toggleActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'"
      @click="toggleActive = true"
    >
      <i class="fa fa-navicon text-lg"></i>
    </div>

    <div
      class="absolute inset-0 flex flex-col justify-center gap-3 p-4 transition-opacity duration-300 whitespace-nowrap"
      :class="toggleActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
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

const selectedValue = ref('month');

const selectOptions = [
  { label: '월간', value: 'month' },
  { label: '주간', value: 'week' },
  { label: '일간', value: 'day' },
];

const toggleActive = ref(false);
</script>

<style scoped>
.toggle-active {
  opacity: 100;
}

.toggle-inactive {
  opacity: 0;
}
</style>
