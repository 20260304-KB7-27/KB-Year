<script setup>
import draggable from 'vuedraggable';

import { ref, onMounted, computed } from 'vue';
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

const transaction = useTransactionStore();
const date = ref(today(getLocalTimeZone()));

// 전체 송금 데이터 (반응형 상태)
const monthlyTrans = computed(() => transaction.monthlyTrans);

// 총 금액 계산
const totalAmount = computed(() => {
  if (!monthlyTrans.value || monthlyTrans.value.length === 0) return 0;
  return monthlyTrans.value.reduce((sum, t) => sum + t.amount, 0);
});

// PieChart 데이터 계산
const pieData = computed(() => {
  const transferSum = monthlyTrans.value
    .filter((t) => t.type === 'TRANSFER')
    .reduce((sum, t) => sum + t.amount, 0);
  const paymentSum = monthlyTrans.value
    .filter((t) => t.type === 'PAYMENT')
    .reduce((sum, t) => sum + t.amount, 0);
  return [
    { type: 'TRANSFER', value: transferSum, color: '#ffcf69' }, // 밝은 노란색
    { type: 'PAYMENT', value: paymentSum, color: '#fcaf17' }, // 어두운 노란색
  ];
});

//
onMounted(() => {
  transaction.getUserTransaction(1);
});

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
      <div class="fixed right-5 bottom-1 flex justify-end mb-4">
        <button
          class="px-4 py-2 bg-gray-800 text-white rounded-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 cursor-pointer"
          @click="resetLayout"
        >
          Reset
        </button>
      </div>

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
              title="Transaction Types"
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
