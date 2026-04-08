<template>
  <div v-if="transactions.length > 0">
    <h1 class="font-bold text-xl text-yellow-600">
      {{ formatDate(transactions[0].date) }}
    </h1>
  </div>
  <div
    class="w-full rounded-2xl px-4 py-3"
    @click="handleTradeList()"
  >
    <div
      ref="scrollContainer"
      class="timeline-scroll"
      :class="{ 'max-h-[420px] overflow-y-auto': transactions.length >= 8 }"
      @scroll="updateFocus"
    >
      <div
        v-if="transactions.length >= 8"
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
          <span class="mt-1 h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span
            v-if="index !== transactions.length - 1"
            class="absolute top-4 w-px bg-gray-200"
            style="height: calc(100% + 8px)"
          />
        </div>

        <div :class="index === transactions.length - 1 ? 'pb-0' : 'pb-6'">
          <p class="text-sm leading-5 text-gray-700">
            {{ trade.memo }}
          </p>
        </div>
      </div>

      <div
        v-if="transactions.length >= 8"
        :style="{ height: `${sidePadding}px` }"
      />
    </div>
  </div>
</template>

<script setup>
import axios from '@/utils/axios';
import { formatTime, formatDate } from '@/utils/date.js';
import { useTimelineTransactions } from '@/composables/useTimelineTransactions.js';
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const route = useRouter();

const data = ref([]);
const scrollContainer = ref(null);
const itemRefs = ref([]);
const focusedIndex = ref(null);
const sidePadding = ref(0);
const setItemRef = (el, index) => {
  if (el) itemRefs.value[index] = el;
};

const handleTradeList = () => {
  route.push('/tradeList');
};

const getTradeList = async () => {
  const response = await axios.get('/transactions');
  if (response.status === 200) {
    data.value = response.data;
  }
};

const { transactions } = useTimelineTransactions(data);

const setScrollPadding = async () => {
  await nextTick();

  const container = scrollContainer.value;
  const firstItem = itemRefs.value[0];

  if (!container || !firstItem || transactions.value.length < 8) {
    sidePadding.value = 0;
    return;
  }

  sidePadding.value = container.clientHeight / 2 - firstItem.clientHeight / 2;
};
const getDefaultIndex = () => {
  return Math.min(3, transactions.value.length);
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
  if (transactions.value.length < 8) {
    return {
      opacity: 1,
      transform: 'scale(1)',
    };
  }

  const distance = Math.abs(index - focusedIndex.value);

  if (distance === 0) {
    return {
      opacity: 1,
      transform: 'scale(1)',
    };
  }

  if (distance === 1) {
    return {
      opacity: 0.72,
      transform: 'scale(0.985)',
    };
  }

  if (distance === 2) {
    return {
      opacity: 0.5,
      transform: 'scale(0.975)',
    };
  }

  return {
    opacity: 0.28,
    transform: 'scale(0.965)',
  };
};

onMounted(async () => {
  await getTradeList();
  await setScrollPadding();

  if (transactions.value.length >= 8) {
    const defaultIndex = getDefaultIndex();
    await scrollToIndex(defaultIndex);
  }

  updateFocus();
});

watch(
  () => transactions.value.length,
  async () => {
    itemRefs.value = [];
    await setScrollPadding();

    if (transactions.value.length >= 8) {
      const defaultIndex = getDefaultIndex();
      await scrollToIndex(defaultIndex);
    }

    updateFocus();
  }
);
</script>

<style scoped>
.timeline-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.timeline-scroll::-webkit-scrollbar {
  display: none;
}
</style>
