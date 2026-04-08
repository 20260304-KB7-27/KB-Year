<script setup>
import { computed, ref, onMounted } from 'vue';

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
const isMounted = ref(false);

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true;
  }, 50);
});

const radius = 50;
const circumference = 2 * Math.PI * radius;

const chartSegments = computed(() => {
  const total = props.data.reduce((sum, item) => sum + item.value, 0);

  // 전체 차트가 그려지는 총 시간 (예: 1200ms = 1.2초)
  const totalDuration = 1200;

  let currentOffset = 0;
  let cumulativeDelay = 0; // 누적 딜레이 시간

  return props.data.map((item) => {
    const proportion = item.value / total; // 전체 중 차지하는 비율 (0 ~ 1)
    const segmentLength = proportion * circumference;

    // 비율에 맞춰 이 조각이 그려질 시간(duration) 계산
    const duration = proportion * totalDuration;
    // 이 조각이 시작될 딜레이(이전 조각들의 duration 합)
    const delay = cumulativeDelay;

    const strokeArray = `${segmentLength} ${circumference - segmentLength}`;
    const strokeDashoffset = circumference - currentOffset;

    // 다음 조각을 위해 오프셋과 누적 딜레이 업데이트
    currentOffset += segmentLength;
    cumulativeDelay += duration;

    return {
      ...item,
      strokeArray,
      strokeDashoffset,
      duration,
      delay,
    };
  });
});
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
          :style="{
            strokeDasharray: isMounted ? segment.strokeArray : `0 ${circumference}`,
            strokeDashoffset: segment.strokeDashoffset,
            opacity: isMounted ? 1 : 0,
            /* 핵심: stroke-dasharray는 duration동안 linear하게 그려지고, 
               opacity는 delay가 끝나는 순간 0ms만에 즉시(1로) 나타나도록 설정 */
            transition: `stroke-dasharray ${segment.duration}ms linear ${segment.delay}ms, opacity 0ms linear ${segment.delay}ms`,
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

<style scoped>
/* 커스텀 스타일 영역 */
</style>
