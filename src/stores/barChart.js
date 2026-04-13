import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useDurationStore } from './duration';

export const useBarChartStore = defineStore('barChart', () => {
  const durationStore = useDurationStore();
  const durationTrans = computed(() => durationStore.durationTrans);

  const barExpense = computed(() => {
    const sumByCategory = durationTrans.value.expense.reduce((acc, t) => {
      const category = t.category || '미분류';
      if (!acc[category]) acc[category] = { value: 0, total: 0, data: [] };
      acc[category].value += t.amount;
      acc[category].total += 1;
      acc[category].data.push(t);
      return acc;
    }, {});

    const palette = ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2', '#FEF2F2'];
    return Object.entries(sumByCategory)
      .sort((a, b) => b[1].value - a[1].value)
      .map(([category, arr], index) => ({
        type: category,
        value: arr.value,
        total: arr.total,
        data: arr.data,
        color: palette[index % palette.length],
      }));
  });

  const barIncome = computed(() => {
    const sumByCategory = durationTrans.value.income.reduce((acc, t) => {
      const category = t.category || '미분류';
      if (!acc[category]) acc[category] = { value: 0, total: 0, data: [] };
      acc[category].value += t.amount;
      acc[category].total += 1;
      acc[category].data.push(t);
      return acc;
    }, {});

    const palette = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#ECFDF5'];
    return Object.entries(sumByCategory)
      .sort((a, b) => b[1].value - a[1].value)
      .map(([category, arr], index) => ({
        type: category,
        value: arr.value,
        total: arr.total,
        data: arr.data,
        color: palette[index % palette.length],
      }));
  });

  return {
    barExpense,
    barIncome,
  };
});
