<template>
  <div class="relative w-full">
    <button
      type="button"
      class="w-full bg-white/90 text-slate-700 text-sm border-none rounded-xl px-3 py-2.5 flex justify-between items-center transition duration-300 outline-none shadow-sm focus:ring-2 focus:ring-[#fcaf17]/40 cursor-pointer font-semibold"
      @click="isOpen = !isOpen"
      @blur="closeDropdown"
    >
      {{ selectedLabel }}
      <svg
        class="w-4 h-4 text-slate-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
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
      enter-from-class="transform opacity-0 -translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2"
    >
      <ul
        v-show="isOpen"
        class="absolute z-50 w-full mt-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 py-1.5 overflow-y-auto max-h-[200px]"
      >
        <li
          v-for="option in options"
          :key="option.value"
          class="px-4 py-2 text-sm cursor-pointer transition-colors duration-150 font-semibold"
          :class="
            modelValue === option.value
              ? 'bg-slate-100 text-[#645b4c]'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          "
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 데이터
const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

// 현재 선택된 라벨 찾기
const selectedLabel = computed(() => {
  // console.log(props.options, props.modelValue);
  const selected = props.options.find((opt) => opt.value === props.modelValue);
  return selected ? selected.label : '선택해주세요';
});

// 옵션 선택 시
const selectOption = (value) => {
  emit('update:modelValue', value); // 부모의 데이터 업데이트
  isOpen.value = false;
};

// blur 처리 (클릭 이벤트가 씹히지 않도록 약간의 지연)
const closeDropdown = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 150);
};
</script>
