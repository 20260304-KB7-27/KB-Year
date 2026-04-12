<script setup>
import draggable from 'vuedraggable';

import { markRaw, ref, computed, onMounted, onBeforeUnmount } from 'vue';

import { Calendar } from '@/components/ui/calendar';
import Card from '@/components/Card.vue';
import UserCard from '@/components/UserCard.vue';
import LineChart from '@/components/LineChart.vue';
import DashboardContainer from '@/components/CardsContainer.vue';
import { useUserStore } from '@/stores/user.js';
import ToggleButton from '@/components/ToggleButton.vue';
import BarChart from '@/components/BarChart.vue';
import { useBarChartStore } from '@/stores/barChart';
import TimeLine from '@/components/tradeList/TimeLine.vue';

import { useDurationStore } from '@/stores/duration';
import { useCardFadeAnimation } from '@/composables/useCardFadeAnimation';
import PwaInstallToast from '@/components/PwaInstallToast.vue';
import { shouldShowPwaInstallToast } from '@/utils/pwaInstallToastStorage.js';
import { usePwaInstall } from '@/composables/usePwaInstall';

import { toast } from 'vue-sonner';
// 상태 관리
const userStore = useUserStore(); // 유저 정보 관리
const user = computed(() => userStore.user);
const durationStore = useDurationStore(); // 수입/지출 내역 기간 관리
const barChartStore = useBarChartStore(); // barChart 데이터 관리

const cardOn = ref(false);
const isFirstLoad = ref(true);

const { handleBeforeInstallPrompt } = usePwaInstall();

const showInstallToast = () => {
  if (!shouldShowPwaInstallToast()) return;

  toast.custom(markRaw(PwaInstallToast));
};

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  showInstallToast();
  setTimeout(() => {
    cardOn.value = true;
    isFirstLoad.value = false;
  }, 200);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

const movePage = async (e) => {};

const date = computed({
  get: () => durationStore.date,
  set: (val) => {
    if (!val) return;
    durationStore.date = val;
  },
});

const duration = computed(() => {
  if (durationStore.duration == 'month') return '이번 달 핵심 요약';
  else if (durationStore.duration == 'day') return '오늘의 핵심 요약';
  else return '최근 1주 핵심 요약';
});

// 날짜별 수입/지출 횟수
const dateTransactionNumber = computed(() => durationStore.dateTransactionNumber);
const barIncome = computed(() => barChartStore.barIncome);
const barExpense = computed(() => barChartStore.barExpense);

const initialCards = [
  { id: 1, type: 'user' },
  { id: 2, type: 'activity' },
  { id: 3, type: 'dashboard' },
  { id: 4, type: 'calendar' },
  // { id: 5, type: 'pie' },
  { id: 5, type: 'bar' },
  { id: 6, type: 'line' },
];

const cards = ref([...initialCards]);

const resetLayout = () => {
  cards.value = [...initialCards];
};

const onDateClick = (selectedDate) => {
  durationStore.handleDateChange(selectedDate);
  durationStore.handleDurationChange('day');
};

const hideCards = () => {
  cardOn.value = false; // 카드를 투명하게 만듦
};

const { cardEnterLeaveClass } = useCardFadeAnimation(cardOn, isFirstLoad, {
  directions: {
    user: 'top',
    activity: 'top',
    dashboard: 'top',
    calendar: 'bottom',
    bar: 'bottom',
    line: 'bottom',
  },
  defaultDirection: 'bottom',
});
</script>

<template>
  <div class="bg-[#f4f2ee] min-h-screen flex items-center justify-center px-8 py-10">
    <div class="w-full lg:max-w-5xl md:max-w-2xl">
      <!-- 초기화 버튼 -->
      <!-- <div class="fixed right-5 bottom-1 flex justify-end mb-4 z-50">
        <button
          class="px-4 py-2 bg-gray-800 text-white rounded-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 cursor-pointer"
          @click="resetLayout"
        >
          Reset
        </button>
      </div> -->
      <ToggleButton
        @reset="resetLayout"
        @duration="durationStore.handleDurationChange"
      ></ToggleButton>

      <!-- 드래그 영역 -->
      <draggable
        v-model="cards"
        item-key="id"
        animation="250"
        :delay="200"
        :delay-on-touch-only="true"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
      >
        <template #item="{ element }">
          <Card
            class="opacity-0"
            :class="cardEnterLeaveClass(element.type)"
          >
            <UserCard
              v-if="element.type === 'user'"
              :user="user"
            />

            <TimeLine
              v-else-if="element.type === 'activity'"
              @start-hide="hideCards"
            />

            <DashboardContainer v-else-if="element.type === 'dashboard'" />

            <Calendar
              v-else-if="element.type === 'calendar'"
              v-model="date"
              :data="dateTransactionNumber"
              class="rounded-2xl p-5 h-full neo-inset content-center"
              @update:model-value="onDateClick"
            />

            <BarChart
              v-else-if="element.type === 'bar'"
              :title-data="duration"
              :income-data="barIncome"
              :expense-data="barExpense"
            />

            <LineChart v-else-if="element.type === 'line'" />
          </Card>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scope></style>
