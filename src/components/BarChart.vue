<script setup>
import { computed, ref } from 'vue';
import TypeDetail from './TypeDetail.vue';

const props = defineProps({
  titleData: {
    type: String,
    default: '이번 달 핵심 요약',
  },
  incomeData: {
    type: Array,
    default: () => [],
  },
  expenseData: {
    type: Array,
    default: () => [],
  },
});

const selectedDetail = ref(null);

const chartGroups = computed(() => {
  const topIncomes = [...props.incomeData].sort((a, b) => b.value - a.value).slice(0, 3);
  const topExpenses = [...props.expenseData].sort((a, b) => b.value - a.value).slice(0, 3);

  const maxIncome = topIncomes.length > 0 ? Math.max(...topIncomes.map((i) => i.value)) : 0;
  const maxExpense = topExpenses.length > 0 ? Math.max(...topExpenses.map((i) => i.value)) : 0;

  const incomeItems = topIncomes.map((item) => ({
    ...item,
    percent: maxIncome === 0 ? 0 : Math.max((item.value / maxIncome) * 100, 2),
  }));

  const expenseItems = topExpenses.map((item) => ({
    ...item,
    percent: maxExpense === 0 ? 0 : Math.max((item.value / maxExpense) * 100, 2),
  }));

  return [
    { title: '수입 TOP 3', type: 'income', items: incomeItems },
    { title: '지출 TOP 3', type: 'expense', items: expenseItems },
  ];
});
</script>

<template>
  <div class="w-full h-full flex flex-col p-1 rounded-2xl">
    <transition
      name="fade-slide"
      mode="out-in"
    >
      <div
        v-if="!selectedDetail"
        class="flex flex-col w-full gap-3 justify-around"
      >
        <h2 class="text-gray-600 font-bold text-lg cursor-default">{{ titleData }}</h2>
        <template
          v-for="(group, groupIndex) in chartGroups"
          :key="group.type"
        >
          <div class="w-full flex flex-col relative group">
            <div
              class="text-[1.0rem] font-bold mb-3 tracking-wide"
              :class="group.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]'"
            >
              {{ group.title }}
            </div>

            <div class="flex flex-col gap-3 w-full">
              <p
                v-if="group.items.length === 0"
                class="text-center text-gray-400"
              >
                {{
                  group.type === 'income'
                    ? '해당 기간 수입이 없습니다!'
                    : '해당 기간 지출이 없습니다!'
                }}
              </p>
              <div
                v-for="(item, index) in group.items"
                :key="item.type || index"
                class="flex items-center w-full"
              >
                <span class="w-12 truncate text-[11px] text-[#a39b8f] font-bold mr-2 text-start">
                  {{ item.type }}
                </span>

                <div
                  class="hover:opacity-75 cursor-pointer flex-1 h-5 rounded-full bg-[#f4f2ee] shadow-[inset_4px_4px_8px_#d9d5ce,inset_-4px_-4px_8px_#ffffff] relative overflow-hidden"
                  @click="selectedDetail = item"
                >
                  <div
                    class="text-sm text-left absolute left-0 top-0 h-full rounded-full shadow-[2px_2px_4px_#d9d5ce,-2px_-2px_4px_#ffffff] transition-all duration-700 ease-out"
                    :style="{
                      width: item.percent + '%',
                      backgroundColor: item.color,
                    }"
                  >
                    <p
                      class="ms-3 font-extrabold"
                      :style="{
                        color: item.percent > 30 ? 'white' : 'black',
                      }"
                    >
                      {{ item.value.toLocaleString() }}
                    </p>
                  </div>
                </div>
                <div
                  class="absolute left-50 px-2.5 py-1 bg-[#645b4c] text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-20 whitespace-nowrap shadow-md"
                >
                  총 {{ item.total.toLocaleString() }}건 발생

                  <div
                    class="absolute -bottom-1 left-4 border-4 border-transparent border-t-[#645b4c]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="groupIndex === 0"
            class="w-full border-t-2 border-dashed border-gray-300 opacity-40 my-1"
          ></div>
        </template>
      </div>
      <TypeDetail
        v-else
        :category="selectedDetail.type"
        :data="selectedDetail.data"
        @back="selectedDetail = null"
      />
    </transition>
  </div>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease-out;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
