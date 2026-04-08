<script setup>
import { computed, ref, onMounted, watch } from 'vue';

const props = defineProps({
  title: { type: String, default: 'Progress' },
  value: { type: Number, required: true },
  total: { type: Number, default: 100 },
  data: { type: Array, required: true },
  unit: { type: String, default: '%' },
});

const hoveredItem = ref(null);
const isMounted = ref(false);
const chartKey = ref(0); // 💡 SVG를 완전히 새로고침하기 위한 키 값

// 애니메이션을 강제로 재시작하는 함수
const triggerAnimation = () => {
  isMounted.value = false; // 일단 애니메이션 상태를 끔
  chartKey.value += 1; // key 값을 변경하여 SVG DOM 자체를 파괴하고 새로 생성

  // DOM이 완전히 새로 그려진 직후(50ms 후) 다시 애니메이션 시작
  setTimeout(() => {
    isMounted.value = true;
  }, 50);
};

// 화면에 처음 나타날 때
onMounted(() => {
  triggerAnimation();
});

// 부모 컴포넌트에서 넘어오는 data(pieData)가 변경될 때마다 감지
watch(
  () => props.data,
  () => {
    triggerAnimation();
  },
  { deep: true } // 배열 내부의 값이 변하는 것까지 감지
);

const radius = 50;
const circumference = 2 * Math.PI * radius;

const chartSegments = computed(() => {
  const total = props.data.reduce((sum, item) => sum + item.value, 0);
  const totalDuration = 500;
  let currentOffset = 0;
  let cumulativeDelay = 0;

  return props.data.map((item) => {
    const proportion = item.value / total;
    const segmentLength = proportion * circumference;
    const duration = proportion * totalDuration;
    const delay = cumulativeDelay;

    const strokeArray = `${segmentLength} ${circumference - segmentLength}`;
    const strokeDashoffset = circumference - currentOffset;

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
        :key="chartKey"
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
