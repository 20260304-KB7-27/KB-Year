<script setup>
import draggable from 'vuedraggable';

import { h, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { today, getLocalTimeZone } from '@internationalized/date';

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

import { toast } from 'vue-sonner';
// 상태 관리
const userStore = useUserStore(); // 유저 정보 관리
const user = computed(() => userStore.user);
const durationStore = useDurationStore(); // 수입/지출 내역 기간 관리
const barChartStore = useBarChartStore(); // barChart 데이터 관리

// pwa 설치
const deferredPrompt = ref(null);
const canInstall = ref(false);

const handleBeforeInstallPrompt = (event) => {
  event.preventDefault();
  deferredPrompt.value = event;
  canInstall.value = true;
};

const installPwa = async () => {
  if (!deferredPrompt.value) {
    toast.info('현재 브라우저에서는 앱 설치를 바로 진행할 수 없어요.', {
      description: '설치 가능 환경이 아니거나 이미 설치된 상태일 수 있습니다.',
    });
    return;
  }

  deferredPrompt.value.prompt();

  const choiceResult = await deferredPrompt.value.userChoice;

  if (choiceResult.outcome === 'accepted') {
    toast.success('앱 설치를 진행합니다.');
  } else {
    toast('앱 설치가 취소되었어요.');
  }

  deferredPrompt.value = null;
  canInstall.value = false;
};
const showInstallToast = () => {
  const toastId = toast.custom(() =>
    h(
      'div',
      {
        class:
          'flex flex-col mx-auto items-center justify-center w-[150px] sm:w-[345px] bg-white/80 rounded-2xl p-5 shadow-lg border border-gray-100',
      },
      [
        h(
          'div',
          { class: 'text-xs sm:text-sm font-medium text-slate-900 mb-2' },
          '앱으로 더 편하게 이용해보세요'
        ),
        h(
          'p',
          { class: 'text-xs sm:text-sm text-slate-800 leading-relaxed mb-4' },
          '홈 화면에 추가하면 캐비어를 빠르게 이용할 수 있어요 !'
        ),
        h('div', { class: 'flex justify-end gap-2' }, [
          h(
            'button',
            {
              class:
                'px-4 py-1 rounded-lg bg-gray-100 text-slate-700  text-xs sm:text-sm hover:bg-gray-200',
              onClick: () => toast.dismiss(toastId),
            },
            '취소'
          ),
          h(
            'button',
            {
              class:
                'px-4 py-1 rounded-lg bg-amber-400 text-white text-xs xm:text-sm font-semibold hover:bg-amber-500',
              onClick: () => {
                toast.dismiss(toastId);
                installPwa();
              },
            },
            '다운로드'
          ),
        ]),
      ]
    )
  );
};

onMounted(() => {
  showInstallToast();
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

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
          <Card>
            <UserCard
              v-if="element.type === 'user'"
              :user="user"
            />

            <TimeLine v-else-if="element.type === 'activity'" />

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

            <!-- <PieChart
              v-else-if="element.type === 'pie' && pieType === 'in'"
              title="수입 유형"
              :value="100"
              :incomeData="pieIncome"
              :expenseData="pieExpense"
              :total="100"
              unit="%"
              @click="togglePieType"
            /> -->

            <LineChart v-else-if="element.type === 'line'" />
          </Card>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scope></style>
