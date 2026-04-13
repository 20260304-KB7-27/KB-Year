<template>
  <div
    v-if="transactions.length > 0"
    class="mb-10"
  >
    <h1 class="font-bold text-xl text-yellow-600">
      {{ formatDateTitle(currentSelectedDate) }}
    </h1>
  </div>

  <div
    class="w-full rounded-2xl px-4 py-3 h-full cursor-pointer"
    @click="handleTradeList()"
  >
    <div
      ref="scrollContainer"
      class="timeline-scroll"
      :class="{ 'max-h-[260px] overflow-y-auto': transactions.length >= MAX_SHOW_LIMIT }"
      @scroll="updateFocus"
    >
      <div
        v-if="transactions.length >= MAX_SHOW_LIMIT"
        :style="{ height: `${sidePadding}px` }"
      />

      <div
        v-for="(trade, index) in transactions"
        :key="trade.id"
        :ref="(el) => setItemRef(el, index)"
        class="grid grid-cols-[52px_16px_1fr] gap-x-3 transition-all duration-200"
        :style="getItemStyle(index)"
      >
        <div class="pt-0.5 text-sm font-medium text-gray-700">
          {{ formatTime(trade.date) }}
        </div>

        <div class="relative flex justify-center">
          <span
            class="mt-1 h-2.5 w-2.5 rounded-full"
            :class="trade.type === 'income' ? 'bg-green-400' : 'bg-red-400'"
          />
          <span
            v-if="index !== transactions.length - 1"
            class="absolute top-4 w-px bg-gray-200"
            style="height: calc(100% + 8px)"
          />
        </div>

        <div :class="index === transactions.length - 1 ? 'pb-0' : 'pb-6'">
          <div class="flex flex-row">
            <p class="max-w-25 truncate text-sm leading-5 text-gray-700 font-bold">
              {{ trade.amount.toLocaleString() }}
            </p>
            <p class="text-sm leading-5 text-gray-700 font-bold">원</p>
          </div>
          <p class="text-xs text-gray-500 max-w-25 truncate">
            {{ trade.memo }}
          </p>
        </div>
      </div>

      <div
        v-if="transactions.length >= MAX_SHOW_LIMIT"
        :style="{ height: `${sidePadding}px` }"
      />
    </div>

    <div
      v-if="transactions.length === 0"
      class="text-center py-10 text-gray-400"
    >
      해당 기간의 내역이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { formatTime, formatDate as formatDateTitle } from '@/utils/date.js';
import { useTimelineTransactions } from '@/composables/useTimelineTransactions.js';
import { useDurationStore } from '@/stores/duration';

const MAX_SHOW_LIMIT = 5;

const router = useRouter();
const durationStore = useDurationStore();

const { filteredTrans, date: currentSelectedDate } = storeToRefs(durationStore);

const scrollContainer = ref(null);
const itemRefs = ref([]);
const focusedIndex = ref(null);
const sidePadding = ref(0);

const { transactions } = useTimelineTransactions(filteredTrans);

const setItemRef = (el, index) => {
  if (el) itemRefs.value[index] = el;
};

// 부모에게 보낼 이벤트를 정의합니다.
const emit = defineEmits(['start-hide']);

const handleTradeList = () => {
  // 1. 부모(Main.vue)에게 카드를 숨기라는 이벤트를 보냅니다.
  emit('start-hide');

  // 2. 애니메이션 진행 시간(400ms)만큼 기다린 후에 라우팅합니다.
  setTimeout(() => {
    // 기존에 있던 라우팅 코드를 이곳에 넣습니다.
    router.push('/tradelist');
  }, 400);
};

const setScrollPadding = async () => {
  await nextTick();
  const container = scrollContainer.value;
  const firstItem = itemRefs.value[0];
  if (!container || !firstItem || transactions.value.length < MAX_SHOW_LIMIT) {
    sidePadding.value = 0;
    return;
  }
  sidePadding.value = container.clientHeight / 2 - firstItem.clientHeight / 2;
};

const scrollToIndex = async (index) => {
  await nextTick();
  const container = scrollContainer.value;
  const target = itemRefs.value[index];
  if (!container || !target) return;
  const containerHeight = container.clientHeight;
  const targetTop = target.offsetTop;
  const targetHeight = target.clientHeight;
  container.scrollTop = targetTop - containerHeight / 2 + targetHeight / 2;
};

const updateFocus = () => {
  const container = scrollContainer.value;
  if (!container || itemRefs.value.length === 0) return;
  const containerRect = container.getBoundingClientRect();
  const containerCenter = containerRect.top + containerRect.height / 2;

  let closestIndex = 0;
  let minDistance = Infinity;

  itemRefs.value.forEach((item, index) => {
    if (!item) return;
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(containerCenter - itemCenter);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });
  focusedIndex.value = closestIndex;
};

const getItemStyle = (index) => {
  if (transactions.value.length < MAX_SHOW_LIMIT) return { opacity: 1, transform: 'scale(1)' };
  const distance = Math.abs(index - focusedIndex.value);
  if (distance === 0) return { opacity: 1, transform: 'scale(1)' };
  if (distance === 1) return { opacity: 0.72, transform: 'scale(0.985)' };
  if (distance === 2) return { opacity: 0.5, transform: 'scale(0.975)' };
  return { opacity: 0.28, transform: 'scale(0.965)' };
};

onMounted(async () => {
  await setScrollPadding();
  if (transactions.value.length >= MAX_SHOW_LIMIT) {
    await scrollToIndex(0);
  }
  updateFocus();
});

watch(
  () => transactions.value,
  async (newTransactions) => {
    itemRefs.value = [];
    await nextTick();

    await setScrollPadding();

    if (newTransactions.length > 0) {
      await scrollToIndex(0);
    }

    updateFocus();
  },
  { deep: true, immediate: true }
);
</script>
<style scoped>
.timeline-scroll {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 transparent;
}

.timeline-scroll::-webkit-scrollbar {
  width: 12px;
}

.timeline-scroll::-webkit-scrollbar-track {
  background: #e0e5ec;
  border-radius: 10px;
  box-shadow:
    inset 2px 2px 5px #babecc,
    inset -5px -5px 10px #ffffff;
  margin: 5px;
}

.timeline-scroll::-webkit-scrollbar-thumb {
  background: #e0e5ec;
  border-radius: 10px;
  box-shadow:
    2px 2px 5px #babecc,
    -2px -2px 5px #ffffff;
  border: 3px solid transparent;
  background-clip: content-box;
}

.timeline-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #e0e5ec;
  box-shadow:
    inset 2px 2px 5px #babecc,
    inset -2px -2px 5px #ffffff;
}
</style>
