<script setup>
import draggable from 'vuedraggable';

import { ref, computed, watch, onMounted } from 'vue';
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
// 상태 관리
const userStore = useUserStore(); // 유저 정보 관리
const user = computed(() => userStore.user);
const durationStore = useDurationStore(); // 수입/지출 내역 기간 관리
const barChartStore = useBarChartStore(); // barChart 데이터 관리

const date = computed({
  get: () => durationStore.date,
  set: (val) => (durationStore.date = val),
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
        @duration="durationStore.handleDurationChange"
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

            <TimeLine v-else-if="element.type === 'activity'" />

            <DashboardContainer v-else-if="element.type === 'dashboard'" />

            <Calendar
              v-else-if="element.type === 'calendar'"
              v-model="date"
              :data="dateTransactionNumber"
              class="rounded-2xl p-5 h-full neo-inset content-center"
            />

            <BarChart
              v-else-if="element.type === 'bar'"
              title="이번 달 핵심 요약"
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
