<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useDurationStore } from '@/stores/duration';

const transactionsStore = useTransactionsStore();
const durationStore = useDurationStore();

const scrollContainer = ref(null);
let scrollInterval = null;

// --- [수정] 로컬 스토리지 연동 (Zoom & DisplayCount) ---

// 1. 초기값 설정: 저장된 값이 있으면 사용, 없으면 기본값(100) 사용
const savedZoom = localStorage.getItem('chart_zoom_level');
const zoomLevel = ref(savedZoom ? Number(savedZoom) : 100);

// 2. 초기값 설정: 저장된 표시 개수가 있으면 사용, 없으면 기본값(7) 사용
const savedCount = localStorage.getItem('chart_display_count');
const displayCount = ref(savedCount ? Number(savedCount) : 7);

const MIN_ZOOM = 25;
const MAX_ZOOM = 175;

// 값이 변경될 때마다 로컬 스토리지에 저장
watch(zoomLevel, (newVal) => {
  localStorage.setItem('chart_zoom_level', newVal);
});

watch(displayCount, (newVal) => {
  localStorage.setItem('chart_display_count', newVal);
});

// 기간 타입(duration)이 변경될 때의 로직은 유지하거나,
// "새로고침 시에도 유지"를 최우선으로 하려면 아래 immediate 옵션을 신중히 결정해야 합니다.
// 여기서는 처음 로드 시 스토리지 값을 존중하도록 수정했습니다.
watch(
  () => durationStore.duration,
  (newType) => {
    // 로컬 스토리지에 데이터가 없을 때만 타입별 기본값 적용
    if (!localStorage.getItem('chart_display_count')) {
      if (newType === 'day') displayCount.value = 7;
      else if (newType === 'week') displayCount.value = 8;
      else if (newType === 'month') displayCount.value = 12;
    }
  }
);

const changeZoom = (delta) => {
  const newZoom = zoomLevel.value + delta;
  if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
    zoomLevel.value = newZoom;
  }
};

// --- 이하 데이터 연동 및 스크롤 로직은 동일 ---
const COLORS = { income: '#4ade80', expense: '#f87171' };

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

const trendData = computed(() => {
  const referenceDate = durationStore.date
    ? new Date(durationStore.date.year, durationStore.date.month - 1, durationStore.date.day || 1)
    : new Date();

  const points = [];
  const type = durationStore.duration;
  const count = displayCount.value;

  if (type === 'day') {
    for (let i = count - 1; i >= 0; i--) {
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
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(referenceDate);
      d.setDate(referenceDate.getDate() - i * 7);
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      points.push({
        year: startOfWeek.getFullYear(),
        month: startOfWeek.getMonth(),
        day: startOfWeek.getDate(),
        label: `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()}주`,
      });
    }
  } else {
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
      points.push({ year: d.getFullYear(), month: d.getMonth(), label: `${d.getMonth() + 1}월` });
    }
  }

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

    return { label: p.label, income: income || 0, expense: expense || 0 };
  });
});

const dynamicBaseWidth = computed(() => {
  const count = trendData.value.length;
  const minWidth = 450;
  const calculatedWidth = count * 60;
  return Math.max(minWidth, calculatedWidth);
});

const dynamicViewboxWidth = computed(() => (dynamicBaseWidth.value * zoomLevel.value) / 100);

watch([() => durationStore.duration, displayCount, zoomLevel], async () => {
  await nextTick();
  scrollToRight();
});

watch(() => transactionsStore.transactions.length, scrollToRight);
watch(() => durationStore.date, scrollToRight);

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

  return { incomePoints: getPoints('income'), expensePoints: getPoints('expense'), yTicks };
});

const getPath = (points) => {
  if (points.length < 2) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
};

onMounted(() => {
  scrollToRight();
});

const formatYAxis = (value) => {
  if (value >= 100000000) {
    return (value / 100000000).toFixed(1).replace(/\.0$/, '') + '억';
  }
  if (value >= 10000) {
    return (value / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return value.toLocaleString();
};

const truncateValue = (value) => {
  const str = value.toLocaleString();
  return str.length > 6 ? str.substring(0, 5) + '...' : str;
};
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-end mb-2">
      <h2 class="text-gray-600 font-bold text-lg cursor-default mb-2">수입/지출 추이</h2>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter"
          >표시 개수</span
        >
        <select
          v-model="displayCount"
          class="text-[11px] font-bold bg-gray-50 border-none rounded px-2 py-1 text-gray-600 focus:ring-0 cursor-pointer"
        >
          <option :value="7">최근 7개</option>
          <option :value="14">최근 14개</option>
          <option :value="21">최근 21개</option>
          <option :value="28">최근 28개</option>
        </select>
      </div>
    </div>

    <div class="flex justify-between items-center mb-1 px-1">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-lg no-drag">
          <button
            class="w-7 h-7 flex items-center justify-center rounded-lg neo-interactive text-[#718096] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="zoomLevel <= 25"
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
            :disabled="zoomLevel >= MAX_ZOOM"
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
        class="absolute left-10 top-0 bottom-0 w-10 z-20 flex items-center pl-2 bg-gradient-to-r from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity no-drag pointer-events-none group-hover:pointer-events-auto"
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
        <div class="w-10 shrink-0 h-52">
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
                {{ truncateValue(formatYAxis(tick.value)) }}
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

            <div
              :class="displayCount <= 7 && zoomLevel <= 25 ? 'px-20' : 'px-10'"
              class="flex justify-between mt-0"
            >
              <span
                v-for="d in trendData"
                :key="d.label"
                :class="
                  parseInt(d.label.split('일')[0]) % 2 || zoomLevel >= 50 ? 'opacity-100' : 'hidden'
                "
                class="text-[0.5em] text-gray-400 font-bold whitespace-nowrap w-0 flex justify-center overflow-visible rotate-315"
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
