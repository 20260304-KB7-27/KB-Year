<script setup>
import draggable from 'vuedraggable';

import { ref, onMounted, computed, watch } from 'vue';
import { today, getLocalTimeZone } from '@internationalized/date';

import { Calendar } from '@/components/ui/calendar';
import Card from '@/components/Card.vue';
import UserCard from '@/components/UserCard.vue';
import ActivityChart from '@/components/ActivityChart.vue';
import { weeklyActivity } from '@/data/activity';
import PieChart from '@/components/PieChart.vue';
import LineChart from '@/components/LineChart.vue';
import DashboardContainer from '@/components/CardsContainer.vue';
import { useTransactionStore } from '@/stores/transaction.js';
import ToggleButton from '@/components/ToggleButton.vue';

const transaction = useTransactionStore();
// 상태 관리
const date = ref(today(getLocalTimeZone()));
const duration = ref('month'); // 'month', 'week', 'day'

// 전체 송금 데이터 (반응형 상태)
const monthlyTrans = computed(() => transaction.monthlyTrans);

// 총 금액 계산
const totalAmount = computed(() => {
  if (!monthlyTrans.value || monthlyTrans.value.length === 0) return 0;
  return monthlyTrans.value.reduce((sum, t) => sum + t.amount, 0);
});

const pieData = computed(() => {
  const sumByCategory = monthlyTrans.value.reduce((acc, t) => {
    const category = t.category || '미분류';
    acc[category] = (acc[category] || 0) + t.amount;
    return acc;
  }, {});

  const palette = ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE047', '#FEF08A', '#FEF9C3'];

  return Object.entries(sumByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([category, sum], index) => ({
      type: category,
      value: sum,
      color: palette[index % palette.length],
    }));
});

// 날짜 포맷팅 헬퍼 함수 (YYYY-MM-DDTHH:mm:ss 형식)
const formatDate = (dateObj, isEnd = false) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return isEnd ? `${y}-${m}-${d}T23:59:59` : `${y}-${m}-${d}T00:00:00`;
};

// 선택된 날짜와 duration에 따라 startDate와 endDate 계산
const dateRange = computed(() => {
  // @internationalized/date 객체를 JS 기본 Date 객체로 변환
  const current = date.value.toDate(getLocalTimeZone());
  const year = current.getFullYear();
  const month = current.getMonth();
  const day = current.getDate();

  let start, end;

  if (duration.value === 'month') {
    start = new Date(year, month, 1); // 월의 첫째 날
    end = new Date(year, month + 1, 0); // 월의 마지막 날
  } else if (duration.value === 'week') {
    const dayOfWeek = current.getDay(); // 0(일) ~ 6(토)
    const diffToStart = day - dayOfWeek; // 일요일을 주의 시작으로 기준
    start = new Date(year, month, diffToStart);
    end = new Date(year, month, diffToStart + 6); // 토요일
  } else {
    // 'day'
    start = new Date(year, month, day);
    end = new Date(year, month, day);
  }

  return {
    startDate: formatDate(start, false),
    endDate: formatDate(end, true),
  };
});

// dateRange 값이 바뀔 때마다(또는 처음 렌더링될 때) API 호출
watch(
  () => dateRange.value,
  (newRange) => {
    console.log(newRange);
    transaction.getUserTransaction('user1', 'expense', newRange.startDate, newRange.endDate);
  },
  { immediate: true } // 컴포넌트 마운트 시 즉시 실행 (onMounted 역할 대체)
);

const handleDurationChange = (selectedValue) => {
  // console.log('선택된 기간:', selectedValue); // 'month', 'week', 'day'
  duration.value = selectedValue;
};

const user = {
  name: 'User Name',
  role: 'UI/UX Designer',
  icon: '👤',
};

const myValue = ref(75);
const myWeeklyData = ref([
  { label: 'Mon', value: 30 },
  { label: 'Tue', value: 50 },
  { label: 'Wed', value: 45 },
  { label: 'Thu', value: 80 },
  { label: 'Fri', value: 60 },
  { label: 'Sat', value: 90 },
  { label: 'Sun', value: 70 },
]);

const initialCards = [
  { id: 1, type: 'user' },
  { id: 2, type: 'activity' },
  { id: 3, type: 'dashboard' },
  { id: 4, type: 'calendar' },
  { id: 5, type: 'pie' },
  { id: 6, type: 'line' },
];

const cards = ref([...initialCards]);

const resetLayout = () => {
  cards.value = [...initialCards];
};
</script>

<template>
  <div class="bg-[#f4f2ee] min-h-screen flex items-center justify-center p-10">
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
        @duration="handleDurationChange"
      ></ToggleButton>

      <!-- 드래그 영역 -->
      <draggable
        v-model="cards"
        item-key="id"
        animation="250"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
      >
        <template #item="{ element }">
          <Card>
            <UserCard
              v-if="element.type === 'user'"
              :user="user"
            />

            <ActivityChart
              v-else-if="element.type === 'activity'"
              :data="weeklyActivity"
            />

            <DashboardContainer v-else-if="element.type === 'dashboard'" />

            <div
              v-else-if="element.type === 'calendar'"
              class="h-full"
            >
              <Calendar
                v-model="date"
                class="rounded-2xl p-5 h-full neo-inset content-center"
              />
            </div>

            <PieChart
              v-else-if="element.type === 'pie'"
              title="소비 유형"
              :value="100"
              :data="pieData"
              :total="100"
              unit="%"
            />

            <LineChart
              v-else-if="element.type === 'line'"
              :data="myWeeklyData"
            />
          </Card>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scope></style>
