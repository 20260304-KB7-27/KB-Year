<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Progress',
  },
  value: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    default: 100,
  },
  data: {
    type: Array,
    required: true,
  },
  unit: {
    type: String,
    default: '%',
  },
});

const hoveredItem = ref(null);

const percentage = computed(() => {
  if (props.total === 0) return 0;
  return Math.min(100, Math.round((props.value / props.total) * 100));
});

// 컴퓨티드 속성 내 계산 예시 (가사 코드)
const chartSegments = computed(() => {
  const total = props.data.reduce((sum, item) => sum + item.value, 0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return props.data.map((item) => {
    const segmentValue = item.value;
    const segmentLength = (segmentValue / total) * circumference;
    const strokeArray = `${segmentLength} ${circumference - segmentLength}`;
    const strokeDashoffset = circumference - currentOffset;

    currentOffset += segmentLength;

    return {
      ...item,
      strokeArray,
      strokeDashoffset,
    };
  });
});

const radius = 50;
const circumference = 2 * Math.PI * radius;
</script>
<template>
  <div class="flex flex-col items-center">
    <h2 class="text-[#645b4c] font-bold text-xl mb-6 self-start ml-2">
      {{ title }}
    </h2>

    <div class="relative w-56 h-56 flex items-center justify-center mb-6">
      <div
        class="absolute inset-0 rounded-full bg-[#f4f2ee] shadow-[inset_10px_10px_20px_#d9d5ce,inset_-10px_-10px_20px_#ffffff]"
      ></div>

      <svg
        viewBox="0 0 120 120"
        class="w-full h-full -rotate-90 transform relative z-10"
      >
        <circle
          v-for="(segment, index) in chartSegments"
          :key="index"
          cx="60"
          cy="60"
          :r="radius"
          fill="none"
          :stroke="segment.color"
          stroke-width="12"
          stroke-linecap="round"
          class="transition-all duration-300 ease-out"
          :style="{
            strokeDasharray: segment.strokeArray,
            strokeDashoffset: segment.strokeDashoffset,
          }"
          @mouseover="hoveredItem = segment"
          @mouseleave="hoveredItem = null"
        />
      </svg>

      <div class="absolute flex flex-col items-center z-20">
        <template v-if="hoveredItem">
          <p class="text-xl font-bold text-[#645b4c]">{{ hoveredItem.type }}</p>
          <p class="text-2xl font-extrabold text-[#645b4c] tabular-nums">
            {{ hoveredItem.value.toLocaleString() }}<span class="text-lg">원</span>
            <!-- {{
              Math.round(
                (hoveredItem.value / chartSegments.reduce((sum, s) => sum + s.value, 0)) * 100
              )
            }} -->
            <!-- <span class="text-lg">{{ unit }}</span> -->
          </p>
        </template>
        <template v-else>
          <p class="text-xl font-bold text-[#645b4c]">Total</p>
          <p class="text-2xl font-extrabold text-[#645b4c] tabular-nums">
            {{ chartSegments.reduce((sum, s) => sum + s.value, 0).toLocaleString()
            }}<span class="text-lg">원</span>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
