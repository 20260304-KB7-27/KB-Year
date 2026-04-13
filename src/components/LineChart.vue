<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useDurationStore } from '@/stores/duration'; // durationStore 추가

const transactionsStore = useTransactionsStore();
const durationStore = useDurationStore(); // 날짜 변화를 감지하기 위해 추가

const scrollContainer = ref(null);
let scrollInterval = null;

const zoomLevel = ref(100);
const baseWidth = 450;

const changeZoom = (delta) => {
  const newZoom = zoomLevel.value + delta;
  if (newZoom >= 50 && newZoom <= 150) {
    zoomLevel.value = newZoom;
  }
};

const COLORS = { income: '#4ade80', expense: '#f87171' };

// --- 자동 스크롤 로직 ---
const startAutoScroll = (direction) => {
  stopAutoScroll();
  scrollInterval = setInterval(() => {
    if (scrollContainer.value) {
      const speed = direction === 'left' ? -10 : 10;
      scrollContainer.value.scrollLeft += speed;
    }
  }, 16);
};

const stopAutoScroll = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
};

const scrollToRight = async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft = scrollContainer.value.scrollWidth;
  }
};

// --- 데이터 연동 로직 ---

const trendData = computed(() => {
  // 1. 기준점 설정
  const referenceDate = durationStore.date
    ? new Date(durationStore.date.year, durationStore.date.month - 1, durationStore.date.day || 1)
    : new Date();

  const points = [];
  const type = durationStore.duration; // 'day', 'week', 'month'

  // 2. 기간 타입에 따른 데이터 포인트(라벨/기준날짜) 생성
  if (type === 'day') {
    // 최근 7일간 (오늘 포함 과거 6일)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(referenceDate);
      d.setDate(referenceDate.getDate() - i);
      points.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        day: d.getDate(),
        label: `${d.getDate()}일`,
      });
    }
  } else if (type === 'week') {
    // 최근 8주간 (이번 주 포함 과거 7주)
    for (let i = 7; i >= 0; i--) {
      const d = new Date(referenceDate);
      d.setDate(referenceDate.getDate() - i * 7);
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay()); // 해당 주의 일요일로 고정
      points.push({
        year: startOfWeek.getFullYear(),
        month: startOfWeek.getMonth(),
        day: startOfWeek.getDate(),
        label: `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()}주`,
      });
    }
  } else {
    // 최근 12개월 (이번 달 포함 과거 11개월)
    for (let i = 11; i >= 0; i--) {
      const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
      points.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: `${d.getMonth() + 1}월`,
      });
    }
  }

  // 3. 필터링 및 합산 로직
  return points.map((p) => {
    const matchedTrans = (transactionsStore.transactions || []).filter((t) => {
      const tDate = new Date(t.date);
      if (type === 'day') {
        return (
          tDate.getFullYear() === p.year &&
          tDate.getMonth() === p.month &&
          tDate.getDate() === p.day
        );
      } else if (type === 'week') {
        const weekStart = new Date(p.year, p.month, p.day);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return tDate >= weekStart && tDate <= weekEnd;
      } else {
        return tDate.getFullYear() === p.year && tDate.getMonth() === p.month;
      }
    });

    const income = matchedTrans
      .filter((t) => t.type?.toLowerCase() === 'income')
      .reduce((a, c) => a + Number(c.amount), 0);

    const expense = matchedTrans
      .filter((t) => t.type?.toLowerCase() === 'expense')
      .reduce((a, c) => a + Number(c.amount), 0);

    return {
      label: p.label,
      income: income || 0,
      expense: expense || 0,
    };
  });
});

// 4. 차트 너비 유동적 관리
const dynamicBaseWidth = computed(() => {
  const count = trendData.value.length;
  // 포인트가 적은 '일별'은 촘촘하게, 많은 '월별'은 넉넉하게 너비 확보
  const minWidth = 450;
  const calculatedWidth = count * (durationStore.duration === 'month' ? 45 : 60);
  return Math.max(minWidth, calculatedWidth);
});

const dynamicViewboxWidth = computed(() => (dynamicBaseWidth.value * zoomLevel.value) / 100);
// 4. 기간 변경 시 자동 스크롤
watch(
  () => durationStore.duration,
  async () => {
    await nextTick();
    scrollToRight();
  }
);

// 차트 좌표 계산
const viewboxHeight = 200;
const padding = { x: 40, y: 25 };

const chartData = computed(() => {
  const data = trendData.value;
  const allValues = data.flatMap((d) => [d.income, d.expense]);
  const maxV = Math.max(...allValues, 0);
  const effectiveMaxY = maxV === 0 ? 1000 : maxV * 1.2;

  const usableW = dynamicViewboxWidth.value - padding.x * 2;
  const usableH = viewboxHeight - padding.y * 2;

  const getPoints = (key) =>
    data.map((d, i) => ({
      x: padding.x + (i / (data.length - 1)) * usableW,
      y: viewboxHeight - padding.y - (d[key] / effectiveMaxY) * usableH,
    }));

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round((effectiveMaxY * ratio) / 100) * 100,
    y: viewboxHeight - padding.y - ratio * usableH,
  }));

  return {
    incomePoints: getPoints('income'),
    expensePoints: getPoints('expense'),
    yTicks,
  };
});

const getPath = (points) => {
  if (points.length < 2) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
};

watch(() => transactionsStore.transactions.length, scrollToRight);
watch(zoomLevel, scrollToRight);
watch(() => durationStore.date, scrollToRight);

onMounted(() => {
  scrollToRight();
});
</script>

<template>
  <div class="w-full">
    <h2 class="text-gray-600 font-bold text-lg cursor-default mb-2">수입/지출 추이</h2>

    <div class="flex justify-between items-center mb-1 px-1">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-lg no-drag">
          <button
            class="w-7 h-7 flex items-center justify-center rounded-lg neo-interactive text-[#718096] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="zoomLevel <= 50"
            @click="changeZoom(-25)"
          >
            <span class="mb-0.5">−</span>
          </button>
          <div class="px-1 py-1 rounded-md w-10 flex-shrink-0 flex justify-center items-center">
            <span class="text-[10px] font-black text-[#8a867e] leading-none select-none">
              {{ zoomLevel }}%
            </span>
          </div>
          <button
            class="w-7 h-7 flex items-center justify-center rounded-lg neo-interactive text-[#718096] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="zoomLevel >= 150"
            @click="changeZoom(25)"
          >
            <span class="mb-0.5">+</span>
          </button>
        </div>
      </div>

      <div class="flex gap-4 text-xs font-semibold">
        <div class="flex items-center gap-1.5">
          <span
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: COLORS.income }"
          ></span>
          <span class="text-gray-500">수입</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: COLORS.expense }"
          ></span>
          <span class="text-gray-500">지출</span>
        </div>
      </div>
    </div>

    <div class="relative group">
      <div
        class="absolute left-[40px] top-0 bottom-0 w-10 z-20 flex items-center pl-2 bg-gradient-to-r from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity no-drag pointer-events-none group-hover:pointer-events-auto"
        @mouseenter="startAutoScroll('left')"
        @mouseleave="stopAutoScroll"
      >
        <span class="text-gray-400 font-bold cursor-pointer">‹</span>
      </div>
      <div
        class="absolute right-0 top-0 bottom-0 w-10 z-20 flex items-center justify-end pr-2 bg-gradient-to-l from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity no-drag pointer-events-none group-hover:pointer-events-auto"
        @mouseenter="startAutoScroll('right')"
        @mouseleave="stopAutoScroll"
      >
        <span class="text-gray-400 font-bold cursor-pointer">›</span>
      </div>

      <div class="flex items-start">
        <div class="w-[40px] shrink-0 h-52">
          <svg
            :viewBox="`0 0 40 ${viewboxHeight}`"
            class="w-full h-full overflow-visible"
          >
            <g
              v-for="tick in chartData.yTicks"
              :key="tick.value"
            >
              <text
                x="35"
                :y="tick.y + 4"
                text-anchor="end"
                fill="#9ca3af"
                font-size="10"
                font-weight="bold"
              >
                {{ tick.value.toLocaleString() }}
              </text>
            </g>
          </svg>
        </div>

        <div
          ref="scrollContainer"
          class="scroll-area overflow-x-auto scrollbar-hide select-none flex-1"
        >
          <div
            :style="{ minWidth: `${dynamicViewboxWidth}px`, width: '100%' }"
            class="relative pb-3 transition-[min-width] duration-300 ease-in-out"
          >
            <div class="h-52">
              <svg
                :viewBox="`0 0 ${dynamicViewboxWidth} ${viewboxHeight}`"
                class="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <g
                  v-for="tick in chartData.yTicks"
                  :key="'grid-' + tick.value"
                >
                  <line
                    x1="0"
                    :y1="tick.y"
                    :x2="dynamicViewboxWidth"
                    :y2="tick.y"
                    stroke="#e5e7eb"
                    stroke-width="1"
                    stroke-dasharray="4 4"
                  />
                </g>

                <path
                  :d="getPath(chartData.incomePoints)"
                  fill="none"
                  :stroke="COLORS.income"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  :d="getPath(chartData.expensePoints)"
                  fill="none"
                  :stroke="COLORS.expense"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <circle
                  v-for="(p, i) in chartData.incomePoints"
                  :key="'in-' + i"
                  :cx="p.x"
                  :cy="p.y"
                  r="4"
                  :fill="COLORS.income"
                />
                <circle
                  v-for="(p, i) in chartData.expensePoints"
                  :key="'ex-' + i"
                  :cx="p.x"
                  :cy="p.y"
                  r="4"
                  :fill="COLORS.expense"
                />
              </svg>
            </div>

            <div class="flex justify-between px-[40px] mt-0">
              <span
                v-for="d in trendData"
                :key="d.label"
                class="text-[11px] text-gray-400 font-bold whitespace-nowrap w-0 flex justify-center overflow-visible"
              >
                {{ d.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
