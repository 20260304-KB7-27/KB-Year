<script setup>
import { computed, ref, onMounted, watch } from 'vue';

// 💡 data 프롭을 incomeData와 expenseData로 분리했습니다.
const props = defineProps({
  title: { type: String, default: '수입 및 지출 분석' },
  incomeData: { type: Array, required: true },
  expenseData: { type: Array, required: true },
});

const hoveredItem = ref(null);
const isMounted = ref(false);
const chartKey = ref(0);

// 애니메이션 강제 재시작
const triggerAnimation = () => {
  isMounted.value = false;
  chartKey.value += 1;

  setTimeout(() => {
    isMounted.value = true;
  }, 50);
};

onMounted(() => {
  triggerAnimation();
});

// 💡 두 데이터 중 하나라도 변경되면 애니메이션 재시작
watch(
  () => [props.incomeData, props.expenseData],
  () => {
    triggerAnimation();
  },
  { deep: true }
);

// 💡 두 개의 고리를 그리기 위해 반지름(radius)을 2개로 나눕니다.
const radiusOuter = 50; // 바깥쪽 (지출)
const circumferenceOuter = 2 * Math.PI * radiusOuter;

const radiusInner = 40; // 안쪽 (수입)
const circumferenceInner = 2 * Math.PI * radiusInner;

// 💡 파라미터에 radius를 추가로 받습니다.
const calculateSegments = (data, circumference, radius) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return [];

  const totalDuration = 500;
  let currentOffset = 0;
  let cumulativeDelay = 0;

  return data.map((item) => {
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
      circumference,
      radius, // 💡 추가: 템플릿의 호버 오버레이에서 사용하기 위함
    };
  });
};

// 지출 조각 (바깥) - 세 번째 인자로 radiusOuter 추가
const expenseSegments = computed(() =>
  calculateSegments(props.expenseData, circumferenceOuter, radiusOuter)
);
// 수입 조각 (안쪽) - 세 번째 인자로 radiusInner 추가
const incomeSegments = computed(() =>
  calculateSegments(props.incomeData, circumferenceInner, radiusInner)
);

// 기본 화면에 띄워줄 총합 계산
const totalExpense = computed(() => props.expenseData.reduce((sum, item) => sum + item.value, 0));
const totalIncome = computed(() => props.incomeData.reduce((sum, item) => sum + item.value, 0));
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
          v-for="(segment, index) in expenseSegments"
          :key="'exp-' + index"
          cx="60"
          cy="60"
          :r="radiusOuter"
          fill="none"
          :stroke="segment.color"
          stroke-width="10"
          stroke-linecap="round"
          class="cursor-pointer"
          :style="{
            strokeDasharray: isMounted ? segment.strokeArray : `0 ${segment.circumference}`,
            strokeDashoffset: segment.strokeDashoffset,
            opacity: isMounted ? 1 : 0,
            transition: `stroke-dasharray ${segment.duration}ms linear ${segment.delay}ms, opacity 0ms linear ${segment.delay}ms`,
          }"
          @mouseover="hoveredItem = segment"
        />

        <circle
          v-for="(segment, index) in incomeSegments"
          :key="'inc-' + index"
          cx="60"
          cy="60"
          :r="radiusInner"
          fill="none"
          :stroke="segment.color"
          stroke-width="10"
          stroke-linecap="round"
          class="cursor-pointer"
          :style="{
            strokeDasharray: isMounted ? segment.strokeArray : `0 ${segment.circumference}`,
            strokeDashoffset: segment.strokeDashoffset,
            opacity: isMounted ? 1 : 0,
            transition: `stroke-dasharray ${segment.duration}ms linear ${segment.delay}ms, opacity 0ms linear ${segment.delay}ms`,
          }"
          @mouseover="hoveredItem = segment"
        />

        <circle
          v-if="hoveredItem"
          cx="60"
          cy="60"
          :r="hoveredItem.radius"
          fill="none"
          :stroke="hoveredItem.color"
          stroke-width="14"
          stroke-linecap="round"
          class="cursor-pointer transition-all duration-200 ease-out"
          :style="{
            strokeDasharray: hoveredItem.strokeArray,
            strokeDashoffset: hoveredItem.strokeDashoffset,
          }"
          @mouseleave="hoveredItem = null"
        />
      </svg>

      <div
        class="absolute flex flex-col items-center justify-center z-20 w-32 h-32 rounded-full pointer-events-none"
      >
        <template v-if="hoveredItem">
          <p class="text-sm font-bold text-[#645b4c] text-center whitespace-normal">
            {{ hoveredItem.type }}
          </p>
          <p class="text-lg font-extrabold text-[#645b4c] tabular-nums leading-tight">
            {{ hoveredItem.t }} {{ hoveredItem.value.toLocaleString()
            }}<span class="text-sm">원</span>
          </p>
        </template>
        <template v-else>
          <div class="flex flex-col items-center gap-1">
            <p class="text-xs font-bold text-[#10B981]">
              수입: +{{ totalIncome.toLocaleString() }}
            </p>
            <p class="text-xs font-bold text-[#EF4444]">
              지출: -{{ totalExpense.toLocaleString() }}
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
